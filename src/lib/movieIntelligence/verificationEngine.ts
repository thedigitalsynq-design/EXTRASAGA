import {
  RawDiscoveredCandidate,
} from "./discoveryEngine";
import {
  VerifiedMovieRecord,
  VerificationStatus,
  ReleaseDateObservation,
  ReleaseDateHistoryEntry,
} from "@/types/movieIntelligence";
import {
  getTodayIST,
  getDaysDifference,
  classifyMovieRelease,
  shiftDaysIST,
} from "@/lib/cinemaDateUtils";

/**
 * Normalizes title string for duplicate detection across multilingual entries.
 */
export function normalizeTitleKey(title: string, industry: string): string {
  return `${industry.toLowerCase()}::${title
    .toLowerCase()
    .replace(/[^a-z0-9\u0C80-\u0CFF]/gi, "")
    .trim()}`;
}

export interface VerificationEngineResult {
  verifiedMovies: VerifiedMovieRecord[];
  upcoming30Days: VerifiedMovieRecord[];
  nowShowing30Days: VerifiedMovieRecord[];
  archivedReleases: VerifiedMovieRecord[];
  postponedReleases: VerifiedMovieRecord[];
  pendingVerification: VerifiedMovieRecord[];
  todayIST: string;
  windowStartDate: string;
  windowEndDate: string;
}

/**
 * Resolves multi-source observations for a single movie candidate.
 * Evaluates agreement, authority, conflicting dates, and official announcements.
 */
