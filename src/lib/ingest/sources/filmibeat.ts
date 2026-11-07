import { load } from "cheerio";
import type { SourceAdapter } from "../types";
import { collectLinks, endsWithNumericId, isNonArticlePath, readArticle } from "./helpers";

const HOSTS = ["kannada.filmibeat.com"];
const LISTING = "https://kannada.filmibeat.com/";
const NAME = "ಫಿಲ್ಮಿಬೀಟ್ ಕನ್ನಡ";

export const filmibeatAdapter: SourceAdapter = {
  id: "filmibeat",
  name: NAME,
  homepage: "https://kannada.filmibeat.com",
  listingUrls: [LISTING],
  allowedHosts: HOSTS,
  defaultCategory: "sandalwood",
  extractLinks(html: string, baseUrl: string): string[] {
    const $ = load(html);
    return collectLinks(
      $,
      'a[href*="/news/"]',
      baseUrl,
      HOSTS,
      (url) =>
        url.pathname.startsWith("/news/") &&
        endsWithNumericId(url.pathname, ".html") &&
        !isNonArticlePath(url.pathname),
    );
  },
  parseArticle(html: string, url: string) {
    return readArticle(load(html), url, {
      sourceId: "filmibeat",
      sourceName: NAME,
      siteNames: ["ಫಿಲ್ಮಿಬೀಟ್", "Filmibeat"],
      allowedHosts: HOSTS,
    });
  },
};
