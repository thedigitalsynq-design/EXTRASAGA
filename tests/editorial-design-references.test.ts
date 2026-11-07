import { describe, it, expect } from "vitest";
import { SUPPORTED_LANGUAGES } from "../src/lib/languages";

describe("Editorial Design References & Tagline Sanitization", () => {
  it("ensures all supported languages have removed promotional 'No.1' claims", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(lang.tagline).not.toContain("ನಂ.1");
      expect(lang.tagline).not.toContain("No.1");
      expect(lang.tagline.length).toBeGreaterThan(15);
      expect(lang.headerTagline.length).toBeGreaterThan(10);
    }
  });

  it("verifies Kannada has independent editorial analysis tagline", () => {
    const kn = SUPPORTED_LANGUAGES.find((l) => l.code === "kn");
    expect(kn).toBeDefined();
    expect(kn?.tagline).toBe("ನಿಖರ ಸಿನಿಮಾ ವಿಶ್ಲೇಷಣೆ, ನಿಷ್ಪಕ್ಷಪಾತ ವಿಮರ್ಶೆಗಳು & ನೇರ ಬಾಕ್ಸ್ ಆಫೀಸ್ ಇಂಟೆಲಿಜೆನ್ಸ್");
  });

  it("verifies English has high-prestige editorial tagline", () => {
    const en = SUPPORTED_LANGUAGES.find((l) => l.code === "en");
    expect(en).toBeDefined();
    expect(en?.tagline).toBe("Independent Film Journalism, Data-Driven Box Office & Unbiased Reviews");
  });

  it("ensures all 6 language codes have complete hot topics and titles", () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(6);
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(lang.hotTopics.length).toBeGreaterThanOrEqual(5);
      expect(lang.newsSectionTitle).toBeTruthy();
      expect(lang.reviewsSectionTitle).toBeTruthy();
      expect(lang.boxOfficeTitle).toBeTruthy();
    }
  });
});

