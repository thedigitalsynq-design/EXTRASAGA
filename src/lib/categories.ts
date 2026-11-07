import type { Category, CategorySlug } from "@/types";

export interface MainNavItem {
  id: string;
  slug: CategorySlug;
  href: string;
  englishLabel: string;
  isButton?: boolean;
}

export const CATEGORIES: Category[] = [
  { id: "1", name: "ಮುಖಪುಟ", englishName: "Home", slug: "mukhaputa", description: "ಸಿನಿ ಕನ್ನಡ ಮುಖಪುಟ - ಇತ್ತೀಚಿನ ತಾಜಾ ಸುದ್ದಿ ಮತ್ತು ಮನರಂಜನೆ" },
  { id: "2", name: "ಇತ್ತೀಚಿನ ಸುದ್ದಿ", englishName: "Latest News", slug: "latest", description: "ಸ್ಯಾಂಡಲ್ವುಡ್ ಮತ್ತು ಭಾರತೀಯ ಚಿತ್ರರಂಗದ ಕ್ಷಣಕ್ಷಣದ ಸುದ್ದಿ" },
  { id: "3", name: "ಸಿನಿಮಾ ವಿಮರ್ಶೆ", englishName: "Movie Reviews", slug: "reviews", description: "ಕನ್ನಡ ಸಿನಿಮಾಗಳ ನೈಜ ಹಾಗೂ ನಿಷ್ಪಕ್ಷಪಾತ ವಿಮರ್ಶೆಗಳು" },
  { id: "4", name: "ಸ್ಯಾಂಡಲ್ವುಡ್", englishName: "Sandalwood", slug: "sandalwood", description: "ಕನ್ನಡ ಚಿತ್ರರಂಗದ ಸಂಪೂರ್ಣ ಸಮಾಚಾರ ಮತ್ತು ವಿಶೇಷ ವರದಿಗಳು" },
  { id: "5", name: "ಬಾಲಿವುಡ್", englishName: "Bollywood", slug: "bollywood", description: "ಹಿಂದಿ ಸಿನಿ ಜಗತ್ತಿನ ತಾಜಾ ಗಾಸಿಪ್ ಮತ್ತು ಅಪ್ಡೇಟ್ಸ್" },
  { id: "6", name: "ಹಾಲಿವುಡ್", englishName: "Hollywood", slug: "hollywood", description: "ವಿಶ್ವ ಸಿನಿಮಾಗಳ ಸಮಾಚಾರ ಮತ್ತು ಅಂತರರಾಷ್ಟ್ರೀಯ ಚಿತ್ರಗಳು" },
  { id: "7", name: "ನಟರು", englishName: "Actors", slug: "actors", description: "ಕನ್ನಡದ ಸ್ಟಾರ್ ನಟರ ವೈಯಕ್ತಿಕ ಮತ್ತು ವೃತ್ತಿ ಬದುಕಿನ ಸುದ್ದಿ" },
  { id: "8", name: "ನಟಿಯರು", englishName: "Actresses", slug: "actresses", description: "ಖ್ಯಾತ ನಟಿಯರ ಹೊಸ ಪ್ರಾಜೆಕ್ಟ್, ಫ್ಯಾಷನ್ ಮತ್ತು ಸಂದರ್ಶನಗಳು" },
  { id: "9", name: "ಸಂದರ್ಶನ", englishName: "Interviews", slug: "interviews", description: "ತಾರೆಯರೊಂದಿಗೆ ನೇರ ಮಾತುಕತೆ ಮತ್ತು ವಿಶೇಷ ಸಂದರ್ಶನಗಳು" },
  { id: "10", name: "ಗಾಸಿಪ್", englishName: "Gossip", slug: "gossip", description: "ಗಾಂಧಿನಗರದ ಒಳಗುಟ್ಟು ಮತ್ತು ಸಿನಿಮಾ ಜಗತ್ತಿನ ಬಿಸಿಬಿಸಿ ಚರ್ಚೆಗಳು" },
  { id: "11", name: "ಫೋಟೋ ಗ್ಯಾಲರಿ", englishName: "Photo Gallery", slug: "gallery", description: "ತಾರೆಯರ ಆಕರ್ಷಕ ಫೋಟೋಗಳು ಮತ್ತು ಸಿನಿಮಾ ಇವೆಂಟ್ಸ್" },
  { id: "12", name: "ವಿಡಿಯೋಗಳು", englishName: "Videos", slug: "videos", description: "ಹೊಸ ಟ್ರೇಲರ್‌ಗಳು, ಟೀಸರ್‌ಗಳು ಮತ್ತು ಹಾಡುಗಳ ವಿಡಿಯೋಗಳು" },
  { id: "13", name: "OTT ಅಪ್ಡೇಟ್", englishName: "OTT Updates", slug: "ott", description: "ನೆಟ್‌ಫ್ಲಿಕ್ಸ್, ಅಮೆಜಾನ್ ಪ್ರೈಮ್, ಜೀ5 ನಲ್ಲಿ ಕನ್ನಡ ಸಿನಿಮಾಗಳು" },
  { id: "14", name: "ಬಾಕ್ಸ್ ಆಫೀಸ್", englishName: "Box Office", slug: "box-office", description: "ಕನ್ನಡ ಸಿನಿಮಾಗಳ ಗಳಿಕೆ ಮತ್ತು ಬಾಕ್ಸ್ ಆಫೀಸ್ ವರದಿಗಳು" },
  { id: "15", name: "ಮುಂಬರುವ ಸಿನಿಮಾಗಳು", englishName: "Upcoming Movies", slug: "upcoming", description: "ಮುಂದಿನ ದಿನಗಳಲ್ಲಿ ತೆರೆಕಾಣಲಿರುವ ನಿರೀಕ್ಷಿತ ಚಿತ್ರಗಳು" },
  { id: "16", name: "ಟ್ರೆಂಡಿಂಗ್", englishName: "Trending Today", slug: "trending", description: "ಇಂದಿನ ಟ್ರೆಂಡಿಂಗ್ ಸಿನಿಮಾ ವಿಷಯಗಳು ಮತ್ತು ಬಿಸಿಬಿಸಿ ಸುದ್ದಿಗಳು" },
  { id: "17", name: "ಕಿರುತೆರೆ", englishName: "Television", slug: "television", description: "ಕಿರುತೆರೆ ಧಾರಾವಾಹಿಗಳು, ರಿಯಾಲಿಟಿ ಶೋ ಮತ್ತು ಟೆಲಿವಿಷನ್ ಲೋಕದ ಸಮಾಚಾರ" },
  { id: "18", name: "ಸೆಲೆಬ್ರಿಟಿ", englishName: "Celebrity", slug: "celebrity", description: "ತಾರೆಯರ ಜೀವನ ಶೈಲಿ, ಪ್ರಸಿದ್ಧ ಸೆಲೆಬ್ರಿಟಿ ವಿಶೇಷಗಳು" },
  { id: "19", name: "ಇವೆಂಟ್ಸ್", englishName: "Events", slug: "events", description: "ಸಿನಿಮಾ ಇವೆಂಟ್ಸ್, ಪ್ರಶಸ್ತಿ ಪ್ರದಾನ, ಆಡಿಯೋ ಮತ್ತು ಟ್ರೇಲರ್ ಲಾಂಚ್" },
  { id: "20", name: "ಸಿನಿಮಾಗಳು", englishName: "Movies", slug: "movies", description: "ಸಿನಿಮಾ ಬಿಡುಗಡೆಗಳು, ಹೊಸ ಚಿತ್ರಗಳು ಮತ್ತು ಮುಂಬರುವ ಚಿತ್ರಗಳ ವಿವರ" },
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
  return BY_SLUG.get(slug as CategorySlug)?.name ?? "ಸುದ್ದಿ";
}

export function categoryHref(slug: string): string {
  if (slug === "mukhaputa") return "/";
  if (slug === "movies") return "/movies";
  return `/category/${slug}`;
}
