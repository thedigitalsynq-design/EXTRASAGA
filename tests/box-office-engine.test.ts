import { describe, it, expect } from "vitest";
import { convertToINRCrores, deriveNetFromGross, deriveDistributorShare, calculateFreshnessMultiplier, normalizeRawReport } from "@/lib/boxOfficeEngine/normalizer";
import { detectAndFlagOutliers, calculateSourceDispersion } from "@/lib/boxOfficeEngine/outlierDetector";
import { MONITORED_MOVIES, fetchIndependentSourceReports } from "@/lib/boxOfficeEngine/providers";
import { consolidateMovieBoxOffice } from "@/lib/boxOfficeEngine/consolidator";
import { BoxOfficeEngineService } from "@/lib/boxOfficeEngine/boxOfficeService";
import { DataService } from "@/lib/dataService";
import { RawProviderReport } from "@/types/boxOffice";

describe("Intelligent Multi-Source Box Office Engine", () => {
  describe("1. Currency & Unit Normalization", () => {
    it("converts USD Millions to standard INR Crores correctly", () => {
      // $10M USD @ 84.0 = ₹84.0 Crores
      const inrCrores = convertToINRCrores(10, "millions", "USD");
      expect(inrCrores).toBe(84.0);
    });

    it("converts Lakhs to INR Crores correctly", () => {
      // 500 Lakhs = ₹5.0 Crores
      const inrCrores = convertToINRCrores(500, "lakhs", "INR");
      expect(inrCrores).toBe(5.0);
    });

    it("derives domestic Net collections from Gross deducting ~18% GST", () => {
      // ₹118 Cr Gross -> ₹100 Cr Net
      const net = deriveNetFromGross(118);
      expect(net).toBe(100.0);
    });

    it("derives distributor share from Net collections", () => {
      // ₹100 Cr Net -> ~₹48.5 Cr Distributor Share
      const share = deriveDistributorShare(100, "domestic");
      expect(share).toBe(48.5);
    });

    it("applies freshness decay to older un-audited reports", () => {
      const now = new Date();
      const freshISO = now.toISOString();
      const freshMultiplier = calculateFreshnessMultiplier(freshISO, false);
      expect(freshMultiplier).toBe(1.0);

      const oldISO = new Date(now.getTime() - 48 * 3600 * 1000).toISOString();
      const oldMultiplier = calculateFreshnessMultiplier(oldISO, false);
      expect(oldMultiplier).toBeLessThan(0.7);

      // Audited statements never decay
      const auditedMultiplier = calculateFreshnessMultiplier(oldISO, true);
      expect(auditedMultiplier).toBe(1.0);
    });
  });

  describe("2. Statistical Outlier Detection & Suppression", () => {
    it("flags extreme exaggerated producer PR claims as outliers", () => {
      const dummyMovie = MONITORED_MOVIES[0]; // KGF 2
      const rawReports = fetchIndependentSourceReports(dummyMovie);
      const normalized = rawReports.map(normalizeRawReport);

      // Inject an inflated PR claim: ₹2500 Cr when consensus is ~₹1250 Cr
      normalized.push({
        reportId: "anomalous_pr_spike",
        movieId: dummyMovie.movieId,
        reportDate: "2026-11-06",
        grossInCrores: 2500.0,
        netInCrores: 2118.0,
        distributorShareInCrores: 1027.0,
        overseasGrossInCrores: 500.0,
        weight: 0.90,
        freshnessMultiplier: 1.0,
        isOutlier: false,
        sourceClassification: "reported",
      });

      const cleansed = detectAndFlagOutliers(normalized);
      const spike = cleansed.find((r) => r.reportId === "anomalous_pr_spike");

      expect(spike).toBeDefined();
      expect(spike?.isOutlier).toBe(true);
      // Ensure outlier weight is severely reduced
      expect(spike?.weight).toBeLessThan(0.2);
    });

    it("calculates source dispersion accurately", () => {
      const dummyMovie = MONITORED_MOVIES[0];
      const rawReports = fetchIndependentSourceReports(dummyMovie);
      const normalized = rawReports.map(normalizeRawReport);
      const dispersion = calculateSourceDispersion(normalized);
      // Legitimate agreeing sources should have low dispersion (<0.06)
      expect(dispersion).toBeLessThan(0.06);
    });
  });

  describe("3. Multi-Source Consolidation & Segregation", () => {
    it("consolidates multi-source feeds into single unified record with segregated Gross, Net, Share", () => {
      const movie = MONITORED_MOVIES[0];
      const raw = fetchIndependentSourceReports(movie);
      const consolidated = consolidateMovieBoxOffice(movie, raw);

      expect(consolidated.movieId).toBe(movie.movieId);
      expect(consolidated.grossInCrores).toBeGreaterThan(1000);
      expect(consolidated.netInCrores).toBeLessThan(consolidated.grossInCrores);
      expect(consolidated.distributorShareInCrores).toBeLessThan(consolidated.netInCrores);
      expect(consolidated.overseasGrossInCrores).toBeGreaterThan(0);
      expect(consolidated.overseasGrossInUSD).toBeGreaterThan(0);
      expect(consolidated.confidenceScore).toBeGreaterThanOrEqual(80);
      expect(consolidated.trajectory).toBeDefined();
      expect(consolidated.trajectory.day1InCrores).toBeGreaterThan(0);
      expect(consolidated.trajectory.openingWeekendInCrores).toBeGreaterThan(consolidated.trajectory.day1InCrores);
    });

    it("separates territory-wise financials with regional breakdowns", () => {
      const movie = MONITORED_MOVIES[0];
      const raw = fetchIndependentSourceReports(movie);
      const consolidated = consolidateMovieBoxOffice(movie, raw);

      expect(consolidated.territories.length).toBeGreaterThanOrEqual(5);
      const karnataka = consolidated.territories.find((t) => t.territory === "Karnataka");
      expect(karnataka).toBeDefined();
      expect(karnataka?.grossInCrores).toBeGreaterThan(0);
      expect(karnataka?.netInCrores).toBeLessThan(karnataka!.grossInCrores);
      expect(karnataka?.distributorShareInCrores).toBeLessThan(karnataka!.netInCrores);
    });
  });

  describe("4. Real-time City Theatrical Telemetry", () => {
    it("tracks metropolitan theatre shows, occupancy, and average ticket price", () => {
      const movie = MONITORED_MOVIES[2]; // Bagheera (Currently in theatres)
      const raw = fetchIndependentSourceReports(movie);
      const consolidated = consolidateMovieBoxOffice(movie, raw);

      expect(consolidated.cityTelemetry.length).toBeGreaterThanOrEqual(6);
      const blr = consolidated.cityTelemetry.find((c) => c.city === "Bengaluru");
      expect(blr).toBeDefined();
      expect(blr?.trackedTheatres).toBeGreaterThan(50);
      expect(blr?.trackedShows).toBeGreaterThan(100);
      expect(blr?.occupancyPercent).toBeGreaterThan(50);
      expect(blr?.averageTicketPriceINR).toBeGreaterThan(150);
    });
  });

  describe("5. Frontend Privacy & Confidentiality Safeguards", () => {
    it("never exposes internal provider IDs, provider names, or raw source URLs in consolidated outputs", async () => {
      const records = await BoxOfficeEngineService.getConsolidatedRecords();
      expect(records.length).toBeGreaterThan(0);

      for (const rec of records) {
        // Stringify the entire object to test deep property leakage
        const json = JSON.stringify(rec);
        expect(json).not.toContain("provider_exhibitor_telemetry");
        expect(json).not.toContain("provider_ticket_booking_aggregator");
        expect(json).not.toContain("provider_distributor_official_statement");
        expect(json).not.toContain("provider_trade_analyst_network");
        expect(json).not.toContain("provider_overseas_comscore_exchange");
        expect(json).not.toContain("rawGross");
        expect(json).not.toContain("rawNet");
      }
    });
  });

  describe("6. DataService Backward Compatibility", () => {
    it("DataService.getBoxOffice returns consolidated entries with legacy format strings", async () => {
      const entries = await DataService.getBoxOffice("kn");
      expect(entries.length).toBeGreaterThan(0);
      const top = entries[0];

      // Check legacy fields expected by existing pages
      expect(top.movieTitle).toBeTruthy();
      expect(top.day1Collection).toContain("Cr");
      expect(top.worldwideCollection).toContain("Cr");
      expect(top.territoryBreakdown.length).toBeGreaterThan(0);

      // Check new multi-source fields
      expect(top.grossInCrores).toBeGreaterThan(0);
      expect(top.confidenceScore).toBeGreaterThanOrEqual(70);
      expect(top.figureStatus).toMatch(/live_estimate|consolidated|verified/);
    });
  });
});

