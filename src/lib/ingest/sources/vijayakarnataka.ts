import { load } from "cheerio";
import type { SourceAdapter } from "../types";
import { collectLinks, endsWithNumericId, isNonArticlePath, readArticle } from "./helpers";

const HOSTS = ["vijaykarnataka.com"];
const LISTING = "https://vijaykarnataka.com/entertainment";
const NAME = "ವಿಜಯ ಕರ್ನಾಟಕ";

export const vijayakarnatakaAdapter: SourceAdapter = {
  id: "vijayakarnataka",
  name: NAME,
  homepage: "https://vijaykarnataka.com",
  listingUrls: [LISTING],
  allowedHosts: HOSTS,
  defaultCategory: "latest",
  extractLinks(html: string, baseUrl: string): string[] {
    const $ = load(html);
    return collectLinks(
      $,
      'a[href*="/entertainment/"]',
      baseUrl,
      HOSTS,
      (url) =>
        url.pathname.startsWith("/entertainment/") &&
        url.pathname.includes("/articleshow/") &&
        endsWithNumericId(url.pathname, ".cms") &&
        !isNonArticlePath(url.pathname),
    );
  },
  parseArticle(html: string, url: string) {
    return readArticle(load(html), url, {
      sourceId: "vijayakarnataka",
      sourceName: NAME,
      siteNames: ["ವಿಜಯ ಕರ್ನಾಟಕ", "Vijaya Karnataka"],
      allowedHosts: HOSTS,
    });
  },
};
