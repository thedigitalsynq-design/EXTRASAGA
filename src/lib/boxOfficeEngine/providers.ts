import { RawProviderReport } from "@/types/boxOffice";

/**
 * Multi-Source Box Office Providers.
 * Simulates independent, reliable cinema data reporting streams.
 *
 * NOTE: Individual provider names and IDs are strictly INTERNAL and
 * NEVER surfaced to the public frontend.
 */

interface ProviderConfig {
  id: string;
  type: RawProviderReport["providerType"];
  baseReliability: number;
  reportingLatencyMinutes: number;
}

export const INTERNAL_PROVIDERS: ProviderConfig[] = [
  {
    id: "provider_exhibitor_telemetry",
    type: "exhibitor_telemetry",
    baseReliability: 0.96, // Highest accuracy - direct automated theatre ticket counts
    reportingLatencyMinutes: 15,
  },
  {
    id: "provider_ticket_booking_aggregator",
    type: "ticket_booking_aggregator",
    baseReliability: 0.89, // High precision - tracked hourly seat-fill velocity
    reportingLatencyMinutes: 30,
  },
  {
    id: "provider_distributor_official_statement",
    type: "distributor_statement",
    baseReliability: 0.92, // Authoritative declarations
    reportingLatencyMinutes: 180,
  },
  {
    id: "provider_trade_analyst_network",
    type: "trade_analyst",
    baseReliability: 0.86, // Independent field surveys & single-screen ground reports
    reportingLatencyMinutes: 60,
  },
  {
    id: "provider_overseas_comscore_exchange",
    type: "overseas_comscore",
    baseReliability: 0.94, // International theater chain verified collections
    reportingLatencyMinutes: 120,
  },
];

export interface MovieSeedConfig {
  movieId: string;
  movieTitle: string;
  movieTitleEn: string;
  slug: string;
  posterImage: string;
  releaseYear: number;
  language: "kn" | "te" | "ta" | "ml" | "hi" | "en";
  industry: "sandalwood" | "tollywood" | "kollywood" | "mollywood" | "bollywood" | "hollywood";
  baseGrossCrores: number;
  budgetCrores: number;
  verdict: string;
  verdictBadgeColor: string;
  isCurrentlyInTheatres: boolean;
  overseasShareRatio: number;
  day1Ratio: number;
  weekendRatio: number;
}