export function verifyCandidateReleaseDate(
  candidate: RawDiscoveredCandidate,
  todayIST: string,
  existingHistory: ReleaseDateHistoryEntry[] = []
): {
  verifiedDate: string;
  verificationStatus: VerificationStatus;
  verificationScore: number;
  sourcesAgreedCount: number;
  totalSourcesObserved: number;
  history: ReleaseDateHistoryEntry[];
} {
  const observations = candidate.observations || [];
  const totalSourcesObserved = observations.length;
  const now = new Date().toISOString();

  // 1. Check for official postponement notice
  if (candidate.postponementNotice?.isPostponed) {
    const postDate = candidate.postponementNotice.newAnnouncedDate || shiftDaysIST(todayIST, 90);
    const updatedHistory: ReleaseDateHistoryEntry[] = [
      ...existingHistory,
      {
        date: candidate.postponementNotice.originalDate,
        recordedAt: now,
        status: "postponed",
        reason: candidate.postponementNotice.reason,
      },
      {
        date: postDate,
        recordedAt: now,
        status: "postponed",
        reason: `Rescheduled to ${postDate}: ${candidate.postponementNotice.reason}`,
      },
    ];

    return {
      verifiedDate: postDate,
      verificationStatus: "postponed",
      verificationScore: 92, // Confirmed postponement
      sourcesAgreedCount: observations.length,
      totalSourcesObserved,
      history: updatedHistory,
    };
  }

  if (totalSourcesObserved === 0) {
    return {
      verifiedDate: todayIST,
      verificationStatus: "pending_verification",
      verificationScore: 20,
      sourcesAgreedCount: 0,
      totalSourcesObserved: 0,
      history: existingHistory,
    };
  }

  // 2. Group observations by date
  const dateGroups = new Map<string, ReleaseDateObservation[]>();
  for (const obs of observations) {
    const list = dateGroups.get(obs.observedDate) || [];
    list.push(obs);
    dateGroups.set(obs.observedDate, list);
  }

  // 3. Find consensus date by weighted authority
  let bestDate = "";
  let highestWeightSum = -1;
  let bestGroup: ReleaseDateObservation[] = [];

  for (const [date, list] of Array.from(dateGroups.entries())) {
    // Validate date format integrity
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;

    const weightSum = list.reduce((acc: number, curr: ReleaseDateObservation) => acc + curr.sourceAuthorityWeight, 0);
    const hasOfficial = list.some((obs) => obs.isOfficialAnnouncement);
    const currentBestHasOfficial = bestGroup.some((obs) => obs.isOfficialAnnouncement);

    // Deterministic tie-breaking: highest weight, then official presence, then higher observer count
    const isBetter =
      weightSum > highestWeightSum ||
      (Math.abs(weightSum - highestWeightSum) < 0.001 && hasOfficial && !currentBestHasOfficial) ||
      (Math.abs(weightSum - highestWeightSum) < 0.001 && list.length > bestGroup.length);

    if (isBetter) {
      highestWeightSum = weightSum;
      bestDate = date;
      bestGroup = list;
    }
  }

  // Fallback if no valid dates discovered
  if (!bestDate) {
    bestDate = todayIST;
    bestGroup = observations;
  }

  const sourcesAgreedCount = bestGroup.length;
  const hasOfficialAnnouncement = bestGroup.some((obs) => obs.isOfficialAnnouncement);
  const diffFromToday = getDaysDifference(bestDate, todayIST);

  let verificationStatus: VerificationStatus = "pending_verification";
  let verificationScore = 0;

  // 4. Multiple conflicting dates with significant weights?
  const hasConflictingDates = dateGroups.size > 1;

  if (hasConflictingDates && sourcesAgreedCount < 2) {
    // Conflict without strong consensus
    verificationStatus = "pending_verification";
    verificationScore = Math.min(65, Math.round(highestWeightSum * 40));
  } else if (sourcesAgreedCount >= 2 && hasOfficialAnnouncement) {
    // Meets strict multi-source verification: >=2 independent sources + official statement
    if (diffFromToday <= 0 && diffFromToday >= -30) {
      verificationStatus = "in_theatres";
    } else {
      verificationStatus = "confirmed";
    }
    // High confidence: 85 - 99
    verificationScore = Math.min(99, Math.round(80 + (highestWeightSum / totalSourcesObserved) * 20));
  } else if (sourcesAgreedCount >= 2) {
    // 2 sources agree but without verified official studio announcement
    if (diffFromToday <= 0 && diffFromToday >= -30) {
      verificationStatus = "in_theatres";
      verificationScore = 88;
    } else {
      verificationStatus = "confirmed";
      verificationScore = 80;
    }
  } else {
    // Single source observation
    verificationStatus = "pending_verification";
    verificationScore = Math.round(highestWeightSum * 60);
  }

  // Check if date changed from historical record
  const lastRecorded = existingHistory[existingHistory.length - 1];
  let updatedHistory = [...existingHistory];
  if (lastRecorded && lastRecorded.date !== bestDate) {
    verificationStatus = "date_changed";
    updatedHistory.push({
      date: bestDate,
      recordedAt: now,
      status: "date_changed",
      reason: `Date adjusted from ${lastRecorded.date} to ${bestDate} based on latest multi-source reports`,
    });
  } else if (!lastRecorded) {
    updatedHistory.push({
      date: bestDate,
      recordedAt: now,
      status: verificationStatus,
      reason: "Initial multi-source cross-verification consensus recorded",
    });
  }

  return {
    verifiedDate: bestDate,
    verificationStatus,
    verificationScore,
    sourcesAgreedCount,
    totalSourcesObserved,
    history: updatedHistory,
  };
}

/**
 * Deduplicates raw candidate movies and executes complete multi-source verification.
 * Filters strictly according to the 30-day discovery window.
 */
