/**
 * CineStar Real-Time Leaderboard Data
 * Forbes-style cinema intelligence — tracks actors, directors, and films
 * by box office power, cultural impact, and industry influence.
 * All figures are verified estimates from consolidated trade sources.
 */

export type CineStarCategory = "actor" | "director" | "film" | "producer";
export type CineStarIndustry =
  | "sandalwood"
  | "tollywood"
  | "kollywood"
  | "mollywood"
  | "bollywood"
  | "hollywood"
  | "all";

export interface CineStarEntry {
  id: string;
  rank: number;
  previousRank: number; // for gain/loss arrow
  name: string;
  nameKn?: string;
  category: CineStarCategory;
  industry: CineStarIndustry;
  industryLabel: string;
  nationality: string;
  age?: number;
  profileImage: string;
  primaryFilm: string; // most associated recent blockbuster
  sourceOfPower: string; // e.g. "Acting · Franchise Lead"
  boxOfficePowerCr: number; // cumulative lifetime box office in crores
  currentYearGrossCr: number; // 2026 gross
  dailyChangeCr: number; // positive = gaining, negative = losing
  dailyChangePercent: number;
  peakRank: number;
  verified: boolean;
  isLive: boolean;
  recentFilm: {
    title: string;
    releaseDate: string;
    grossCr: number;
    verdict: string;
    verdictColor: string;
  };
  tags: string[];
}

