import { describe, expect, it } from "vitest";
import type { ValidatedRawArticle } from "@/lib/ingest/types";
import {
  cleanText,
  kannadaRatio,
  normalizeArticle,
  slugFromUrl,
  stripSiteSuffix,
  trimExcerpt,
} from "@/lib/ingest/normalize";
import { validateRawArticle } from "@/lib/ingest/validate";

describe("normalize", () => {
  it("decodes entities and collapses whitespace", () => {
    expect(cleanText("  ಕಾಂತಾರ &amp; ಯಶ್\n\n ಸುದ್ದಿ  ")).toBe("ಕಾಂತಾರ & ಯಶ್ ಸುದ್ದಿ");
  });

  it("keeps words separated across tags and drops script content", () => {
    expect(cleanText("ಮೊದಲು<br>ನಂತರ")).toBe("ಮೊದಲು ನಂತರ");
    expect(cleanText("ಮೊದಲು<script>alert(1)</script>ನಂತರ")).toBe("ಮೊದಲು ನಂತರ");
  });

  it("strips a known site suffix but keeps a Kannada subtitle", () => {
    expect(stripSiteSuffix("ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ರಿಲೀಸ್ | ಫಿಲ್ಮಿಬೀಟ್", ["ಫಿಲ್ಮಿಬೀಟ್"])).toBe(
      "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ರಿಲೀಸ್",
    );
    expect(stripSiteSuffix("ಕಾಂತಾರ - ಭಾಗ 1", ["ಫಿಲ್ಮಿಬೀಟ್"])).toBe("ಕಾಂತಾರ - ಭಾಗ 1");
  });

  it("cuts an excerpt at a sentence boundary and appends an ellipsis", () => {
    const text = `${"ಕನ್ನಡ ಸಿನಿಮಾ ಸುದ್ದಿ. ".repeat(20)}`;
    const excerpt = trimExcerpt(text, 120);
    expect(excerpt.length).toBeLessThanOrEqual(120);
    expect(excerpt.endsWith("…")).toBe(true);
  });

  it("measures the Kannada character ratio", () => {
    expect(kannadaRatio("ಕನ್ನಡ ಸಿನಿಮಾ")).toBeGreaterThan(0.9);
    expect(kannadaRatio("Kannada cinema")).toBe(0);
  });

  it("builds an ASCII slug and falls back to a hash for Kannada-only URLs", () => {
    expect(slugFromUrl("https://example.com/news/kantara-chapter-1.html")).toBe("kantara-chapter-1");
    expect(slugFromUrl("https://example.com/news/ಕಾಂತಾರ")).toMatch(/^news-[0-9a-f]{8}$/);
  });

  it("does not throw on malformed percent-encoding in the last segment", () => {
    expect(slugFromUrl("https://example.com/news/%E0%A4%A")).toBe("e0-a4-a");
  });
});

const raw: ValidatedRawArticle = {
  sourceId: "filmibeat",
  sourceName: "ಫಿಲ್ಮಿಬೀಟ್ ಕನ್ನಡ",
  sourceUrl: "https://kannada.filmibeat.com/news/kantara-123.html",
  title: "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭ",
  excerpt: "ಕನ್ನಡ ಸಿನಿಮಾ: ಕುಂದಾಪುರದಲ್ಲಿ ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭವಾಗಿದ್ದು ಅಭಿಮಾನಿಗಳಲ್ಲಿ ಭಾರೀ ಕುತೂಹಲ ಮೂಡಿಸಿದೆ.",
  imageUrl: "https://images.filmibeat.com/kantara.jpg",
  publishedAt: "2026-10-31T08:30:00.000Z",
};

