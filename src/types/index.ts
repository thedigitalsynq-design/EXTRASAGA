export type CategorySlug =
  | "mukhaputa"
  | "latest"
  | "reviews"
  | "sandalwood"
  | "bollywood"
  | "hollywood"
  | "actors"
  | "actresses"
  | "interviews"
  | "gossip"
  | "gallery"
  | "videos"
  | "ott"
  | "box-office"
  | "upcoming";

export interface Category {
  id: string;
  name: string; // Kannada name e.g. "ಸ್ಯಾಂಡಲ್ವುಡ್"
  englishName: string;
  slug: CategorySlug;
  description?: string;
  count?: number;
}

export interface Article {
  id: string;
  title: string; // Kannada headline
  titleEn?: string;
  slug: string;
  summary: string; // Short Kannada description
  content: string; // Rich Kannada markdown / HTML content
  category: CategorySlug;
  categoryName: string; // Kannada category name
  tags: string[];
  featuredImage: string;
  imageCaption?: string;
  author: {
    id: string;
    name: string; // e.g. "ಸಿನಿ ಕನ್ನಡ ಬ್ಯೂರೋ", "ಪ್ರವೀಣ್ ಕುಮಾರ್"
    avatar?: string;
    role?: string;
  };
  publishedAt: string; // ISO date
  updatedAt?: string;
  readTimeMinutes: number;
  views: number;
  isBreaking?: boolean;
  isTopStory?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  status: "published" | "draft" | "scheduled";
  relatedArticleIds?: string[];
}

export interface MovieReview {
  id: string;
  movieTitle: string; // Kannada movie title
  movieTitleEn: string;
  slug: string;
  rating: number; // e.g. 4.0 out of 5
  maxRating: number; // 5
  releaseDate: string;
  director: string;
  producers: string[];
  musicDirector: string;
  cinematography?: string;
  cast: {
    name: string;
    role: string;
    image?: string;
  }[];
  posterImage: string;
  bannerImage?: string;
  trailerYoutubeId?: string;
  genres: string[];
  censorRating: string; // U/A, U, A
  runtime: string; // e.g. "2 ಗಂಟೆ 35 ನಿಮಿಷ"
  verdict: string; // Kannada verdict badge e.g. "ಬ್ಲಾಕ್‌ಬಸ್ಟರ್ ಸಿನಿಮಾ!", "ಮಸ್ತ್ ಮನರಂಜನೆ"
  summary: string;
  storyAnalysis: string;
  performanceAnalysis: string;
  directionAnalysis: string;
  musicAnalysis: string;
  pros: string[];
  cons: string[];
  boxOfficeSummary?: string;
  publishedAt: string;
  author: string;
}

export interface BoxOfficeEntry {
  id: string;
  movieTitle: string;
  movieTitleEn: string;
  slug: string;
  posterImage: string;
  releaseYear: number;
  day1Collection: string; // e.g. "₹25 ಕೋಟಿ"
  weekendCollection: string; // e.g. "₹70 ಕೋಟಿ"
  worldwideCollection: string; // e.g. "₹450 ಕೋಟಿ+"
  budget: string; // e.g. "₹100 ಕೋಟಿ"
  verdict: "ಆಲ್ ಟೈಮ್ ಬ್ಲಾಕ್‌ಬಸ್ಟರ್" | "ಬ್ಲಾಕ್‌ಬಸ್ಟರ್" | "ಸೂಪರ್ ಹಿಟ್" | "ಹಿಟ್" | "ಸರಾಸರಿ";
  verdictBadgeColor: string;
  territoryBreakdown: {
    territory: string;
    collection: string;
  }[];
  rank: number;
  updatedAt: string;
}

export interface OttRelease {
  id: string;
  movieTitle: string;
  movieTitleEn: string;
  platform: "Netflix" | "Prime Video" | "JioCinema" | "ZEE5" | "SunNXT" | "Disney+ Hotstar";
  platformBadgeColor: string;
  releaseDate: string; // e.g. "15 ನವೆಂಬರ್ 2026"
  languages: string[];
  genre: string;
  posterImage: string;
  watchUrl?: string;
  description: string;
  cast: string[];
}

export interface VideoItem {
  id: string;
  title: string;
  category: "ಟ್ರೇಲರ್" | "ಟೀಸರ್" | "ಹಾಡುಗಳು" | "ಸಂದರ್ಶನ";
  youtubeId: string;
  thumbnailUrl: string;
  duration: string;
  views: string;
  publishedAt: string;
  featured?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  celebrityName: string;
  category: "ನಟರು" | "ನಟಿಯರು" | "ಸಿನಿಮಾ ಇವೆಂಟ್";
  photoCount: number;
  photos: {
    url: string;
    caption: string;
  }[];
  publishedAt: string;
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
  likes: number;
  isApproved: boolean;
}

export interface AdSpot {
  id: string;
  placement: "header_leaderboard" | "sidebar_rectangle" | "in_article" | "footer_banner" | "sticky_bottom";
  title: string;
  imageUrl?: string;
  targetUrl?: string;
  adCode?: string; // HTML or script for Google AdSense
  isActive: boolean;
  altText: string;
}

