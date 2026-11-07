import { load } from "cheerio";
import type { SourceAdapter } from "../types";
import { collectLinks, endsWithNumericId, isNonArticlePath, readArticle } from "./helpers";

const HOSTS = ["kannada.news18.com"];
const LISTING = "https://kannada.news18.com/entertainment/";
const NAME = "ನ್ಯೂಸ್18 ಕನ್ನಡ";

export const news18Adapter: SourceAdapter = {
  id: "news18",
  name: NAME,
  homepage: "https://kannada.news18.com",
  listingUrls: [LISTING],
  allowedHosts: HOSTS,
  defaultCategory: "sandalwood",
  extractLinks(html: string, baseUrl: string): string[] {
    const $ = load(html);
    return collectLinks(
      $,
      'a[href*="/news/entertainment/"]',
      baseUrl,
      HOSTS,
      (url) =>
        url.pathname.startsWith("/news/entertainment/") &&
        endsWithNumericId(url.pathname, ".html") &&
        !isNonArticlePath(url.pathname),
    );
  },
  parseArticle(html: string, url: string) {
    return readArticle(load(html), url, {
      sourceId: "news18",
      sourceName: NAME,
      siteNames: ["ನ್ಯೂಸ್18 ಕನ್ನಡ", "News18 Kannada", "News18"],
      allowedHosts: HOSTS,
    });
  },
};
