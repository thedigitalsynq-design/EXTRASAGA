import type { Category, CategorySlug } from "@/types";

export interface MainNavItem {
  id: string;
  slug: CategorySlug;
  href: string;
  englishLabel: string;
  isButton?: boolean;
}

export const CATEGORIES: Category[] = [
  { id: "1", name: "Home", englishName: "Home", slug: "mukhaputa", description: "Cinema frontpage — the latest breaking stories and entertainment" },
  { id: "2", name: "Latest News", englishName: "Latest News", slug: "latest", description: "Real-time news from Sandalwood and the Indian film world" },
  { id: "3", name: "Movie Reviews", englishName: "Movie Reviews", slug: "reviews", description: "Honest, receipts-checked and strictly unbiased film verdicts" },
  { id: "4", name: "Sandalwood", englishName: "Sandalwood", slug: "sandalwood", description: "Complete coverage and insider reports from the Kannada film industry" },
  { id: "5", name: "Bollywood", englishName: "Bollywood", slug: "bollywood", description: "Hot tea and updates from the Hindi film world" },
  { id: "6", name: "Hollywood", englishName: "Hollywood", slug: "hollywood", description: "Global cinema news and international releases" },
  { id: "7", name: "Actors", englishName: "Actors", slug: "actors", description: "Star actor news — on screen and off screen" },
  { id: "8", name: "Actresses", englishName: "Actresses", slug: "actresses", description: "New projects, fashion and interviews from the leading ladies" },
  { id: "9", name: "Interviews", englishName: "Interviews", slug: "interviews", description: "Up-front conversations and exclusive sit-downs with the stars" },
  { id: "10", name: "Gossip", englishName: "Gossip", slug: "gossip", description: "Hot tea from Gandhinagar and the wider cinema world" },
  { id: "11", name: "Photo Gallery", englishName: "Photo Gallery", slug: "gallery", description: "Star photo drops and cinema event galleries" },
  { id: "12", name: "Videos", englishName: "Videos", slug: "videos", description: "New trailers, teasers and song video drops" },
  { id: "13", name: "OTT Updates", englishName: "OTT Updates", slug: "ott", description: "Verified streams on Netflix, Amazon Prime, JioHotstar and more" },
  { id: "14", name: "Box Office", englishName: "Box Office", slug: "box-office", description: "Receipts-backed collections and box office reports" },
  { id: "15", name: "Upcoming Movies", englishName: "Upcoming Movies", slug: "upcoming", description: "Every verified release heading to theatres next" },
  { id: "16", name: "Trending Today", englishName: "Trending Today", slug: "trending", description: "What the cine feed is arguing about right now" },
  { id: "17", name: "Television", englishName: "Television", slug: "television", description: "TV serials, reality shows and the television beat" },
  { id: "18", name: "Celebrity", englishName: "Celebrity", slug: "celebrity", description: "Star lifestyles and celebrity spotlight specials" },
  { id: "19", name: "Events", englishName: "Events", slug: "events", description: "Movie events, award nights, audio and trailer launches" },
  { id: "20", name: "Movies", englishName: "Movies", slug: "movies", description: "Cinema releases, new titles and upcoming film details" },
];

export const MAIN_NAV_ITEMS: MainNavItem[] = [
  { id: "trending", slug: "trending", href: "/category/trending", englishLabel: "Trending Today", isButton: true },
  { id: "home", slug: "mukhaputa", href: "/", englishLabel: "Home" },
  { id: "news", slug: "latest", href: "/category/latest", englishLabel: "News" },
  { id: "reviews", slug: "reviews", href: "/reviews", englishLabel: "Reviews" },
  { id: "television", slug: "television", href: "/category/television", englishLabel: "Television" },
  { id: "celebrity", slug: "celebrity", href: "/category/celebrity", englishLabel: "Celebrity" },
  { id: "movies", slug: "movies", href: "/movies", englishLabel: "Movies" },
  { id: "interviews", slug: "interviews", href: "/category/interviews", englishLabel: "Interviews" },
  { id: "gossips", slug: "gossip", href: "/category/gossip", englishLabel: "Gossips" },
  { id: "photos", slug: "gallery", href: "/category/gallery", englishLabel: "Photos" },
  { id: "videos", slug: "videos", href: "/category/videos", englishLabel: "Videos" },
  { id: "events", slug: "events", href: "/category/events", englishLabel: "Events" },
];

const BY_SLUG = new Map(CATEGORIES.map((category) => [category.slug, category]));

export function categoryName(slug: string): string {
  return BY_SLUG.get(slug as CategorySlug)?.name ?? "News";
}

export function categoryHref(slug: string): string {
  if (slug === "mukhaputa") return "/";
  if (slug === "movies") return "/movies";
  return `/category/${slug}`;
}
