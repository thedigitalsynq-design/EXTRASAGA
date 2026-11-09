import { LanguageCode, FilmIndustry } from "./index";

export type BoxOfficeFigureStatus = "live_estimate" | "consolidated" | "verified";
export type BoxOfficeDataClass = "measured" | "reported" | "estimated";
export type CurrencyCode = "INR" | "USD" | "AED" | "GBP";

/**
 * Internal Raw Provider Report.
 * CRITICAL PRIVACY RULE: Never expose providerId, raw source figures,
 * or provider names to the frontend.
 */
export interface RawProviderReport {
  id: string;
  providerId: string;
  providerType:
    | "exhibitor_telemetry"
    | "ticket_booking_aggregator"
    | "distributor_statement"
    | "trade_analyst"
    | "overseas_comscore";
  movieId: string;
  movieTitle: string;
  reportDate: string; // ISO format (YYYY-MM-DD)
  reportedAt: string; // ISO timestamp
  currency: CurrencyCode;
  figures: {
    rawGross: number;
    rawNet?: number;
    rawDistributorShare?: number;
    rawOverseasGross?: number;
    unit: "crores" | "lakhs" | "millions" | "exact";
  };
  theatreTelemetry?: {
    trackedShows: number;
    trackedTickets: number;
    trackedOccupancyPercent: number;
    fastFillingShows?: number;
    cancellations?: number;
    city?: string;
  };
  reliabilityScore: number; // 0.0 to 1.0 (historical accuracy track record)
  isAuditedStatement?: boolean;
}

/**
 * Normalized Box Office Report ready for statistical consolidation.
 */
export interface NormalizedReport {
  reportId: string;
  movieId: string;
  reportDate: string;
  grossInCrores: number;
  netInCrores: number;
  distributorShareInCrores: number;
  overseasGrossInCrores: number;
  theatreShows?: number;
  occupancyPercent?: number;
  weight: number;
  freshnessMultiplier: number;
  isOutlier: boolean;
  sourceClassification: BoxOfficeDataClass;
}

/**
 * City-Wise Cinema Telemetry & Operational Metrics.
 * Displays aggregate performance per major cinema market.
 */
export interface CityCinemaTelemetry {
  city: string; // e.g. "Bengaluru", "Hyderabad", "Chennai", "Mumbai"
  nativeName?: string; // e.g. "Bengaluru", "Hyderabad"
  state: string;
  trackedTheatres: number;
  trackedShows: number;
  occupancyPercent: number;
  fastFillingPercent: number;
  averageTicketPriceINR: number;
  dailyGrossInCrores: number;
  status: "live" | "consolidated";
  lastTrackedTime: string;
}

/**
 * Territory-wise Financial Breakdown segregating Gross, Net, and Distributor Share.
 */
export interface TerritoryFinancialBreakdown {
  territory: string;
  regionalTitle?: string;
  grossInCrores: number;
  netInCrores: number;
  distributorShareInCrores: number;
  occupancyRate: number;
  marketSharePercent: number;
}

/**
 * Day-wise and Lifecycle Trajectory Tracking.
 */
export interface BoxOfficeLifecycleTrajectory {
  day1InCrores: number;
  day2InCrores: number;
  day3InCrores: number;
  openingWeekendInCrores: number;
  week1InCrores: number;
  cumulativeGrossInCrores: number;
  projectedLifetimeInCrores: number;
}

/**
 * Public Consolidated Box Office Analytics Model.
 * Privacy-preserving: exposes zero provider identities or internal raw figures.
 */
export interface ConsolidatedBoxOfficeRecord {
  id: string;
  movieId: string;
  movieTitle: string; // Display title e.g. "Kantara: Chapter 1"
  movieTitleEn: string; // English title e.g. "Kantara: Chapter 1"
  slug: string;
  posterImage: string;
  releaseYear: number;
  language: LanguageCode;
  industry: FilmIndustry;

  // Status & Privacy-Preserving Trust Indicators
  figureStatus: BoxOfficeFigureStatus;
  dataClass: BoxOfficeDataClass;
  confidenceScore: number; // 0 to 100
  confidenceLabel: string; // e.g. "High • Multi-source Reconciled"
  lastUpdated: string; // ISO timestamp
  providersTrackedCount: number; // e.g. 5 sources integrated without revealing identities

  // Core Financial Segregation (INR Crores & USD Millions)
  grossInCrores: number;
  netInCrores: number;
  distributorShareInCrores: number;
  overseasGrossInCrores: number;
  overseasGrossInUSD: number;
  budgetInCrores: number;
  verdict: string;
  verdictBadgeColor: string;
  rank: number;

