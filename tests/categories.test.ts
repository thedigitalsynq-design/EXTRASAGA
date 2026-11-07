import { describe, expect, it } from "vitest";
import { CATEGORIES, MAIN_NAV_ITEMS, categoryHref, categoryName } from "@/lib/categories";

describe("categories", () => {
  it("contains all category slugs exactly once", () => {
    expect(CATEGORIES).toHaveLength(20);
    expect(new Set(CATEGORIES.map((category) => category.slug)).size).toBe(20);
  });

  it("contains all 12 main navigation bar items matching exact order", () => {
    expect(MAIN_NAV_ITEMS).toHaveLength(12);
    expect(MAIN_NAV_ITEMS[0].englishLabel).toBe("Trending Today");
    expect(MAIN_NAV_ITEMS[0].isButton).toBe(true);
    expect(MAIN_NAV_ITEMS[1].englishLabel).toBe("Home");
    expect(MAIN_NAV_ITEMS[2].englishLabel).toBe("News");
    expect(MAIN_NAV_ITEMS[3].englishLabel).toBe("Reviews");
    expect(MAIN_NAV_ITEMS[4].englishLabel).toBe("Television");
    expect(MAIN_NAV_ITEMS[5].englishLabel).toBe("Celebrity");
    expect(MAIN_NAV_ITEMS[6].englishLabel).toBe("Movies");
    expect(MAIN_NAV_ITEMS[7].englishLabel).toBe("Interviews");
    expect(MAIN_NAV_ITEMS[8].englishLabel).toBe("Gossips");
    expect(MAIN_NAV_ITEMS[9].englishLabel).toBe("Photos");
    expect(MAIN_NAV_ITEMS[10].englishLabel).toBe("Videos");
    expect(MAIN_NAV_ITEMS[11].englishLabel).toBe("Events");
  });

  it("returns the English name for a known slug and falls back safely", () => {
    expect(categoryName("sandalwood")).toBe("Sandalwood");
    expect(categoryName("does-not-exist")).toBe("News");
  });

  it("builds the home link for mukhaputa and category links for everything else", () => {
    expect(categoryHref("mukhaputa")).toBe("/");
    expect(categoryHref("movies")).toBe("/movies");
    expect(categoryHref("ott")).toBe("/category/ott");
  });
});
