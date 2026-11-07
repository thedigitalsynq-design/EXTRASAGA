import { readFileSync } from "node:fs";
import path from "node:path";
import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { filmibeatAdapter } from "@/lib/ingest/sources/filmibeat";
import { news18Adapter } from "@/lib/ingest/sources/news18";
import { vijayakarnatakaAdapter } from "@/lib/ingest/sources/vijayakarnataka";
import { SOURCE_ADAPTERS } from "@/lib/ingest/sources";
import {
  bestExcerpt,
  canonicalUrl,
  jsonLdDate,
  timeElementDate,
} from "@/lib/ingest/sources/helpers";

function fixture(name: string): string {
  return readFileSync(path.join(process.cwd(), "tests/fixtures", name), "utf8");
}

const cases = [
  {
    adapter: filmibeatAdapter,
    listing: "filmibeat-listing.html",
    article: "filmibeat-article.html",
    articleUrl: "https://kannada.filmibeat.com/news/kantara-chapter-1-shooting-123.html",
    title: "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭ",
    image: "https://images.filmibeat.com/kantara.jpg",
    sourceUrl: "https://kannada.filmibeat.com/news/kantara-chapter-1-shooting-123.html",
    publishedAt: "2026-10-31T08:30:00Z",
    links: [
      "https://kannada.filmibeat.com/news/kantara-chapter-1-shooting-123.html",
      "https://kannada.filmibeat.com/news/yash-toxic-456.html",
    ],
  },
  {
    adapter: vijayakarnatakaAdapter,
    listing: "vijayakarnataka-listing.html",
    article: "vijayakarnataka-article.html",
    articleUrl:
      "https://vijaykarnataka.com/entertainment/kannada-cinema/kantara-shooting/articleshow/123.cms",
    title: "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಶೂಟಿಂಗ್ ವಿವರ",
    image: "https://static.langimg.com/kantara.jpg",
    sourceUrl:
      "https://vijaykarnataka.com/entertainment/kannada-cinema/kantara-shooting/articleshow/123.cms",
    publishedAt: "2026-10-31T07:45:00Z",
    links: [
      "https://vijaykarnataka.com/entertainment/kannada-cinema/kantara-shooting/articleshow/123.cms",
      "https://vijaykarnataka.com/entertainment/kannada-cinema/yash-toxic/articleshow/456.cms",
    ],
  },
  {
    adapter: news18Adapter,
    listing: "news18-listing.html",
    article: "news18-article.html",
    articleUrl: "https://kannada.news18.com/news/entertainment/kantara-chapter-1-shooting-123.html",
    title: "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣದ ಹೊಸ ಅಪ್ಡೇಟ್",
    image: "https://images.news18.com/kantara.jpg",
    sourceUrl:
      "https://kannada.news18.com/news/entertainment/kantara-chapter-1-shooting-123.html",
    publishedAt: "2026-10-31T09:15:00Z",
    links: [
      "https://kannada.news18.com/news/entertainment/kantara-chapter-1-shooting-123.html",
      "https://kannada.news18.com/news/entertainment/yash-toxic-update-456.html",
    ],
  },
];

describe("source adapters", () => {
  it("registers exactly the three approved sources", () => {
    expect(SOURCE_ADAPTERS.map((adapter) => adapter.id)).toEqual([
      "filmibeat",
      "vijayakarnataka",
      "news18",
    ]);
  });

  it.each(cases)("extracts only article links for $adapter.id", ({ adapter, listing, links }) => {
    const extracted = adapter.extractLinks(fixture(listing), adapter.listingUrls[0]);
    expect(extracted).toEqual(links);
    expect(new Set(extracted).size).toBe(extracted.length);
    expect(extracted.every((link) => link.startsWith("https://"))).toBe(true);
    expect(extracted.some((link) => link.includes("example.com"))).toBe(false);
    expect(extracted.some((link) => link.includes("/tag/"))).toBe(false);
    expect(extracted.some((link) => link.includes("?utm_source"))).toBe(false);
  });

  it.each(cases)(
    "parses article metadata for $adapter.id",
    ({ adapter, article, articleUrl, title, image, sourceUrl, publishedAt }) => {
      const raw = adapter.parseArticle(fixture(article), articleUrl);
      expect(raw).not.toBeNull();
      expect(raw?.title).toBe(title);
      expect(raw?.imageUrl).toBe(image);
      expect(raw?.sourceUrl).toBe(sourceUrl);
      expect(raw?.publishedAt).toBe(publishedAt);
      expect(raw?.excerpt.length).toBeGreaterThanOrEqual(40);
      const parsedHost = new URL(raw!.sourceUrl).hostname;
      expect(
        adapter.allowedHosts.some(
          (host) => parsedHost === host || parsedHost.endsWith(`.${host}`),
        ),
      ).toBe(true);
      expect(raw?.publishedAt).toMatch(/^2026-10-31T/);
    },
  );
});

