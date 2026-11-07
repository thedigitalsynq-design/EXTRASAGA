import { Movie, MovieReleaseStatus } from "@/types";

export const CINEMA_TIMEZONE = "Asia/Kolkata";

/**
 * Returns current date string formatted as YYYY-MM-DD in Asia/Kolkata timezone.
 * Never hardcoded. Dynamically derived from the server clock.
 */
export function getTodayIST(): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: CINEMA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}

/**
 * Calculates calendar day difference between target date and base date (default: today IST).
 * Positive value = Future date (Upcoming)
 * 0 = Today
 * Negative value = Past date
 */
export function getDaysDifference(targetDate: string, baseDate?: string): number {
  const todayStr = baseDate || getTodayIST();
  
  const [tYear, tMonth, tDay] = targetDate.split("-").map(Number);
  const [bYear, bMonth, bDay] = todayStr.split("-").map(Number);

  const targetUtc = Date.UTC(tYear, tMonth - 1, tDay);
  const baseUtc = Date.UTC(bYear, bMonth - 1, bDay);

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.round((targetUtc - baseUtc) / MS_PER_DAY);
}

/**
 * Dynamically classifies a movie release based on the strict 30-day window:
 * - Upcoming: release date > today
 * - In Theatres (Latest Releases): release date between (today - 30 days) and today
 * - Archived: release date < (today - 30 days)
 */
export function classifyMovieRelease(
  theatricalReleaseDate: string,
  baseDate?: string
): MovieReleaseStatus {
  const diffDays = getDaysDifference(theatricalReleaseDate, baseDate);

  if (diffDays > 0) {
    return "upcoming";
  } else if (diffDays <= 0 && diffDays >= -30) {
    return "in_theatres";
  } else {
    return "archived";
  }
}

export type UpcomingTimeFilter =
  | "all"
  | "today"
  | "tomorrow"
  | "next_7_days"
  | "next_30_days"
  | "next_60_days"
  | "next_90_days";

/**
 * Evaluates whether an upcoming movie matches a specific upcoming bucket.
 */
export function matchesUpcomingBucket(
  theatricalReleaseDate: string,
  filter: UpcomingTimeFilter,
  baseDate?: string
): boolean {
  const diff = getDaysDifference(theatricalReleaseDate, baseDate);
  if (diff < 0) return false; // In past

  switch (filter) {
    case "today":
      return diff === 0;
    case "tomorrow":
      return diff === 1;
    case "next_7_days":
      return diff <= 7;
    case "next_30_days":
      return diff <= 30;
    case "next_60_days":
      return diff <= 60;
    case "next_90_days":
      return diff <= 90;
    case "all":
    default:
      return true;
  }
}

/**
 * Dynamically partitions a list of movies into:
 * 1. In Theatres (Released in the last 30 days up to today)
 * 2. Upcoming Releases (Release date > today)
 * 3. Archived Releases (Released more than 30 days ago)
 */
export function partitionMoviesByReleaseStatus(
  movies: Movie[],
  baseDate?: string
): {
  inTheatres: Movie[];
  upcoming: Movie[];
  archived: Movie[];
} {
  const inTheatres: Movie[] = [];
  const upcoming: Movie[] = [];
  const archived: Movie[] = [];

  for (const m of movies) {
    const status = classifyMovieRelease(m.theatricalReleaseDate, baseDate);
    const enriched: Movie = { ...m, releaseStatus: status };

    if (status === "upcoming") {
      upcoming.push(enriched);
    } else if (status === "in_theatres") {
      inTheatres.push(enriched);
    } else {
      archived.push(enriched);
    }
  }

  // Sort upcoming ascending (nearest release first)
  upcoming.sort(
    (a, b) =>
      new Date(a.theatricalReleaseDate).getTime() -
      new Date(b.theatricalReleaseDate).getTime()
  );

  // Sort in-theatres descending (most recently released first)
  inTheatres.sort(
    (a, b) =>
      new Date(b.theatricalReleaseDate).getTime() -
      new Date(a.theatricalReleaseDate).getTime()
  );

  // Sort archived descending
  archived.sort(
    (a, b) =>
      new Date(b.theatricalReleaseDate).getTime() -
      new Date(a.theatricalReleaseDate).getTime()
  );

  return { inTheatres, upcoming, archived };
}

/**
 * Returns formatted release date in IST with relative badge information.
 */
export function formatReleaseDateIST(
  dateStr: string,
  baseDate?: string
): {
  formatted: string;
  relativeBadge: string;
  diffDays: number;
} {
  const diffDays = getDaysDifference(dateStr, baseDate);

  const [year, month, day] = dateStr.split("-").map(Number);
  const dateObj = new Date(Date.UTC(year, month - 1, day));

  const formatted = dateObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  let relativeBadge = "";
  if (diffDays === 0) {
    relativeBadge = "ಇಂದೇ ಬಿಡುಗಡೆ! (Releasing Today)";
  } else if (diffDays === 1) {
    relativeBadge = "ನಾಳೆ ಬಿಡುಗಡೆ (Releasing Tomorrow)";
  } else if (diffDays > 1 && diffDays <= 7) {
    relativeBadge = `${diffDays} ದಿನಗಳಲ್ಲಿ (In ${diffDays} Days)`;
  } else if (diffDays > 7 && diffDays <= 30) {
    relativeBadge = `ಮುಂದಿನ ${diffDays} ದಿನಗಳಲ್ಲಿ`;
  } else if (diffDays > 30) {
    relativeBadge = `ಮುಂಬರುವ ಬಿಡುಗಡೆ (${Math.round(diffDays / 30)} ತಿಂಗಳು)`;
  } else if (diffDays >= -7) {
    relativeBadge = `ಈ ವಾರ ಬಿಡುಗಡೆಯಾಗಿದೆ (${Math.abs(diffDays)} ದಿನಗಳ ಹಿಂದೆ)`;
  } else if (diffDays >= -30) {
    relativeBadge = `ಚಿತ್ರಮಂದಿರಗಳಲ್ಲಿ ಪ್ರದರ್ಶನ (${Math.abs(diffDays)} ದಿನಗಳ ಹಿಂದೆ)`;
  } else {
    relativeBadge = "ಆರ್ಕೈವ್ ಬಿಡುಗಡೆ (Archived Release)";
  }

  return { formatted, relativeBadge, diffDays };
}

/**
 * Shifts a YYYY-MM-DD date string by a given number of days.
 */
export function shiftDaysIST(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split("T")[0];
}
