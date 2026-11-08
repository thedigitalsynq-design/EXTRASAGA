import {
  discoverMoviesAcrossIndustries,
  RawDiscoveredCandidate,
} from "./discoveryEngine";
import {
  runMovieVerificationEngine,
  VerificationEngineResult,
} from "./verificationEngine";
import {
  VerifiedMovieRecord,
  MovieIntelligenceStats,
} from "@/types/movieIntelligence";
import { FilmIndustry, LanguageCode, Movie } from "@/types";
import { getTodayIST, shiftDaysIST } from "@/lib/cinemaDateUtils";

interface CacheState {
  result: VerificationEngineResult | null;
  cachedAt: number;
  cachedForDate: string;
}

// 60-minute in-memory cache TTL (or invalidated when date changes)
const CACHE_TTL_MS = 60 * 60 * 1000;

class MovieIntelligenceServiceClass {
  private cache: CacheState = {
    result: null,
    cachedAt: 0,
    cachedForDate: "",
  };

  // In-flight execution promise to prevent cache stampedes / thundering herds
  private inFlightPromise: Promise<VerificationEngineResult> | null = null;

  /**
   * Returns current verified movie state, recalculating if cache expired or clock rolled over.
   * Employs In-Flight Deduplication and Stale-While-Revalidate resilience.
   */
  public async getEngineResult(forceRefresh = false): Promise<VerificationEngineResult> {
    const today = getTodayIST();
    const now = Date.now();

    const isCacheValid =
      !forceRefresh &&
      this.cache.result !== null &&
      this.cache.cachedForDate === today &&
      now - this.cache.cachedAt < CACHE_TTL_MS;

    if (isCacheValid && this.cache.result) {
      return this.cache.result;
    }

    // Reuse existing in-flight task if already running
    if (this.inFlightPromise) {
      return this.inFlightPromise;
    }

    this.inFlightPromise = (async () => {
      try {
        const candidates = discoverMoviesAcrossIndustries(today);
        const engineResult = runMovieVerificationEngine(candidates, today);

        this.cache = {
          result: engineResult,
          cachedAt: Date.now(),
          cachedForDate: today,
        };

        return engineResult;
      } catch (error) {
        // Stale-While-Revalidate: return last good known state if discovery encounters an issue
        if (this.cache.result) {
          console.warn("Movie intelligence refresh encountered an issue; serving stale cache:", error);
          return this.cache.result;
        }
        throw error;
      } finally {
        this.inFlightPromise = null;
      }
    })();

    return this.inFlightPromise;
  }

  /**
   * Forces immediate recalculation of all movies and date windows.
   */
  public async syncNow(): Promise<MovieIntelligenceStats> {
    const result = await this.getEngineResult(true);
    return this.calculateStats(result);
  }

  /**
   * Retrieves verified movies releasing within the strict 30-day window.
   */
  public async getVerifiedUpcoming(options?: {
    industry?: FilmIndustry;
    language?: LanguageCode;
    limit?: number;
  }): Promise<VerifiedMovieRecord[]> {
    const { upcoming30Days } = await this.getEngineResult();
    let list = [...upcoming30Days];

    if (options?.industry) {
      list = list.filter((m) => m.industry === options.industry);
    }
    if (options?.language) {
      list = list.filter((m) => m.language === options.language);
    }
    if (options?.limit) {
      list = list.slice(0, options.limit);
    }
    return list;
  }

  /**
   * Retrieves verified movies playing in theatres (released within the past 30 days).
   */
  public async getVerifiedNowShowing(options?: {
    industry?: FilmIndustry;
    language?: LanguageCode;
    limit?: number;
  }): Promise<VerifiedMovieRecord[]> {
    const { nowShowing30Days } = await this.getEngineResult();
    let list = [...nowShowing30Days];

    if (options?.industry) {
      list = list.filter((m) => m.industry === options.industry);
    }
    if (options?.language) {
      list = list.filter((m) => m.language === options.language);
    }
    if (options?.limit) {
      list = list.slice(0, options.limit);
    }
    return list;
  }

