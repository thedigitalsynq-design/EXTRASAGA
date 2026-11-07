import { describe, expect, it } from "vitest";
import { findMergeCandidate, jaccardSimilarity, titleTokens } from "@/lib/ingest/dedupe";

const candidates = [
  {
    id: "a",
    title: "ಯಶ್ ಟಾಕ್ಸಿಕ್ ಚಿತ್ರದ ಶೂಟಿಂಗ್ ಆರಂಭ",
    sourceUrl: "https://a.example/1",
    publishedAt: "2026-10-31T08:00:00Z",
    publishedAtEstimated: false,
    coverageCount: 1,
  },
  {
    id: "b",
    title: "ರುಕ್ಮಿಣಿ ವಸಂತ್ ಹೊಸ ಫೋಟೋಶೂಟ್ ವೈರಲ್",
    sourceUrl: "https://b.example/2",
    publishedAt: "2026-10-31T07:00:00Z",
    publishedAtEstimated: false,
    coverageCount: 1,
  },
];

describe("dedupe", () => {
  it("ignores English stopwords", () => {
    expect(titleTokens("The Kannada cinema and the box office")).toEqual(
      new Set(["kannada", "cinema", "box", "office"]),
    );
  });

  it("keeps whole Kannada words intact", () => {
    expect(titleTokens("ಯಶ್ ಟಾಕ್ಸಿಕ್ ಚಿತ್ರದ ಶೂಟಿಂಗ್ ಆರಂಭ")).toEqual(
      new Set(["ಯಶ್", "ಟಾಕ್ಸಿಕ್", "ಚಿತ್ರದ", "ಶೂಟಿಂಗ್", "ಆರಂಭ"]),
    );
  });

  it("treats zero-width joiners as part of the same word", () => {
    const joined = new Set(["ನೆಟ್ಫ್ಲಿಕ್ಸ್"]);
    expect(titleTokens("ನೆಟ್ಫ್ಲಿಕ್ಸ್")).toEqual(joined);
    expect(titleTokens("ನೆಟ್‌ಫ್ಲಿಕ್ಸ್")).toEqual(joined);
    expect(titleTokens("ನೆಟ್‍ಫ್ಲಿಕ್ಸ್")).toEqual(joined);
  });

  it("matches canonically equivalent spellings", () => {
    expect(titleTokens("ಕೊ")).toEqual(titleTokens("ಕೊ".normalize("NFD")));
  });

  it("scores identical token sets as 1 and disjoint sets as 0", () => {
    expect(jaccardSimilarity(new Set(["a", "b"]), new Set(["a", "b"]))).toBe(1);
    expect(jaccardSimilarity(new Set(["a"]), new Set(["b"]))).toBe(0);
  });

  it("merges a near-identical headline", () => {
    const match = findMergeCandidate("ಯಶ್ ಟಾಕ್ಸಿಕ್ ಚಿತ್ರ ಶೂಟಿಂಗ್ ಆರಂಭ", candidates);
    expect(match?.id).toBe("a");
  });

  it("rejects an unrelated headline", () => {
    expect(findMergeCandidate("ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ರಿಲೀಸ್ ಡೇಟ್", candidates)).toBeNull();
  });
});
