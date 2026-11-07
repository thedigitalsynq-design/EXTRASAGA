import { describe, expect, it } from "vitest";
import type { NormalizedArticle } from "@/lib/ingest/types";
import { toArticleRow, toArticleUpdateRow } from "@/lib/ingest/store";

const article: NormalizedArticle = {
  sourceId: "filmibeat",
  sourceName: "Filmibeat Kannada",
  sourceUrl: "https://kannada.filmibeat.com/news/kantara-123.html",
  title: "Kantara Chapter 1 Shooting Begins",
  excerpt: "Filming has begun in Kundapura, sparking massive curiosity among fans.",
  imageUrl: "https://images.filmibeat.com/kantara.jpg",
  publishedAt: "2026-10-31T08:30:00Z",
  publishedAtEstimated: false,
  fetchedAt: "2026-10-31T09:00:00Z",
  category: "sandalwood",
  tags: ["Sandalwood"],
  slug: "kantara-123",
};

const INSERT_ONLY_KEYS = [
  "views",
  "is_breaking",
  "is_top_story",
  "is_trending",
  "is_featured",
  "status",
  "coverage_count",
  "alt_sources",
] as const;

const UPDATABLE_KEYS = [
  "title",
  "slug",
  "summary",
  "content",
  "excerpt",
  "published_at",
  "source_url",
  "source_id",
  "source_name",
  "fetched_at",
  "published_at_estimated",
  "category_slug",
  "tags",
  "featured_image",
  "author_name",
  "read_time_minutes",
  "is_scraped",
  "updated_at",
] as const;

describe("toArticleRow", () => {
  it("maps scraped fields without inventing metrics", () => {
    const row = toArticleRow(article);
    expect(row.content).toBeNull();
    expect(row.views).toBe(0);
    expect(row.read_time_minutes).toBe(0);
    expect(row.is_scraped).toBe(true);
    expect(row.summary).toBe(article.excerpt);
    expect(row.author_name).toBe(article.sourceName);
    expect(row.source_url).toBe(article.sourceUrl);
    expect(row.published_at_estimated).toBe(false);
    expect(row.coverage_count).toBe(1);
    expect(row.alt_sources).toEqual([]);
    expect(row.status).toBe("published");
  });

  it("carries the estimated-timestamp flag", () => {
    const row = toArticleRow({ ...article, publishedAtEstimated: true });
    expect(row.published_at_estimated).toBe(true);
  });
});

describe("toArticleUpdateRow", () => {
  it("omits merged and editorial state so a refetch cannot reset it", () => {
    const row = toArticleUpdateRow(article);
    for (const key of INSERT_ONLY_KEYS) {
      expect(row).not.toHaveProperty(key);
    }
  });

  it("still refreshes the scraped article fields", () => {
    const row = toArticleUpdateRow(article);
    for (const key of UPDATABLE_KEYS) {
      expect(row).toHaveProperty(key);
    }
    expect(row).toMatchObject({
      title: article.title,
      slug: article.slug,
      summary: article.excerpt,
      content: null,
      excerpt: article.excerpt,
      published_at: article.publishedAt,
      published_at_estimated: article.publishedAtEstimated,
      source_url: article.sourceUrl,
      source_id: article.sourceId,
      source_name: article.sourceName,
      fetched_at: article.fetchedAt,
      updated_at: article.fetchedAt,
      category_slug: article.category,
      tags: article.tags,
      featured_image: article.imageUrl,
      author_name: article.sourceName,
      read_time_minutes: 0,
      is_scraped: true,
    });
  });

  it("has exactly the nineteen fields a refetch owns", () => {
    expect(Object.keys(toArticleUpdateRow(article)).sort()).toEqual([...UPDATABLE_KEYS].sort());
  });
});
