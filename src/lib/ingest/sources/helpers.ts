import type { CheerioAPI } from "cheerio";
import type { RawArticle } from "../types";
import { cleanText, kannadaRatio, pickKannadaSentence, stripSiteSuffix } from "../normalize";

const MIN_EXCERPT = 40;

// Section paths that look like articles but are listing/hub pages.
const NON_ARTICLE_SEGMENTS = new Set([
  "photos",
  "videos",
  "videoshow",
  "photostories",
  "photogallery",
  "gallery",
  "galleries",
  "tags",
  "tag",
  "topics",
  "topic",
  "author",
  "authors",
]);

const ARTICLE_TYPES = new Set([
  "Article",
  "NewsArticle",
  "ReportageNewsArticle",
  "OpinionNewsArticle",
  "AnalysisNewsArticle",
  "ReviewNewsArticle",
  "BlogPosting",
  "LiveBlogPosting",
]);

export function metaContent($: CheerioAPI, property: string): string | null {
  const value =
    $(`meta[property="${property}"]`).attr("content") ??
    $(`meta[name="${property}"]`).attr("content");
  return value ? value.trim() : null;
}

function parseHttpsUrl(rawUrl: string, baseUrl: string): URL | null {
  try {
    const url = new URL(rawUrl, baseUrl);
    if (url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    if (url.port && url.port !== "443") return null;
    return url;
  } catch {
    return null;
  }
}

export function withinHosts(rawUrl: string, allowedHosts: string[]): boolean {
  const url = parseHttpsUrl(rawUrl, rawUrl);
  if (!url) return false;
  const host = url.hostname.toLowerCase();
  return allowedHosts.some((entry) => {
    const base = entry.toLowerCase();
    return host === base || host.endsWith(`.${base}`);
  });
}

export function canonicalUrl($: CheerioAPI, fallback: string, allowedHosts: string[]): string {
  const href = $('link[rel="canonical"]').attr("href");
  if (!href) return fallback;
  const url = parseHttpsUrl(href, fallback);
  if (!url || !withinHosts(url.toString(), allowedHosts)) return fallback;
  url.hash = "";
  return url.toString();
}

function nodeTypes(object: Record<string, unknown>): string[] {
  const type = object["@type"];
  if (typeof type === "string") return [type];
  if (Array.isArray(type)) return type.filter((item): item is string => typeof item === "string");
  return [];
}

function nodeUrl(object: Record<string, unknown>): string | null {
  const url = object.url;
  if (typeof url === "string") return url;
  if (url && typeof url === "object") {
    const id = (url as Record<string, unknown>)["@id"];
    if (typeof id === "string") return id;
  }
  const main = object.mainEntityOfPage;
  if (typeof main === "string") return main;
  if (main && typeof main === "object") {
    const id = (main as Record<string, unknown>)["@id"];
    if (typeof id === "string") return id;
  }
  return null;
}

function resourceKey(rawUrl: string, baseUrl: string): string | null {
  try {
    const url = new URL(rawUrl, baseUrl);
    return `${url.hostname.toLowerCase()}${url.pathname.replace(/\/+$/, "")}`;
  } catch {
    return null;
  }
}

function pickArticleDate(
  value: unknown,
  expectedKey: string | null,
  baseUrl: string,
): string | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = pickArticleDate(item, expectedKey, baseUrl);
      if (found) return found;
    }
    return null;
  }
  if (!value || typeof value !== "object") return null;
  const object = value as Record<string, unknown>;
  if (Array.isArray(object["@graph"])) {
    const found = pickArticleDate(object["@graph"], expectedKey, baseUrl);
    if (found) return found;
  }
  const isArticle = nodeTypes(object).some((type) => ARTICLE_TYPES.has(type));
  if (!isArticle || typeof object.datePublished !== "string") return null;
  const candidate = nodeUrl(object);
  if (expectedKey && candidate) {
    const candidateKey = resourceKey(candidate, baseUrl);
    if (candidateKey && candidateKey !== expectedKey) return null;
  }
  return object.datePublished;
}

