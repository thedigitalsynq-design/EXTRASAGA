import { MetadataRoute } from "next";
import { ARTICLES_SEED, REVIEWS_SEED, CATEGORIES } from "@/data/mockData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sinikannada.com";

  // Category pages
  const categoryUrls: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: cat.slug === "mukhaputa" ? baseUrl : `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  // Article pages
  const articleUrls: MetadataRoute.Sitemap = ARTICLES_SEED.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // Review pages
  const reviewUrls: MetadataRoute.Sitemap = REVIEWS_SEED.map((rev) => ({
    url: `${baseUrl}/reviews/${rev.slug}`,
    lastModified: new Date(rev.publishedAt),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Special hub pages
  const staticHubs: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/box-office`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/ott`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    },
  ];

  return [...categoryUrls, ...articleUrls, ...reviewUrls, ...staticHubs];
}

