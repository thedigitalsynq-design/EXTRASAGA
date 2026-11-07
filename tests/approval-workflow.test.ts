import { describe, it, expect, beforeEach } from "vitest";
import { DataService } from "../src/lib/dataService";
import { convertFeedItemToArticle } from "../src/lib/ingest/rssFetcher";
import { TRUSTED_NEWS_SOURCES } from "../src/lib/ingest/trustedSources";
import * as fs from "fs";
import * as path from "path";

describe("Real-Time Ingestion, Free Tiers & Editorial Approval Workflow", () => {
  beforeEach(async () => {
    // Reset/setup clean state
  });

  it("should verify vercel.json 15-minute automatic cron schedule", () => {
    const vercelConfigPath = path.resolve(__dirname, "../vercel.json");
    expect(fs.existsSync(vercelConfigPath)).toBe(true);

    const config = JSON.parse(fs.readFileSync(vercelConfigPath, "utf-8"));
    expect(config.crons).toBeDefined();
    expect(config.crons.length).toBeGreaterThan(0);
    expect(config.crons[0].path).toBe("/api/cron/sync");
    expect(config.crons[0].schedule).toBe("*/15 * * * *");
  });

  it("should mark incoming imported RSS articles as 'pending' for admin approval", () => {
    const source = TRUSTED_NEWS_SOURCES[0];
    const sampleFeedItem = {
      title: "Kantara Chapter 1 Sets Massive Theatrical Release Date",
      link: "https://kannada.filmibeat.com/news/kantara-chapter-1-exclusive-update.html",
      publishedAt: new Date().toISOString(),
      description: "Hombale Films officially locks the grand festive theatrical window for Kantara Chapter 1.",
    };

    const article = convertFeedItemToArticle(sampleFeedItem, source);

    expect(article.status).toBe("pending");
    expect(article.isScraped).toBe(true);
    expect(article.source).toBeDefined();
    expect(article.source?.name).toBe(source.name);
    expect(article.source?.url).toBe(sampleFeedItem.link);
  });

  it("should exclude 'pending' articles from public views by default", async () => {
    const testPendingArticle = {
      id: "test-pending-123",
      title: "Pending Trade Leak: Salaar 2 Pre-production",
      slug: "test-pending-trade-leak",
      summary: "Under review by admin desk",
      content: "Exclusive trade report waiting for verification.",
      category: "sandalwood" as const,
      categoryName: "Sandalwood",
      tags: ["Prabhas", "Prashanth Neel"],
      featuredImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23",
      author: { id: "p1", name: "News18 Desk" },
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 2,
      views: 0,
      status: "pending" as const,
      source: {
        id: "news18",
        name: "News18",
        url: "https://news18.com/salaar2",
        publishedAtEstimated: false,
      },
    };

    await DataService.saveArticle(testPendingArticle);

    // Public call: includePending = false (default)
    const publicArticles = await DataService.getArticles();
    const foundInPublic = publicArticles.find((a) => a.id === "test-pending-123");
    expect(foundInPublic).toBeUndefined();

    // Admin call: includePending = true
    const adminArticles = await DataService.getArticles(undefined, undefined, true);
    const foundInAdmin = adminArticles.find((a) => a.id === "test-pending-123");
    expect(foundInAdmin).toBeDefined();
    expect(foundInAdmin?.status).toBe("pending");
  });

  it("should approve a pending article and publish it live", async () => {
    const approved = await DataService.approveArticle("test-pending-123");
    expect(approved).not.toBeNull();
    expect(approved?.status).toBe("published");

    // Should now be visible to public users
    const publicArticles = await DataService.getArticles();
    const found = publicArticles.find((a) => a.id === "test-pending-123");
    expect(found).toBeDefined();
    expect(found?.status).toBe("published");
  });

  it("should approve all pending articles in batch", async () => {
    await DataService.saveArticle({
      id: "pending-batch-1",
      title: "Batch Article 1",
      slug: "batch-1",
      summary: "Summary 1",
      status: "pending",
      author: { id: "a1", name: "Desk" },
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 2,
      views: 0,
      category: "bollywood",
      categoryName: "Bollywood",
      tags: [],
      featuredImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23",
    });

    await DataService.saveArticle({
      id: "pending-batch-2",
      title: "Batch Article 2",
      slug: "batch-2",
      summary: "Summary 2",
      status: "pending",
      author: { id: "a2", name: "Desk" },
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 2,
      views: 0,
      category: "sandalwood",
      categoryName: "Sandalwood",
      tags: [],
      featuredImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23",
    });

    const approvedCount = await DataService.approveAllPendingArticles();
    expect(approvedCount).toBeGreaterThanOrEqual(2);

    const adminArticles = await DataService.getArticles(undefined, undefined, true);
    const item1 = adminArticles.find((a) => a.id === "pending-batch-1");
    const item2 = adminArticles.find((a) => a.id === "pending-batch-2");
    expect(item1?.status).toBe("published");
    expect(item2?.status).toBe("published");
  });

  it("should guarantee every trusted source has free syndication feed URL and attribution", () => {
    TRUSTED_NEWS_SOURCES.forEach((s) => {
      expect(s.feedUrl).toMatch(/^https?:\/\//);
      expect(s.homepage).toMatch(/^https?:\/\//);
      expect(s.name.length).toBeGreaterThan(0);
      expect(s.trustScore).toBeGreaterThanOrEqual(90);
    });
  });
});
