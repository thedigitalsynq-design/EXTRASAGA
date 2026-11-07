import { LanguageCode } from "@/types";

/**
 * EXTRASAGA is an English-language publication.
 * The per-language dictionaries have been retired: every edition key resolves
 * to the same English dictionary so legacy `lang` plumbing keeps compiling
 * (and keeps rendering English) everywhere.
 */
export interface Translations {
  // Navigation
  nav_home: string;
  nav_latest: string;
  nav_reviews: string;
  nav_television: string;
  nav_celebrity: string;
  nav_movies: string;
  nav_interviews: string;
  nav_gossips: string;
  nav_photos: string;
  nav_videos: string;
  nav_events: string;
  nav_trending_today: string;
  nav_industry: string;
  nav_bollywood: string;
  nav_hollywood: string;
  nav_actors: string;
  nav_actresses: string;
  nav_gossip: string;
  nav_gallery: string;
  nav_ott: string;
  nav_boxoffice: string;
  nav_upcoming: string;
  nav_trending: string;
  nav_admin: string;
  nav_search: string;
  nav_search_placeholder: string;
  nav_hot_topics: string;
  nav_select_industry: string;
  nav_categories: string;

  // Actions & Buttons
  btn_all_news: string;
  btn_more_news: string;
  btn_read_more: string;
  btn_view_all: string;
  btn_full_report: string;
  btn_watch_trailer: string;
  btn_read_review: string;
  btn_all_reviews: string;
  btn_all_videos: string;
  btn_all_ott: string;
  btn_search: string;
  btn_share: string;
  btn_filter: string;

  // Section Headers
  sec_breaking: string;
  sec_latest_news: string;
  sec_top_stories: string;
  sec_trending: string;
  sec_reviews: string;
  sec_trailers: string;
  sec_boxoffice: string;
  sec_ott: string;
  sec_gallery: string;

  // Box Office Table Columns
  bo_rank: string;
  bo_movie: string;
  bo_day1: string;
  bo_weekend: string;
  bo_worldwide: string;
  bo_verdict: string;

  // Meta & Footer
  footer_about: string;
  footer_telegram_whatsapp: string;
  footer_telegram: string;
  footer_whatsapp: string;
  footer_quick_links: string;
  footer_cinema_industries: string;
  footer_privacy: string;
  footer_terms: string;
  footer_contact: string;
  footer_rights: string;
}

const ENGLISH: Translations = {
  nav_home: "Home",
  nav_latest: "News",
  nav_reviews: "Reviews",
  nav_television: "Television",
  nav_celebrity: "Celebrity",
  nav_movies: "Movies",
  nav_interviews: "Interviews",
  nav_gossips: "Gossips",
  nav_photos: "Photos",
  nav_videos: "Videos",
  nav_events: "Events",
  nav_trending_today: "Trending Today",
  nav_industry: "Sandalwood",
  nav_bollywood: "Bollywood",
  nav_hollywood: "Hollywood",
  nav_actors: "Actors",
  nav_actresses: "Actresses",
  nav_gossip: "Tea",
  nav_gallery: "Photos",
  nav_ott: "Now Streaming",
  nav_boxoffice: "Box Office",
  nav_upcoming: "Upcoming Movies",
  nav_trending: "Trending",
  nav_admin: "Admin",
  nav_search: "Search",
  nav_search_placeholder: "Search the six industries — movies, stars, verdicts, receipts...",
  nav_hot_topics: "Hot Topics:",
  nav_select_industry: "Pick Your Industry",
  nav_categories: "Categories",

  btn_all_news: "All Stories",
  btn_more_news: "Pull up the whole feed",
  btn_read_more: "Read the thread",
  btn_view_all: "View All",
  btn_full_report: "Full Report",
  btn_watch_trailer: "Roll the First Look",
  btn_read_review: "Read the verdict",
  btn_all_reviews: "All Verdicts",
  btn_all_videos: "All Videos & Trailers",
  btn_all_ott: "All Streaming Titles",
  btn_search: "Search",
  btn_share: "Share",
  btn_filter: "Filter",

  sec_breaking: "Sirens — Breaking",
  sec_latest_news: "Fresh Off the Wire",
  sec_top_stories: "Top Story",
  sec_trending: "Trending Stories",
  sec_reviews: "The Verdict Wall",
  sec_trailers: "First Look",
  sec_boxoffice: "The Receipts Desk",
  sec_ott: "Now Streaming / OTT Radar",
  sec_gallery: "Star Photo Gallery",

  bo_rank: "Rank",
  bo_movie: "Movie Title",
  bo_day1: "Day 1 ₹",
  bo_weekend: "Opening Weekend ₹",
  bo_worldwide: "Worldwide ₹",
  bo_verdict: "Verdict",

  footer_about:
    "EXTRASAGA — the film-brain desk for six industries: Sandalwood, Tollywood, Kollywood, Mollywood, Bollywood and Hollywood. Receipts-backed box office, zero-fake tea, and strictly unbiased verdicts.",
  footer_telegram_whatsapp: "Join the channels:",
  footer_telegram: "Telegram",
  footer_whatsapp: "WhatsApp Channel",
  footer_quick_links: "Quick Navigation",
  footer_cinema_industries: "Film Industries",
  footer_privacy: "Privacy Policy",
  footer_terms: "Terms of Use",
  footer_contact: "Contact Us",
  footer_rights: "All rights reserved.",
};

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  kn: ENGLISH,
  te: ENGLISH,
  ta: ENGLISH,
  ml: ENGLISH,
  hi: ENGLISH,
  en: ENGLISH,
  bn: ENGLISH,
  pa: ENGLISH,
  other: ENGLISH,
};

export function getTranslation(_lang: LanguageCode, key: keyof Translations): string {
  // Single-language edition: the edition argument is accepted for compatibility.
  void _lang;
  return ENGLISH[key] || "";
}

export function getLocalizedCategoryName(slug: string, _lang: LanguageCode): string {
  void _lang;
  switch (slug) {
    case "mukhaputa":
    case "home":
      return ENGLISH.nav_home;
    case "latest":
    case "news":
      return ENGLISH.nav_latest;
    case "reviews":
      return ENGLISH.nav_reviews;
    case "television":
    case "tv":
      return ENGLISH.nav_television;
    case "celebrity":
      return ENGLISH.nav_celebrity;
    case "movies":
      return ENGLISH.nav_movies;
    case "interviews":
      return ENGLISH.nav_interviews;
    case "gossip":
    case "gossips":
      return ENGLISH.nav_gossips;
    case "gallery":
    case "photos":
      return ENGLISH.nav_photos;
    case "videos":
      return ENGLISH.nav_videos;
    case "events":
      return ENGLISH.nav_events;
    case "trending":
      return ENGLISH.nav_trending_today;
    case "sandalwood":
      return "Sandalwood";
    case "bollywood":
      return ENGLISH.nav_bollywood;
    case "hollywood":
      return ENGLISH.nav_hollywood;
    case "actors":
      return ENGLISH.nav_actors;
    case "actresses":
      return ENGLISH.nav_actresses;
    case "ott":
      return ENGLISH.nav_ott;
    case "box-office":
      return ENGLISH.nav_boxoffice;
    case "upcoming":
      return ENGLISH.nav_upcoming;
    default:
      return slug;
  }
}
