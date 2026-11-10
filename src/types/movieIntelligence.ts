import { LanguageCode, FilmIndustry, MovieReleaseStatus } from "./index";

export type VerificationStatus =
  | "confirmed"            // >=2 independent sources agree with >=1 official statement
  | "pending_verification" // Discrepancy between sources or single unconfirmed report
  | "date_changed"         // New date observed differing from earlier confirmed date
  | "postponed"            // Officially delayed / postponed to future or TBD
  | "tba"                  // Officially announced, release date TBA
  | "in_theatres";         // Released and currently playing

export type SourceType =
  | "official_studio"
  | "cinema_chain_booking"
  | "trade_publication";

export interface ReleaseDateObservation {
  sourceId: string;
  sourceType: SourceType;
  sourceAuthorityWeight: number; // 0.0 to 1.0 (e.g. 0.95 for official studio)
  observedDate: string; // YYYY-MM-DD in Asia/Kolkata
  observedAt: string; // ISO timestamp
  isOfficialAnnouncement: boolean;
  notes?: string;
}

export interface ReleaseDateHistoryEntry {
  date: string;
  recordedAt: string;
  status: VerificationStatus;
  reason?: string;
}

export interface FivePointVerification {
  studioConfirmed: boolean;
  multiplexListed: boolean;
  advanceBookingOpen: boolean;
  chamberApproved: boolean;
  tradeConsensusReached: boolean;
  crossCheckCount: number; // 0 to 5
  accuracyScore: number;   // 0 to 100%
  accuracyGrade: string;   // e.g. "5/5 Sovereign Consensus"
  verifiedSourcesList: string[];
}

export interface VerifiedMovieRecord {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  synopsis: string;
  introduction?: string;
  theatricalReleaseDate: string; // YYYY-MM-DD in Asia/Kolkata
  daysUntilRelease: number;
  verificationStatus: VerificationStatus;
  verificationScore: number; // 0 to 100 confidence
  sourcesAgreedCount: number;
  totalSourcesObserved: number;
  releaseStatus: MovieReleaseStatus;
  fivePointVerification?: FivePointVerification;
  language: LanguageCode;
  industry: FilmIndustry;
  genres: string[];
  director: string;
  producers: string[];
  cast: {
    name: string;
    role: string;
    characterName?: string;
    image?: string;
  }[];
  crew?: {
    name: string;
    role: string;
  }[];
  productionCompany?: string;
  distributionCompany?: string;
  posterImage: string;
  bannerImage?: string;
  galleryImages?: string[];
  trailerYoutubeId?: string;
  trailerUrl?: string;
  censorRating?: string;
  runtimeMinutes?: number;
  runtimeFormatted?: string;
  isFeatured?: boolean;
  canTrackBoxOffice: boolean; // Strictly false if theatricalReleaseDate > today
  releaseDateHistory: ReleaseDateHistoryEntry[];
  lastVerifiedAt: string;
  nextVerificationScheduledAt: string;
}

export interface MovieIntelligenceStats {
  todayIST: string;
  windowStartDate: string;
  windowEndDate: string;
  totalDiscovered: number;
  upcoming30DaysCount: number;
  nowShowingCount: number;
  postponedCount: number;
  pendingVerificationCount: number;
  industryBreakdown: Record<FilmIndustry, number>;
  lastEngineSync: string;
}

