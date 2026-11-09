import { LanguageCode } from "@/types";

/**
 * EXTRA-SAAGA is a unified English-language entertainment platform.
 * Every edition key resolves to the same clear, expressive, and engaging English
 * dictionary so all routes and legacy language hooks continue to render flawlessly.
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
  nav_actors: "Leading Men",
  nav_actresses: "Leading Women",
  nav_gossip: "Studio Wire",
  nav_gallery: "Gallery",
  nav_ott: "Now Streaming",
  nav_boxoffice: "Box Office",
  nav_upcoming: "Coming Soon",
  nav_trending: "Trending",
  nav_admin: "Admin",
  nav_search: "Search",
  nav_search_placeholder: "Search across Indian cinema — movies, stars, honest reviews, verified box office...",
  nav_hot_topics: "Trending Topics:",
  nav_select_industry: "Explore Industries",
  nav_categories: "Browse Categories",

  btn_all_news: "Explore All Stories",
  btn_more_news: "Explore Every Story",
  btn_read_more: "Read Full Story",
  btn_view_all: "View All",
  btn_full_report: "Read Detailed Report",
  btn_watch_trailer: "Watch Official Trailer",
  btn_read_review: "Read The Full Review",
  btn_all_reviews: "Browse All Reviews",
  btn_all_videos: "Watch All Trailers",
  btn_all_ott: "Explore All Streaming Titles",
  btn_search: "Search",
  btn_share: "Share Story",
  btn_filter: "Filter By Industry",

  sec_breaking: "Breaking News · Cinema Wire",
  sec_latest_news: "Fresh Dispatches · The Pulse of Cinema",
  sec_top_stories: "Spotlight Stories",
  sec_trending: "What India Is Talking About",
  sec_reviews: "The Verdict · Honest Film Reviews",
  sec_trailers: "Screen Test · Trailers & Teasers",
  sec_boxoffice: "Box Office Wire · Receipts & Records",
  sec_ott: "Now Streaming · Your Living Room Cinema",
  sec_gallery: "In Focus · Star Photo Gallery",

  bo_rank: "Rank",
  bo_movie: "Film Title",
  bo_day1: "Opening Day ₹",
  bo_weekend: "Opening Weekend ₹",
  bo_worldwide: "Worldwide Total ₹",
  bo_verdict: "Trade Verdict",

  footer_about:
    "EXTRA-SAAGA brings all Indian cinema together under one grand roof — celebrating extraordinary stories from Bollywood, Tollywood, Sandalwood, Kollywood, Mollywood, and beyond. We deliver receipt-backed box office numbers, fearless reviews, and the living heartbeat of the silver screen with warmth, depth, and unwavering respect.",
  footer_telegram_whatsapp: "Connect With Our Newsroom:",
  footer_telegram: "Telegram Wire",
  footer_whatsapp: "WhatsApp Channel",
  footer_quick_links: "Explore Platform",
  footer_cinema_industries: "Film Industries",
  footer_privacy: "Privacy Policy",
  footer_terms: "Terms of Use",
  footer_contact: "Contact The Bureau",
  footer_rights: "All rights reserved. Dedicated to the craft and magic of Indian cinema.",
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
