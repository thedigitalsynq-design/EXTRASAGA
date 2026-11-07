import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { CATEGORIES } from "@/data/mockData";
import { DataService } from "@/lib/dataService";
import { CategorySlug, LanguageCode } from "@/types";
import ArticleCard from "@/components/ArticleCard";
import TrendingSidebar from "@/components/TrendingSidebar";
import ReviewsSection from "@/components/ReviewsSection";
import BoxOfficeTable from "@/components/BoxOfficeTable";
import OttSection from "@/components/OttSection";
import VideoSection from "@/components/VideoSection";
import PhotoGallerySection from "@/components/PhotoGallerySection";
import AdBanner from "@/components/AdBanner";
import { getLanguageConfig } from "@/lib/languages";
import { getTranslation, getLocalizedCategoryName } from "@/lib/translations";

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
  if (!cat) return { title: "Category not found" };

  const catName = getLocalizedCategoryName(params.slug, "en");

  return {
    title: `${catName} (${cat.englishName}) - EXTRASAGA`,
    description: cat.description || `${catName} cinema updates and reviews.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const currentCategory = CATEGORIES.find((c) => c.slug === params.slug);

  if (!currentCategory) {
    notFound();
  }

  const activeLang = "en" as LanguageCode;
  const config = getLanguageConfig(activeLang);

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
    <div className="w-full bg-paper min-h-screen text-ink">
      {/* Category Header Band */}
      <div className="bg-sheet border-b-2 border-ink py-8 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-ink-dim mb-3 font-mono">
            <Link href="/" className="hover:text-press font-bold transition-colors">
              {getTranslation(activeLang, "nav_home")}
            </Link>
            <span>/</span>
            <span className="text-press-deep font-bold">{localizedTitle}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="sticker bg-press text-paper border-2 border-ink px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase">
                  CATEGORY DESK
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-band text-ink border-2 border-ink shadow-sticker">
                  ALL INDIAN FILM INDUSTRIES
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-poster uppercase tracking-tight text-ink mt-2">
                {localizedTitle}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-ink-dim max-w-2xl font-grotesk font-medium">
                {currentCategory.description}
              </p>
            </div>
            <span className="text-xs font-poster uppercase px-3 py-1.5 bg-band text-ink border-2 border-ink shadow-sticker self-start md:self-auto">
              {currentCategory.englishName}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Render Specialized Category Views if category is Reviews, Box-Office, OTT, Videos, Gallery */}
        {params.slug === "reviews" && (
          <div className="space-y-8">
            <ReviewsSection reviews={reviews} />
          </div>
        )}

        {params.slug === "box-office" && (
          <div className="space-y-8">
            <BoxOfficeTable entries={boxOffice} showAllLink={false} />
          </div>
        )}

        {params.slug === "ott" && (
          <div className="space-y-8">
            <OttSection releases={ottReleases} />
          </div>
        )}

        {params.slug === "videos" && (
          <div className="space-y-8">
            <VideoSection videos={videos} />
          </div>
        )}

        {params.slug === "gallery" && (
          <div className="space-y-8">
            <PhotoGallerySection galleries={galleries} />
          </div>
        )}

        {/* Regular Article Listing Grid */}
        {!["reviews", "box-office", "ott", "videos", "gallery"].includes(params.slug) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <main className="lg:col-span-8">
              <h2 className="text-lg font-poster uppercase text-ink mb-5 border-l-4 border-press pl-3">
                {localizedTitle} ({articles.length})
              </h2>

              {articles.length === 0 ? (
                <div className="bg-sheet p-12 border-2 border-dashed border-ink shadow-press text-center space-y-3">
                  <p className="text-base font-poster uppercase text-ink-dim">
                    No articles printed in this category yet.
                  </p>
                  <Link
                    href="/"
                    className="inline-block px-5 py-2.5 bg-ink text-paper text-xs font-poster uppercase tracking-wider hover:bg-press border-2 border-ink shadow-sticker transition-colors"
                  >
                    Back to Home
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="horizontal" />
                  ))}
                </div>
              )}
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <TrendingSidebar articles={trendingArticles} />
              <AdBanner placement="sidebar_rectangle" />
            </aside>
          </div>
        )}

        {/* Supplementary In-Depth Articles for Specialized Pages */}
        {["reviews", "box-office", "ott", "videos", "gallery"].includes(params.slug) && articles.length > 0 && (
          <div className="mt-12 pt-8 border-t-2 border-ink">
            <h3 className="text-lg font-poster uppercase text-ink mb-5 border-l-4 border-press pl-3">
              {localizedTitle} — Special Reports ({articles.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="grid" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
