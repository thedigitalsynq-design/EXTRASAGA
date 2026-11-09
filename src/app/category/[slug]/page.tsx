import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { CATEGORIES } from "@/data/mockData";
import { DataService } from "@/lib/dataService";
import { CategorySlug, LanguageCode } from "@/types";
import ReviewsSection from "@/components/ReviewsSection";
import BoxOfficeTable from "@/components/BoxOfficeTable";
import OttSection from "@/components/OttSection";
import VideoSection from "@/components/VideoSection";
import PhotoGallerySection from "@/components/PhotoGallerySection";
import { getLanguageConfig } from "@/lib/languages";
import { getLocalizedCategoryName } from "@/lib/translations";
import { formatEditorialDate } from "@/lib/utils";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) return { title: "Category not found — Films Discourse" };

  const catName = getLocalizedCategoryName(params.slug, "en");

  return {
    title: `${catName} — Films Discourse`,
    description: cat.description || `${catName} cinema updates and reviews.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const currentCategory = CATEGORIES.find((c) => c.slug === params.slug);

  if (!currentCategory) {
    notFound();
  }

  const activeLang = "en" as LanguageCode;
  const localizedTitle = getLocalizedCategoryName(params.slug, activeLang);

  const [articles, trendingArticles, reviews, boxOffice, ottReleases, videos, galleries] =
    await Promise.all([
      DataService.getArticles(params.slug as CategorySlug, activeLang),
      DataService.getTrendingArticles(5, activeLang),
      DataService.getReviews(),
      DataService.getBoxOffice(),
      DataService.getOttReleases(),
      DataService.getVideos(activeLang),
      DataService.getGalleries(activeLang),
    ]);

  return (
    <div className="wrap">
      {/* Category Header */}
      <header className="py-8 border-b border-line mb-8">
        <p className="kicker text-xs font-mono uppercase text-muted mb-2 tracking-wider">
          <Link href="/" className="hover:text-text">Home</Link> · Archive Desk
        </p>
        <h1 className="text-3xl sm:text-5xl font-title font-extrabold text-ink tracking-tight uppercase">
          {localizedTitle}
        </h1>
        {currentCategory.description && (
          <p className="text-sm sm:text-base text-muted mt-2 max-w-2xl">
            {currentCategory.description}
          </p>
        )}
      </header>

      {/* Specialized Category Views if category is Reviews, Box-Office, OTT, Videos, Gallery */}
      {params.slug === "reviews" && (
        <div className="space-y-8 mb-12">
          <ReviewsSection reviews={reviews} />
        </div>
      )}

      {params.slug === "box-office" && (
        <div className="space-y-8 mb-12">
          <BoxOfficeTable entries={boxOffice} showAllLink={false} />
        </div>
      )}

      {params.slug === "ott" && (
        <div className="space-y-8 mb-12">
          <OttSection releases={ottReleases} />
        </div>
      )}

      {params.slug === "videos" && (
        <div className="space-y-8 mb-12">
          <VideoSection videos={videos} />
        </div>
      )}

      {params.slug === "gallery" && (
        <div className="space-y-8 mb-12">
          <PhotoGallerySection galleries={galleries} />
        </div>
      )}

      {/* Standard Articles Grid */}
      {!["reviews", "box-office", "ott", "videos", "gallery"].includes(params.slug) && (
        <div>
          {articles.length === 0 ? (
            <div className="p-12 border border-dashed border-line text-center space-y-3 rounded">
              <p className="text-base text-muted">
                No dispatches published in this archive yet.
              </p>
              <Link
                href="/"
                className="inline-block px-4 py-2 bg-[var(--surface-2)] text-text text-xs uppercase font-medium hover:border-text border border-line rounded transition-colors"
              >
                Back to Desk
              </Link>
            </div>
          ) : (
            <div className="cn-arts">
              {articles.map((art) => (
                <article key={art.id} className="cn-artc">
                  <Link href={`/news/${art.slug}`}>
                    <figure className="cn-artc-fig">
                      <Image
                        src={art.featuredImage}
                        alt={art.title}
                        width={400}
                        height={260}
                        className="object-cover"
                      />
                    </figure>
                    <div className="cn-artc-body">
                      <div className="cn-artc-meta">
                        <span>{art.category.toUpperCase()}</span>
                        <span>{formatEditorialDate(art.publishedAt)}</span>
                      </div>
                      <h3 className="cn-artc-title">{art.title}</h3>
                      <p className="cn-artc-sum line-clamp-2">{art.summary}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Supplementary Articles for Specialized Pages */}
      {["reviews", "box-office", "ott", "videos", "gallery"].includes(params.slug) && articles.length > 0 && (
        <div className="mt-12 pt-8 border-t border-line">
          <div className="h3-head flex items-baseline justify-between pb-2 mb-6 border-b border-line">
            <h2 className="text-lg font-bold uppercase tracking-wider">{localizedTitle} — Reports</h2>
          </div>
          <div className="cn-arts">
            {articles.map((art) => (
              <article key={art.id} className="cn-artc">
                <Link href={`/news/${art.slug}`}>
                  <figure className="cn-artc-fig">
                    <Image
                      src={art.featuredImage}
                      alt={art.title}
                      width={400}
                      height={260}
                      className="object-cover"
                    />
                  </figure>
                  <div className="cn-artc-body">
                    <div className="cn-artc-meta">
                      <span>{art.category.toUpperCase()}</span>
                      <span>{formatEditorialDate(art.publishedAt)}</span>
                    </div>
                    <h3 className="cn-artc-title">{art.title}</h3>
                    <p className="cn-artc-sum line-clamp-2">{art.summary}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
