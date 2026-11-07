import { describe, it, expect } from "vitest";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getLanguageConfig, ENGLISH_CONFIG } from "../src/lib/languages";

describe("Editorial Design References & Tagline Sanitization (English-only edition)", () => {
  it("ensures the shipped language config has removed promotional 'No.1' claims", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(lang.tagline).not.toContain("No.1");
      expect(lang.tagline.length).toBeGreaterThan(15);
      expect(lang.headerTagline.length).toBeGreaterThan(10);
    }
  });

  it("verifies the site leads with receipts-backed credibility + zero fake tea (press voice)", () => {
    const en = SUPPORTED_LANGUAGES.find((l) => l.code === "en");
    expect(en).toBeDefined();
    expect(en?.tagline).toBe("Receipts-Backed Box Office, Zero-Fake Tea & Strictly Unbiased Verdicts");
  });

  it("ships a single English configuration", () => {
    expect(DEFAULT_LANGUAGE).toBe("en");
    expect(SUPPORTED_LANGUAGES).toHaveLength(1);
    expect(SUPPORTED_LANGUAGES[0]).toBe(ENGLISH_CONFIG);
    // Legacy resolution always collapses to the English edition
    expect(getLanguageConfig("kn")).toBe(ENGLISH_CONFIG);
    expect(getLanguageConfig()).toBe(ENGLISH_CONFIG);
  });

  it("ensures the edition has complete hot topics and titles", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(lang.hotTopics.length).toBeGreaterThanOrEqual(5);
      expect(lang.hotTopics.every((t) => /^[\x00-\xFF]*$/.test(t) && !/[\u0800-\u0CFF\u0900-\u097F]/.test(t))).toBe(true);
      expect(lang.newsSectionTitle).toBeTruthy();
      expect(lang.reviewsSectionTitle).toBeTruthy();
      expect(lang.boxOfficeTitle).toBeTruthy();
    }
  });
});
