import { TRUSTED_NEWS_SOURCES, TrustedNewsSource } from "./trustedSources";
import { parseRssXml, convertFeedItemToArticle, deduplicateIncomingArticles } from "./rssFetcher";
import { DataService } from "@/lib/dataService";
import { Article, LanguageCode } from "@/types";

export interface SyncReport {
  startedAt: string;
  finishedAt: string;
  sourcesProcessed: number;
  articlesDiscovered: number;
  articlesImported: number;
  errors: { sourceId: string; error: string }[];
}

export class RealtimeIngestionService {
  private static sourceConfigs: Map<string, TrustedNewsSource> = new Map(
    TRUSTED_NEWS_SOURCES.map((s) => [s.id, { ...s }])
  );

  public static getSources(): TrustedNewsSource[] {
    return Array.from(this.sourceConfigs.values());
  }

  public static toggleSource(id: string, enabled: boolean): boolean {
    const source = this.sourceConfigs.get(id);
    if (!source) return false;
    source.enabled = enabled;
    this.sourceConfigs.set(id, source);
    return true;
  }

  public static async fetchFeedForSource(source: TrustedNewsSource): Promise<Article[]> {
    if (!source.enabled) return [];

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(source.feedUrl, {
        headers: {
          "User-Agent": "EXTRASAGA News Ingest Engine/1.0 (+https://extrasaga.press; syndicate reader)",
          Accept: "application/rss+xml, application/xml, text/xml, */*",
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const xml = await response.text();
      const feedItems = parseRssXml(xml, source);

      return feedItems.map((item) => convertFeedItemToArticle(item, source));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[Ingestion] Failed to fetch feed for ${source.id} (${source.name}):`, msg);
      return [];
    }
  }

  public static async syncAll(targetLang?: LanguageCode): Promise<SyncReport> {
    const startedAt = new Date().toISOString();
    const errors: { sourceId: string; error: string }[] = [];
    let discovered = 0;
    let imported = 0;

    const sources = this.getSources().filter(
      (s) => s.enabled && (!targetLang || s.language === targetLang)
    );

    const existingArticles = await DataService.getArticles();

    for (const source of sources) {
      try {
        const incomingArticles = await this.fetchFeedForSource(source);
        discovered += incomingArticles.length;

        if (incomingArticles.length > 0) {
          const fresh = deduplicateIncomingArticles(incomingArticles, existingArticles);
          for (const item of fresh) {
            await DataService.saveArticle(item);
            imported += 1;
          }

          source.lastSyncAt = new Date().toISOString();
          source.articlesImportedCount = (source.articlesImportedCount || 0) + fresh.length;
          this.sourceConfigs.set(source.id, source);
        }
      } catch (e: unknown) {
        errors.push({
          sourceId: source.id,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    return {
      startedAt,
      finishedAt: new Date().toISOString(),
      sourcesProcessed: sources.length,
      articlesDiscovered: discovered,
      articlesImported: imported,
      errors,
    };
  }
}

