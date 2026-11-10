import type { FivePointVerification } from "./movieIntelligence";

export type LanguageCode = "kn" | "te" | "ta" | "ml" | "hi" | "en" | "bn" | "pa" | "other";

export type FilmIndustry =
  | "sandalwood"
  | "tollywood"
  | "kollywood"
  | "mollywood"
  | "bollywood"
  | "hollywood"
  | "bengali"
  | "punjabi"
  | "regional";

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
  | "hypometer"
  | "upcoming"
  | "trending"
  | "television"
  | "celebrity"
  | "events"
  | "movies";

export interface Category {
  id: string;
  name: string; // Display name e.g. "Sandalwood"
  englishName: string;
  slug: CategorySlug;
  description?: string;
  count?: number;
}

export interface Article {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  summary: string;
  content?: string;
  excerpt?: string;
  category: CategorySlug;
  categoryName: string;
  tags: string[];
  featuredImage: string;
  imageCaption?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  readTimeMinutes: number;
  views: number;
  isBreaking?: boolean;
  isTopStory?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  status: "published" | "draft" | "scheduled" | "pending" | "archived";
  relatedArticleIds?: string[];
  source?: {
    id: string;
    name: string;
    url: string;
    publishedAtEstimated: boolean;
  };
  coverageCount?: number;
  altSources?: { name: string; url: string }[];
  isScraped?: boolean;
  fetchedAt?: string;
  publishedAtEstimated?: boolean;
  language?: LanguageCode;
  industry?: FilmIndustry;
}

export interface MovieReview {
  id: string;
  movieTitle: string; // Kannada or regional movie title
  movieTitleEn: string;
  slug: string;
  language?: LanguageCode;
  industry?: FilmIndustry;
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
  runtime: string; // e.g. "2 hours 35 mins"
  verdict: string; // Verdict badge e.g. "Blockbuster Movie!", "Total Entertainment!"
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
  // Next-Gen Dual-Axis Review Scores
  narrativeScore?: {
    overall: number; // e.g. 8.5/10
    story: number;
    screenplay: number;
    performances: number;
  };
  craftScore?: {
    overall: number; // e.g. 9.2/10
    cinematography: number;
    soundAndScore: number;
    vfxAndProduction: number;
    editing: number;
  };
  isReverentMilestone?: boolean;
  screenFormatRecommendation?: "IMAX" | "Dolby Atmos" | "4DX" | "Standard 2D";
  spoilers?: string[];
}

export * from "./boxOffice";
export * from "./movieIntelligence";

export interface BoxOfficeEntry {
  id: string;
  movieTitle: string;
  movieTitleEn: string;
  slug: string;
  posterImage: string;
  releaseYear: number;
  language?: LanguageCode;
  industry?: FilmIndustry;
  day1Collection: string; // e.g. "₹25 Cr"
  weekendCollection: string; // e.g. "₹70 Cr"
  worldwideCollection: string; // e.g. "₹450 Cr+"
  budget: string; // e.g. "₹100 Cr"
  verdict: "All-Time Blockbuster" | "Blockbuster" | "Super Hit" | "Hit" | "Average" | string;
  verdictBadgeColor: string;
  territoryBreakdown: {
    territory: string;
    collection: string;
  }[];
  rank: number;
  updatedAt: string;

  // Intelligent Multi-Source Analytics Fields
  figureStatus?: "live_estimate" | "consolidated" | "verified";
  dataClass?: "measured" | "reported" | "estimated";
  confidenceScore?: number; // 0 - 100
  confidenceLabel?: string;
  providersTrackedCount?: number;
  grossInCrores?: number;
  netInCrores?: number;
  distributorShareInCrores?: number;
  overseasGrossInCrores?: number;
  overseasGrossInUSD?: number;
  budgetInCrores?: number;
  territoryFinancials?: Array<{
    territory: string;
    regionalTitle?: string;
    grossInCrores: number;
    netInCrores: number;
    distributorShareInCrores: number;
    occupancyRate: number;
    marketSharePercent: number;
  }>;
  cityTelemetry?: Array<{
    city: string;
    nativeName?: string;
    state: string;
    trackedTheatres: number;
    trackedShows: number;
    occupancyPercent: number;
    fastFillingPercent: number;
    averageTicketPriceINR: number;
    dailyGrossInCrores: number;
    status: "live" | "consolidated";
    lastTrackedTime: string;
  }>;
  trajectory?: {
    day1InCrores: number;
    day2InCrores: number;
    day3InCrores: number;
    openingWeekendInCrores: number;
    week1InCrores: number;
    cumulativeGrossInCrores: number;
    projectedLifetimeInCrores: number;
  };
}

