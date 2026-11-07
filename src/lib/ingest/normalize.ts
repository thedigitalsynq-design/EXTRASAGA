import { load } from "cheerio";
import type { CategorySlug } from "@/types";
import type { NormalizedArticle, ValidatedRawArticle } from "./types";
import { extractTags } from "./categorize";

export function cleanText(input: string): string {
  const withoutMarkup = input
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return load(`<span>${withoutMarkup}</span>`)
    .text()
    .replace(/[\u0000-\u001F\u007F\u200B\uFEFF\u2028\u2029]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function stripSiteSuffix(title: string, siteNames: string[]): string {
  const parts = title.split(/\s+[|–—-]\s+/);
  if (parts.length < 2) return title;
  const last = parts[parts.length - 1].trim();
  const matchesSite = siteNames.some((name) =>
    last.toLowerCase().includes(name.toLowerCase()),
  );
  const looksEnglish = /^[\x20-\x7E]+$/.test(last);
  if (matchesSite || looksEnglish) {
    return parts.slice(0, -1).join(" - ").trim();
  }
  return title;
}

export function kannadaRatio(text: string): number {
  const chars = Array.from(text.replace(/\s/g, ""));
  if (chars.length === 0) return 0;
  let kannada = 0;
  for (const char of chars) {
    if (char >= "\u0C80" && char <= "\u0CFF") kannada += 1;
  }
  return kannada / chars.length;
}

export function pickKannadaSentence(text: string): string | null {
  const sentences = text
    .split(/(?<=[.!?।])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  let best: string | null = null;
  let bestLength = 0;
  for (const sentence of sentences) {
    if (kannadaRatio(sentence) >= 0.5 && sentence.length > bestLength) {
      best = sentence;
      bestLength = sentence.length;
    }
  }
  return best;
}

export function trimExcerpt(text: string, max = 240): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max - 1);
  const boundary = Math.max(
    slice.lastIndexOf("."),
    slice.lastIndexOf("!"),
    slice.lastIndexOf("?"),
    slice.lastIndexOf("।"),
  );
  const cut = boundary >= 40 ? slice.slice(0, boundary + 1) : slice.replace(/\s+\S*$/, "");
  return `${cut.trim()}…`;
}

export function toIsoOrNull(value: string | null | undefined): string | null {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toISOString() : null;
}

export function hash8(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 8);
}

export function slugFromUrl(rawUrl: string): string {
  const url = new URL(rawUrl);
  const last = url.pathname.split("/").filter(Boolean).pop() ?? "";
  let segment = last;
  try {
    segment = decodeURIComponent(last);
  } catch {
    segment = last;
  }
  const base = segment
    .replace(/\.[a-z0-9]+$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
  if (base.length < 3) return `news-${hash8(rawUrl)}`;
  return base;
}

export function withCollisionSuffix(slug: string, sourceUrl: string): string {
  return `${slug}-${hash8(sourceUrl).slice(0, 6)}`;
}

export interface NormalizeOptions {
  category: CategorySlug;
  fetchedAt: string;
  takenSlugs: Set<string>;
}

export function normalizeArticle(
  raw: ValidatedRawArticle,
  options: NormalizeOptions,
): NormalizedArticle {
  const title = cleanText(raw.title);
  const excerpt = trimExcerpt(cleanText(raw.excerpt));
  const sourcePublishedAt = toIsoOrNull(raw.publishedAt);
  const fetchedAt = toIsoOrNull(options.fetchedAt) ?? new Date().toISOString();
  const publishedAt = sourcePublishedAt ?? fetchedAt;
  const publishedAtEstimated = sourcePublishedAt === null;
  const baseSlug = slugFromUrl(raw.sourceUrl);
  let slug = baseSlug;
  if (options.takenSlugs.has(slug)) {
    slug = withCollisionSuffix(baseSlug, raw.sourceUrl);
    let counter = 2;
    while (options.takenSlugs.has(slug)) {
      slug = `${withCollisionSuffix(baseSlug, raw.sourceUrl)}-${counter}`;
      counter += 1;
    }
  }
  options.takenSlugs.add(slug);

  return {
    sourceId: raw.sourceId,
    sourceName: raw.sourceName,
    sourceUrl: raw.sourceUrl,
    title,
    excerpt,
    imageUrl: raw.imageUrl,
    publishedAt,
    publishedAtEstimated,
    fetchedAt,
    category: options.category,
    tags: extractTags(`${title} ${excerpt}`),
    slug,
  };
}
