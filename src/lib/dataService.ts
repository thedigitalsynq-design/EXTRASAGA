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
import { supabase, isSupabaseConfigured } from "./supabase";

// Storage keys for browser persistence
const STORAGE_KEYS = {
  articles: "sini_kannada_articles",
  reviews: "sini_kannada_reviews",
  comments: "sini_kannada_comments",
  ads: "sini_kannada_ads",
  videos: "sini_kannada_videos",
  galleries: "sini_kannada_galleries",
  boxOffice: "sini_kannada_box_office",
};

// In-memory runtime cache for server-side operations
let memoryArticles: Article[] = [...ARTICLES_SEED];
let memoryReviews: MovieReview[] = [...REVIEWS_SEED];
let memoryComments: Comment[] = [...COMMENTS_SEED];
let memoryAds: AdSpot[] = [...ADS_SEED];
let memoryVideos: VideoItem[] = [...VIDEOS_SEED];
let memoryGalleries: GalleryItem[] = [...GALLERIES_SEED];
let memoryBoxOffice: BoxOfficeEntry[] = [...BOX_OFFICE_SEED];

export const DataService = {
  // --- ARTICLES ---
  async getArticles(category?: CategorySlug): Promise<Article[]> {
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

    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from("articles").select("*").eq("status", "published").order("published_at", { ascending: false });
        if (category && category !== "mukhaputa") {
          query = query.eq("category_slug", category);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((item) => ({
            id: item.id,
            title: item.title,
            titleEn: item.title_en,
            slug: item.slug,
            summary: item.summary,
            content: item.content,
            category: item.category_slug as CategorySlug,
            categoryName: CATEGORIES.find((c) => c.slug === item.category_slug)?.name || "ಸುದ್ದಿ",
            tags: item.tags || [],
            featuredImage: item.featured_image,
            imageCaption: item.image_caption,
            author: {
              id: item.author_id || "auth-1",
              name: item.author_name || "ಸಿನಿ ಕನ್ನಡ ಬ್ಯೂರೋ",
            },
            publishedAt: item.published_at,
            readTimeMinutes: item.read_time_minutes || 3,
            views: item.views || 0,
            isBreaking: item.is_breaking,
            isTopStory: item.is_top_story,
            isTrending: item.is_trending,
            isFeatured: item.is_featured,
            status: item.status,
            relatedArticleIds: item.related_article_ids,
          }));
        }
      } catch (err) {
        console.warn("Supabase fetch failed, fallback to local:", err);
      }
    }

    if (category && category !== "mukhaputa") {
      return memoryArticles.filter((a) => a.category === category);
    }
    return memoryArticles;
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    const all = await this.getArticles();
    const article = all.find((a) => a.slug === slug);
    if (article) {
      article.views = (article.views || 0) + 1;
    }
    return article || null;
  },

  async getBreakingNews(): Promise<Article[]> {
    const all = await this.getArticles();
    return all.filter((a) => a.isBreaking);
  },

  async getTopStories(): Promise<Article[]> {
    const all = await this.getArticles();
    return all.filter((a) => a.isTopStory);
  },

  async getTrendingArticles(limit: number = 5): Promise<Article[]> {
    const all = await this.getArticles();
    return [...all].sort((a, b) => b.views - a.views).slice(0, limit);
  },

  async saveArticle(article: Partial<Article>): Promise<Article> {
    const isNew = !article.id;
    const now = new Date().toISOString();
    const cat = CATEGORIES.find((c) => c.slug === article.category);

    const completeArticle: Article = {
      id: article.id || `art-${Date.now()}`,
      title: article.title || "ಹೊಸ ಶೀರ್ಷಿಕೆ",
      titleEn: article.titleEn || "New Article",
      slug: article.slug || `article-${Date.now()}`,
      summary: article.summary || "",
      content: article.content || "",
      category: article.category || "sandalwood",
      categoryName: cat?.name || "ಸ್ಯಾಂಡಲ್ವುಡ್",
      tags: article.tags || ["ಸಿನಿಮಾ"],
      featuredImage:
        article.featuredImage ||
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
      imageCaption: article.imageCaption || "",
      author: article.author || { id: "auth-1", name: "ಸಿನಿ ಕನ್ನಡ ಬ್ಯೂರೋ", role: "ಸಂಪಾದಕರು" },
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

    if (isNew) {
      memoryArticles = [completeArticle, ...memoryArticles];
    } else {
      memoryArticles = memoryArticles.map((a) => (a.id === completeArticle.id ? completeArticle : a));
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
  async getReviews(): Promise<MovieReview[]> {
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
    return memoryReviews;
  },

  async getReviewBySlug(slug: string): Promise<MovieReview | null> {
    const all = await this.getReviews();
    return all.find((r) => r.slug === slug) || null;
  },

  async saveReview(review: Partial<MovieReview>): Promise<MovieReview> {
    const isNew = !review.id;
    const complete: MovieReview = {
      id: review.id || `rev-${Date.now()}`,
      movieTitle: review.movieTitle || "ಹೊಸ ಸಿನಿಮಾ",
      movieTitleEn: review.movieTitleEn || "New Movie",
      slug: review.slug || `review-${Date.now()}`,
      rating: review.rating || 4.0,
      maxRating: 5.0,
      releaseDate: review.releaseDate || new Date().toISOString().slice(0, 10),
      director: review.director || "ನಿರ್ದೇಶಕರು",
      producers: review.producers || ["ನಿರ್ಮಾಪಕರು"],
      musicDirector: review.musicDirector || "ಸಂಗೀತ ನಿರ್ದೇಶಕರು",
      cast: review.cast || [],
      posterImage:
        review.posterImage ||
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
      bannerImage: review.bannerImage,
      trailerYoutubeId: review.trailerYoutubeId || "8MR9Ohbv3KM",
      genres: review.genres || ["ಆಕ್ಷನ್", "ಡ್ರಾಮಾ"],
      censorRating: review.censorRating || "U/A",
      runtime: review.runtime || "2 ಗಂಟೆ 30 ನಿಮಿಷ",
      verdict: review.verdict || "ಉತ್ತಮ ಮನರಂಜನೆ",
      summary: review.summary || "",
      storyAnalysis: review.storyAnalysis || "",
      performanceAnalysis: review.performanceAnalysis || "",
      directionAnalysis: review.directionAnalysis || "",
      musicAnalysis: review.musicAnalysis || "",
      pros: review.pros || [],
      cons: review.cons || [],
      boxOfficeSummary: review.boxOfficeSummary || "",
      publishedAt: review.publishedAt || new Date().toISOString(),
      author: review.author || "ಸಿನಿಮಾ ಡೆಸ್ಕ್",
    };

    if (isNew) {
      memoryReviews = [complete, ...memoryReviews];
    } else {
      memoryReviews = memoryReviews.map((r) => (r.id === complete.id ? complete : r));
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(memoryReviews));
    }
    return complete;
  },

  async deleteReview(id: string): Promise<boolean> {
    memoryReviews = memoryReviews.filter((r) => r.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(memoryReviews));
    }
    return true;
  },

  // --- BOX OFFICE ---
  async getBoxOffice(): Promise<BoxOfficeEntry[]> {
    return memoryBoxOffice;
  },

  // --- OTT ---
  async getOttReleases(): Promise<OttRelease[]> {
    return OTT_RELEASES_SEED;
  },

  // --- VIDEOS ---
  async getVideos(): Promise<VideoItem[]> {
    return memoryVideos;
  },

  // --- GALLERIES ---
  async getGalleries(): Promise<GalleryItem[]> {
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
    return memoryComments.filter((c) => c.articleId === articleId && c.isApproved);
  },

  async addComment(comment: { articleId: string; authorName: string; content: string }): Promise<Comment> {
    const newCom: Comment = {
      id: `com-${Date.now()}`,
      articleId: comment.articleId,
      authorName: comment.authorName || "ಅನಾಮಧೇಯ ಓದುಗರು",
      content: comment.content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isApproved: true,
    };
    memoryComments = [newCom, ...memoryComments];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(memoryComments));
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
};
