import { describe, it, expect } from "vitest";
import { getTodayIST, shiftDaysIST, getDaysDifference, classifyMovieRelease } from "@/lib/cinemaDateUtils";
import { discoverMoviesAcrossIndustries } from "@/lib/movieIntelligence/discoveryEngine";
import {
  runMovieVerificationEngine,
  verifyCandidateReleaseDate,
  normalizeTitleKey,
} from "@/lib/movieIntelligence/verificationEngine";
import { MovieIntelligenceService } from "@/lib/movieIntelligence/movieIntelligenceService";
import { DataService } from "@/lib/dataService";

describe("Real-Time Movie Discovery & Release Verification System", () => {
  const todayIST = getTodayIST();

  describe("1. Dynamic Clock & Automatic 30-Day Window Detection", () => {
    it("dynamically reads current date in Asia/Kolkata timezone without hardcoding", () => {
      expect(todayIST).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const parts = todayIST.split("-");
      expect(parts.length).toBe(3);
      expect(parseInt(parts[0], 10)).toBeGreaterThanOrEqual(2024);
    });

    it("automatically calculates the 30-calendar-day forward window [today, today + 30]", () => {
      const windowStart = todayIST;
      const windowEnd = shiftDaysIST(todayIST, 30);

      expect(getDaysDifference(windowEnd, windowStart)).toBe(30);
      expect(windowEnd > windowStart).toBe(true);
    });
  });

  describe("2. Multi-Industry Global Discovery", () => {
    const candidates = discoverMoviesAcrossIndustries(todayIST);

    it("discovers releases across all major film industries", () => {
      const industries = new Set(candidates.map((c) => c.industry));

      expect(industries.has("sandalwood")).toBe(true); // Kannada
      expect(industries.has("tollywood")).toBe(true);  // Telugu
      expect(industries.has("kollywood")).toBe(true);  // Tamil
      expect(industries.has("mollywood")).toBe(true);  // Malayalam
      expect(industries.has("bollywood")).toBe(true);  // Hindi
      expect(industries.has("hollywood")).toBe(true);  // Global / English
    });

    it("attaches independent multi-source observations to candidates", () => {
      for (const candidate of candidates) {
        expect(candidate.observations.length).toBeGreaterThan(0);
        for (const obs of candidate.observations) {
          expect(obs.sourceType).toMatch(/official_studio|cinema_chain_booking|trade_publication/);
          expect(obs.sourceAuthorityWeight).toBeGreaterThan(0);
          expect(obs.observedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
      }
    });
  });

  describe("3. Multi-Source Release Date Verification & Consensus", () => {
    it("marks release as 'confirmed' when >=2 independent sources agree with an official studio announcement", () => {
      const candidates = discoverMoviesAcrossIndustries(todayIST);
      const pushpa = candidates.find((c) => c.slug === "pushpa-2-the-rule");
      expect(pushpa).toBeDefined();

      const verification = verifyCandidateReleaseDate(pushpa!, todayIST);
      expect(verification.verificationStatus).toBe("confirmed");
      expect(verification.sourcesAgreedCount).toBeGreaterThanOrEqual(2);
      expect(verification.verificationScore).toBeGreaterThanOrEqual(85);
    });

    it("flags movies with conflicting dates as 'pending_verification'", () => {
      const candidates = discoverMoviesAcrossIndustries(todayIST);
      const conflictingMovie = candidates.find((c) => c.slug === "they-call-him-og");
      expect(conflictingMovie).toBeDefined();

      const verification = verifyCandidateReleaseDate(conflictingMovie!, todayIST);
      expect(verification.verificationStatus).toBe("pending_verification");
      expect(verification.verificationScore).toBeLessThan(80);
    });

    it("detects postponements and retains previous release date audit history", () => {
      const candidates = discoverMoviesAcrossIndustries(todayIST);
      const postponedMovie = candidates.find((c) => c.slug === "toxic-fairy-tale");
      expect(postponedMovie).toBeDefined();

      const verification = verifyCandidateReleaseDate(postponedMovie!, todayIST);
      expect(verification.verificationStatus).toBe("postponed");
      expect(verification.history.length).toBeGreaterThanOrEqual(2);
      expect(verification.history[0].status).toBe("postponed");
      expect(verification.history[0].reason).toContain("VFX polish");
    });
  });

  describe("4. Strict 30-Day Release Window Filtering", () => {
    it("partitions discovered movies strictly by the 30-day window", () => {
      const candidates = discoverMoviesAcrossIndustries(todayIST);
      const result = runMovieVerificationEngine(candidates, todayIST);

      // 1. Upcoming releases must strictly be within [today + 1, today + 30]
      for (const upcoming of result.upcoming30Days) {
        const diff = getDaysDifference(upcoming.theatricalReleaseDate, todayIST);
        expect(diff).toBeGreaterThan(0);
        expect(diff).toBeLessThanOrEqual(30);
      }

      // 2. Now showing releases must strictly be within [today - 30, today]
      for (const showing of result.nowShowing30Days) {
        const diff = getDaysDifference(showing.theatricalReleaseDate, todayIST);
        expect(diff).toBeLessThanOrEqual(0);
        expect(diff).toBeGreaterThanOrEqual(-30);
      }

      // 3. Postponed movies are excluded from upcoming active window
      for (const upcoming of result.upcoming30Days) {
        expect(upcoming.verificationStatus).not.toBe("postponed");
      }
    });
  });

  describe("5. Box Office Safeguard: Zero Fabricated Figures for Unreleased Movies", () => {
    it("strictly disallows box office tracking for movies whose release date is in the future", async () => {
      const result = await MovieIntelligenceService.getEngineResult();

      for (const movie of result.upcoming30Days) {
        expect(movie.canTrackBoxOffice).toBe(false);
        const canTrack = await MovieIntelligenceService.canTrackBoxOffice(movie.slug);
        expect(canTrack).toBe(false);
      }
    });

    it("allows box office tracking ONLY for movies that have actually released theatrically", async () => {
      const result = await MovieIntelligenceService.getEngineResult();

      for (const movie of result.nowShowing30Days) {
        expect(movie.canTrackBoxOffice).toBe(true);
        const canTrack = await MovieIntelligenceService.canTrackBoxOffice(movie.slug);
        expect(canTrack).toBe(true);
      }
    });
  });

  describe("6. Title Normalization & Deduplication", () => {
    it("normalizes multilingual title strings accurately", () => {
      const key1 = normalizeTitleKey("Kantara: Chapter 1", "sandalwood");
      const key2 = normalizeTitleKey("kantara chapter-1!", "sandalwood");
      expect(key1).toBe(key2);
    });

    it("deduplicates candidates when same movie is discovered from multiple sources", () => {
      const candidates = discoverMoviesAcrossIndustries(todayIST);
      // Inject duplicate candidate
      const duplicateCandidate = {
        ...candidates[0],
        rawId: "duplicate-id-test",
      };

      const result = runMovieVerificationEngine([...candidates, duplicateCandidate], todayIST);
      const occurrences = result.verifiedMovies.filter((m) => m.slug === candidates[0].slug);
      expect(occurrences.length).toBe(1);
    });
  });

  describe("7. Website-Wide Synchronization & Service Integration", () => {
    it("integrates seamlessly into DataService.getMovies()", async () => {
      const movies = await DataService.getMovies();
      expect(movies.length).toBeGreaterThan(0);

      // Verify that Kantara and Pushpa 2 are discoverable through DataService
      const kantara = movies.find((m) => m.slug === "kantara-chapter-1");
      const pushpa = movies.find((m) => m.slug === "pushpa-2-the-rule");

      expect(kantara).toBeDefined();
      expect(pushpa).toBeDefined();
    });

    it("retrieves movie intelligence telemetry and stats", async () => {
      const stats = await MovieIntelligenceService.getStats();

      expect(stats.todayIST).toBe(todayIST);
      expect(stats.totalDiscovered).toBeGreaterThan(5);
      expect(stats.upcoming30DaysCount).toBeGreaterThan(0);
      expect(stats.nowShowingCount).toBeGreaterThan(0);
      expect(stats.industryBreakdown.sandalwood).toBeGreaterThan(0);
    });

    it("converts verified record to standard movie without leaking internal provider information", async () => {
      const kantara = await MovieIntelligenceService.getVerifiedMovieBySlug("kantara-chapter-1");
      expect(kantara).toBeDefined();

      const standard = MovieIntelligenceService.toStandardMovie(kantara!);
      expect(standard.title).toBe(kantara!.title);
      expect(standard.theatricalReleaseDate).toBe(kantara!.theatricalReleaseDate);

      // Ensure no raw observation or provider array is attached on standard object
      expect((standard as any).observations).toBeUndefined();
    });

    it("deduplicates concurrent in-flight requests to prevent cache stampedes", async () => {
      // Trigger multiple concurrent requests simultaneously
      const [res1, res2, res3] = await Promise.all([
        MovieIntelligenceService.getEngineResult(),
        MovieIntelligenceService.getEngineResult(),
        MovieIntelligenceService.getEngineResult(),
      ]);

      expect(res1.todayIST).toBe(res2.todayIST);
      expect(res2.todayIST).toBe(res3.todayIST);
      expect(res1.verifiedMovies.length).toBe(res2.verifiedMovies.length);
    });

    it("gracefully handles candidate with malformed date strings", () => {
      const malformedCandidate = {
        rawId: "malformed-test",
        title: "ಟೆಸ್ಟ್ ಸಿನಿಮಾ",
        titleEn: "Malformed Date Test",
        slug: "malformed-date-test",
        industry: "sandalwood" as const,
        language: "kn" as const,
        genres: ["Action"],
        director: "Test Director",
        producers: ["Test Producer"],
        productionCompany: "Test Prod",
        distributionCompany: "Test Dist",
        cast: [],
        synopsis: "Test",
        posterImage: "",
        observations: [
          {
            sourceId: "src-broken",
            sourceType: "trade_publication" as const,
            sourceAuthorityWeight: 0.8,
            observedDate: "invalid-date-string",
            observedAt: new Date().toISOString(),
            isOfficialAnnouncement: false,
          },
        ],
      };

      const result = verifyCandidateReleaseDate(malformedCandidate, todayIST);
      expect(result.verifiedDate).toBe(todayIST);
      expect(result.verificationStatus).toBe("pending_verification");
    });
  });
});
