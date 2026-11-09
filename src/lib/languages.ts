import { LanguageCode, FilmIndustry } from "@/types";

/**
 * EXTRA-SAAGA ships as an English-language publication.
 * The language edition axis has been retired: every page renders English,
 * but films keep their own language identity (a Kannada film is still a
 * Kannada film — that field describes the film, not the site).
 */
export interface LanguageConfig {
  code: LanguageCode;
  name: string; // Site language name — always English
  englishName: string;
  brandNameNative: string; // Retained for compatibility; equals the brand in Latin script
  industry: FilmIndustry;
  industryName: string;
  industryNameNative: string; // Retained for compatibility; equals industryName
  flagEmoji: string;
  badgeColor: string;
  tagline: string;
  headerTagline: string;
  newsSectionTitle: string;
  reviewsSectionTitle: string;
  trailersSectionTitle: string;
  boxOfficeTitle: string;
  ottTitle: string;
  hotTopics: string[];
}

export const ENGLISH_CONFIG: LanguageConfig = {
  code: "en",
  name: "English",
  englishName: "English",
  brandNameNative: "EXTRA-SAAGA",
  industry: "hollywood", // Technical identifier retained for compatibility
  industryName: "Indian Cinema",
  industryNameNative: "All Indian Film Industries",
  flagEmoji: "🇮🇳",
  badgeColor: "bg-sheet text-ink border-2 border-ink shadow-sticker",
  tagline: "Receipts-Backed Box Office, Zero-Fake Tea & Strictly Unbiased Verdicts",
  headerTagline: "All Indian Film Industries · Unified Press Desk · 90-Day Release Radar · The Verdict Desk",
  newsSectionTitle: "The Feed — All Indian Film Industries, Real-Time",
  reviewsSectionTitle: "The Verdict Desk — All-India Film Reviews, Zero Star Games",
  trailersSectionTitle: "First Look — Official Trailers & Teaser Drops Across All Industries",
  boxOfficeTitle: "The Receipts — Consolidated Indian Box Office Leaderboard",
  ottTitle: "Now Streaming — Verified OTT Radar Across All Indian Languages",
  hotTopics: ["Kantara: Chapter 1", "Pushpa 2: The Rule", "Ramayana (Ranbir × Yash)", "Toxic (Yash)", "War 2", "Coolie", "Vettaiyan", "L2: Empuraan"],
};

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [ENGLISH_CONFIG];

export function isLanguageCode(value: string | null | undefined): value is LanguageCode {
  return value === "en";
}

export const DEFAULT_LANGUAGE: LanguageCode = "en";

export function getLanguageConfig(_code?: string): LanguageConfig {
  // Single-language edition: always English, regardless of any legacy ?lang value.
  void _code;
  return ENGLISH_CONFIG;
}

export function getIndustryByLanguage(_code: LanguageCode): FilmIndustry {
  return ENGLISH_CONFIG.industry;
}

/** Legacy per-language industry mapping retained for reference (film-language boards). */
export function getIndustryForFilmLanguage(code: LanguageCode | undefined): FilmIndustry | undefined {
  switch (code) {
    case "kn":
      return "sandalwood";
    case "te":
      return "tollywood";
    case "ta":
      return "kollywood";
    case "ml":
      return "mollywood";
    case "hi":
      return "bollywood";
    case "en":
      return "hollywood";
    default:
      return undefined;
  }
}
