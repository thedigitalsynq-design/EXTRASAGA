import { describe, expect, it } from "vitest";
import { extractTags, inferCategory } from "@/lib/ingest/categorize";

describe("inferCategory", () => {
  const cases: Array<[string, string]> = [
    ["ಚಿತ್ರದ ಬಾಕ್ಸ್ ಆಫೀಸ್ ಗಳಿಕೆ 100 ಕೋಟಿ", "box-office"],
    ["ಹೊಸ ಸಿನಿಮಾ ನೆಟ್‌ಫ್ಲಿಕ್ಸ್‌ನಲ್ಲಿ ಸ್ಟ್ರೀಮಿಂಗ್", "ott"],
    ["ಸಿನಿಮಾ ವಿಮರ್ಶೆ: ಉತ್ತಮ ಕಥೆ", "reviews"],
    ["ನಟಿ ರುಕ್ಮಿಣಿ ವಸಂತ್ ಹೊಸ ಲುಕ್", "actresses"],
    ["ನಟ ಯಶ್ ಹೊಸ ಸಿನಿಮಾ", "actors"],
    ["ಟೀಸರ್ ಬಿಡುಗಡೆಯಾದ ದಿನಾಂಕ", "upcoming"],
    ["Kannada cinema box office collection", "box-office"],
  ];

  it.each(cases)("maps %s to %s", (title, expected) => {
    expect(inferCategory({ title, excerpt: "" }, "latest")).toBe(expected);
  });

  it("falls back when nothing matches", () => {
    expect(inferCategory({ title: "ಸಾಮಾನ್ಯ ಸುದ್ದಿ ವರದಿ", excerpt: "" }, "sandalwood")).toBe(
      "sandalwood",
    );
  });

  it("does not let generic money words override a review", () => {
    expect(inferCategory({ title: "ಸಿನಿಮಾ ವಿಮರ್ಶೆ: 100 ಕೋಟಿ ಗಳಿಕೆ", excerpt: "" }, "latest")).toBe("reviews");
  });

  it("ignores keyword substrings inside longer words", () => {
    expect(inferCategory({ title: "boycott call for the kannada film", excerpt: "" }, "sandalwood")).toBe("sandalwood");
    expect(inferCategory({ title: "ಯಶಸ್ವಿ ನಟನೆಯ ಪ್ರಯಾಣ", excerpt: "" }, "latest")).toBe("latest");
  });

  it("matches common Kannada inflections", () => {
    expect(inferCategory({ title: "ನಟರು ಸಿನಿಮಾದಲ್ಲಿ ನಟಿಸಿದ್ದಾರೆ", excerpt: "" }, "latest")).toBe("actors");
    expect(inferCategory({ title: "ಚಿತ್ರದ ವಿಮರ್ಶೆಗಳು ಮತ್ತು ರೇಟಿಂಗ್", excerpt: "" }, "latest")).toBe("reviews");
  });

  it("needs at least two generic money words to infer box-office", () => {
    expect(inferCategory({ title: "ಚಿತ್ರದ ಗಳಿಕೆ 100 ಕೋಟಿ", excerpt: "" }, "latest")).toBe("box-office");
    expect(inferCategory({ title: "ಚಿತ್ರದ ಗಳಿಕೆ ವರದಿ", excerpt: "" }, "latest")).toBe("latest");
  });
});

describe("extractTags", () => {
  it("returns at most four matched keywords without duplicates", () => {
    const tags = extractTags("ಟ್ರೇಲರ್ ಮತ್ತು ಟೀಸರ್ ಹಾಗೂ ವಿಮರ್ಶೆ ಮತ್ತು ರೇಟಿಂಗ್");
    expect(tags.length).toBeLessThanOrEqual(4);
    expect(new Set(tags).size).toBe(tags.length);
    expect(tags).toEqual(["ವಿಮರ್ಶೆ", "ರೇಟಿಂಗ್", "ಟೀಸರ್", "ಟ್ರೇಲರ್"]);
  });
});
