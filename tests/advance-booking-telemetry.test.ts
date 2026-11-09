import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import {
  AdvanceBookingService,
} from "../src/lib/boxOfficeEngine/advanceBookingService";

describe("Live Advance Booking & National Chains Telemetry Verification", () => {
  it("verifies AdvanceBookingService returns active tracked movies with valid telemetry", () => {
    const movies = AdvanceBookingService.getTrackedMovies();
    expect(movies.length).toBeGreaterThan(0);

    for (const movie of movies) {
      expect(movie.movieId).toBeTruthy();
      expect(movie.movieTitleEn).toBeTruthy();
      expect(movie.slug).toBeTruthy();
      expect(movie.advance).toBeDefined();

      const adv = movie.advance;
      expect(adv.advanceGrossInCrores).toBeGreaterThan(0);
      expect(adv.ticketsSold).toBeGreaterThan(0);
      expect(adv.totalShows).toBeGreaterThan(0);
      expect(adv.trackedTheatres).toBeGreaterThan(0);
      expect(adv.occupancyPercent).toBeGreaterThanOrEqual(0);
      expect(adv.occupancyPercent).toBeLessThanOrEqual(100);
      expect(adv.nationalChainsTickets).toBeGreaterThan(0);
      expect(adv.nationalChainsGrossInCrores).toBeGreaterThan(0);
      expect(adv.dayPredictionInCrores).toBeTruthy();
      expect(adv.weekendProjectionInCrores).toBeTruthy();
      expect(["up", "down", "flat"]).toContain(adv.trend);
    }
  });

  it("verifies National Chains Advance Pulse items for live ticker", () => {
    const pulseItems = AdvanceBookingService.getNationalChainsPulse();
    expect(pulseItems.length).toBeGreaterThan(0);

    for (const item of pulseItems) {
      expect(item.movieTitle).toBeTruthy();
      expect(item.picTicketsSold).toBeGreaterThan(0);
      expect(item.picTicketsSoldFormatted).toMatch(/\d+(\.\d+)?\s*(Lakh|K)/);
      expect(item.picGrossInCrores).toBeGreaterThan(0);
      expect(item.trendDelta).toMatch(/^[+-]?\d+(\.\d+)?%/);
    }
  });

  it("verifies state distribution circuits coverage", () => {
    const circuits = AdvanceBookingService.getStateCircuits();
    expect(circuits.length).toBeGreaterThanOrEqual(6);

    const states = circuits.map((c) => c.regionCode);
    expect(states).toContain("AP-TG");
    expect(states).toContain("MH");
    expect(states).toContain("KA");
    expect(states).toContain("TN");
    expect(states).toContain("NCR-NORTH");
    expect(states).toContain("KL");

    for (const circuit of circuits) {
      expect(circuit.trackedTheatres).toBeGreaterThan(0);
      expect(circuit.trackedShows).toBeGreaterThan(0);
      expect(circuit.dailyGrossInCrores).toBeGreaterThan(0);
      expect(circuit.topMovie).toBeTruthy();
    }
  });

  it("verifies aggregate national metrics computation", () => {
    const aggregates = AdvanceBookingService.getAggregateMetrics();
    expect(aggregates.totalAdvanceGrossFormatted).toMatch(/^₹\d+(\.\d+)?\s*Cr$/);
    expect(aggregates.totalTicketsSoldFormatted).toMatch(/\d+(\.\d+)?\s*Lakh/);
    expect(aggregates.totalPICTicketsFormatted).toMatch(/\d+(\.\d+)?\s*Lakh/);
    expect(aggregates.averageOccupancyPercent).toBeGreaterThan(0);
    expect(aggregates.activeTrackedFilmsCount).toBeGreaterThan(0);
  });

  it("verifies design token purity across advance booking components", () => {
    const componentsDir = path.resolve(__dirname, "../src/components");
    const components = [
      "NationalChainsAdvancePulse.tsx",
      "BoxOfficeTrackingSwitcher.tsx",
      "AdvanceBookingsLiveTable.tsx",
      "NationalChainsPICCard.tsx",
      "StateCircuitTelemetryTable.tsx",
      "BoxOfficeTweetStudioModal.tsx",
    ];

    for (const file of components) {
      const fullPath = path.join(componentsDir, file);
      expect(fs.existsSync(fullPath)).toBe(true);

      const content = fs.readFileSync(fullPath, "utf-8");
      // Must not leak un-themed raw classes
      expect(content).not.toContain("bg-[#F8FAF9]");
      expect(content).not.toContain("bg-[#F8F9FA]");
      expect(content).not.toContain("bg-white");
      expect(content).not.toContain("text-[#0F3529]");
    }
  });
});
