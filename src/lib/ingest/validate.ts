import type { RawArticle, ValidatedRawArticle } from "./types";
import { assertAllowedUrl } from "./fetcher";
import { cleanText, kannadaRatio, toIsoOrNull } from "./normalize";

export type ValidationResult =
  | { ok: true; article: ValidatedRawArticle }
  | { ok: false; reason: string };

const MAX_FUTURE_MS = 30 * 24 * 60 * 60 * 1000;

export function validateRawArticle(raw: RawArticle, allowedHosts: string[]): ValidationResult {
  const title = cleanText(raw.title);
  if (title.length < 10) return { ok: false, reason: "title-too-short" };
  if (title.length > 200) return { ok: false, reason: "title-too-long" };

  const excerpt = cleanText(raw.excerpt);
  if (excerpt.length < 40) return { ok: false, reason: "excerpt-too-short" };
  if (kannadaRatio(excerpt) < 0.35) return { ok: false, reason: "excerpt-not-kannada" };

  if (!raw.imageUrl) return { ok: false, reason: "missing-image" };
  try {
    const image = new URL(raw.imageUrl);
    if (image.protocol !== "https:") return { ok: false, reason: "image-not-https" };
  } catch {
    return { ok: false, reason: "invalid-image" };
  }

  try {
    assertAllowedUrl(raw.sourceUrl, allowedHosts);
  } catch {
    return { ok: false, reason: "source-url-not-allowed" };
  }

  if (raw.publishedAt) {
    const iso = toIsoOrNull(raw.publishedAt);
    if (!iso) return { ok: false, reason: "invalid-published-at" };
    if (Date.parse(iso) > Date.now() + MAX_FUTURE_MS) {
      return { ok: false, reason: "published-at-too-far-future" };
    }
  }

  const publishedAt = raw.publishedAt ? toIsoOrNull(raw.publishedAt) : null;

  return { ok: true, article: { ...raw, title, excerpt, publishedAt, imageUrl: raw.imageUrl } };
}
