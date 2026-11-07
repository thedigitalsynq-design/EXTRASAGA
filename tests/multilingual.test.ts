import { describe, it, expect } from "vitest";
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  getLanguageConfig,
  isLanguageCode,
  getIndustryForFilmLanguage,
} from "../src/lib/languages";
import { DataService } from "../src/lib/dataService";
import { LanguageCode } from "../src/types";

describe("English-Only Edition with Multi-Industry Content", () => {
  it("ships a single English publication configuration", () => {
    expect(DEFAULT_LANGUAGE).toBe("en");
    expect(SUPPORTED_LANGUAGES).toHaveLength(1);
    expect(SUPPORTED_LANGUAGES[0].code).toBe("en");

    const conf = getLanguageConfig("en");
    expect(conf.name).toBe("English");
    expect(conf.englishName).toBe("English");
    expect(conf.brandNameNative).toBeTruthy();
    expect(conf.industry).toBeTruthy();
    expect(conf.industryName).toBeTruthy();
    expect(conf.badgeColor).toBeTruthy();
    expect(conf.tagline).toBeTruthy();
    expect(conf.headerTagline).toBeTruthy();
    expect(conf.newsSectionTitle).toBeTruthy();
    expect(conf.reviewsSectionTitle).toBeTruthy();
    expect(conf.trailersSectionTitle).toBeTruthy();
    expect(conf.boxOfficeTitle).toBeTruthy();
    expect(conf.ottTitle).toBeTruthy();
    expect(conf.hotTopics.length).toBeGreaterThan(0);
  });

  it("collapses every legacy language code to the English edition", () => {
    for (const legacy of ["kn", "te", "ta", "ml", "hi", "unknown_code"] as const) {
      expect(getLanguageConfig(legacy).code).toBe("en");
      expect(getLanguageConfig(legacy).industry).toBe("hollywood");
    }
  });

  it("should validate language codes before using URL or stored values", () => {
    for (const language of SUPPORTED_LANGUAGES) {
      expect(isLanguageCode(language.code)).toBe(true);
    }

    expect(isLanguageCode(null)).toBe(false);
    expect(isLanguageCode("kn")).toBe(false);
    expect(isLanguageCode("xx")).toBe(false);
  });

  it("keeps the legacy film-language -> industry mapping intact", () => {
    for (const legacy of ["kn", "te", "ta", "ml", "hi"] as const) {
      expect(typeof getIndustryForFilmLanguage(legacy)).toBe("string");
    }
    // Unknown or absent film languages resolve to undefined (a data-fact
    // lookup, not an edition switcher).
    expect(getIndustryForFilmLanguage(undefined)).toBeUndefined();
    expect(getIndustryForFilmLanguage("kn")).toBe("sandalwood");
    expect(getIndustryForFilmLanguage("te")).toBe("tollywood");
  });

  it("should fetch English edition articles across every industry", async () => {
    const articles = await DataService.getArticles();
    expect(articles.length).toBeGreaterThan(0);
    expect(articles.every((a) => a.language === "en")).toBe(true);
    // Six-industry agenda: every industry keeps at least one story
    const industries = new Set(articles.map((a) => a.industry));
    for (const industry of ["sandalwood", "tollywood", "kollywood", "mollywood", "bollywood", "hollywood"]) {
      expect(industries.has(industry as never)).toBe(true);
    }
  });

  it("should fetch English edition reviews and box office", async () => {
    const reviews = await DataService.getReviews("en");
    expect(reviews.length).toBeGreaterThan(0);
    expect(reviews.every((r) => r.language === "en")).toBe(true);

    const boxOffice = await DataService.getBoxOffice("en");
    expect(boxOffice.length).toBeGreaterThan(0);

    const videos = await DataService.getVideos("en");
    expect(videos.length).toBeGreaterThan(0);

    const ott = await DataService.getOttReleases("en");
    expect(ott.length).toBeGreaterThan(0);
  });

  it("should fetch English edition celebrity photo galleries", async () => {
    const galleries = await DataService.getGalleries("en");
    expect(galleries.length).toBeGreaterThan(0);
    expect(galleries.every((g) => g.language === "en")).toBe(true);
  });

  it("should provide English breaking news and trending items", async () => {
    const breaking = await DataService.getBreakingNews("en");
    expect(breaking.length).toBeGreaterThan(0);
    expect(breaking[0].language).toBe("en");

    const trending = await DataService.getTrendingArticles(5, "en");
    expect(trending.length).toBeGreaterThan(0);
    expect(trending[0].language).toBe("en");
  });

  it("should provide the 12 navigation category labels in English", async () => {
    const { MAIN_NAV_ITEMS } = await import("../src/lib/categories");
    const { getLocalizedCategoryName } = await import("../src/lib/translations");

    MAIN_NAV_ITEMS.forEach((item) => {
      const localized = getLocalizedCategoryName(item.slug, "en");
      expect(localized).toBeTruthy();
      expect(typeof localized).toBe("string");
      expect(/[\u0C80-\u0CFF\u0900-\u097F]/.test(localized)).toBe(false);
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

  it("resolves seeded categories to English names", async () => {
    const { categoryName } = await import("../src/lib/categories");
    for (const slug of ["sandalwood", "bollywood", "hollywood", "gossip", "gallery", "box-office"]) {
      const name = categoryName(slug);
      expect(name).toBeTruthy();
      expect(/[\u0C80-\u0CFF\u0900-\u097F]/.test(name)).toBe(false);
    }
    expect(categoryName("sandalwood")).toBe("Sandalwood");
  });
});
