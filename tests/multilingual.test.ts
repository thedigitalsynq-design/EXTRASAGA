import { describe, it, expect } from "vitest";
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  getLanguageConfig,
  isLanguageCode,
} from "../src/lib/languages";
import { DataService } from "../src/lib/dataService";
import { LanguageCode } from "../src/types";

describe("Multi-Language and Multi-Industry System", () => {
  it("should support all 6 required languages and industries", () => {
    const requiredCodes: LanguageCode[] = ["kn", "te", "ta", "ml", "hi", "en"];
    const foundCodes = SUPPORTED_LANGUAGES.map((l) => l.code);

    requiredCodes.forEach((code) => {
      expect(foundCodes).toContain(code);
    });

    expect(SUPPORTED_LANGUAGES).toHaveLength(6);
  });

  it("should have complete industry configurations for each language", () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      expect(lang.code).toBeTruthy();
      expect(lang.name).toBeTruthy();
      expect(lang.englishName).toBeTruthy();
      expect(lang.brandNameNative).toBeTruthy();
      expect(lang.industry).toBeTruthy();
      expect(lang.industryName).toBeTruthy();
      expect(lang.industryNameNative).toBeTruthy();
      expect(lang.badgeColor).toBeTruthy();
      expect(lang.flagEmoji).toBeTruthy();
      expect(lang.tagline).toBeTruthy();
      expect(lang.headerTagline).toBeTruthy();
      expect(lang.newsSectionTitle).toBeTruthy();
      expect(lang.reviewsSectionTitle).toBeTruthy();
      expect(lang.trailersSectionTitle).toBeTruthy();
      expect(lang.boxOfficeTitle).toBeTruthy();
      expect(lang.ottTitle).toBeTruthy();
      expect(lang.hotTopics.length).toBeGreaterThan(0);
    });

    // Test specific native EXTRASAGA brand names (AFTER-DARK era)
    const kn = getLanguageConfig("kn");
    expect(kn.brandNameNative).toBe("ಎಕ್ಸ್ಟ್ರಾಸಾಗ");
    expect(kn.headerTagline).toContain("ಸ್ಯಾಂಡಲ್ವುಡ್");

    const ta = getLanguageConfig("ta");
    expect(ta.brandNameNative).toBe("எக்ஸ்ட்ராசாக");
    expect(ta.headerTagline).toContain("கோலிவுட்");
    // Ensure Tamil header tagline has NO Kannada characters
    expect(/[\u0C80-\u0CFF]/.test(ta.headerTagline)).toBe(false);
    expect(/[\u0C80-\u0CFF]/.test(ta.brandNameNative)).toBe(false);

    const te = getLanguageConfig("te");
    expect(te.brandNameNative).toBe("ఎక్స్ట్రాసాగా");
    expect(/[\u0C80-\u0CFF]/.test(te.headerTagline)).toBe(false);

    const hi = getLanguageConfig("hi");
    expect(hi.brandNameNative).toBe("एक्स्ट्रासागा");
    expect(/[\u0C80-\u0CFF]/.test(hi.headerTagline)).toBe(false);
  });

  it("should default to Kannada (kn) / Sandalwood", () => {
    expect(DEFAULT_LANGUAGE).toBe("kn");
    const defaultConf = getLanguageConfig("kn");
    expect(defaultConf.industry).toBe("sandalwood");
    expect(defaultConf.name).toBe("ಕನ್ನಡ");
  });

  it("should validate language codes before using URL or stored values", () => {
    for (const language of SUPPORTED_LANGUAGES) {
      expect(isLanguageCode(language.code)).toBe(true);
    }

    expect(isLanguageCode(null)).toBe(false);
    expect(isLanguageCode("xx")).toBe(false);
  });

  it("should fallback safely to Kannada for invalid or unknown language code", () => {
    const fallback = getLanguageConfig("unknown_code");
    expect(fallback.code).toBe("kn");
    expect(fallback.industry).toBe("sandalwood");
  });

  it("should fetch Telugu / Tollywood articles and content", async () => {
    const articles = await DataService.getArticles("te");
    expect(articles.length).toBeGreaterThan(0);
    expect(articles.every((a) => a.language === "te")).toBe(true);

    const reviews = await DataService.getReviews("te");
    expect(reviews.length).toBeGreaterThan(0);
    expect(reviews.every((r) => r.language === "te")).toBe(true);

    const boxOffice = await DataService.getBoxOffice("te");
    expect(boxOffice.length).toBeGreaterThan(0);
    expect(boxOffice.every((b) => b.language === "te")).toBe(true);

    const videos = await DataService.getVideos("te");
    expect(videos.length).toBeGreaterThan(0);
    expect(videos.every((v) => v.language === "te")).toBe(true);

    const ott = await DataService.getOttReleases("te");
    expect(ott.length).toBeGreaterThan(0);
    expect(ott.every((o) => o.language === "te")).toBe(true);
  });

  it("should fetch Tamil / Kollywood articles and content", async () => {
    const articles = await DataService.getArticles("ta");
    expect(articles.length).toBeGreaterThan(0);
    expect(articles.every((a) => a.language === "ta")).toBe(true);

    const reviews = await DataService.getReviews("ta");
    expect(reviews.length).toBeGreaterThan(0);
    expect(reviews.every((r) => r.language === "ta")).toBe(true);

    const boxOffice = await DataService.getBoxOffice("ta");
    expect(boxOffice.length).toBeGreaterThan(0);
    expect(boxOffice.every((b) => b.language === "ta")).toBe(true);
  });

  it("should fetch Malayalam / Mollywood articles and content", async () => {
    const articles = await DataService.getArticles("ml");
    expect(articles.length).toBeGreaterThan(0);
    expect(articles.every((a) => a.language === "ml")).toBe(true);

    const boxOffice = await DataService.getBoxOffice("ml");
    expect(boxOffice.length).toBeGreaterThan(0);
    expect(boxOffice.every((b) => b.language === "ml")).toBe(true);
  });

  it("should fetch Hindi / Bollywood articles and content", async () => {
    const articles = await DataService.getArticles("hi");
    expect(articles.length).toBeGreaterThan(0);
    expect(articles.every((a) => a.language === "hi")).toBe(true);

    const boxOffice = await DataService.getBoxOffice("hi");
    expect(boxOffice.length).toBeGreaterThan(0);
    expect(boxOffice.every((b) => b.language === "hi")).toBe(true);
  });

  it("should fetch English / Hollywood articles and content", async () => {
    const articles = await DataService.getArticles("en");
    expect(articles.length).toBeGreaterThan(0);
    expect(articles.every((a) => a.language === "en")).toBe(true);

    const boxOffice = await DataService.getBoxOffice("en");
    expect(boxOffice.length).toBeGreaterThan(0);
    expect(boxOffice.every((b) => b.language === "en")).toBe(true);
  });

  it("should fetch language-specific celebrity photo galleries", async () => {
    const teGalleries = await DataService.getGalleries("te");
    expect(teGalleries.length).toBeGreaterThan(0);
    expect(teGalleries.every((g) => g.language === "te")).toBe(true);

    const taGalleries = await DataService.getGalleries("ta");
    expect(taGalleries.length).toBeGreaterThan(0);
    expect(taGalleries.every((g) => g.language === "ta")).toBe(true);

    const hiGalleries = await DataService.getGalleries("hi");
    expect(hiGalleries.length).toBeGreaterThan(0);
    expect(hiGalleries.every((g) => g.language === "hi")).toBe(true);
  });

  it("should provide language-specific breaking news and trending items", async () => {
    const teBreaking = await DataService.getBreakingNews("te");
    expect(teBreaking.length).toBeGreaterThan(0);
    expect(teBreaking[0].language).toBe("te");

    const hiTrending = await DataService.getTrendingArticles(5, "hi");
    expect(hiTrending.length).toBeGreaterThan(0);
    expect(hiTrending[0].language).toBe("hi");
  });

  it("should provide localized category labels for all 12 navigation items in all 6 languages", async () => {
    const { MAIN_NAV_ITEMS } = await import("../src/lib/categories");
    const { getLocalizedCategoryName } = await import("../src/lib/translations");
    const langCodes: LanguageCode[] = ["kn", "te", "ta", "ml", "hi", "en"];

    langCodes.forEach((lang) => {
      MAIN_NAV_ITEMS.forEach((item) => {
        const localized = getLocalizedCategoryName(item.slug, lang);
        expect(localized).toBeTruthy();
        expect(typeof localized).toBe("string");
      });
    });

    // Verify English matches exact user specification
    expect(getLocalizedCategoryName("trending", "en")).toBe("Trending Today");
    expect(getLocalizedCategoryName("mukhaputa", "en")).toBe("Home");
    expect(getLocalizedCategoryName("latest", "en")).toBe("News");
    expect(getLocalizedCategoryName("reviews", "en")).toBe("Reviews");
    expect(getLocalizedCategoryName("television", "en")).toBe("Television");
    expect(getLocalizedCategoryName("celebrity", "en")).toBe("Celebrity");
    expect(getLocalizedCategoryName("movies", "en")).toBe("Movies");
    expect(getLocalizedCategoryName("interviews", "en")).toBe("Interviews");
    expect(getLocalizedCategoryName("gossip", "en")).toBe("Gossips");
    expect(getLocalizedCategoryName("gallery", "en")).toBe("Photos");
    expect(getLocalizedCategoryName("videos", "en")).toBe("Videos");
    expect(getLocalizedCategoryName("events", "en")).toBe("Events");
  });
});
