import {
  Article,
  MovieReview,
  BoxOfficeEntry,
  OttRelease,
  VideoItem,
  GalleryItem,
  AdSpot,
  Comment,
  CategorySlug,
  LanguageCode,
  FilmIndustry,
  Movie,
  MovieReleaseStatus,
  AutomationLog,
} from "@/types";
import {
  ARTICLES_SEED,
  REVIEWS_SEED,
  BOX_OFFICE_SEED,
  OTT_RELEASES_SEED,
  VIDEOS_SEED,
  GALLERIES_SEED,
  ADS_SEED,
  COMMENTS_SEED,
  CATEGORIES,
} from "@/data/mockData";
import AUTOMATED_ARTICLES_SEED from "@/data/automated_news.json";
import { INITIAL_MOVIES_SEED } from "@/data/cinemaReleasesData";
import {
  classifyMovieRelease,
  matchesUpcomingBucket,
  partitionMoviesByReleaseStatus,
  UpcomingTimeFilter,
  getTodayIST,
} from "./cinemaDateUtils";
import { MovieIntelligenceService } from "./movieIntelligence/movieIntelligenceService";
import { VerifiedMovieRecord, MovieIntelligenceStats } from "@/types/movieIntelligence";
import { supabase, isSupabaseConfigured } from "./supabase";

// Storage keys for browser persistence
const STORAGE_KEYS = {
  articles: "extrasaga_articles",
  reviews: "extrasaga_reviews",
  comments: "extrasaga_comments",
  ads: "extrasaga_ads",
  videos: "extrasaga_videos",
  galleries: "extrasaga_galleries",
  boxOffice: "extrasaga_box_office",
  movies: "extrasaga_cinema_movies",
  automationLogs: "extrasaga_automation_logs",
};

/**
 * Dynamic Recency & Accuracy Algorithm.
 * Dynamically re-anchors article publication timestamps relative to current live Asia/Kolkata date
 * so the frontpage and news feeds are never stale or outdated.
 */
function synchronizeArticleRecency(articles: Article[]): Article[] {
  const todayStr = getTodayIST();
  const [y, m, d] = todayStr.split("-").map(Number);

  return articles.map((art, idx) => {
    const pubDate = new Date(art.publishedAt);
    const todayDate = new Date(Date.UTC(y, m - 1, d));
    const diffHours = (todayDate.getTime() - pubDate.getTime()) / (1000 * 60 * 60);

    // If article was seeded with an older static timestamp, dynamically anchor to current calendar
    if (diffHours > 24) {
      let dayOffset = 0;
      let hour = 10;
      let minute = 30;

      if (art.isBreaking) {
        dayOffset = 0; // Today
        hour = 11 - (idx % 3);
        minute = 15 + ((idx * 17) % 40);
      } else if (art.isTopStory) {
        dayOffset = 0; // Today
        hour = 8 - (idx % 2);
        minute = 30 + ((idx * 7) % 25);
      } else {
        dayOffset = -Math.min(6, Math.floor(idx / 6));
        hour = 9 + (idx % 8);
        minute = (idx * 13) % 60;
      }

      const freshDate = new Date(Date.UTC(y, m - 1, d + dayOffset, hour, minute, 0));
      return {
        ...art,
        publishedAt: freshDate.toISOString(),
      };
    }
    return art;
  });
}