export const MONITORED_MOVIES: MovieSeedConfig[] = [
  {
    movieId: "mov_kgf2",
    movieTitle: "ಕೆ.ಜಿ.ಎಫ್: ಚಾಪ್ಟರ್ 2",
    movieTitleEn: "K.G.F: Chapter 2",
    slug: "kgf-chapter-2",
    posterImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2022,
    language: "kn",
    industry: "sandalwood",
    baseGrossCrores: 1250.0,
    budgetCrores: 100.0,
    verdict: "ಆಲ್ ಟೈಮ್ ಬ್ಲಾಕ್‌ಬಸ್ಟರ್",
    verdictBadgeColor: "emerald",
    isCurrentlyInTheatres: false,
    overseasShareRatio: 0.22,
    day1Ratio: 0.108,
    weekendRatio: 0.32,
  },
  {
    movieId: "mov_kantara",
    movieTitle: "ಕಾಂತಾರ",
    movieTitleEn: "Kantara",
    slug: "kantara-a-legend",
    posterImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2022,
    language: "kn",
    industry: "sandalwood",
    baseGrossCrores: 450.0,
    budgetCrores: 16.0,
    verdict: "ಆಲ್ ಟೈಮ್ ಬ್ಲಾಕ್‌ಬಸ್ಟರ್",
    verdictBadgeColor: "emerald",
    isCurrentlyInTheatres: false,
    overseasShareRatio: 0.15,
    day1Ratio: 0.055,
    weekendRatio: 0.21,
  },
  {
    movieId: "mov_bagheera",
    movieTitle: "ಭಗೀರ (Bagheera)",
    movieTitleEn: "Bagheera",
    slug: "bagheera-box-office-collection",
    posterImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2024,
    language: "kn",
    industry: "sandalwood",
    baseGrossCrores: 38.5,
    budgetCrores: 20.0,
    verdict: "ಹಿಟ್",
    verdictBadgeColor: "blue",
    isCurrentlyInTheatres: true,
    overseasShareRatio: 0.12,
    day1Ratio: 0.16,
    weekendRatio: 0.45,
  },
  {
    movieId: "mov_rrr",
    movieTitle: "ఆర్.ఆర్.ఆర్ (RRR)",
    movieTitleEn: "RRR",
    slug: "rrr-box-office-collection",
    posterImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2022,
    language: "te",
    industry: "tollywood",
    baseGrossCrores: 1387.0,
    budgetCrores: 550.0,
    verdict: "ఆల్ టైమ్ బ్లాక్‌బస్టర్",
    verdictBadgeColor: "emerald",
    isCurrentlyInTheatres: false,
    overseasShareRatio: 0.28,
    day1Ratio: 0.16,
    weekendRatio: 0.36,
  },
  {
    movieId: "mov_kalki",
    movieTitle: "కల్కి 2898 AD (Kalki 2898 AD)",
    movieTitleEn: "Kalki 2898 AD",
    slug: "kalki-2898-ad-box-office",
    posterImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2024,
    language: "te",
    industry: "tollywood",
    baseGrossCrores: 1042.0,
    budgetCrores: 600.0,
    verdict: "బ్లాక్‌బస్టర్",
    verdictBadgeColor: "emerald",
    isCurrentlyInTheatres: false,
    overseasShareRatio: 0.30,
    day1Ratio: 0.18,
    weekendRatio: 0.40,
  },
  {
    movieId: "mov_leo",
    movieTitle: "லியோ (Leo)",
    movieTitleEn: "Leo",
    slug: "leo-box-office-collection",
    posterImage: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2023,
    language: "ta",
    industry: "kollywood",
    baseGrossCrores: 620.0,
    budgetCrores: 250.0,
    verdict: "பிளாக்பஸ்டர்",
    verdictBadgeColor: "emerald",
    isCurrentlyInTheatres: false,
    overseasShareRatio: 0.35,
    day1Ratio: 0.24,
    weekendRatio: 0.46,
  },
  {
    movieId: "mov_manjummel",
    movieTitle: "മഞ്ഞുമ്മൽ ബോയ്സ് (Manjummel Boys)",
    movieTitleEn: "Manjummel Boys",
    slug: "manjummel-boys-box-office",
    posterImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2024,
    language: "ml",
    industry: "mollywood",
    baseGrossCrores: 242.0,
    budgetCrores: 20.0,
    verdict: "ഓൾ ടൈം ബ്ലോക്ക്ബസ്റ്റർ",
    verdictBadgeColor: "emerald",
    isCurrentlyInTheatres: false,
    overseasShareRatio: 0.32,
    day1Ratio: 0.045,
    weekendRatio: 0.22,
  },
  {
    movieId: "mov_jawan",
    movieTitle: "जवान (Jawan)",
    movieTitleEn: "Jawan",
    slug: "jawan-box-office-collection",
    posterImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2023,
    language: "hi",
    industry: "bollywood",
    baseGrossCrores: 1148.0,
    budgetCrores: 300.0,
    verdict: "ऑल टाइम ब्लॉकबस्टर",
    verdictBadgeColor: "emerald",
    isCurrentlyInTheatres: false,
    overseasShareRatio: 0.34,
    day1Ratio: 0.11,
    weekendRatio: 0.33,
  },
  {
    movieId: "mov_oppenheimer",
    movieTitle: "Oppenheimer",
    movieTitleEn: "Oppenheimer",
    slug: "oppenheimer-box-office",
    posterImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2023,
    language: "en",
    industry: "hollywood",
    baseGrossCrores: 7850.0, // ~$960M USD in INR Crores
    budgetCrores: 800.0,
    verdict: "All-Time Historic Blockbuster",
    verdictBadgeColor: "emerald",
    isCurrentlyInTheatres: false,
    overseasShareRatio: 0.65,
    day1Ratio: 0.08,
    weekendRatio: 0.25,
  },
];

/**
 * Ingest Engine: generates multi-source reports for a given movie.
 * Introduces slight natural source variance (±1% to ±4%) to simulate
 * independent distributor, trade, and ticket counting streams.
 */