  /**
   * Finds a verified movie by its slug.
   */
  public async getVerifiedMovieBySlug(slug: string): Promise<VerifiedMovieRecord | null> {
    const { verifiedMovies } = await this.getEngineResult();
    return verifiedMovies.find((m) => m.slug === slug) || null;
  }

  /**
   * Retrieves all verified movies with filtering options.
   */
  public async getAllVerifiedMovies(options?: {
    industry?: FilmIndustry;
    language?: LanguageCode;
    status?: string;
    search?: string;
  }): Promise<VerifiedMovieRecord[]> {
    const { verifiedMovies } = await this.getEngineResult();
    let list = [...verifiedMovies];

    if (options?.industry) {
      list = list.filter((m) => m.industry === options.industry);
    }
    if (options?.language) {
      list = list.filter((m) => m.language === options.language);
    }
    if (options?.status) {
      list = list.filter((m) => m.releaseStatus === options.status);
    }
    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.titleEn.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q)
      );
    }

    return list;
  }

  /**
   * Safeguard: Validates whether a movie is legally allowed to track Box Office collections.
   * Returns true ONLY if theatricalReleaseDate <= todayIST AND verificationStatus !== "postponed".
   */
  public async canTrackBoxOffice(slug: string): Promise<boolean> {
    const movie = await this.getVerifiedMovieBySlug(slug);
    if (!movie) return false;
    const today = getTodayIST();
    return movie.theatricalReleaseDate <= today && movie.verificationStatus !== "postponed";
  }

  /**
   * Converts a VerifiedMovieRecord into standard website `Movie` interface
   * for seamless backward compatibility.
   */
  public toStandardMovie(record: VerifiedMovieRecord): Movie {
    return {
      id: record.id,
      title: record.title,
      titleEn: record.titleEn,
      slug: record.slug,
      synopsis: record.synopsis,
      introduction: record.introduction,
      theatricalReleaseDate: record.theatricalReleaseDate,
      releaseDateConfidence: record.verificationStatus === "confirmed" ? "confirmed" : "tentative",
      releaseStatus: record.releaseStatus,
      language: record.language,
      industry: record.industry,
      genres: record.genres,
      director: record.director,
      producers: record.producers,
      cast: record.cast,
      productionCompany: record.productionCompany,
      distributionCompany: record.distributionCompany,
      posterImage: record.posterImage,
      bannerImage: record.bannerImage,
      trailerYoutubeId: record.trailerYoutubeId,
      censorRating: record.censorRating,
      runtimeMinutes: record.runtimeMinutes,
      runtimeFormatted: record.runtimeFormatted,
      isFeatured: record.isFeatured,
      fivePointVerification: record.fivePointVerification,
      verificationScore: record.verificationScore,
      createdAt: record.lastVerifiedAt,
      updatedAt: record.lastVerifiedAt,
    };
  }

  /**
   * Aggregates engine telemetry and summary statistics.
   */
  public async getStats(): Promise<MovieIntelligenceStats> {
    const result = await this.getEngineResult();
    return this.calculateStats(result);
  }

  private calculateStats(result: VerificationEngineResult): MovieIntelligenceStats {
    const industryBreakdown: Record<FilmIndustry, number> = {
      sandalwood: 0,
      tollywood: 0,
      kollywood: 0,
      mollywood: 0,
      bollywood: 0,
      hollywood: 0,
      bengali: 0,
      punjabi: 0,
      regional: 0,
    };

    for (const m of result.verifiedMovies) {
      if (industryBreakdown[m.industry] !== undefined) {
        industryBreakdown[m.industry]++;
      }
    }

    return {
      todayIST: result.todayIST,
      windowStartDate: result.windowStartDate,
      windowEndDate: result.windowEndDate,
      totalDiscovered: result.verifiedMovies.length,
      upcoming30DaysCount: result.upcoming30Days.length,
      nowShowingCount: result.nowShowing30Days.length,
      postponedCount: result.postponedReleases.length,
      pendingVerificationCount: result.pendingVerification.length,
      industryBreakdown,
      lastEngineSync: new Date().toISOString(),
    };
  }
}

export const MovieIntelligenceService = new MovieIntelligenceServiceClass();
