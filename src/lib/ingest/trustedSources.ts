import { FilmIndustry, LanguageCode, CategorySlug } from "@/types";

export interface TrustedNewsSource {
  id: string;
  name: string;
  homepage: string;
  feedUrl: string;
  language: LanguageCode;
  industry: FilmIndustry;
  defaultCategory: CategorySlug;
  enabled: boolean;
  trustScore: number; // 0-100
  description: string;
  favicon?: string;
  lastSyncAt?: string;
  articlesImportedCount?: number;
}

export const TRUSTED_NEWS_SOURCES: TrustedNewsSource[] = [
  // --- KANNADA / SANDALWOOD ---
  {
    id: "filmibeat-kn",
    name: "Filmibeat Kannada",
    homepage: "https://kannada.filmibeat.com",
    feedUrl: "https://kannada.filmibeat.com/rss/kannada-filmibeat-fb.xml",
    language: "kn",
    industry: "sandalwood",
    defaultCategory: "sandalwood",
    enabled: true,
    trustScore: 95,
    description: "Leading Kannada digital cinema entertainment portal by OneIndia Media.",
  },
  {
    id: "vijayakarnataka-kn",
    name: "Vijaya Karnataka Cinema",
    homepage: "https://vijaykarnataka.com",
    feedUrl: "https://vijaykarnataka.com/rssfeeds/2886744.cms",
    language: "kn",
    industry: "sandalwood",
    defaultCategory: "sandalwood",
    enabled: true,
    trustScore: 96,
    description: "Top circulation Kannada daily newspaper entertainment desk (Times of India Group).",
  },
  {
    id: "news18-kn",
    name: "News18 Kannada Cinema",
    homepage: "https://kannada.news18.com",
    feedUrl: "https://kannada.news18.com/commonfeeds/v1/kan/rss/entertainment/cinema.xml",
    language: "kn",
    industry: "sandalwood",
    defaultCategory: "sandalwood",
    enabled: true,
    trustScore: 94,
    description: "Network18 Group Kannada cinema news division.",
  },

  // --- TELUGU / TOLLYWOOD ---
  {
    id: "filmibeat-te",
    name: "Filmibeat Telugu",
    homepage: "https://telugu.filmibeat.com",
    feedUrl: "https://telugu.filmibeat.com/rss/telugu-filmibeat-fb.xml",
    language: "te",
    industry: "tollywood",
    defaultCategory: "latest",
    enabled: true,
    trustScore: 95,
    description: "Major Tollywood movie reviews, box office tracking, and casting updates.",
  },
  {
    id: "news18-te",
    name: "News18 Telugu Cinema",
    homepage: "https://telugu.news18.com",
    feedUrl: "https://telugu.news18.com/commonfeeds/v1/tel/rss/entertainment/cinema.xml",
    language: "te",
    industry: "tollywood",
    defaultCategory: "latest",
    enabled: true,
    trustScore: 94,
    description: "Real-time Telugu film news and industry reports by Network18.",
  },
  {
    id: "samayam-te",
    name: "Samayam Telugu Cinema",
    homepage: "https://telugu.samayam.com",
    feedUrl: "https://telugu.samayam.com/rssfeeds/11874288.cms",
    language: "te",
    industry: "tollywood",
    defaultCategory: "latest",
    enabled: true,
    trustScore: 95,
    description: "Times Internet Telugu entertainment and Tollywood box office reports.",
  },

  // --- TAMIL / KOLLYWOOD ---
  {
    id: "filmibeat-ta",
    name: "Filmibeat Tamil",
    homepage: "https://tamil.filmibeat.com",
    feedUrl: "https://tamil.filmibeat.com/rss/tamil-filmibeat-fb.xml",
    language: "ta",
    industry: "kollywood",
    defaultCategory: "latest",
    enabled: true,
    trustScore: 95,
    description: "Kollywood breaking news, film reviews, and audio launch coverage.",
  },
  {
    id: "news18-ta",
    name: "News18 Tamil Cinema",
    homepage: "https://tamil.news18.com",
    feedUrl: "https://tamil.news18.com/commonfeeds/v1/tam/rss/entertainment/cinema.xml",
    language: "ta",
    industry: "kollywood",
    defaultCategory: "latest",
    enabled: true,
    trustScore: 94,
    description: "Reputable Tamil cinema reporting and celebrity news by Network18.",
  },
  {
    id: "samayam-ta",
    name: "Samayam Tamil Cinema",
    homepage: "https://tamil.samayam.com",
    feedUrl: "https://tamil.samayam.com/rssfeeds/47344154.cms",
    language: "ta",
    industry: "kollywood",
    defaultCategory: "latest",
    enabled: true,
    trustScore: 95,
    description: "Times Internet Tamil Kollywood box office numbers and reviews.",
  },

  // --- MALAYALAM / MOLLYWOOD ---
  {
    id: "filmibeat-ml",
    name: "Filmibeat Malayalam",
    homepage: "https://malayalam.filmibeat.com",
    feedUrl: "https://malayalam.filmibeat.com/rss/malayalam-filmibeat-fb.xml",
    language: "ml",
    industry: "mollywood",
    defaultCategory: "latest",
    enabled: true,
    trustScore: 95,
    description: "Mollywood cinema news, shooting reports, and box office tracking.",
  },
  {
    id: "news18-ml",
    name: "News18 Malayalam Cinema",
    homepage: "https://malayalam.news18.com",
    feedUrl: "https://malayalam.news18.com/commonfeeds/v1/mlm/rss/entertainment/cinema.xml",
    language: "ml",
    industry: "mollywood",
    defaultCategory: "latest",
    enabled: true,
    trustScore: 94,
    description: "Network18 Malayalam cinema and festival award coverage.",
  },
  {
    id: "samayam-ml",
    name: "Samayam Malayalam Cinema",
    homepage: "https://malayalam.samayam.com",
    feedUrl: "https://malayalam.samayam.com/rssfeeds/47344186.cms",
    language: "ml",
    industry: "mollywood",
    defaultCategory: "latest",
    enabled: true,
    trustScore: 95,
    description: "Times Internet Malayalam film industry updates and critical verdicts.",
  },

  // --- HINDI / BOLLYWOOD ---
  {
    id: "filmibeat-hi",
    name: "Filmibeat Hindi",
    homepage: "https://hindi.filmibeat.com",
    feedUrl: "https://hindi.filmibeat.com/rss/hindi-filmibeat-fb.xml",
    language: "hi",
    industry: "bollywood",
    defaultCategory: "bollywood",
    enabled: true,
    trustScore: 95,
    description: "Bollywood news, celebrity exclusives, reviews, and Day-1 collections.",
  },
  {
    id: "news18-hi",
    name: "News18 Hindi Cinema",
    homepage: "https://hindi.news18.com",
    feedUrl: "https://hindi.news18.com/commonfeeds/v1/hin/rss/entertainment/cinema.xml",
    language: "hi",
    industry: "bollywood",
    defaultCategory: "bollywood",
    enabled: true,
    trustScore: 94,
    description: "Network18 Hindi Bollywood box office tracking and trailers.",
  },
  {
    id: "nbt-hi",
    name: "Navbharat Times Cinema",
    homepage: "https://navbharattimes.indiatimes.com",
    feedUrl: "https://navbharattimes.indiatimes.com/movie-masti/cinema/rssfeeds/2364.cms",
    language: "hi",
    industry: "bollywood",
    defaultCategory: "bollywood",
    enabled: true,
    trustScore: 96,
    description: "Times of India Group Navbharat Times Bollywood desk.",
  },

  // --- HOLLYWOOD / ENGLISH ---
  {
    id: "variety-en",
    name: "Variety Film",
    homepage: "https://variety.com",
    feedUrl: "https://variety.com/v/film/feed/",
    language: "en",
    industry: "hollywood",
    defaultCategory: "hollywood",
    enabled: true,
    trustScore: 99,
    description: "Authoritative global entertainment trade publication (Penske Media).",
  },
  {
    id: "deadline-en",
    name: "Deadline Hollywood",
    homepage: "https://deadline.com",
    feedUrl: "https://deadline.com/v/film/feed/",
    language: "en",
    industry: "hollywood",
    defaultCategory: "hollywood",
    enabled: true,
    trustScore: 98,
    description: "Breaking Hollywood box office analytics, festival scoops, and greenlights.",
  },
  {
    id: "hollywood-reporter-en",
    name: "The Hollywood Reporter",
    homepage: "https://www.hollywoodreporter.com",
    feedUrl: "https://www.hollywoodreporter.com/c/movies/feed/",
    language: "en",
    industry: "hollywood",
    defaultCategory: "hollywood",
    enabled: true,
    trustScore: 98,
    description: "Premier film industry publication covering world cinema and critical reviews.",
  },
  {
    id: "collider-en",
    name: "Collider Movie News",
    homepage: "https://collider.com",
    feedUrl: "https://collider.com/feed/category/movie-news/",
    language: "en",
    industry: "hollywood",
    defaultCategory: "hollywood",
    enabled: true,
    trustScore: 93,
    description: "High-volume movie news, trailer breakdowns, and streaming updates.",
  },
];

export function getSourcesForLanguage(lang: LanguageCode): TrustedNewsSource[] {
  return TRUSTED_NEWS_SOURCES.filter((s) => s.language === lang && s.enabled);
}

export function getSourceById(id: string): TrustedNewsSource | undefined {
  return TRUSTED_NEWS_SOURCES.find((s) => s.id === id);
}