describe("normalizeArticle", () => {
  it("marks a real source timestamp as exact", () => {
    const article = normalizeArticle(raw, {
      category: "sandalwood",
      fetchedAt: "2026-10-31T09:00:00Z",
      takenSlugs: new Set(),
    });
    expect(article.publishedAtEstimated).toBe(false);
    expect(article.publishedAt).toBe("2026-10-31T08:30:00.000Z");
    expect(article.fetchedAt).toBe("2026-10-31T09:00:00.000Z");
    expect(article.slug).toBe("kantara-123");
    expect(article.tags.length).toBeGreaterThan(0);
  });

  it("canonicalizes RFC-2822 source dates", () => {
    const article = normalizeArticle(
      { ...raw, publishedAt: "Sat, 31 Oct 2026 08:30:00 GMT" },
      { category: "sandalwood", fetchedAt: "2026-10-31T09:00:00Z", takenSlugs: new Set() },
    );
    expect(article.publishedAt).toBe("2026-10-31T08:30:00.000Z");
    expect(article.publishedAtEstimated).toBe(false);
  });

  it("uses the fetch time and labels it estimated when the source has no date", () => {
    const fromNull = normalizeArticle(
      { ...raw, publishedAt: null },
      { category: "sandalwood", fetchedAt: "2026-10-31T09:00:00Z", takenSlugs: new Set() },
    );
    expect(fromNull.publishedAtEstimated).toBe(true);
    expect(fromNull.publishedAt).toBe("2026-10-31T09:00:00.000Z");

    const fromEmpty = normalizeArticle(
      { ...raw, publishedAt: "" },
      { category: "sandalwood", fetchedAt: "2026-10-31T09:00:00Z", takenSlugs: new Set() },
    );
    expect(fromEmpty.publishedAtEstimated).toBe(true);
    expect(fromEmpty.publishedAt).toBe("2026-10-31T09:00:00.000Z");
  });

  it("escalates the slug suffix until it is free", () => {
    const takenSlugs = new Set<string>();
    const first = normalizeArticle(raw, {
      category: "sandalwood",
      fetchedAt: "2026-10-31T09:00:00Z",
      takenSlugs,
    });
    const second = normalizeArticle(raw, {
      category: "sandalwood",
      fetchedAt: "2026-10-31T09:00:00Z",
      takenSlugs,
    });
    const third = normalizeArticle(raw, {
      category: "sandalwood",
      fetchedAt: "2026-10-31T09:00:00Z",
      takenSlugs,
    });
    expect(first.slug).toBe("kantara-123");
    expect(second.slug).toMatch(/^kantara-123-[0-9a-f]{6}$/);
    expect(third.slug).toBe(`${second.slug}-2`);
    expect(takenSlugs.size).toBe(3);
  });
});

describe("validateRawArticle", () => {
  it("accepts a complete article", () => {
    expect(validateRawArticle(raw, ["filmibeat.com"]).ok).toBe(true);
  });

  it("returns the parsed ISO timestamp", () => {
    const result = validateRawArticle(raw, ["filmibeat.com"]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.article.publishedAt).toBe("2026-10-31T08:30:00.000Z");
    expect(result.article.imageUrl).toBe(raw.imageUrl);
  });

  it("rejects short titles, short excerpts, missing images, and foreign hosts", () => {
    expect(validateRawArticle({ ...raw, title: "ಸುದ್ದಿ" }, ["filmibeat.com"]).ok).toBe(false);
    expect(validateRawArticle({ ...raw, excerpt: "ಸಣ್ಣ" }, ["filmibeat.com"]).ok).toBe(false);
    expect(validateRawArticle({ ...raw, imageUrl: null }, ["filmibeat.com"]).ok).toBe(false);
    expect(validateRawArticle({ ...raw, sourceUrl: "https://evil.example/a" }, ["filmibeat.com"]).ok).toBe(false);
  });

  it("enforces the Kannada preview gate", () => {
    expect(validateRawArticle({ ...raw, excerpt: "A long enough English excerpt about cinema releases worldwide." }, ["filmibeat.com"]).ok).toBe(false);
  });
});
