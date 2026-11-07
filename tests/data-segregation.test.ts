import { describe, it, expect } from "vitest";
import { DataService } from "../src/lib/dataService";

describe("Strict Data Segregation Between Pages & Categories", () => {
  it("strictly isolates interview articles without leaking general news", async () => {
    const interviews = await DataService.getArticles("interviews", "kn");
    expect(interviews.length).toBeGreaterThan(0);
    expect(interviews.every((a) => a.category === "interviews")).toBe(true);
    // Ensure no general news or box office articles leaked in
    expect(interviews.some((a) => a.slug === "kantara-chapter-1-shooting-kundapura-rishab-shetty-look")).toBe(false);
    expect(interviews.some((a) => a.slug === "bagheera-box-office-collection-first-week-sriimurali")).toBe(false);
  });

  it("strictly isolates gossip articles", async () => {
    const gossips = await DataService.getArticles("gossip", "kn");
    expect(gossips.length).toBeGreaterThan(0);
    expect(gossips.every((a) => a.category === "gossip")).toBe(true);
  });

  it("strictly isolates television articles", async () => {
    const tv = await DataService.getArticles("television", "kn");
    expect(tv.length).toBeGreaterThan(0);
    expect(tv.every((a) => a.category === "television" || a.category === "ott")).toBe(true);
  });

  it("strictly isolates celebrity articles", async () => {
    const celeb = await DataService.getArticles("celebrity", "kn");
    expect(celeb.length).toBeGreaterThan(0);
    expect(celeb.every((a) => a.category === "celebrity" || a.category === "actors" || a.category === "actresses")).toBe(true);
  });

  it("strictly isolates event articles", async () => {
    const events = await DataService.getArticles("events", "kn");
    expect(events.length).toBeGreaterThan(0);
    expect(events.every((a) => a.category === "events")).toBe(true);
  });

  it("strictly isolates actor articles", async () => {
    const actors = await DataService.getArticles("actors", "kn");
    expect(actors.length).toBeGreaterThan(0);
    expect(actors.every((a) => a.category === "actors")).toBe(true);
  });

  it("strictly isolates bollywood articles", async () => {
    const bollywood = await DataService.getArticles("bollywood", "kn");
    expect(bollywood.length).toBeGreaterThan(0);
    expect(bollywood.every((a) => a.category === "bollywood" || a.industry === "bollywood")).toBe(true);
  });

  it("strictly isolates hollywood articles", async () => {
    const hollywood = await DataService.getArticles("hollywood", "kn");
    expect(hollywood.length).toBeGreaterThan(0);
    expect(hollywood.every((a) => a.category === "hollywood" || a.industry === "hollywood")).toBe(true);
  });

  it("strictly isolates language feeds without cross-language leakage", async () => {
    const teArticles = await DataService.getArticles("te");
    expect(teArticles.length).toBeGreaterThan(0);
    expect(teArticles.every((a) => a.language === "te")).toBe(true);

    const taArticles = await DataService.getArticles("ta");
    expect(taArticles.length).toBeGreaterThan(0);
    expect(taArticles.every((a) => a.language === "ta")).toBe(true);

    const mlArticles = await DataService.getArticles("ml");
    expect(mlArticles.length).toBeGreaterThan(0);
    expect(mlArticles.every((a) => a.language === "ml")).toBe(true);

    const hiArticles = await DataService.getArticles("hi");
    expect(hiArticles.length).toBeGreaterThan(0);
    expect(hiArticles.every((a) => a.language === "hi")).toBe(true);

    const enArticles = await DataService.getArticles("en");
    expect(enArticles.length).toBeGreaterThan(0);
    expect(enArticles.every((a) => a.language === "en")).toBe(true);
  });

  it("returns an empty array when a category has no matching articles instead of leaking all articles", async () => {
    // If we filter by an empty category on a language that has no articles in that category
    const result = await DataService.getArticles("upcoming", "te");
    // Should be empty array, NOT all Telugu or Kannada articles
    expect(result.length).toBe(0);
  });
});