export type OttPlatform =
  | "Netflix"
  | "Prime Video"
  | "JioCinema"
  | "JioHotstar"
  | "Disney+ Hotstar"
  | "ZEE5"
  | "SunNXT"
  | "Sun NXT"
  | "Aha"
  | "SonyLIV";

export interface OttRelease {
  id: string;
  movieTitle: string;
  movieTitleEn: string;
  platform: OttPlatform;
  platformBadgeColor: string;
  releaseDate: string; // ISO date YYYY-MM-DD or formatted
  releaseStatus?: "streaming_now" | "upcoming_ott" | "tba";
  theatricalReleaseDate?: string;
  languages: string[];
  genre: string;
  posterImage: string;
  watchUrl?: string;
  trailerUrl?: string;
  description: string;
  cast: string[];
  director?: string;
  runtime?: string;
  productionHouse?: string;
  verificationScore?: number;
  verificationSources?: string[];
  language?: LanguageCode;
  industry?: FilmIndustry;
}

export interface VideoItem {
  id: string;
  title: string;
  category: "Trailer" | "Teaser" | "Songs" | "Interview" | string;
  youtubeId: string;
  thumbnailUrl: string;
  duration: string;
  views: string;
  publishedAt: string;
  featured?: boolean;
  language?: LanguageCode;
  industry?: FilmIndustry;
}

export interface GalleryItem {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  celebrityName: string;
  category: "Actors" | "Actresses" | "Cinema Event" | string;
  photoCount: number;
  photos: {
    url: string;
    caption: string;
  }[];
  publishedAt: string;
  language?: LanguageCode;
  industry?: FilmIndustry;
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

export type MovieReleaseStatus = "in_theatres" | "upcoming" | "tba" | "postponed" | "archived";
export type ReleaseDateConfidence = "confirmed" | "tentative" | "unconfirmed_tba";

export interface MovieCastMember {
  name: string;
  role: string; // e.g. "Lead Actor", "Lead Actress", "Antagonist"
  characterName?: string;
  image?: string;
}

export interface MovieCrewMember {
  name: string;
  role: string; // e.g. "Director", "Producer", "Music Director"
}

export interface Movie {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  synopsis: string;
  introduction?: string;
  theatricalReleaseDate: string; // YYYY-MM-DD in Asia/Kolkata
  releaseDateConfidence: ReleaseDateConfidence;
  releaseStatus: MovieReleaseStatus;
  language: LanguageCode;
  industry: FilmIndustry;
  genres: string[];
  director: string;
  producers: string[];
  cast: MovieCastMember[];
  crew?: MovieCrewMember[];
  productionCompany?: string;
  distributionCompany?: string;
  posterImage: string;
  bannerImage?: string;
  galleryImages?: string[];
  trailerYoutubeId?: string;
  trailerUrl?: string;
  censorRating?: string; // "U", "U/A", "A"
  runtimeMinutes?: number;
  runtimeFormatted?: string;
  articleSlug?: string;
  relatedArticleIds?: string[];
  sourceReferences?: {
    name: string;
    url: string;
    verified: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
  isFeatured?: boolean;
  fivePointVerification?: FivePointVerification;
  verificationScore?: number;
}

export interface AutomationLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  moviesProcessed: number;
  upcomingCount: number;
  inTheatresCount: number;
  archivedCount: number;
  status: "success" | "warning" | "error";
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

export interface Theatre {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  city: string;
  area: string;
  address: string;
  phone?: string;
  amenities: string[];
  isActive: boolean;
}

export interface Showtime {
  id: string;
  movieId: string;
  theatreId: string;
  screenId: string;
  theatreName: string;
  movieTitle: string;
  showDate: string;
  showTime: string;
  language: string;
  format: "2D" | "3D" | "IMAX";
  basePrice: number;
  status: "open" | "filling_fast" | "almost_full" | "sold_out";
}

export interface Seat {
  id: string;
  screenId: string;
  rowLabel: string;
  seatNumber: number;
  tier: "Classic" | "Prime" | "Recliner";
  price: number;
  isAvailable: boolean;
  isLocked?: boolean;
}

export interface Booking {
  id: string;
  bookingReference: string;
  showtimeId: string;
  movieTitle: string;
  theatreName: string;
  showDate: string;
  showTime: string;
  seats: string[];
  totalAmount: number;
  convenienceFee: number;
  gstAmount: number;
  currency: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  status: "pending" | "confirmed" | "failed" | "cancelled";
  createdAt: string;
  qrCodeUrl?: string;
}