// In-memory runtime cache for server-side operations
let memoryArticles: Article[] = [
  ...((Array.isArray(AUTOMATED_ARTICLES_SEED) ? AUTOMATED_ARTICLES_SEED : []) as Article[]),
  ...ARTICLES_SEED,
];
let memoryReviews: MovieReview[] = [...REVIEWS_SEED];
let memoryComments: Comment[] = [...COMMENTS_SEED];
let memoryAds: AdSpot[] = [...ADS_SEED];
let memoryVideos: VideoItem[] = [...VIDEOS_SEED];
let memoryGalleries: GalleryItem[] = [...GALLERIES_SEED];
let memoryBoxOffice: BoxOfficeEntry[] = [...BOX_OFFICE_SEED];
let memoryMovies: Movie[] = [...INITIAL_MOVIES_SEED];
let memoryAutomationLogs: AutomationLog[] = [
  {
    id: "log-init",
    timestamp: new Date().toISOString(),
    action: "System Initialization & Dynamic Date Anchor",
    details: `Initialized dynamic releases engine for Asia/Kolkata date: ${getTodayIST()}`,
    moviesProcessed: INITIAL_MOVIES_SEED.length,
    upcomingCount: INITIAL_MOVIES_SEED.filter((m) => classifyMovieRelease(m.theatricalReleaseDate) === "upcoming").length,
    inTheatresCount: INITIAL_MOVIES_SEED.filter((m) => classifyMovieRelease(m.theatricalReleaseDate) === "in_theatres").length,
    archivedCount: INITIAL_MOVIES_SEED.filter((m) => classifyMovieRelease(m.theatricalReleaseDate) === "archived").length,
    status: "success",
  },
];

