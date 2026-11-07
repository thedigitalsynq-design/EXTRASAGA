import { describe, it, expect, beforeEach } from "vitest";
import {
  getTodayIST,
  classifyMovieRelease,
  matchesUpcomingBucket,
  partitionMoviesByReleaseStatus,
  getDaysDifference,
  shiftDaysIST,
  formatReleaseDateIST,
} from "@/lib/cinemaDateUtils";
import { Movie } from "@/types";
import { DataService } from "@/lib/dataService";

describe("Cinema Releases Date Engine (Asia/Kolkata)", () => {
  it("computes current date strictly in YYYY-MM-DD format for Asia/Kolkata", () => {
    const today = getTodayIST();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("calculates exact day differences accurately", () => {
    const today = getTodayIST();
    const tomorrow = shiftDaysIST(today, 1);
    const yesterday = shiftDaysIST(today, -1);
    const thirtyDaysAgo = shiftDaysIST(today, -30);

    expect(getDaysDifference(tomorrow, today)).toBe(1);
    expect(getDaysDifference(yesterday, today)).toBe(-1);
    expect(getDaysDifference(thirtyDaysAgo, today)).toBe(-30);
  });

  describe("Automatic Dynamic Classification (Requirement 3)", () => {
    const today = getTodayIST();

    it("classifies movie released today as 'in_theatres'", () => {
      expect(classifyMovieRelease(today)).toBe("in_theatres");
    });

    it("classifies movie released 10 days ago as 'in_theatres'", () => {
      const tenDaysAgo = shiftDaysIST(today, -10);
      expect(classifyMovieRelease(tenDaysAgo)).toBe("in_theatres");
    });

    it("classifies movie released exactly 30 days ago as 'in_theatres'", () => {
      const thirtyDaysAgo = shiftDaysIST(today, -30);
      expect(classifyMovieRelease(thirtyDaysAgo)).toBe("in_theatres");
    });

    it("classifies movie released 31 days ago as 'archived' (never hardcoded, preserved)", () => {
      const thirtyOneDaysAgo = shiftDaysIST(today, -31);
      expect(classifyMovieRelease(thirtyOneDaysAgo)).toBe("archived");
    });

    it("classifies movie releasing tomorrow as 'upcoming'", () => {
      const tomorrow = shiftDaysIST(today, 1);
      expect(classifyMovieRelease(tomorrow)).toBe("upcoming");
    });

    it("classifies movie releasing 60 days in future as 'upcoming'", () => {
      const future = shiftDaysIST(today, 60);
      expect(classifyMovieRelease(future)).toBe("upcoming");
    });
  });

  describe("Upcoming Time Window Bucketing (Requirement 2)", () => {
    const today = getTodayIST();

    it("correctly identifies 'today' releases", () => {
      expect(matchesUpcomingBucket(today, "today")).toBe(true);
      expect(matchesUpcomingBucket(shiftDaysIST(today, 1), "today")).toBe(false);
    });

    it("correctly identifies 'tomorrow' releases", () => {
      const tomorrow = shiftDaysIST(today, 1);
      expect(matchesUpcomingBucket(tomorrow, "tomorrow")).toBe(true);
      expect(matchesUpcomingBucket(today, "tomorrow")).toBe(false);
    });

    it("filters next 7 days correctly", () => {
      expect(matchesUpcomingBucket(shiftDaysIST(today, 4), "next_7_days")).toBe(true);
      expect(matchesUpcomingBucket(shiftDaysIST(today, 8), "next_7_days")).toBe(false);
    });

    it("filters next 30, 60, and 90 days correctly", () => {
      const day20 = shiftDaysIST(today, 20);
      const day45 = shiftDaysIST(today, 45);
      const day75 = shiftDaysIST(today, 75);
      const day120 = shiftDaysIST(today, 120);

      expect(matchesUpcomingBucket(day20, "next_30_days")).toBe(true);
      expect(matchesUpcomingBucket(day45, "next_30_days")).toBe(false);

      expect(matchesUpcomingBucket(day45, "next_60_days")).toBe(true);
      expect(matchesUpcomingBucket(day75, "next_60_days")).toBe(false);

      expect(matchesUpcomingBucket(day75, "next_90_days")).toBe(true);
      expect(matchesUpcomingBucket(day120, "next_90_days")).toBe(false);
    });
  });

  describe("Array Partitioning & Permanent Retention (Requirement 5)", () => {
    const today = getTodayIST();

    const sampleMovies: Partial<Movie>[] = [
      { id: "m1", title: "In Theatres Now", theatricalReleaseDate: shiftDaysIST(today, -5) },
      { id: "m2", title: "Releasing Tomorrow", theatricalReleaseDate: shiftDaysIST(today, 1) },
      { id: "m3", title: "Releasing Next Month", theatricalReleaseDate: shiftDaysIST(today, 25) },
      { id: "m4", title: "Past Blockbuster", theatricalReleaseDate: shiftDaysIST(today, -45) },
    ];

    it("partitions movies into 3 distinct status groups without deleting any records", () => {
      const { inTheatres, upcoming, archived } =
        partitionMoviesByReleaseStatus(sampleMovies as Movie[]);

      expect(inTheatres).toHaveLength(1);
      expect(inTheatres[0].id).toBe("m1");

      expect(upcoming).toHaveLength(2);
      expect(upcoming.map((m) => m.id)).toEqual(["m2", "m3"]);

      expect(archived).toHaveLength(1);
      expect(archived[0].id).toBe("m4");

      // Verify no records were lost
      const total = inTheatres.length + upcoming.length + archived.length;
      expect(total).toBe(sampleMovies.length);
    });
  });

  describe("DataService Movie Operations & Rollover", () => {
    it("fetches latest theatrical releases (last 30 days)", async () => {
      const releases = await DataService.getLatestTheatricalReleases();
      expect(Array.isArray(releases)).toBe(true);
      expect(releases.length).toBeGreaterThan(0);
      for (const m of releases) {
        expect(m.releaseStatus).toBe("in_theatres");
      }
    });

    it("fetches upcoming releases with time filtering", async () => {
      const upcoming = await DataService.getUpcomingReleases(undefined, "next_90_days");
      expect(Array.isArray(upcoming)).toBe(true);
      for (const m of upcoming) {
        expect(m.releaseStatus).toBe("upcoming");
      }
    });

    it("runs daily rollover and produces telemetry logs", async () => {
      const result = await DataService.runDailyCinemaRollover();
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("moviesProcessed");
      expect(result).toHaveProperty("upcomingCount");
      expect(result).toHaveProperty("inTheatresCount");
      expect(result).toHaveProperty("archivedCount");
      expect(result.status).toBe("success");

      const logs = await DataService.getAutomationLogs();
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0].action).toContain("Daily Cinema Rollover");
      expect(logs[0].status).toBe("success");
    });
  });
});