describe("article metadata helpers", () => {
  const articleUrl = "https://kannada.news18.com/news/entertainment/kantara-chapter-1-shooting-123.html";

  it("uses only the article node that matches the canonical URL", () => {
    const html = `<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebPage", datePublished: "2026-10-30T00:00:00Z" },
        {
          "@type": "NewsArticle",
          url: "https://kannada.news18.com/news/entertainment/other-story-999.html",
          datePublished: "2026-10-30T05:00:00Z",
        },
        {
          "@type": "NewsArticle",
          mainEntityOfPage: { "@id": articleUrl },
          datePublished: "2026-10-31T09:15:00Z",
        },
      ],
    })}</script>`;
    expect(jsonLdDate(load(html), articleUrl)).toBe("2026-10-31T09:15:00Z");
  });

  it("ignores non-article JSON-LD nodes entirely", () => {
    const html = `<script type="application/ld+json">${JSON.stringify({
      "@type": "WebPage",
      datePublished: "2026-10-31T09:15:00Z",
    })}</script>`;
    expect(jsonLdDate(load(html), articleUrl)).toBeNull();
  });

  it("clamps an insecure or off-host canonical to the fallback", () => {
    const insecure = load(
      `<html><head><link rel="canonical" href="http://m.news18.com/news/a-1.html"></head></html>`,
    );
    expect(canonicalUrl(insecure, articleUrl, ["kannada.news18.com"])).toBe(articleUrl);

    const insecureInHost = load(
      `<html><head><link rel="canonical" href="http://kannada.news18.com/news/a-1.html"></head></html>`,
    );
    expect(canonicalUrl(insecureInHost, articleUrl, ["kannada.news18.com"])).toBe(articleUrl);

    const ported = load(
      `<html><head><link rel="canonical" href="https://kannada.news18.com:8443/news/a-1.html"></head></html>`,
    );
    expect(canonicalUrl(ported, articleUrl, ["kannada.news18.com"])).toBe(articleUrl);

    const foreign = load(
      `<html><head><link rel="canonical" href="https://evil.example/a-1.html"></head></html>`,
    );
    expect(canonicalUrl(foreign, articleUrl, ["kannada.news18.com"])).toBe(articleUrl);
  });

  it("accepts an in-host https canonical over the fetched URL", () => {
    const $ = load(
      `<html><head><link rel="canonical" href="/news/entertainment/a-1.html"></head></html>`,
    );
    expect(canonicalUrl($, articleUrl, ["kannada.news18.com"])).toBe(
      "https://kannada.news18.com/news/entertainment/a-1.html",
    );
  });

  it("prefers meta published time over JSON-LD", () => {
    const html = `<html><head>
      <meta property="og:title" content="ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭ | ಫಿಲ್ಮಿಬೀಟ್" />
      <meta property="og:description" content="ಕುಂದಾಪುರದಲ್ಲಿ ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭವಾಗಿದ್ದು ಅಭಿಮಾನಿಗಳಲ್ಲಿ ಭಾರೀ ಕುತೂಹಲ ಮೂಡಿಸಿದೆ." />
      <meta property="og:image" content="https://images.filmibeat.com/kantara.jpg" />
      <meta property="article:published_time" content="2026-10-31T08:30:00Z" />
      <link rel="canonical" href="https://kannada.filmibeat.com/news/kantara-chapter-1-shooting-123.html" />
      <script type="application/ld+json">{"@type":"NewsArticle","url":"https://kannada.filmibeat.com/news/kantara-chapter-1-shooting-123.html","datePublished":"2026-10-31T07:45:00Z"}</script>
    </head></html>`;
    const raw = filmibeatAdapter.parseArticle(
      html,
      "https://kannada.filmibeat.com/news/kantara-chapter-1-shooting-123.html",
    );
    expect(raw?.publishedAt).toBe("2026-10-31T08:30:00Z");
  });

  it("falls back to the body when the description is too short", () => {
    const body =
      "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರದ ಶೂಟಿಂಗ್ ಕುಂದಾಪುರದಲ್ಲಿ ನಡೆಯುತ್ತಿದ್ದು ಚಿತ್ರತಂಡದ ವಿಶೇಷ ಫೋಟೋಗಳು ವೈರಲ್ ಆಗಿವೆ.";
    expect(bestExcerpt("ಸಣ್ಣ ವಿವರ", body)).toBe(body);
    expect(bestExcerpt(body, "ಬೇರೆ ಪಠ್ಯ")).toBe(body);
  });

  it("ignores page-level time elements outside the article", () => {
    const withRelated = load(
      `<html><body><time datetime="2026-10-30T01:00:00Z">related</time><article><time itemprop="datePublished" datetime="2026-10-31T09:15:00Z">story</time></article></body></html>`,
    );
    expect(timeElementDate(withRelated)).toBe("2026-10-31T09:15:00Z");

    const bare = load(
      `<html><body><time datetime="2026-10-30T01:00:00Z">related</time></body></html>`,
    );
    expect(timeElementDate(bare)).toBeNull();
  });
});