// Only article-typed nodes count; a WebPage container or a related story's
// NewsArticle sibling must not supply the publish time.
export function jsonLdDate($: CheerioAPI, expectedUrl: string | null): string | null {
  const baseUrl = expectedUrl ?? "https://example.invalid/";
  const expectedKey = expectedUrl ? resourceKey(expectedUrl, baseUrl) : null;
  const scripts = $('script[type="application/ld+json"]');
  for (let index = 0; index < scripts.length; index += 1) {
    try {
      const found = pickArticleDate(JSON.parse($(scripts[index]).text()), expectedKey, baseUrl);
      if (found) return found;
    } catch {
      // Malformed JSON-LD is common; try the next block.
    }
  }
  return null;
}

export function timeElementDate($: CheerioAPI): string | null {
  for (const selector of [
    'time[itemprop="datePublished"][datetime]',
    "article time[datetime]",
  ]) {
    const value = $(selector).first().attr("datetime");
    if (value) return value.trim();
  }
  return null;
}

export function bodyText($: CheerioAPI, selector: string): string {
  return $(selector)
    .map((_, element) => cleanText($(element).text()))
    .get()
    .join(" ");
}

export function bestExcerpt(description: string | null, body: string): string {
  const cleanedDescription = cleanText(description ?? "");
  if (cleanedDescription.length >= MIN_EXCERPT && kannadaRatio(cleanedDescription) >= 0.5) {
    return cleanedDescription;
  }
  const cleanedBody = cleanText(body);
  return pickKannadaSentence(cleanedBody) ?? (cleanedBody || cleanedDescription);
}

export function absoluteHttpsUrl(value: string | null, baseUrl: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value, baseUrl);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function normalizeHref(href: string, baseUrl: string): string | null {
  try {
    const url = new URL(href, baseUrl);
    url.hash = "";
    url.search = "";
    return url.toString();
  } catch {
    return null;
  }
}

export function isNonArticlePath(pathname: string): boolean {
  return pathname
    .toLowerCase()
    .split("/")
    .filter(Boolean)
    .some((segment) => NON_ARTICLE_SEGMENTS.has(segment));
}

// Article URLs on all three sources end in a numeric story id.
export function endsWithNumericId(pathname: string, extension: string): boolean {
  const lower = pathname.toLowerCase();
  if (!lower.endsWith(extension)) return false;
  const lastSegment = lower.slice(0, -extension.length).split("/").pop() ?? "";
  return /\d/.test(lastSegment);
}

export function collectLinks(
  $: CheerioAPI,
  selector: string,
  baseUrl: string,
  allowedHosts: string[],
  accept: (url: URL) => boolean,
): string[] {
  const seen = new Set<string>();
  const links: string[] = [];
  $(selector).each((_, element) => {
    const href = $(element).attr("href");
    if (!href) return;
    const normalized = normalizeHref(href, baseUrl);
    if (!normalized || !withinHosts(normalized, allowedHosts)) return;
    const url = new URL(normalized);
    if (!accept(url)) return;
    if (!seen.has(normalized)) {
      seen.add(normalized);
      links.push(normalized);
    }
  });
  return links;
}

export interface ArticleShellOptions {
  sourceId: string;
  sourceName: string;
  siteNames: string[];
  allowedHosts: string[];
}

export function readArticle(
  $: CheerioAPI,
  url: string,
  options: ArticleShellOptions,
): RawArticle | null {
  const title = stripSiteSuffix(
    cleanText(metaContent($, "og:title") ?? $("h1").first().text()),
    options.siteNames,
  );
  if (!title) return null;
  const sourceUrl = canonicalUrl($, url, options.allowedHosts);
  return {
    sourceId: options.sourceId,
    sourceName: options.sourceName,
    sourceUrl,
    title,
    excerpt: bestExcerpt(
      metaContent($, "og:description"),
      bodyText($, "article p, .article-content p, .content p"),
    ),
    imageUrl: absoluteHttpsUrl(metaContent($, "og:image"), url),
    publishedAt:
      metaContent($, "article:published_time") ??
      jsonLdDate($, sourceUrl) ??
      timeElementDate($),
  };
}
