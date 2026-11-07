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
  searchParams?: {
    lang?: string;
  };
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) return { title: "ವಿಭಾಗ ಕಂಡುಬಂದಿಲ್ಲ" };

  const lang = (searchParams?.lang || "kn") as LanguageCode;
  const catName = getLocalizedCategoryName(params.slug, lang);

  return {
    title: `${catName} (${cat.englishName}) - EXTRASAGA`,
    description: cat.description || `${catName} cinema updates and reviews.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const currentCategory = CATEGORIES.find((c) => c.slug === params.slug);

  if (!currentCategory) {
    notFound();
  }

  const activeLang = (searchParams?.lang || "kn") as LanguageCode;
  const config = getLanguageConfig(activeLang);

  const isIndustrySlug = params.slug === "sandalwood";
  const localizedTitle =
    isIndustrySlug && activeLang !== "kn"
      ? config.industryName
      : getLocalizedCategoryName(params.slug, activeLang);

  const [articles, trendingArticles, reviews, boxOffice, ottReleases, videos, galleries] =
    await Promise.all([
      DataService.getArticles(params.slug as CategorySlug, activeLang),
      DataService.getTrendingArticles(5, activeLang),
      DataService.getReviews(activeLang),
      DataService.getBoxOffice(activeLang),
      DataService.getOttReleases(activeLang),
      DataService.getVideos(activeLang),
      DataService.getGalleries(activeLang),
    ]);

  const emptyTextMap: Record<string, { msg: string; back: string }> = {
    kn: { msg: "ಈ ವಿಭಾಗದಲ್ಲಿ ಸದ್ಯಕ್ಕೆ ಯಾವುದೇ ಲೇಖನಗಳಿಲ್ಲ.", back: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ" },
    te: { msg: "ఈ విభాగంలో ప్రస్తుతం ఎలాంటి వ్యాసాలు లేవు.", back: "హోమ్ పేజీకి వెళ్లండి" },
    ta: { msg: "இந்த பகுதியில் தற்போது செய்திகள் எதுவும் இல்லை.", back: "முகப்புக்குச் செல்லவும்" },
    ml: { msg: "ഈ വിഭാഗത്തിൽ ഇപ്പോൾ ಲേഖനങ്ങളൊന്നുമില്ല.", back: "ഹോം പേജിലേക്ക് പോകുക" },
    hi: { msg: "इस अनुभाग में फ़िलहाल कोई लेख उपलब्ध नहीं हैं।", back: "होम पेज पर वापस जाएं" },
    en: { msg: "No articles available in this category yet.", back: "Back to Home" },
  };

  const emptyText = emptyTextMap[activeLang] || emptyTextMap.kn;

  return (
    <div className="w-full">
      {/* Category Header Band */}
      <div className="projector-beam relative bg-hall border-b border-glow-line py-8 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-popcorn-dim mb-3 font-mono-tabular">
            <Link href={`/?lang=${activeLang}`} className="hover:text-popcorn font-medium transition-colors">
              {getTranslation(activeLang, "nav_home")}
            </Link>
            <span>/</span>
            <span className="text-signal-soft font-bold">{localizedTitle}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-display-latin font-black uppercase tracking-[0.2em] mb-3 text-ultra-soft border border-ultra/25 bg-ultra/10">
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                {config.industryName}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display-latin text-popcorn tracking-tight">
                {localizedTitle}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-popcorn-dim max-w-2xl">
                {currentCategory.description}
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-signal/10 text-signal-soft border border-signal/25 uppercase tracking-wider font-display-latin self-start md:self-auto shadow-2xs">
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

        {/* Regular Article Listing Grid (for Sandalwood, Latest, Bollywood, Hollywood, Actors, Actresses, Gossip, Interviews, Television, Celebrity, Events, Upcoming, Trending) */}
        {!["reviews", "box-office", "ott", "videos", "gallery"].includes(params.slug) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <main className="lg:col-span-8">
              <h2 className="text-lg font-bold text-popcorn mb-5 border-l-4 border-signal pl-3 font-sans">
                {localizedTitle} ({articles.length})
              </h2>

              {articles.length === 0 ? (
                <div className="bg-revealed p-12 rounded-2xl border border-glow-line shadow-sm text-center space-y-3">
                  <p className="text-base text-popcorn-dim">
                    {emptyText.msg}
                  </p>
                  <Link
                    href={`/?lang=${activeLang}`}
                    className="inline-block px-5 py-2.5 rounded-lg bg-signal-deep text-popcorn text-xs font-bold hover:bg-signal transition-colors"
                  >
                    {emptyText.back}
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

        {/* Supplementary In-Depth Articles for Specialized Pages (only if specific articles exist) */}
        {["reviews", "box-office", "ott", "videos", "gallery"].includes(params.slug) && articles.length > 0 && (
          <div className="mt-12 pt-8 border-t border-glow-line">
            <h3 className="text-lg font-bold text-popcorn mb-5 border-l-4 border-signal pl-3 font-sans">
              {localizedTitle} - ವಿಶೇಷ ವರದಿಗಳು ({articles.length})
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