export const DataService = {
  // --- ARTICLES ---
  async getArticles(
    categoryOrLanguage?: CategorySlug | LanguageCode,
    language?: LanguageCode,
    includePending: boolean = false
  ): Promise<Article[]> {
    let effectiveCategory: CategorySlug | undefined = undefined;
    let effectiveLanguage: LanguageCode | undefined = language;

    const langCodes: LanguageCode[] = ["kn", "te", "ta", "ml", "hi", "en"];
    if (categoryOrLanguage) {
      if (langCodes.includes(categoryOrLanguage as LanguageCode) && !language) {
        effectiveLanguage = categoryOrLanguage as LanguageCode;
      } else {
        effectiveCategory = categoryOrLanguage as CategorySlug;
      }
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.articles);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            memoryArticles = parsed;
          }
        } catch (e) {
          console.error("Error reading stored articles:", e);
        }
      }
    }

    let result = memoryArticles;

    // Filter by approval status: only return published articles unless includePending is true
    if (!includePending) {
      result = result.filter((a) => !a.status || a.status === "published");
    }

    if (effectiveCategory && effectiveCategory !== "mukhaputa") {
      if (effectiveCategory === "trending") {
        result = result.filter((a) => a.isTrending || (a.views && a.views > 2000));
      } else if (effectiveCategory === "television") {
        result = result.filter(
          (a) =>
            a.category === "television" ||
            a.category === "ott" ||
            (a.tags && a.tags.some((t: string) => /tv|tele|serial|show/i.test(t)))
        );
      } else if (effectiveCategory === "celebrity") {
        result = result.filter(
          (a) =>
            a.category === "celebrity" ||
            a.category === "actors" ||
            a.category === "actresses"
        );
      } else if (effectiveCategory === "events") {
        result = result.filter(
          (a) =>
            a.category === "events" ||
            (a.tags && a.tags.some((t: string) => /event|audio|launch|trailer|festival/i.test(t)))
        );
      } else if (effectiveCategory === "latest") {
        result = result.filter(
          (a) => a.category === "latest" || a.isBreaking
        );
      } else if (effectiveCategory === "sandalwood") {
        result = result.filter(
          (a) => a.category === "sandalwood" || a.industry === "sandalwood"
        );
      } else if (effectiveCategory === "bollywood") {
        result = result.filter(
          (a) => a.category === "bollywood" || a.industry === "bollywood"
        );
      } else if (effectiveCategory === "hollywood") {
        result = result.filter(
          (a) => a.category === "hollywood" || a.industry === "hollywood"
        );
      } else {
        result = result.filter((a) => a.category === effectiveCategory);
      }
    }

    if (effectiveLanguage) {
      result = result.filter((a) => a.language === effectiveLanguage);
    }

    result = synchronizeArticleRecency(result);
    result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return result;
  },

  async approveArticle(id: string): Promise<Article | null> {
    const article = memoryArticles.find((a) => a.id === id);
    if (!article) return null;
    article.status = "published";
    article.updatedAt = new Date().toISOString();
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.articles, JSON.stringify(memoryArticles));
    }
    return article;
  },

  async approveAllPendingArticles(): Promise<number> {
    let count = 0;
    const now = new Date().toISOString();
    memoryArticles = memoryArticles.map((a) => {
      if (a.status === "pending") {
        count++;
        return { ...a, status: "published", updatedAt: now };
      }
      return a;
    });
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.articles, JSON.stringify(memoryArticles));
    }
    return count;
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    const all = await this.getArticles();
    const article = all.find((a) => a.slug === slug);
    if (article) {
      article.views = (article.views || 0) + 1;
    }
    return article || null;
  },

  async getBreakingNews(language?: LanguageCode): Promise<Article[]> {
    const all = await this.getArticles(undefined, language);
    const breaking = all.filter((a) => a.isBreaking);
    if (breaking.length > 0) return breaking;
    const globalBreaking = (await this.getArticles()).filter((a) => a.isBreaking);
    return globalBreaking.length > 0 ? globalBreaking : all.slice(0, 3);
  },

  async getTopStories(language?: LanguageCode): Promise<Article[]> {
    const all = await this.getArticles(undefined, language);
    const top = all.filter((a) => a.isTopStory);
    return top.length > 0 ? top : all.slice(0, 3);
  },

  async getTrendingArticles(limit: number = 5, language?: LanguageCode): Promise<Article[]> {
    const all = await this.getArticles(undefined, language);
    return [...all].sort((a, b) => b.views - a.views).slice(0, limit);
  },

  async saveArticle(article: Partial<Article>): Promise<Article> {
    const isNew = !article.id;
    const now = new Date().toISOString();
    const cat = CATEGORIES.find((c) => c.slug === article.category);

    const completeArticle: Article = {
      id: article.id || `art-${Date.now()}`,
      title: article.title || "New Article",
      titleEn: article.titleEn || "New Article",
      slug: article.slug || `article-${Date.now()}`,
      summary: article.summary || "",
      content: article.content || "",
      category: article.category || "sandalwood",
      categoryName: cat?.name || "Sandalwood",
      tags: article.tags || ["Cinema"],
      featuredImage:
        article.featuredImage ||
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
      imageCaption: article.imageCaption || "",
      author: article.author || { id: "auth-1", name: "EXTRA-SAAGA Bureau", role: "Editor" },
      publishedAt: article.publishedAt || now,
      updatedAt: now,
      readTimeMinutes: article.readTimeMinutes || 3,
      views: article.views || 100,
      isBreaking: Boolean(article.isBreaking),
      isTopStory: Boolean(article.isTopStory),
      isTrending: Boolean(article.isTrending),
      isFeatured: Boolean(article.isFeatured),
      status: article.status || "published",
      relatedArticleIds: article.relatedArticleIds || [],
    };

    const existingIndex = memoryArticles.findIndex((a) => a.id === completeArticle.id);
    if (existingIndex >= 0) {
      memoryArticles = memoryArticles.map((a) => (a.id === completeArticle.id ? completeArticle : a));
    } else {
      memoryArticles = [completeArticle, ...memoryArticles];
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.articles, JSON.stringify(memoryArticles));
    }

    if (isSupabaseConfigured()) {
      try {
        await supabase.from("articles").upsert({
          id: completeArticle.id.startsWith("art-") ? undefined : completeArticle.id,
          title: completeArticle.title,
          title_en: completeArticle.titleEn,
          slug: completeArticle.slug,
          summary: completeArticle.summary,
          content: completeArticle.content,
          category_slug: completeArticle.category,
          tags: completeArticle.tags,
          featured_image: completeArticle.featuredImage,
          image_caption: completeArticle.imageCaption,
          author_name: completeArticle.author.name,
          read_time_minutes: completeArticle.readTimeMinutes,
          is_breaking: completeArticle.isBreaking,
          is_top_story: completeArticle.isTopStory,
          is_trending: completeArticle.isTrending,
          is_featured: completeArticle.isFeatured,
          status: completeArticle.status,
        });
      } catch (e) {
        console.warn("Supabase upsert error:", e);
      }
    }

    return completeArticle;
  },

  async deleteArticle(id: string): Promise<boolean> {
    memoryArticles = memoryArticles.filter((a) => a.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.articles, JSON.stringify(memoryArticles));
    }
    if (isSupabaseConfigured()) {
      try {
        await supabase.from("articles").delete().eq("id", id);
      } catch (e) {
        console.warn("Supabase delete error:", e);
      }
    }
    return true;
  },

  // --- REVIEWS ---
  async getReviews(language?: LanguageCode): Promise<MovieReview[]> {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.reviews);
      if (stored) {
        try {
          memoryReviews = JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }
    if (language) {
      const filtered = memoryReviews.filter((r) => r.language === language);
      if (filtered.length > 0) return filtered;
    }
    return memoryReviews;
  },

  async getReviewBySlug(slug: string, lang?: string): Promise<MovieReview | null> {
    const all = await this.getReviews();

    // 1. Exact slug match
    const exact = all.find((r) => r.slug === slug);
    if (exact) return exact;

    // 2. Ramayana aliases — the canonical English review serves every legacy
    //    per-language slug (kannada/telugu/tamil/hindi/malayalam review URLs).
    if (slug.startsWith("ramayana-part-1") || slug.startsWith("ramayana")) {
      const preferredLang = lang || "en";
      const matched = all.find(
        (r) => r.slug.startsWith("ramayana-part-1") && r.language === preferredLang
      );
      if (matched) return matched;
      return all.find((r) => r.slug.startsWith("ramayana-part-1")) || null;
    }

    return null;
  },

  async saveReview(review: Partial<MovieReview>): Promise<MovieReview> {
    const isNew = !review.id;
    const complete: MovieReview = {
      id: review.id || `rev-${Date.now()}`,
      movieTitle: review.movieTitle || "New Movie",
      movieTitleEn: review.movieTitleEn || "New Movie",
      slug: review.slug || `review-${Date.now()}`,
      rating: review.rating || 4.0,
      maxRating: 5.0,
      releaseDate: review.releaseDate || new Date().toISOString().slice(0, 10),
      director: review.director || "Director",
      producers: review.producers || ["Producer"],
      musicDirector: review.musicDirector || "Music Director",
      cast: review.cast || [],
      posterImage:
        review.posterImage ||
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
      bannerImage: review.bannerImage,
      trailerYoutubeId: review.trailerYoutubeId || "8MR9Ohbv3KM",
      genres: review.genres || ["Action", "Drama"],
      censorRating: review.censorRating || "U/A",
      runtime: review.runtime || "2h 30m",
      verdict: review.verdict || "Good Entertainer",
      summary: review.summary || "",
      storyAnalysis: review.storyAnalysis || "",
      performanceAnalysis: review.performanceAnalysis || "",
      directionAnalysis: review.directionAnalysis || "",
      musicAnalysis: review.musicAnalysis || "",
      pros: review.pros || [],
      cons: review.cons || [],
      boxOfficeSummary: review.boxOfficeSummary || "",
      publishedAt: review.publishedAt || new Date().toISOString(),
      author: review.author || "Cinema Desk",
    };

    if (isNew) {
      memoryReviews = [complete, ...memoryReviews];
    } else {
      memoryReviews = memoryReviews.map((r) => (r.id === complete.id ? complete : r));
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(memoryReviews));
    }

    if (isSupabaseConfigured()) {
      try {
        await supabase.from("movies").upsert({
          id: complete.id.startsWith("rev-") ? undefined : complete.id,
          movie_title: complete.movieTitle,
          movie_title_en: complete.movieTitleEn,
          slug: complete.slug,
          rating: complete.rating,
          release_date: complete.releaseDate,
          director: complete.director,
          producers: complete.producers,
          music_director: complete.musicDirector,
          poster_image: complete.posterImage,
          banner_image: complete.bannerImage,
          trailer_youtube_id: complete.trailerYoutubeId,
          genres: complete.genres,
          censor_rating: complete.censorRating,
          runtime: complete.runtime,
          verdict: complete.verdict,
          summary: complete.summary,
          story_analysis: complete.storyAnalysis,
          performance_analysis: complete.performanceAnalysis,
          direction_analysis: complete.directionAnalysis,
          music_analysis: complete.musicAnalysis,
          pros: complete.pros,
          cons: complete.cons,
          author: complete.author,
        });
      } catch (e) {
        console.warn("Supabase review upsert error:", e);
      }
    }

    return complete;
  },

  async deleteReview(id: string): Promise<boolean> {
    memoryReviews = memoryReviews.filter((r) => r.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(memoryReviews));
    }
    if (isSupabaseConfigured()) {
      try {
        await supabase.from("movies").delete().eq("id", id);
      } catch (e) {
        console.warn("Supabase review delete error:", e);
      }
    }
    return true;
  },

  // --- BOX OFFICE ---
  async getBoxOffice(language?: LanguageCode): Promise<BoxOfficeEntry[]> {
    try {
      const { BoxOfficeEngineService } = await import("./boxOfficeEngine/boxOfficeService");
      const records = await BoxOfficeEngineService.getConsolidatedRecords(language);
      if (records && records.length > 0) {
        return records.map((c) => ({
          id: c.id,
          movieTitle: c.movieTitle,
          movieTitleEn: c.movieTitleEn,
          slug: c.slug,
          posterImage: c.posterImage,
          releaseYear: c.releaseYear,
          language: c.language,
          industry: c.industry,
          day1Collection: c.day1Collection,
          weekendCollection: c.weekendCollection,
          worldwideCollection: c.worldwideCollection,
          budget: c.budget,
          verdict: c.verdict,
          verdictBadgeColor: c.verdictBadgeColor,
          rank: c.rank,
          updatedAt: c.lastUpdated,
          territoryBreakdown: c.territories.map((t) => ({
            territory: t.territory,
            collection: `₹${t.grossInCrores} Cr`,
          })),
          // Upgraded multi-source intelligence fields
          figureStatus: c.figureStatus,
          dataClass: c.dataClass,
          confidenceScore: c.confidenceScore,
          confidenceLabel: c.confidenceLabel,
          providersTrackedCount: c.providersTrackedCount,
          grossInCrores: c.grossInCrores,
          netInCrores: c.netInCrores,
          distributorShareInCrores: c.distributorShareInCrores,
          overseasGrossInCrores: c.overseasGrossInCrores,
          overseasGrossInUSD: c.overseasGrossInUSD,
          budgetInCrores: c.budgetInCrores,
          territoryFinancials: c.territories,
          cityTelemetry: c.cityTelemetry,
          trajectory: c.trajectory,
        }));
      }
    } catch (err) {
      console.warn("BoxOfficeEngineService fallback:", err);
    }

    if (language) {
      const filtered = memoryBoxOffice.filter((b) => b.language === language);
      if (filtered.length > 0) return filtered;
    }
    return memoryBoxOffice;
  },

  // --- OTT ---
  async getOttReleases(language?: LanguageCode): Promise<OttRelease[]> {
    if (language) {
      const filtered = OTT_RELEASES_SEED.filter((o) => o.language === language);
      if (filtered.length > 0) return filtered;
    }
    return OTT_RELEASES_SEED;
  },

  // --- VIDEOS ---
  async getVideos(language?: LanguageCode): Promise<VideoItem[]> {
    if (language) {
      const filtered = memoryVideos.filter((v) => v.language === language);
      if (filtered.length > 0) return filtered;
    }
    return memoryVideos;
  },

  // --- GALLERIES ---
  async getGalleries(language?: LanguageCode): Promise<GalleryItem[]> {
    if (language) {
      const filtered = memoryGalleries.filter((g) => g.language === language);
      if (filtered.length > 0) return filtered;
    }
    return memoryGalleries;
  },

  async getGalleryBySlug(slug: string): Promise<GalleryItem | null> {
    return memoryGalleries.find((g) => g.slug === slug) || null;
  },

  // --- COMMENTS ---
  async getComments(articleId: string): Promise<Comment[]> {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.comments);
      if (stored) {
        try {
          memoryComments = JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("comments")
          .select("*")
          .eq("article_id", articleId)
          .eq("is_approved", true)
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((c) => ({
            id: c.id,
            articleId: c.article_id,
            authorName: c.author_name,
            authorEmail: c.author_email,
            content: c.content,
            createdAt: c.created_at,
            likes: c.likes || 0,
            isApproved: c.is_approved,
          }));
        }
      } catch (e) {
        console.warn("Supabase comments fetch error:", e);
      }
    }

    return memoryComments.filter((c) => c.articleId === articleId && c.isApproved);
  },

  async addComment(comment: { articleId: string; authorName: string; content: string }): Promise<Comment> {
    const newCom: Comment = {
      id: `com-${Date.now()}`,
      articleId: comment.articleId,
      authorName: comment.authorName || "Anonymous Reader",
      content: comment.content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isApproved: true,
    };
    memoryComments = [newCom, ...memoryComments];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(memoryComments));
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from("comments").insert({
          article_id: comment.articleId.startsWith("art-") ? undefined : comment.articleId,
          author_name: newCom.authorName,
          content: newCom.content,
          is_approved: true,
        }).select().single();

        if (!error && data) {
          newCom.id = data.id;
        }
      } catch (e) {
        console.warn("Supabase comment insert error:", e);
      }
    }

    return newCom;
  },

  // --- ADS ---
  async getAds(): Promise<AdSpot[]> {
    return memoryAds;
  },

  async getAdByPlacement(placement: AdSpot["placement"]): Promise<AdSpot | null> {
    return memoryAds.find((a) => a.placement === placement && a.isActive) || null;
  },

  // --- CINEMA RELEASES & DYNAMIC DATE SYSTEM ---
  async getMovies(options?: {
    language?: LanguageCode;
    status?: MovieReleaseStatus;
    timeFilter?: UpcomingTimeFilter;
    search?: string;
    limit?: number;
  }): Promise<Movie[]> {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.movies);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            memoryMovies = parsed;
          }
        } catch (e) {
          console.error("Error reading stored movies:", e);
        }
      }
    }

    // Incorporate multi-source discovered & verified releases
    try {
      const verified = await MovieIntelligenceService.getAllVerifiedMovies();
      const verifiedAsMovies = verified.map((m) => MovieIntelligenceService.toStandardMovie(m));
      const existingSlugs = new Set(memoryMovies.map((m) => m.slug));
      for (const vm of verifiedAsMovies) {
        if (!existingSlugs.has(vm.slug)) {
          memoryMovies.push(vm);
          existingSlugs.add(vm.slug);
        }
      }
    } catch {
      // Graceful fallback to memoryMovies if intelligence engine is initializing
    }

    // Always re-classify status dynamically against current server date
    let list = memoryMovies.map((m) => ({
      ...m,
      releaseStatus: classifyMovieRelease(m.theatricalReleaseDate),
    }));

    if (options?.language) {
      list = list.filter((m) => m.language === options.language);
    }

    if (options?.status) {
      list = list.filter((m) => m.releaseStatus === options.status);
    }

    if (options?.timeFilter && options.timeFilter !== "all") {
      list = list.filter((m) =>
        matchesUpcomingBucket(m.theatricalReleaseDate, options.timeFilter!)
      );
    }

    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.titleEn.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.cast.some((c) => c.name.toLowerCase().includes(q)) ||
          m.genres.some((g) => g.toLowerCase().includes(q))
      );
    }

    if (options?.limit) {
      list = list.slice(0, options.limit);
    }

    return list;
  },

  async getMovieBySlug(slug: string): Promise<Movie | null> {
    const movies = await this.getMovies();
    const movie = movies.find((m) => m.slug === slug);
    return movie || null;
  },

  async getLatestTheatricalReleases(language?: LanguageCode, limit?: number): Promise<Movie[]> {
    const movies = await this.getMovies({ language, status: "in_theatres" });
    movies.sort((a, b) => new Date(b.theatricalReleaseDate).getTime() - new Date(a.theatricalReleaseDate).getTime());
    return limit ? movies.slice(0, limit) : movies;
  },

  async getUpcomingReleases(
    language?: LanguageCode,
    timeFilter?: UpcomingTimeFilter,
    limit?: number
  ): Promise<Movie[]> {
    const movies = await this.getMovies({ language, status: "upcoming", timeFilter });
    movies.sort((a, b) => new Date(a.theatricalReleaseDate).getTime() - new Date(b.theatricalReleaseDate).getTime());
    return limit ? movies.slice(0, limit) : movies;
  },

  async getVerifiedMovies(options?: {
    industry?: FilmIndustry;
    language?: LanguageCode;
    status?: string;
    search?: string;
  }): Promise<VerifiedMovieRecord[]> {
    return MovieIntelligenceService.getAllVerifiedMovies(options);
  },

  async getMovieIntelligenceStats(): Promise<MovieIntelligenceStats> {
    return MovieIntelligenceService.getStats();
  },

  async getArchivedReleases(language?: LanguageCode, limit?: number): Promise<Movie[]> {
    const movies = await this.getMovies({ language, status: "archived" });
    movies.sort((a, b) => new Date(b.theatricalReleaseDate).getTime() - new Date(a.theatricalReleaseDate).getTime());
    return limit ? movies.slice(0, limit) : movies;
  },

  async saveMovie(movie: Partial<Movie>): Promise<Movie> {
    const now = new Date().toISOString();
    const dynamicStatus = movie.theatricalReleaseDate
      ? classifyMovieRelease(movie.theatricalReleaseDate)
      : "upcoming";

    const completeMovie: Movie = {
      id: movie.id || `mov-${Date.now()}`,
      title: movie.title || "New Movie",
      titleEn: movie.titleEn || "New Movie",
      slug: movie.slug || `movie-${Date.now()}`,
      synopsis: movie.synopsis || "",
      introduction: movie.introduction || "",
      theatricalReleaseDate: movie.theatricalReleaseDate || getTodayIST(),
      releaseDateConfidence: movie.releaseDateConfidence || "confirmed",
      releaseStatus: dynamicStatus,
      language: movie.language || "en",
      industry: movie.industry || "sandalwood",
      genres: movie.genres || ["Action", "Drama"],
      director: movie.director || "Unknown Director",
      producers: movie.producers || ["Production House"],
      cast: movie.cast || [],
      crew: movie.crew || [],
      productionCompany: movie.productionCompany || "",
      distributionCompany: movie.distributionCompany || "",
      posterImage:
        movie.posterImage ||
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
      bannerImage: movie.bannerImage || movie.posterImage,
      galleryImages: movie.galleryImages || [],
      trailerYoutubeId: movie.trailerYoutubeId || "",
      trailerUrl: movie.trailerUrl || "",
      censorRating: movie.censorRating || "U/A",
      runtimeMinutes: movie.runtimeMinutes || 150,
      runtimeFormatted: movie.runtimeFormatted || "2h 30m",
      articleSlug: movie.articleSlug || movie.slug,
      sourceReferences: movie.sourceReferences || [],
      createdAt: movie.createdAt || now,
      updatedAt: now,
      isFeatured: Boolean(movie.isFeatured),
    };

    const existingIndex = memoryMovies.findIndex((m) => m.id === completeMovie.id);
    if (existingIndex >= 0) {
      memoryMovies[existingIndex] = completeMovie;
    } else {
      memoryMovies = [completeMovie, ...memoryMovies];
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.movies, JSON.stringify(memoryMovies));
    }

    // Automatically sync dedicated movie article so every movie has an SEO article page
    await this.syncMovieArticle(completeMovie);

    return completeMovie;
  },

  async deleteMovie(id: string): Promise<boolean> {
    memoryMovies = memoryMovies.filter((m) => m.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.movies, JSON.stringify(memoryMovies));
    }
    return true;
  },

  async syncMovieArticle(movie: Movie): Promise<Article> {
    const existingArticle = memoryArticles.find((a) => a.slug === movie.slug);
    const now = new Date().toISOString();

    const castList = movie.cast.map((c) => `${c.name} (${c.role})`).join(", ");
    const fullArticleContent = `
# ${movie.title} (${movie.titleEn})

${movie.introduction || movie.synopsis}

## Synopsis
${movie.synopsis}

## Cast & Crew
- **Director:** ${movie.director}
- **Producers:** ${movie.producers.join(", ")}
- **Main Cast:** ${castList || "To be announced"}
- **Industry:** ${movie.industry.toUpperCase()} (${movie.language.toUpperCase()})
- **Genres:** ${movie.genres.join(", ")}
- **Censor Rating:** ${movie.censorRating || "U/A"}
- **Runtime:** ${movie.runtimeFormatted || `${movie.runtimeMinutes} minutes`}

## Theatrical Release Details
- **Release Date:** ${movie.theatricalReleaseDate} (${movie.releaseDateConfidence === "confirmed" ? "Confirmed" : "Tentative"})
- **Status:** ${movie.releaseStatus === "in_theatres" ? "Now showing in theatres" : movie.releaseStatus === "upcoming" ? "Upcoming release" : "Archived release"}
- **Production House:** ${movie.productionCompany || "Leading production house"}
- **Distribution:** ${movie.distributionCompany || "All-India Distribution"}
    `.trim();

    const movieArticle: Partial<Article> = {
      id: existingArticle?.id || `art-mov-${movie.id}`,
      title: `${movie.title} - Theatrical Release, Cast, Trailer & Full Synopsis`,
      titleEn: `${movie.titleEn} - Theatrical Release, Cast, Trailer & Full Synopsis`,
      slug: movie.slug,
      summary: movie.synopsis.slice(0, 200) + "...",
      content: fullArticleContent,
      category: "upcoming",
      categoryName: "Upcoming Movies",
      tags: [movie.titleEn, ...movie.genres, movie.industry, "Cinema Release"],
      featuredImage: movie.posterImage,
      imageCaption: `Official Poster: ${movie.titleEn} (${movie.theatricalReleaseDate})`,
      author: {
        id: "cinema-release-desk",
        name: "EXTRA-SAAGA Cinema Releases Desk",
        role: "Chief Cinema Releases Editor",
      },
      publishedAt: existingArticle?.publishedAt || now,
      updatedAt: now,
      readTimeMinutes: 3,
      views: existingArticle?.views || 180,
      isBreaking: false,
      isTopStory: Boolean(movie.isFeatured),
      isTrending: true,
      status: "published",
      language: movie.language,
      industry: movie.industry,
    };

    return await this.saveArticle(movieArticle);
  },

  async runDailyCinemaRollover(logDetails?: string): Promise<AutomationLog> {
    const today = getTodayIST();
    let transitionedToReleased = 0;
    let transitionedToArchived = 0;

    memoryMovies = memoryMovies.map((m) => {
      const oldStatus = m.releaseStatus;
      const newStatus = classifyMovieRelease(m.theatricalReleaseDate, today);

      if (oldStatus === "upcoming" && newStatus === "in_theatres") {
        transitionedToReleased++;
      } else if (oldStatus === "in_theatres" && newStatus === "archived") {
        transitionedToArchived++;
      }

      return {
        ...m,
        releaseStatus: newStatus,
        updatedAt: new Date().toISOString(),
      };
    });

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.movies, JSON.stringify(memoryMovies));
    }

    const upcomingCount = memoryMovies.filter((m) => m.releaseStatus === "upcoming").length;
    const inTheatresCount = memoryMovies.filter((m) => m.releaseStatus === "in_theatres").length;
    const archivedCount = memoryMovies.filter((m) => m.releaseStatus === "archived").length;

    const log: AutomationLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Daily Cinema Rollover & Status Reclassification",
      details: logDetails || `Automated rollover on ${today} (Asia/Kolkata). Upcoming -> In Theatres: ${transitionedToReleased}, In Theatres -> Archived: ${transitionedToArchived}`,
      moviesProcessed: memoryMovies.length,
      upcomingCount,
      inTheatresCount,
      archivedCount,
      status: "success",
    };

    memoryAutomationLogs = [log, ...memoryAutomationLogs.slice(0, 49)];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.automationLogs, JSON.stringify(memoryAutomationLogs));
    }

    return log;
  },

  async getAutomationLogs(): Promise<AutomationLog[]> {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.automationLogs);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            memoryAutomationLogs = parsed;
          }
        } catch (e) {
          console.error("Error reading stored logs:", e);
        }
      }
    }
    return memoryAutomationLogs;
  },
};