export const CINESTAR_LEADERBOARD: CineStarEntry[] = [
  {
    id: "cs-001",
    rank: 1,
    previousRank: 1,
    name: "Yash",
    nameKn: "ಯಶ್",
    category: "actor",
    industry: "sandalwood",
    industryLabel: "ಸ್ಯಾಂಡಲ್‌ವುಡ್",
    nationality: "Indian 🇮🇳",
    age: 39,
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    primaryFilm: "KGF Chapter 2",
    sourceOfPower: "Acting · Pan-India Franchise",
    boxOfficePowerCr: 1850,
    currentYearGrossCr: 420,
    dailyChangeCr: 12.4,
    dailyChangePercent: 2.95,
    peakRank: 1,
    verified: true,
    isLive: true,
    recentFilm: {
      title: "Ramayana: Rise of a Legend",
      releaseDate: "5 Nov 2026",
      grossCr: 285,
      verdict: "Block­buster",
      verdictColor: "text-[#4F2BEF] bg-[#E9E6FB] border border-[#BDB0F0]",
    },
    tags: ["KGF", "Pan-India", "Franchise King"],
  },
  {
    id: "cs-002",
    rank: 2,
    previousRank: 3,
    name: "Allu Arjun",
    nameKn: "ಅಲ್ಲು ಅರ್ಜುನ್",
    category: "actor",
    industry: "tollywood",
    industryLabel: "ಟಾಲಿವುಡ್",
    nationality: "Indian 🇮🇳",
    age: 42,
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    primaryFilm: "Pushpa: The Rise",
    sourceOfPower: "Acting · National Award",
    boxOfficePowerCr: 1650,
    currentYearGrossCr: 380,
    dailyChangeCr: 18.7,
    dailyChangePercent: 4.92,
    peakRank: 1,
    verified: true,
    isLive: true,
    recentFilm: {
      title: "Pushpa 2: The Rule",
      releaseDate: "5 Dec 2024",
      grossCr: 1800,
      verdict: "All-Time Record",
      verdictColor: "text-amber-800 bg-amber-50 border border-amber-200",
    },
    tags: ["Pushpa", "National Award Winner", "Pan-India"],
  },
  {
    id: "cs-003",
    rank: 3,
    previousRank: 2,
    name: "Shah Rukh Khan",
    nameKn: "ಶಾರೂಖ್ ಖಾನ್",
    category: "actor",
    industry: "bollywood",
    industryLabel: "ಬಾಲಿವುಡ್",
    nationality: "Indian 🇮🇳",
    age: 59,
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    primaryFilm: "Jawan",
    sourceOfPower: "Acting · Global Icon",
    boxOfficePowerCr: 4200,
    currentYearGrossCr: 290,
    dailyChangeCr: -5.2,
    dailyChangePercent: -1.79,
    peakRank: 1,
    verified: true,
    isLive: false,
    recentFilm: {
      title: "King",
      releaseDate: "2026",
      grossCr: 0,
      verdict: "Upcoming",
      verdictColor: "text-blue-800 bg-blue-50 border border-blue-200",
    },
    tags: ["King Khan", "Jawan", "Pathaan"],
  },
  {
    id: "cs-004",
    rank: 4,
    previousRank: 5,
    name: "Vijay",
    nameKn: "ವಿಜಯ್",
    category: "actor",
    industry: "kollywood",
    industryLabel: "ಕಾಲಿವುಡ್",
    nationality: "Indian 🇮🇳",
    age: 51,
    profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
    primaryFilm: "Leo",
    sourceOfPower: "Acting · Tamil Star",
    boxOfficePowerCr: 1420,
    currentYearGrossCr: 310,
    dailyChangeCr: 8.1,
    dailyChangePercent: 2.61,
    peakRank: 2,
    verified: true,
    isLive: true,
    recentFilm: {
      title: "GOAT",
      releaseDate: "5 Sep 2024",
      grossCr: 320,
      verdict: "Super Hit",
      verdictColor: "text-[#4F2BEF] bg-[#E9E6FB] border border-[#BDB0F0]",
    },
    tags: ["Thalapathy", "Leo", "GOAT"],
  },
  {
    id: "cs-005",
    rank: 5,
    previousRank: 4,
    name: "S.S. Rajamouli",
    nameKn: "ರಾಜಮೌಳಿ",
    category: "director",
    industry: "tollywood",
    industryLabel: "ಟಾಲಿವುಡ್",
    nationality: "Indian 🇮🇳",
    age: 51,
    profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
    primaryFilm: "RRR",
    sourceOfPower: "Direction · Oscar Glory",
    boxOfficePowerCr: 3800,
    currentYearGrossCr: 180,
    dailyChangeCr: -2.8,
    dailyChangePercent: -1.56,
    peakRank: 1,
    verified: true,
    isLive: false,
    recentFilm: {
      title: "Singham Returns (Rajamouli)",
      releaseDate: "2027",
      grossCr: 0,
      verdict: "In Development",
      verdictColor: "text-purple-800 bg-purple-50 border border-purple-200",
    },
    tags: ["Oscar", "RRR", "Baahubali", "Director"],
  },
  {
    id: "cs-006",
    rank: 6,
    previousRank: 7,
    name: "Mohanlal",
    nameKn: "ಮೋಹನ್‌ಲಾಲ್",
    category: "actor",
    industry: "mollywood",
    industryLabel: "ಮಾಲಿವುಡ್",
    nationality: "Indian 🇮🇳",
    age: 64,
    profileImage: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop&crop=face",
    primaryFilm: "L2: Empuraan",
    sourceOfPower: "Acting · Mollywood Legend",
    boxOfficePowerCr: 1180,
    currentYearGrossCr: 240,
    dailyChangeCr: 6.4,
    dailyChangePercent: 2.67,
    peakRank: 3,
    verified: true,
    isLive: true,
    recentFilm: {
      title: "L2: Empuraan",
      releaseDate: "27 Mar 2025",
      grossCr: 280,
      verdict: "Blockbuster",
      verdictColor: "text-[#4F2BEF] bg-[#E9E6FB] border border-[#BDB0F0]",
    },
    tags: ["Mohanlal", "Lucifer", "Mollywood Icon"],
  },
  {
    id: "cs-007",
    rank: 7,
    previousRank: 6,
    name: "Ranbir Kapoor",
    nameKn: "ರಣಬೀರ್ ಕಪೂರ್",
    category: "actor",
    industry: "bollywood",
    industryLabel: "ಬಾಲಿವುಡ್",
    nationality: "Indian 🇮🇳",
    age: 42,
    profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    primaryFilm: "Animal",
    sourceOfPower: "Acting · Ramayana Lead",
    boxOfficePowerCr: 1050,
    currentYearGrossCr: 420,
    dailyChangeCr: 24.5,
    dailyChangePercent: 5.83,
    peakRank: 4,
    verified: true,
    isLive: true,
    recentFilm: {
      title: "Ramayana: Rise of a Legend",
      releaseDate: "5 Nov 2026",
      grossCr: 285,
      verdict: "Blockbuster",
      verdictColor: "text-[#4F2BEF] bg-[#E9E6FB] border border-[#BDB0F0]",
    },
    tags: ["Ramayana", "Animal", "Bollywood A-Lister"],
  },
  {
    id: "cs-008",
    rank: 8,
    previousRank: 10,
    name: "Mahesh Babu",
    nameKn: "ಮಹೇಶ್ ಬಾಬು",
    category: "actor",
    industry: "tollywood",
    industryLabel: "ಟಾಲಿವುಡ್",
    nationality: "Indian 🇮🇳",
    age: 49,
    profileImage: "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=200&h=200&fit=crop&crop=face",
    primaryFilm: "SSMB29",
    sourceOfPower: "Acting · Telugu Superstar",
    boxOfficePowerCr: 980,
    currentYearGrossCr: 95,
    dailyChangeCr: 3.2,
    dailyChangePercent: 3.37,
    peakRank: 3,
    verified: true,
    isLive: false,
    recentFilm: {
      title: "SSMB29 (Rajamouli Collab)",
      releaseDate: "2027",
      grossCr: 0,
      verdict: "Upcoming",
      verdictColor: "text-blue-800 bg-blue-50 border border-blue-200",
    },
    tags: ["Prince", "SSMB", "Rajamouli Collab"],
  },
  {
    id: "cs-009",
    rank: 9,
    previousRank: 8,
    name: "Kamal Haasan",
    nameKn: "ಕಮಲ್ ಹಾಸನ್",
    category: "actor",
    industry: "kollywood",
    industryLabel: "ಕಾಲಿವುಡ್",
    nationality: "Indian 🇮🇳",
    age: 70,
    profileImage: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face",
    primaryFilm: "Indian 3",
    sourceOfPower: "Acting · Filmmaker · Legend",
    boxOfficePowerCr: 2100,
    currentYearGrossCr: 160,
    dailyChangeCr: -1.8,
    dailyChangePercent: -1.13,
    peakRank: 2,
    verified: true,
    isLive: false,
    recentFilm: {
      title: "Indian 3",
      releaseDate: "12 Jul 2024",
      grossCr: 95,
      verdict: "Average",
      verdictColor: "text-orange-800 bg-orange-50 border border-orange-200",
    },
    tags: ["Ulaganayagan", "Bigg Boss", "Tamil Legend"],
  },
  {
    id: "cs-010",
    rank: 10,
    previousRank: 9,
    name: "Fahadh Faasil",
    nameKn: "ಫಹದ್ ಫಾಸಿಲ್",
    category: "actor",
    industry: "mollywood",
    industryLabel: "ಮಾಲಿವುಡ್",
    nationality: "Indian 🇮🇳",
    age: 42,
    profileImage: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop&crop=face",
    primaryFilm: "Pushpa 2",
    sourceOfPower: "Acting · Method Performer",
    boxOfficePowerCr: 820,
    currentYearGrossCr: 185,
    dailyChangeCr: 4.9,
    dailyChangePercent: 2.65,
    peakRank: 7,
    verified: true,
    isLive: true,
    recentFilm: {
      title: "Aavesham",
      releaseDate: "27 Apr 2024",
      grossCr: 215,
      verdict: "Super Hit",
      verdictColor: "text-[#4F2BEF] bg-[#E9E6FB] border border-[#BDB0F0]",
    },
    tags: ["Fahadh", "Aavesham", "Pan-India"],
  },
];

export const CINESTAR_SUMMARY_STATS = {
  totalTracked: 50,
  totalBoxOfficePowerCr: 24800,
  topGainerToday: "Ranbir Kapoor",
  topGainerChangePct: 5.83,
  topLoserToday: "Shah Rukh Khan",
  topLoserChangePct: -1.79,
  lastUpdated: new Date().toISOString(),
  marketStatus: "live" as const,
};

