import { describe, it, expect } from "vitest";
import {
  RAMAYANA_REVIEWS_BY_LANGUAGE,
  RAMAYANA_ENGLISH_REVIEW,
  RAMAYANA_POSTER_IMAGE,
  getRamayanaMovieReview,
  ALL_RAMAYANA_REVIEWS,
} from "@/data/ramayanaReviewData";
import { DataService } from "@/lib/dataService";
import { LanguageCode } from "@/types";

describe("Ramayana Part 1 – Magnum Opus Review (English-only edition)", () => {
  it("provides one canonical English review record", () => {
    const rev = RAMAYANA_ENGLISH_REVIEW;
    expect(rev.language).toBe("en");
    expect(rev.movieTitle).toBeTruthy();
    expect(rev.headline).toBeTruthy();
    expect(rev.summary).toBeTruthy();
    expect(rev.fullReviewText).toBeTruthy();
    expect(rev.characterHighlights.length).toBeGreaterThanOrEqual(4);
    expect(rev.closingLine).toContain("NO RATINGS, ONLY RESPECT!");
  });

  it("resolves every legacy language key to the same English review", () => {
    const legacyKeys: LanguageCode[] = ["kn", "te", "ta", "ml", "hi", "en", "bn", "pa", "other"];
    for (const key of legacyKeys) {
      const rev = RAMAYANA_REVIEWS_BY_LANGUAGE[key];
      expect(rev).toBeDefined();
      expect(rev).toBe(RAMAYANA_ENGLISH_REVIEW);
    }
  });

  it("references the official front-page artwork path", () => {
    expect(RAMAYANA_POSTER_IMAGE).toBe("/images/ramayana-part-1.jpg");
  });

  it("spotlights Yash as Ravana in English", () => {
    const rev = RAMAYANA_ENGLISH_REVIEW;
    const hasYash = rev.characterHighlights.some(
      (c) =>
        c.actor.toLowerCase().includes("yash") ||
        c.character.toLowerCase().includes("ravan")
    );
    expect(hasYash).toBe(true);
    expect(rev.fullReviewText).toContain("YASH AS RAVANA");
  });

  it("spotlights Ranbir Kapoor as Rama and Sai Pallavi as Sita in English", () => {
    const rev = RAMAYANA_ENGLISH_REVIEW;
    const hasRanbir = rev.characterHighlights.some((c) =>
      c.actor.toLowerCase().includes("ranbir")
    );
    const hasSaiPallavi = rev.characterHighlights.some((c) =>
      c.actor.toLowerCase().includes("sai pallavi")
    );
    expect(hasRanbir).toBe(true);
    expect(hasSaiPallavi).toBe(true);
    expect(rev.fullReviewText).toContain("RANBIR KAPOOR AS LORD RAMA");
    expect(rev.fullReviewText).toContain("SAI PALLAVI AS MATA SITA");
  });

  it("keeps the reverence clause strictly verbatim", () => {
    expect(RAMAYANA_ENGLISH_REVIEW.closingLine).toBe(
      "RAMAYANA – OUR CULTURE. OUR HERITAGE. OUR PRIDE. NO RATINGS, ONLY RESPECT!"
    );
    expect(ALL_RAMAYANA_REVIEWS[0].verdict).toContain("NO RATINGS, ONLY RESPECT!");
  });

  it("includes the canonical review in ALL_RAMAYANA_REVIEWS array", () => {
    expect(ALL_RAMAYANA_REVIEWS).toHaveLength(1);
    expect(ALL_RAMAYANA_REVIEWS[0].language).toBe("en");
    expect(ALL_RAMAYANA_REVIEWS[0].slug).toBe("ramayana-part-1-english-review");
  });

  it("builds a rating-free MovieReview with English cast crew", () => {
    const review = getRamayanaMovieReview("kn");
    expect(review.language).toBe("en");
    expect(review.director).toBe("Nitesh Tiwari");
    expect(review.cast.some((c) => c.name === "Rocking Star Yash" && c.role === "Ravana")).toBe(true);
    expect(review.cast.some((c) => c.name === "Ranbir Kapoor" && c.role === "Lord Rama")).toBe(true);
    expect(review.runtime).toBe("3h 10m (Part 1)");
    // Rating is internal only; the verbatim reverence line is the public verdict
    expect(review.verdict).toContain("NO RATINGS, ONLY RESPECT!");
  });

  describe("DataService Resolution", () => {
    it("resolves the Ramayana review via canonical slug alias 'ramayana-part-1'", async () => {
      const rev = await DataService.getReviewBySlug("ramayana-part-1");
      expect(rev).toBeDefined();
      expect(rev?.language).toBe("en");
      expect(rev?.slug).toBe("ramayana-part-1-english-review");
    });

    it("resolves legacy per-language review slugs to the English review", async () => {
      for (const legacy of [
        "ramayana-part-1-kannada-review",
        "ramayana-part-1-telugu-review",
        "ramayana-part-1-tamil-review",
        "ramayana-part-1-hindi-review",
        "ramayana-part-1-malayalam-review",
      ]) {
        const rev = await DataService.getReviewBySlug(legacy);
        expect(rev).toBeDefined();
        expect(rev?.language).toBe("en");
      }

      const revEn = await DataService.getReviewBySlug("ramayana-part-1-english-review");
      expect(revEn).toBeDefined();
      expect(revEn?.movieTitle).toContain("RAMAYANA");
    });
  });
});
