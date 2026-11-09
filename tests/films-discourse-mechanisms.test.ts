import { describe, it, expect } from "vitest";
import { normalizeVerdictKey, getVerdictPresentation } from "@/lib/boxOfficeEngine/verdictEngine";
import {
  getYearlyLeaderboard,
  getYearlyAggregateStats,
} from "@/lib/boxOfficeEngine/yearlyLeaderboardData";
import { HypoMeterService } from "@/lib/hypoMeterService";

describe("Films Discourse Mechanisms: Trade Verdict Engine", () => {
  it("normalizes diverse verdict strings to canonical verdict levels", () => {
    expect(normalizeVerdictKey("All-Time Blockbuster")).toBe("all_time_blockbuster");
    expect(normalizeVerdictKey("ATB")).toBe("all_time_blockbuster");
    expect(normalizeVerdictKey("Blockbuster")).toBe("blockbuster");
    expect(normalizeVerdictKey("Superhit")).toBe("superhit");
    expect(normalizeVerdictKey("HIT")).toBe("hit");
    expect(normalizeVerdictKey("Above Average")).toBe("above_average");
    expect(normalizeVerdictKey("Average")).toBe("average");
    expect(normalizeVerdictKey("Flop")).toBe("flop");
    expect(normalizeVerdictKey("Disaster")).toBe("disaster");
    expect(normalizeVerdictKey("In Theatres")).toBe("running");
  });

  it("assigns high-contrast House Full Press token classes for verdicts", () => {
    const atb = getVerdictPresentation("all_time_blockbuster");
    expect(atb.badgeClass).toContain("bg-marquee");
    expect(atb.badgeClass).toContain("border-2 border-ink");

    const superhit = getVerdictPresentation("superhit");
    expect(superhit.badgeClass).toContain("bg-press");
    expect(superhit.badgeClass).toContain("text-paper");

    const hit = getVerdictPresentation("hit");
    expect(hit.badgeClass).toContain("bg-band");
  });
});

describe("Films Discourse Mechanisms: Yearly Leaderboard Engine", () => {
  it("returns sorted records by India Net for 2026", () => {
    const records = getYearlyLeaderboard(2026, "net");
    expect(records.length).toBeGreaterThan(0);
    expect(records[0].rank).toBe(1);
    expect(records[0].movieTitleEn).toBe("Dhurandhar: The Revenge");
    expect(records[0].indiaNettCrores).toBe(1108.0);

    // Verify descending order
    for (let i = 0; i < records.length - 1; i++) {
      expect(records[i].indiaNettCrores).toBeGreaterThanOrEqual(records[i + 1].indiaNettCrores);
    }
  });

  it("correctly sorts by Worldwide Gross dimension", () => {
    const records = getYearlyLeaderboard(2026, "ww");
    expect(records[0].movieTitleEn).toBe("Dhurandhar: The Revenge");
    expect(records[0].worldwideGrossCrores).toBe(1852.0);

    for (let i = 0; i < records.length - 1; i++) {
      expect(records[i].worldwideGrossCrores).toBeGreaterThanOrEqual(records[i + 1].worldwideGrossCrores);
    }
  });

  it("correctly sorts by Opening Day dimension", () => {
    const records = getYearlyLeaderboard(2026, "open");
    expect(records[0].openingDayNettCrores).toBe(102.55);

    for (let i = 0; i < records.length - 1; i++) {
      expect(records[i].openingDayNettCrores).toBeGreaterThanOrEqual(records[i + 1].openingDayNettCrores);
    }
  });

  it("computes accurate aggregate stats for 2026 box office", () => {
    const stats = getYearlyAggregateStats(2026);
    expect(stats.year).toBe(2026);
    expect(stats.filmsTrackedCount).toBe(10);
    expect(stats.totalIndiaNetCrores).toBeGreaterThan(2500);
    expect(stats.topGrosserName).toBe("Dhurandhar: The Revenge");
    expect(stats.hitsOrBetterCount).toBeGreaterThanOrEqual(5);
  });
});

describe("Films Discourse Mechanisms: HypoMeter Audience Pulse", () => {
  it("loads seeded upcoming films with valid hype and prediction data", () => {
    const films = HypoMeterService.getFilms();
    expect(films.length).toBeGreaterThanOrEqual(5);

    const king = films.find((f) => f.slug === "king-shah-rukh-khan");
    expect(king).toBeDefined();
    expect(king?.interestedCount).toBe(111000);
    expect(king?.openingDayPredictionMinCr).toBeGreaterThan(50);
  });

  it("fetches top hyped films ordered by interested count", () => {
    const topHyped = HypoMeterService.getTopHyped(3);
    expect(topHyped.length).toBe(3);
    expect(topHyped[0].interestedCount).toBeGreaterThanOrEqual(topHyped[1].interestedCount);
  });
});
