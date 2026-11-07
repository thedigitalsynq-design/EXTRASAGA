import { describe, it, expect } from "vitest";
import {
  RAMAYANA_REVIEWS_BY_LANGUAGE,
  RAMAYANA_POSTER_IMAGE,
  getRamayanaMovieReview,
  ALL_RAMAYANA_REVIEWS,
} from "@/data/ramayanaReviewData";
import { DataService } from "@/lib/dataService";
import { LanguageCode } from "@/types";

describe("Ramayana Part 1 – Multilingual Magnum Opus Review", () => {
  const supportedLanguages: LanguageCode[] = ["kn", "te", "ta", "hi", "ml", "en"];

  it("provides comprehensive review data for all 6 cinema languages", () => {
    for (const lang of supportedLanguages) {
      const rev = RAMAYANA_REVIEWS_BY_LANGUAGE[lang];
      expect(rev).toBeDefined();
      expect(rev.language).toBe(lang);
      expect(rev.movieTitle).toBeTruthy();
      expect(rev.headline).toBeTruthy();
      expect(rev.summary).toBeTruthy();
      expect(rev.fullReviewText).toBeTruthy();
      expect(rev.characterHighlights.length).toBeGreaterThanOrEqual(4);
      expect(rev.closingLine).toContain("NO RATINGS, ONLY RESPECT!");
    }
  });

  it("references the official front-page artwork path", () => {
    expect(RAMAYANA_POSTER_IMAGE).toBe("/images/ramayana-part-1.jpg");
  });

  it("accurately spotlights Yash as Ravana in all 6 language reviews", () => {
    for (const lang of supportedLanguages) {
      const rev = RAMAYANA_REVIEWS_BY_LANGUAGE[lang];
      const hasYash = rev.characterHighlights.some(
        (c) =>
          c.actor.toLowerCase().includes("yash") ||
          c.actor.includes("ಯಶ್") ||
          c.actor.includes("యష్") ||
          c.actor.includes("யஷ்") ||
          c.actor.includes("यश") ||
          c.actor.includes("യഷ്") ||
          c.character.toLowerCase().includes("ravan") ||
          c.character.includes("ರಾವಣ") ||
          c.character.includes("రాయ") ||
          c.character.includes("ராவண") ||
          c.character.includes("रावण") ||
          c.character.includes("രാവണ")
      );
      expect(hasYash).toBe(true);
    }
  });

  it("accurately spotlights Ranbir Kapoor as Rama and Sai Pallavi as Sita", () => {
    for (const lang of supportedLanguages) {
      const rev = RAMAYANA_REVIEWS_BY_LANGUAGE[lang];
      const hasRanbir = rev.characterHighlights.some(
        (c) =>
          c.actor.toLowerCase().includes("ranbir") ||
          c.actor.includes("ರಣಬೀರ್") ||
          c.actor.includes("రణబీర్") ||
          c.actor.includes("ரன்பீர்") ||
          c.actor.includes("रणबीर") ||
          c.actor.includes("രൺബീർ")
      );
      const hasSaiPallavi = rev.characterHighlights.some(
        (c) =>
          c.actor.toLowerCase().includes("sai pallavi") ||
          c.actor.includes("ಸಾಯಿ ಪಲ್ಲವಿ") ||
          c.actor.includes("సాయి పల్లవి") ||
          c.actor.includes("சாய் பல்லவி") ||
          c.actor.includes("साई पल्लवी") ||
          c.actor.includes("സായി പല്ലവി")
      );
      expect(hasRanbir).toBe(true);
      expect(hasSaiPallavi).toBe(true);
    }
  });

  it("includes all 6 reviews in canonical ALL_RAMAYANA_REVIEWS array", () => {
    expect(ALL_RAMAYANA_REVIEWS).toHaveLength(6);
    const languages = ALL_RAMAYANA_REVIEWS.map((r) => r.language);
    expect(languages).toContain("kn");
    expect(languages).toContain("te");
    expect(languages).toContain("ta");
    expect(languages).toContain("hi");
    expect(languages).toContain("ml");
    expect(languages).toContain("en");
  });

  describe("DataService Resolution", () => {
    it("resolves Ramayana review via canonical slug alias 'ramayana-part-1'", async () => {
      const revKn = await DataService.getReviewBySlug("ramayana-part-1", "kn");
      expect(revKn).toBeDefined();
      expect(revKn?.language).toBe("kn");

      const revTe = await DataService.getReviewBySlug("ramayana-part-1", "te");
      expect(revTe).toBeDefined();
      expect(revTe?.language).toBe("te");
    });

    it("resolves language-specific slugs directly", async () => {
      const revTa = await DataService.getReviewBySlug("ramayana-part-1-tamil-review");
      expect(revTa).toBeDefined();
      expect(revTa?.language).toBe("ta");
      expect(revTa?.movieTitle).toContain("ராமாயணம்");

      const revHi = await DataService.getReviewBySlug("ramayana-part-1-hindi-review");
      expect(revHi).toBeDefined();
      expect(revHi?.language).toBe("hi");
      expect(revHi?.movieTitle).toContain("रामायण");
    });
  });
});