export function runMovieVerificationEngine(
  rawCandidates: RawDiscoveredCandidate[],
  baseDate?: string
): VerificationEngineResult {
  const todayIST = baseDate || getTodayIST();
  const windowStartDate = todayIST;
  const windowEndDate = shiftDaysIST(todayIST, 30);

  // 1. Deduplicate candidates using slug and normalized title keys
  const uniqueCandidatesMap = new Map<string, RawDiscoveredCandidate>();
  for (const candidate of rawCandidates) {
    const key = normalizeTitleKey(candidate.titleEn, candidate.industry);
    if (!uniqueCandidatesMap.has(key)) {
      uniqueCandidatesMap.set(key, candidate);
    } else {
      // Merge observations into existing candidate
      const existing = uniqueCandidatesMap.get(key)!;
      existing.observations = [...existing.observations, ...candidate.observations];
      if (candidate.postponementNotice) {
        existing.postponementNotice = candidate.postponementNotice;
      }
    }
  }

  const verifiedMovies: VerifiedMovieRecord[] = [];
  const upcoming30Days: VerifiedMovieRecord[] = [];
  const nowShowing30Days: VerifiedMovieRecord[] = [];
  const archivedReleases: VerifiedMovieRecord[] = [];
  const postponedReleases: VerifiedMovieRecord[] = [];
  const pendingVerification: VerifiedMovieRecord[] = [];

  for (const candidate of Array.from(uniqueCandidatesMap.values())) {
    const verification = verifyCandidateReleaseDate(candidate, todayIST);
    const daysUntilRelease = getDaysDifference(verification.verifiedDate, todayIST);
    const releaseStatus = classifyMovieRelease(verification.verifiedDate, todayIST);

    // Box office safety guarantee:
    // Box office tracking is ONLY allowed if theatricalReleaseDate <= todayIST AND not postponed!
    const canTrackBoxOffice = daysUntilRelease <= 0 && verification.verificationStatus !== "postponed";

    const verifiedRecord: VerifiedMovieRecord = {
      id: candidate.rawId,
      title: candidate.title,
      titleEn: candidate.titleEn,
      slug: candidate.slug,
      synopsis: candidate.synopsis,
      introduction: candidate.introduction,
      theatricalReleaseDate: verification.verifiedDate,
      daysUntilRelease,
      verificationStatus: verification.verificationStatus,
      verificationScore: verification.verificationScore,
      sourcesAgreedCount: verification.sourcesAgreedCount,
      totalSourcesObserved: verification.totalSourcesObserved,
      releaseStatus,
      language: candidate.language,
      industry: candidate.industry,
      genres: candidate.genres,
      director: candidate.director,
      producers: candidate.producers,
      cast: candidate.cast,
      productionCompany: candidate.productionCompany,
      distributionCompany: candidate.distributionCompany,
      posterImage: candidate.posterImage,
      bannerImage: candidate.bannerImage || candidate.posterImage,
      censorRating: candidate.censorRating || "U/A",
      runtimeMinutes: candidate.runtimeMinutes || 150,
      runtimeFormatted: candidate.runtimeFormatted || "2h 30m",
      trailerYoutubeId: candidate.trailerYoutubeId,
      isFeatured: Boolean(candidate.isFeatured),
      canTrackBoxOffice,
      releaseDateHistory: verification.history,
      lastVerifiedAt: new Date().toISOString(),
      nextVerificationScheduledAt: shiftDaysIST(todayIST, 1),
    };

    verifiedMovies.push(verifiedRecord);

    // 2. Strict Partitioning by Window
    if (verification.verificationStatus === "postponed") {
      postponedReleases.push(verifiedRecord);
    } else if (verification.verificationStatus === "pending_verification") {
      pendingVerification.push(verifiedRecord);
    } else if (daysUntilRelease > 0 && daysUntilRelease <= 30) {
      // Strictly in 30-day upcoming window
      upcoming30Days.push(verifiedRecord);
    } else if (daysUntilRelease <= 0 && daysUntilRelease >= -30) {
      // In Theatres within the past 30 days
      nowShowing30Days.push(verifiedRecord);
    } else if (daysUntilRelease < -30) {
      // Past 30 days (Archived)
      archivedReleases.push(verifiedRecord);
    } else if (daysUntilRelease > 30) {
      // Outside 30 days window
      postponedReleases.push(verifiedRecord);
    }
  }

  // Sort upcoming by earliest release date ascending
  upcoming30Days.sort(
    (a, b) =>
      new Date(a.theatricalReleaseDate).getTime() -
      new Date(b.theatricalReleaseDate).getTime()
  );

  // Sort now showing by most recent release date descending
  nowShowing30Days.sort(
    (a, b) =>
      new Date(b.theatricalReleaseDate).getTime() -
      new Date(a.theatricalReleaseDate).getTime()
  );

  return {
    verifiedMovies,
    upcoming30Days,
    nowShowing30Days,
    archivedReleases,
    postponedReleases,
    pendingVerification,
    todayIST,
    windowStartDate,
    windowEndDate,
  };
}
