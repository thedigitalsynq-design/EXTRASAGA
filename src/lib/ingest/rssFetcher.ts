import { load } from "cheerio";
import { Article, CategorySlug } from "@/types";
import { TrustedNewsSource } from "./trustedSources";
import { inferCategory } from "./categorize";
import { titleTokens, jaccardSimilarity } from "./dedupe";
import { slugify } from "@/lib/utils";

export interface ParsedFeedItem {
  title: string;
  link: string;
  description: string;
  publishedAt: string;
  imageUrl?: string;
  authorName?: string;
  guid?: string;
}

export function parseRssXml(xml: string, source: TrustedNewsSource): ParsedFeedItem[] {
  const $ = load(xml, { xmlMode: true });
  const items: ParsedFeedItem[] = [];

  // Check RSS <item> nodes
  $("item").each((_, el) => {
    const $item = $(el);
    const title = cleanText($item.find("title").text());
    const link = $item.find("link").text().trim() || $item.find("guid").text().trim();
    const description = cleanText(
      $item.find("description").text() || $item.find("content\\:encoded").text()
    );
    const pubDateStr = $item.find("pubDate").text().trim() || $item.find("dc\\:date").text().trim();
    const author =
      $item.find("dc\\:creator").text().trim() ||
      $item.find("author").text().trim() ||
      source.name;

    // Image extraction from enclosure or media tags
    let imageUrl =
      $item.find("enclosure[type^='image']").attr("url") ||
      $item.find("media\\:content[medium='image']").attr("url") ||
      $item.find("media\\:content").attr("url") ||
      $item.find("media\\:thumbnail").attr("url");

    // Fallback: search for <img> src in description or content:encoded
    if (!imageUrl) {
      const rawDesc = $item.find("description").text();
      const match = rawDesc.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (match && match[1]) {
        imageUrl = match[1];
      }
    }

    if (title && link) {
      let publishedAt = new Date().toISOString();
      if (pubDateStr) {
        const parsed = new Date(pubDateStr);
        if (!isNaN(parsed.getTime())) {
          publishedAt = parsed.toISOString();
        }
      }

      items.push({
        title,
        link,
        description,
        publishedAt,
        imageUrl: imageUrl || undefined,
        authorName: author,
        guid: $item.find("guid").text().trim() || link,
      });
    }
  });

  // Check Atom <entry> nodes if no RSS items found
  if (items.length === 0) {
    $("entry").each((_, el) => {
      const $entry = $(el);
      const title = cleanText($entry.find("title").text());
      const link =
        $entry.find("link[rel='alternate']").attr("href") ||
        $entry.find("link").attr("href") ||
        $entry.find("id").text().trim();
      const description = cleanText(
        $entry.find("summary").text() || $entry.find("content").text()
      );
      const pubDateStr =
        $entry.find("published").text().trim() || $entry.find("updated").text().trim();
      const author = $entry.find("author name").text().trim() || source.name;

      if (title && link) {
        let publishedAt = new Date().toISOString();
        if (pubDateStr) {
          const parsed = new Date(pubDateStr);
          if (!isNaN(parsed.getTime())) {
            publishedAt = parsed.toISOString();
          }
        }

        items.push({
          title,
          link,
          description,
          publishedAt,
          authorName: author,
          guid: $entry.find("id").text().trim() || link,
        });
      }
    });
  }

  return items;
}

function cleanText(text: string): string {
  if (!text) return "";
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Transforms parsed RSS items into verified Article entities.
 */
export function convertFeedItemToArticle(
  item: ParsedFeedItem,
  source: TrustedNewsSource
): Article {
  const category = inferCategory(
    { title: item.title, excerpt: item.description },
    source.defaultCategory
  );

  const fallbackImageMap: Record<string, string> = {
    sandalwood:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200&auto=format&fit=crop",
    tollywood:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
    kollywood:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
    mollywood:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1200&auto=format&fit=crop",
    bollywood:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    hollywood:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
  };

  const id = `import-${source.id}-${Math.abs(hashString(item.link))}`;
  const slug = `${slugify(item.title.slice(0, 70))}-${source.id}`;

  const summary =
    item.description && item.description.length > 20
      ? item.description.slice(0, 240) + "..."
      : item.title;

  return {
    id,
    title: item.title,
    titleEn: source.language === "en" ? item.title : undefined,
    slug,
    summary,
    content: item.description || summary,
    excerpt: summary,
    category,
    categoryName: source.name,
    tags: [source.name, source.industry, "Cinema"],
    featuredImage: item.imageUrl || fallbackImageMap[source.industry] || fallbackImageMap.sandalwood,
    imageCaption: `Image courtesy: ${source.name}`,
    author: {
      id: `auth-${source.id}`,
      name: source.name,
      role: `${source.name} Verified Syndication`,
    },
    publishedAt: item.publishedAt,
    updatedAt: item.publishedAt,
    readTimeMinutes: Math.max(2, Math.ceil(summary.split(" ").length / 60)),
    views: Math.floor(Math.random() * 450) + 120,
    isBreaking: false,
    isTopStory: false,
    isTrending: true,
    isFeatured: false,
    status: "pending", // Requires Admin Approval
    isScraped: true,
    source: {
      id: source.id,
      name: source.name,
      url: item.link,
      publishedAtEstimated: false,
    },
    language: source.language,
    industry: source.industry,
    fetchedAt: new Date().toISOString(),
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

/**
 * Filter out duplicate articles against an existing set of articles using title tokens.
 */
export function deduplicateIncomingArticles(
  incoming: Article[],
  existing: Article[],
  threshold = 0.65
): Article[] {
  const existingTokenSets = existing.map((a) => ({
    id: a.id,
    url: a.source?.url,
    tokens: titleTokens(a.title),
  }));

  const unique: Article[] = [];

  for (const item of incoming) {
    // Check exact source URL duplicate
    if (item.source?.url && existingTokenSets.some((e) => e.url === item.source?.url)) {
      continue;
    }

    // Check title Jaccard similarity
    const itemTokens = titleTokens(item.title);
    let isDupe = false;

    for (const ex of existingTokenSets) {
      if (jaccardSimilarity(itemTokens, ex.tokens) >= threshold) {
        isDupe = true;
        break;
      }
    }

    if (!isDupe) {
      unique.push(item);
      existingTokenSets.push({
        id: item.id,
        url: item.source?.url,
        tokens: itemTokens,
      });
    }
  }

  return unique;
}
