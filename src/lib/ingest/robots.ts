import robotsParser from "robots-parser";

export const INGEST_BOT_TOKEN = "SiniKannadaBot";

export function canFetch(url: string, robotsTxt: string | null, userAgent: string): boolean {
  if (!robotsTxt) return true;
  const parsed = robotsParser(url, robotsTxt);
  return parsed.isAllowed(url, userAgent) !== false;
}

export interface RobotsChecker {
  isAllowed(url: string, userAgent: string): Promise<boolean>;
}

export function createRobotsChecker(
  fetcher: { fetchText(url: string): Promise<string> },
  userAgent: string,
): RobotsChecker {
  const cache = new Map<string, Promise<string | null>>();
  return {
    async isAllowed(url: string, agent: string): Promise<boolean> {
      const origin = new URL(url).origin;
      if (!cache.has(origin)) {
        cache.set(
          origin,
          fetcher.fetchText(`${origin}/robots.txt`).catch(() => null),
        );
      }
      const robotsTxt = (await cache.get(origin)) ?? null;
      return canFetch(url, robotsTxt, agent || userAgent);
    },
  };
}
