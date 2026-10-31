import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { CATEGORIES } from "@/data/mockData";
import { DataService } from "@/lib/dataService";
import { CategorySlug } from "@/types";
import ArticleCard from "@/components/ArticleCard";
import TrendingSidebar from "@/components/TrendingSidebar";
import ReviewsSection from "@/components/ReviewsSection";
import BoxOfficeTable from "@/components/BoxOfficeTable";
import OttSection from "@/components/OttSection";
import VideoSection from "@/components/VideoSection";
import PhotoGallerySection from "@/components/PhotoGallerySection";
import AdBanner from "@/components/AdBanner";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) return { title: "ವಿಭಾಗ ಕಂಡುಬಂದಿಲ್ಲ" };

  return {
    title: `${cat.name} (${cat.englishName}) - ತಾಜಾ ಸುದ್ದಿಗಳು | ಸಿನಿ ಕನ್ನಡ`,
    description: cat.description || `${cat.name} ವಿಭಾಗದ ತಾಜಾ ಕನ್ನಡ ಸಿನಿಮಾ ಸಮಾಚಾರ ಮತ್ತು ಅಪ್ಡೇಟ್ಸ್`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const currentCategory = CATEGORIES.find((c) => c.slug === params.slug);

  if (!currentCategory) {
    notFound();
  }

  const [articles, trendingArticles, reviews, boxOffice, ottReleases, videos, galleries] =
    await Promise.all([
      DataService.getArticles(params.slug as CategorySlug),
      DataService.getTrendingArticles(5),
      DataService.getReviews(),
      DataService.getBoxOffice(),
      DataService.getOttReleases(),
      DataService.getVideos(),
      DataService.getGalleries(),
    ]);

  return (
    <div className="w-full">
      {/* Category Header Banner */}
      <div className="bg-gradient-to-r from-brand-dark via-brand-card to-brand-dark border-b border-brand-border py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-brand-muted font-kannada mb-3">
            <Link href="/" className="hover:text-white transition-colors">
              ಮುಖಪುಟ
            </Link>
            <span>/</span>
            <span className="text-brand-red font-medium">{currentCategory.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-kannada">
                {currentCategory.name}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-gray-300 font-kannada max-w-2xl">
                {currentCategory.description}
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase tracking-wider font-sans self-start md:self-auto">
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

        {/* Regular Article Listing Grid (for Sandalwood, Latest, Bollywood, Hollywood, Actors, Actresses, Gossip, Upcoming) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <main className="lg:col-span-8">
            <h2 className="text-lg font-bold text-white font-kannada mb-5 border-l-4 border-brand-red pl-3">
              {currentCategory.name} ಲೇಖನಗಳು ({articles.length})
            </h2>

            {articles.length === 0 ? (
              <div className="bg-brand-dark p-12 rounded-2xl border border-brand-border text-center space-y-3">
                <p className="text-base text-gray-300 font-kannada">
                  ಈ ವಿಭಾಗದಲ್ಲಿ ಸದ್ಯಕ್ಕೆ ಯಾವುದೇ ಲೇಖನಗಳಿಲ್ಲ.
                </p>
                <Link
                  href="/"
                  className="inline-block px-5 py-2.5 rounded-lg bg-brand-red text-white text-xs font-bold font-kannada hover:bg-brand-crimson transition-colors"
                >
                  ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ
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
      </div>
    </div>
  );
}
