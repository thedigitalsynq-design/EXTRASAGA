import React from "react";
import Link from "next/link";
import { ChevronRight, Newspaper, Flame, Film, Sparkles } from "lucide-react";
import { DataService } from "@/lib/dataService";
import BreakingTicker from "@/components/BreakingTicker";
import HeroTopStories from "@/components/HeroTopStories";
import TrendingSidebar from "@/components/TrendingSidebar";
import ArticleCard from "@/components/ArticleCard";
import ReviewsSection from "@/components/ReviewsSection";
import BoxOfficeTable from "@/components/BoxOfficeTable";
import OttSection from "@/components/OttSection";
import VideoSection from "@/components/VideoSection";
import PhotoGallerySection from "@/components/PhotoGallerySection";
import AdBanner from "@/components/AdBanner";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const [
    allArticles,
    breakingNews,
    topStories,
    trendingArticles,
    reviews,
    boxOffice,
    ottReleases,
    videos,
    galleries,
    headerAd,
    sidebarAd,
  ] = await Promise.all([
    DataService.getArticles(),
    DataService.getBreakingNews(),
    DataService.getTopStories(),
    DataService.getTrendingArticles(5),
    DataService.getReviews(),
    DataService.getBoxOffice(),
    DataService.getOttReleases(),
    DataService.getVideos(),
    DataService.getGalleries(),
    DataService.getAdByPlacement("header_leaderboard"),
    DataService.getAdByPlacement("sidebar_rectangle"),
  ]);

  const sandalwoodNews = allArticles.filter((a) => a.category === "sandalwood");
  const latestNews = allArticles.slice(0, 6);

  return (
    <div className="w-full">
      {/* 1. Breaking News Ticker */}
      <BreakingTicker articles={breakingNews} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Header Ad Slot */}
        <AdBanner placement="header_leaderboard" ad={headerAd} />

        {/* 2. Top Stories Hero Section */}
        <HeroTopStories articles={topStories.length > 0 ? topStories : allArticles.slice(0, 3)} />

        {/* 3. Main Content Grid: Latest News (Col 8) + Trending Sidebar (Col 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-10">
          {/* Col 8: Latest News Grid */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-red/20 text-brand-red">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white font-kannada">
                    ಇತ್ತೀಚಿನ ತಾಜಾ ಸುದ್ದಿ (Latest News)
                  </h2>
                </div>
              </div>

              <Link
                href="/category/latest"
                className="text-xs sm:text-sm font-semibold text-brand-red hover:text-white flex items-center gap-1 font-kannada transition-colors"
              >
                <span>ಎಲ್ಲಾ ಸುದ್ದಿ</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Grid of latest articles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {latestNews.map((article) => (
                <ArticleCard key={article.id} article={article} variant="grid" />
              ))}
            </div>

            {/* Load more button */}
            <div className="mt-8 text-center">
              <Link
                href="/category/latest"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-card hover:bg-brand-red text-white text-sm font-bold font-kannada transition-colors border border-brand-border shadow-lg"
              >
                <span>ಮತ್ತಷ್ಟು ಸುದ್ದಿಗಳು ವೀಕ್ಷಿಸಿ</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Col 4: Trending News Sidebar & Ads */}
          <div className="lg:col-span-4 space-y-6">
            <TrendingSidebar articles={trendingArticles} />
            <AdBanner placement="sidebar_rectangle" ad={sidebarAd} />
          </div>
        </div>

        {/* 4. Sandalwood Special News Section */}
        <section className="my-12">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-brand-border">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-kannada">
                  ಸ್ಯಾಂಡಲ್ವುಡ್ ವಿಶೇಷ ಸಮಾಚಾರ (Sandalwood Special)
                </h2>
                <p className="text-xs text-brand-muted font-kannada">
                  ಕನ್ನಡದ ನೆಚ್ಚಿನ ಸ್ಟಾರ್‌ಗಳು, ಹೊಸ ಚಿತ್ರಗಳ ಅನೌನ್ಸ್‌ಮೆಂಟ್ & ಅಪ್ಡೇಟ್ಸ್
                </p>
              </div>
            </div>

            <Link
              href="/category/sandalwood"
              className="text-xs sm:text-sm font-semibold text-amber-400 hover:text-white flex items-center gap-1 font-kannada transition-colors"
            >
              <span>ಸ್ಯಾಂಡಲ್ವುಡ್ ಪೇಜ್</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {sandalwoodNews.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} article={article} variant="grid" />
            ))}
          </div>
        </section>

        {/* In-Article / In-Feed Banner Ad */}
        <AdBanner placement="in_article" />

        {/* 5. Movie Reviews Section with Star Ratings */}
        <ReviewsSection reviews={reviews} />

        {/* 6. Videos & YouTube Trailers Section */}
        <VideoSection videos={videos} />

        {/* 7. OTT Releases Hub */}
        <OttSection releases={ottReleases} />

        {/* 8. Box Office Leaderboard */}
        <BoxOfficeTable entries={boxOffice} />

        {/* 9. Celebrity Photo Gallery */}
        <PhotoGallerySection galleries={galleries} />

        {/* Footer Banner Ad */}
        <AdBanner placement="footer_banner" />
      </div>
    </div>
  );
}