export function fetchIndependentSourceReports(movie: MovieSeedConfig): RawProviderReport[] {
  const now = new Date();
  const reports: RawProviderReport[] = [];

  const base = movie.baseGrossCrores;

  // 1. Exhibitor Telemetry (Direct measured automated tickets)
  const exhibitorGross = Number((base * (1 + (Math.sin(movie.movieId.length * 1) * 0.015))).toFixed(2));
  reports.push({
    id: `${movie.movieId}_exhibitor_tel_${Date.now()}`,
    providerId: "provider_exhibitor_telemetry",
    providerType: "exhibitor_telemetry",
    movieId: movie.movieId,
    movieTitle: movie.movieTitle,
    reportDate: now.toISOString().slice(0, 10),
    reportedAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
    currency: "INR",
    figures: {
      rawGross: exhibitorGross,
      rawNet: Number((exhibitorGross / 1.18).toFixed(2)),
      rawDistributorShare: Number(((exhibitorGross / 1.18) * 0.49).toFixed(2)),
      unit: "crores",
    },
    theatreTelemetry: {
      trackedShows: movie.isCurrentlyInTheatres ? 1420 : 6800,
      trackedTickets: Math.round(base * 38000),
      trackedOccupancyPercent: movie.isCurrentlyInTheatres ? 74.5 : 88.2,
      fastFillingShows: movie.isCurrentlyInTheatres ? 512 : 3400,
      cancellations: 2,
    },
    reliabilityScore: 0.96,
  });

  // 2. Ticket-Booking Aggregator (Hourly velocity)
  const ticketGross = Number((base * (1 + (Math.cos(movie.movieId.length * 2) * 0.022))).toFixed(2));
  reports.push({
    id: `${movie.movieId}_ticket_agg_${Date.now()}`,
    providerId: "provider_ticket_booking_aggregator",
    providerType: "ticket_booking_aggregator",
    movieId: movie.movieId,
    movieTitle: movie.movieTitle,
    reportDate: now.toISOString().slice(0, 10),
    reportedAt: new Date(now.getTime() - 35 * 60 * 1000).toISOString(),
    currency: "INR",
    figures: {
      rawGross: ticketGross,
      unit: "crores",
    },
    theatreTelemetry: {
      trackedShows: movie.isCurrentlyInTheatres ? 1380 : 6500,
      trackedTickets: Math.round(base * 37200),
      trackedOccupancyPercent: movie.isCurrentlyInTheatres ? 72.8 : 86.4,
    },
    reliabilityScore: 0.89,
  });

  // 3. Official Distributor Statement (Authoritative / audited)
  const distributorGross = Number((base * (1 + (Math.sin(movie.movieId.length * 3) * 0.012))).toFixed(2));
  reports.push({
    id: `${movie.movieId}_dist_stmt_${Date.now()}`,
    providerId: "provider_distributor_official_statement",
    providerType: "distributor_statement",
    movieId: movie.movieId,
    movieTitle: movie.movieTitle,
    reportDate: now.toISOString().slice(0, 10),
    reportedAt: new Date(now.getTime() - 120 * 60 * 1000).toISOString(),
    currency: "INR",
    figures: {
      rawGross: distributorGross,
      rawNet: Number((distributorGross / 1.18).toFixed(2)),
      rawDistributorShare: Number(((distributorGross / 1.18) * 0.50).toFixed(2)),
      unit: "crores",
    },
    reliabilityScore: 0.92,
    isAuditedStatement: !movie.isCurrentlyInTheatres,
  });

  // 4. Trade Analyst Field Trackers (B & C Single screen estimates)
  const tradeGross = Number((base * (1 - (Math.cos(movie.movieId.length * 4) * 0.018))).toFixed(2));
  reports.push({
    id: `${movie.movieId}_trade_ana_${Date.now()}`,
    providerId: "provider_trade_analyst_network",
    providerType: "trade_analyst",
    movieId: movie.movieId,
    movieTitle: movie.movieTitle,
    reportDate: now.toISOString().slice(0, 10),
    reportedAt: new Date(now.getTime() - 50 * 60 * 1000).toISOString(),
    currency: "INR",
    figures: {
      rawGross: tradeGross,
      rawNet: Number((tradeGross / 1.18).toFixed(2)),
      unit: "crores",
    },
    reliabilityScore: 0.86,
  });

  // 5. Overseas Comscore Network (USD / International)
  const overseasCrores = Number((base * movie.overseasShareRatio).toFixed(2));
  const overseasUSDMillions = Number(((overseasCrores * 10_000_000) / 84.0 / 1_000_000).toFixed(2));
  const worldwideUSDMillions = Number(
    (((base * (1 + (Math.sin(movie.movieId.length * 5) * 0.01))) * 10_000_000) / 84.0 / 1_000_000).toFixed(2)
  );

  reports.push({
    id: `${movie.movieId}_overseas_${Date.now()}`,
    providerId: "provider_overseas_comscore_exchange",
    providerType: "overseas_comscore",
    movieId: movie.movieId,
    movieTitle: movie.movieTitle,
    reportDate: now.toISOString().slice(0, 10),
    reportedAt: new Date(now.getTime() - 90 * 60 * 1000).toISOString(),
    currency: "USD",
    figures: {
      rawGross: worldwideUSDMillions,
      rawOverseasGross: overseasUSDMillions,
      unit: "millions",
    },
    reliabilityScore: 0.94,
  });

  return reports;
}
