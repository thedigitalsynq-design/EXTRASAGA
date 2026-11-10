import { MetadataRoute } from "next";
import { ARTICLES_SEED, REVIEWS_SEED, CATEGORIES } from "@/data/mockData";
import { INITIAL_MOVIES_SEED } from "@/data/cinemaReleasesData";
import { getSiteUrl } from "@/lib/siteUrl";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

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

  // Movie Release Profile pages (/movies/[slug])
  const movieUrls: MetadataRoute.Sitemap = INITIAL_MOVIES_SEED.map((movie) => ({
    url: `${baseUrl}/movies/${movie.slug}`,
    lastModified: new Date(movie.updatedAt || movie.theatricalReleaseDate),
    changeFrequency: "daily",
    priority: 0.95,
  }));

  // Special hub pages
  const staticHubs: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/reviews/ramayana-part-1`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
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

  return [...categoryUrls, ...articleUrls, ...reviewUrls, ...movieUrls, ...staticHubs];
}