  // Formatted Strings for Backward-Compatibility with BoxOfficeEntry
  day1Collection: string; // e.g. "₹25 Cr"
  weekendCollection: string; // e.g. "₹70 Cr"
  worldwideCollection: string; // e.g. "₹450 Cr+"
  budget: string; // e.g. "₹100 Cr"

  // Analytics Deep Dives
  trajectory: BoxOfficeLifecycleTrajectory;
  territories: TerritoryFinancialBreakdown[];
  cityTelemetry: CityCinemaTelemetry[];
  advanceBooking?: AdvanceBookingTelemetry;
}

/**
 * Live Advance Booking Telemetry (BFILMY reverse-engineered mechanism).
 * Tracks real-time tickets sold, show counts, fast-filling and housefull velocity.
 */
export interface AdvanceBookingTelemetry {
  advanceGrossInCrores: number;
  advanceGrossFormatted: string;
  ticketsSold: number;
  ticketsSoldFormatted: string;
  totalShows: number;
  fastFillingShows: number;
  housefullShows: number;
  trackedTheatres: number;
  occupancyPercent: number;
  nationalChainsTickets: number; // PIC: PVR, INOX, Cinépolis
  nationalChainsTicketsFormatted: string;
  nationalChainsGrossInCrores: number;
  dayPredictionInCrores: string;
  weekendProjectionInCrores: string;
  trendDeltaPercent: number;
  trend: "up" | "down" | "flat";
  lastTracked: string;
}

/**
 * National Chains Advance Pulse item for ticker & market strip.
 */
export interface NationalChainsAdvancePulseItem {
  movieId: string;
  movieTitle: string;
  slug: string;
  language: string;
  picTicketsSold: number;
  picTicketsSoldFormatted: string;
  picGrossInCrores: number;
  trend: "up" | "down" | "flat";
  trendDelta: string;
  occupancyPercent: number;
  totalShows: number;
  fastFillingCount: number;
}

/**
 * State-wise Cinema Theatrical Exhibition Telemetry.
 */
export interface StateCinemaTelemetry {
  state: string;
  regionCode: string;
  trackedTheatres: number;
  trackedShows: number;
  occupancyPercent: number;
  dailyGrossInCrores: number;
  topMovie: string;
  leadLanguage: string;
}

/**
 * Aggregated Telemetry Health Stats (Internal / Diagnostic).
 */
export interface BoxOfficeEngineHealth {
  activeProvidersCount: number;
  lastSuccessfulSync: string;
  reconciliationJobStatus: "idle" | "running" | "healthy" | "degraded";
  totalReportsIngested: number;
  outliersSuppressedCount: number;
  averageConfidenceScore: number;
}

/**
 * Films Discourse Verdict Hierarchy:
 * From All-Time Blockbuster to Disaster & Active Theatrical Runs.
 */
export type FilmsDiscourseVerdictLevel =
  | "all_time_blockbuster"
  | "blockbuster"
  | "superhit"
  | "hit"
  | "above_average"
  | "average"
  | "flop"
  | "disaster"
  | "running";

/**
 * Yearly Box Office Leaderboard Record (Films Discourse mechanism).
 * Allows sorting by Net, Opening Day, Worldwide, or Overseas.
 */
export interface YearlyBoxOfficeLeaderboardItem {
  rank: number;
  movieTitle: string;
  movieTitleEn: string;
  slug: string;
  posterImage: string;
  releaseDate: string; // e.g. "19 Mar 2026"
  releaseYear: number;
  openingDayNettCrores: number;
  indiaNettCrores: number;
  worldwideGrossCrores: number;
  overseasGrossUSDMillions: number;
  verdict: FilmsDiscourseVerdictLevel;
  verdictLabel: string;
  language: string;
  industry: string;
}

/**
 * HypoMeter Film Record (Audience Pulse & Fan Hype Telemetry).
 * Reverse-engineered from Films Discourse HypoMeter.
 */
export interface HypoFilmItem {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  releaseDate: string; // e.g. "2026-12-24"
  releaseDateFormatted: string; // e.g. "24 Dec 2026"
  daysToRelease: number;
  language: string;
  director: string;
  starring: string;
  posterImage: string;
  backdropImage: string;
  interestedCount: number;
  interestedCountFormatted: string; // e.g. "1,11,000"
  dailyDelta: number; // e.g. +3,500
  hypeRank: number;
  openingDayPredictionMinCr: number;
  openingDayPredictionMaxCr: number;
  hypedVotes: number;
  notHypedVotes: number;
  hypedPercent: number;
  accentColorDark: string; // HSL for background tint
  accentColorLight: string;
}


