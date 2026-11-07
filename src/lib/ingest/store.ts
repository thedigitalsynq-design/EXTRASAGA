import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  ArticleRepository,
  CandidateArticle,
  IngestResult,
  NormalizedArticle,
} from "./types";

export function toArticleRow(article: NormalizedArticle): Record<string, unknown> {
  return {
    title: article.title,
    slug: article.slug,
    summary: article.excerpt,
    content: null,
    excerpt: article.excerpt,
    category_slug: article.category,
    tags: article.tags,
    featured_image: article.imageUrl,
    author_name: article.sourceName,
    published_at: article.publishedAt,
    updated_at: article.fetchedAt,
    read_time_minutes: 0,
    views: 0,
    is_breaking: false,
    is_top_story: false,
    is_trending: false,
    is_featured: false,
    status: "published",
    is_scraped: true,
    source_id: article.sourceId,
    source_name: article.sourceName,
    source_url: article.sourceUrl,
    fetched_at: article.fetchedAt,
    published_at_estimated: article.publishedAtEstimated,
    coverage_count: 1,
    alt_sources: [],
  };
}

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

/**
 * Re-fetching the primary URL of a merged story must not reset coverage,
 * alternate sources, views, or editorial flags, so updates only write fields
 * that a fresh scrape owns.
 */
export function toArticleUpdateRow(article: NormalizedArticle): Record<string, unknown> {
  const row = toArticleRow(article);
  for (const key of INSERT_ONLY_KEYS) {
    delete row[key];
  }
  return row;
}

interface CandidateRow {
  id: string;
  title: string;
  source_url: string | null;
  published_at: string | null;
  published_at_estimated: boolean | null;
  coverage_count: number | null;
}

export function createSupabaseRepository(config: {
  url: string;
  serviceRoleKey: string;
}): ArticleRepository {
  const db: SupabaseClient = createClient(config.url, config.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return {
    async findExistingSourceUrls(urls: string[]): Promise<Set<string>> {
      if (urls.length === 0) return new Set();
      const { data, error } = await db.from("articles").select("source_url").in("source_url", urls);
      if (error) throw new Error(`source lookup failed: ${error.message}`);
      return new Set(
        (data ?? [])
          .map((row) => row.source_url)
          .filter((value): value is string => typeof value === "string"),
      );
    },

    async findExistingSlugs(slugs: string[]): Promise<Set<string>> {
      if (slugs.length === 0) return new Set();
      const { data, error } = await db.from("articles").select("slug").in("slug", slugs);
      if (error) throw new Error(`slug lookup failed: ${error.message}`);
      return new Set(
        (data ?? [])
          .map((row) => row.slug)
          .filter((value): value is string => typeof value === "string"),
      );
    },

    async findRecentCandidates(sinceIso: string, limit: number): Promise<CandidateArticle[]> {
      const { data, error } = await db
        .from("articles")
        .select("id, title, source_url, published_at, published_at_estimated, coverage_count")
        .eq("is_scraped", true)
        .eq("status", "published")
        .gte("published_at", sinceIso)
        .order("published_at", { ascending: false })
        .limit(limit);
      if (error) throw new Error(`candidate lookup failed: ${error.message}`);
      const rows = (data ?? []) as CandidateRow[];
      return rows
        .filter((row) => row.source_url && row.published_at)
        .map((row) => ({
          id: row.id,
          title: row.title,
          sourceUrl: row.source_url as string,
          publishedAt: row.published_at as string,
          publishedAtEstimated: Boolean(row.published_at_estimated),
          coverageCount: row.coverage_count ?? 1,
        }));
    },

    async insertArticle(article: NormalizedArticle): Promise<{ id: string }> {
      const { data, error } = await db
        .from("articles")
        .insert(toArticleRow(article))
        .select("id")
        .single();
      if (error) throw new Error(`insert failed: ${error.message}`);
      return { id: data.id as string };
    },

    async updateBySourceUrl(article: NormalizedArticle): Promise<void> {
      const { error } = await db
        .from("articles")
        .update(toArticleUpdateRow(article))
        .eq("source_url", article.sourceUrl);
      if (error) throw new Error(`update failed: ${error.message}`);
    },

    async mergeSource(primaryId: string, article: NormalizedArticle): Promise<void> {
      const { error } = await db.rpc("merge_article_source", {
        p_primary_id: primaryId,
        p_source_url: article.sourceUrl,
        p_source_name: article.sourceName,
        p_published_at: article.publishedAt,
        p_published_at_estimated: article.publishedAtEstimated,
        p_fetched_at: article.fetchedAt,
      });
      if (error) throw new Error(`merge failed: ${error.message}`);
    },

    async logRun(result: IngestResult, startedAt: Date, finishedAt: Date): Promise<void> {
      const { error } = await db.from("ingest_runs").insert({
        source_id: result.sourceId,
        status: result.status,
        discovered: result.discovered,
        fetched: result.fetched,
        inserted: result.inserted,
        merged: result.merged,
        skipped: result.skipped,
        errors: result.errors,
        duration_ms: result.durationMs,
        message: result.message ?? null,
        started_at: startedAt.toISOString(),
        finished_at: finishedAt.toISOString(),
      });
      if (error) throw new Error(`run log failed: ${error.message}`);
    },
  };
}
