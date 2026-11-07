import { describe, it, expect } from "vitest";
import { DataService } from "../src/lib/dataService";

describe("Strict Data Segregation Between Pages & Categories", () => {
  it("strictly isolates interview articles without leaking general news", async () => {
    const interviews = await DataService.getArticles("interviews");
    expect(interviews.length).toBeGreaterThan(0);
    expect(interviews.every((a) => a.category === "interviews")).toBe(true);
    // Ensure no general news or box office articles leaked in
    expect(interviews.some((a) => a.slug === "kantara-chapter-1-shooting-kundapura-rishab-shetty-look")).toBe(false);
    expect(interviews.some((a) => a.slug === "bagheera-box-office-collection-first-week-sriimurali")).toBe(false);
  });

  it("strictly isolates gossip articles", async () => {
    const gossips = await DataService.getArticles("gossip");
    expect(gossips.length).toBeGreaterThan(0);
    expect(gossips.every((a) => a.category === "gossip")).toBe(true);
  });

  it("strictly isolates television articles", async () => {
    const tv = await DataService.getArticles("television");
    expect(tv.length).toBeGreaterThan(0);
    expect(tv.every((a) => a.category === "television" || a.category === "ott")).toBe(true);
  });

  it("strictly isolates celebrity articles", async () => {
    const celeb = await DataService.getArticles("celebrity");
    expect(celeb.length).toBeGreaterThan(0);
    expect(celeb.every((a) => a.category === "celebrity" || a.category === "actors" || a.category === "actresses")).toBe(true);
  });

  it("strictly isolates event articles", async () => {
    const events = await DataService.getArticles("events");
    expect(events.length).toBeGreaterThan(0);
    expect(events.every((a) => a.category === "events")).toBe(true);
  });

  it("strictly isolates actor articles", async () => {
    const actors = await DataService.getArticles("actors");
    expect(actors.length).toBeGreaterThan(0);
    expect(actors.every((a) => a.category === "actors")).toBe(true);
  });

  it("strictly isolates bollywood articles", async () => {
    const bollywood = await DataService.getArticles("bollywood");
    expect(bollywood.length).toBeGreaterThan(0);
    expect(bollywood.every((a) => a.category === "bollywood" || a.industry === "bollywood")).toBe(true);
  });

  it("strictly isolates hollywood articles", async () => {
    const hollywood = await DataService.getArticles("hollywood");
    expect(hollywood.length).toBeGreaterThan(0);
    expect(hollywood.every((a) => a.category === "hollywood" || a.industry === "hollywood")).toBe(true);
  });

  it("ships no native-language edition feeds — every article is the English edition", async () => {
    // The ?lang= edition axis is retired: legacy language args must resolve to
    // empty feeds rather than leaking any native-script corpus.
    for (const legacy of ["te", "ta", "ml", "hi"] as const) {
      const legacyArticles = await DataService.getArticles(legacy);
      expect(legacyArticles.length).toBe(0);
    }

    // The single English edition covers the whole six-industry corpus.
    const enArticles = await DataService.getArticles("en");
    expect(enArticles.length).toBeGreaterThan(0);
    expect(enArticles.every((a) => a.language === "en")).toBe(true);
  });

  it("returns an empty array for retired edition-language filters instead of leaking all articles", async () => {
    // A legacy edition-language arg combined with a category must return an
    // empty array, NOT the entire article corpus.
    const result = await DataService.getArticles("upcoming", "te");
    expect(result.length).toBe(0);
  });
});

