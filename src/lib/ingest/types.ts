import type { CategorySlug } from "@/types";

export interface RawArticle {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  publishedAt: string | null;
  bodyPreview?: string;
}

export interface ValidatedRawArticle extends Omit<RawArticle, "imageUrl" | "publishedAt"> {
  imageUrl: string;
  publishedAt: string | null;
}

export interface NormalizedArticle {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  publishedAt: string;
  publishedAtEstimated: boolean;
  fetchedAt: string;
  category: CategorySlug;
  tags: string[];
  slug: string;
}

export interface SourceAdapter {
  id: string;
  name: string;
  homepage: string;
  listingUrls: string[];
  allowedHosts: string[];
  defaultCategory: CategorySlug;
  extractLinks(html: string, baseUrl: string): string[];
  parseArticle(html: string, url: string): RawArticle | null;
}

export interface CandidateArticle {
  id: string;
  title: string;
  sourceUrl: string;
  publishedAt: string;
  publishedAtEstimated: boolean;
  coverageCount: number;
}

export interface IngestResult {
  sourceId: string;
  status: "success" | "partial" | "failed";
  discovered: number;
  fetched: number;
  inserted: number;
  merged: number;
  skipped: number;
  errors: number;
  durationMs: number;
  message?: string;
}

export interface ArticleRepository {
  findExistingSourceUrls(urls: string[]): Promise<Set<string>>;
  findExistingSlugs(slugs: string[]): Promise<Set<string>>;
  findRecentCandidates(sinceIso: string, limit: number): Promise<CandidateArticle[]>;
  insertArticle(article: NormalizedArticle): Promise<{ id: string }>;
  updateBySourceUrl(article: NormalizedArticle): Promise<void>;
  mergeSource(primaryId: string, article: NormalizedArticle): Promise<void>;
  logRun(result: IngestResult, startedAt: Date, finishedAt: Date): Promise<void>;
}
