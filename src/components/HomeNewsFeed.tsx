"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Newspaper, Sparkles } from "lucide-react";
import { Article, AdSpot } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { DataService } from "@/lib/dataService";
import ArticleCard from "@/components/ArticleCard";
import TrendingSidebar from "@/components/TrendingSidebar";
import AdBanner from "@/components/AdBanner";

interface HomeNewsFeedProps {
  initialArticles: Article[];
  initialTrending: Article[];
  sidebarAd?: AdSpot | null;
  hideSidebar?: boolean;
}

export default function HomeNewsFeed({
  initialArticles,
  initialTrending,
  sidebarAd,
  hideSidebar = false,
}: HomeNewsFeedProps) {
  const { language, config, t, localizeUrl } = useLanguage();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [trending, setTrending] = useState<Article[]>(initialTrending);
  const isInitialRef = React.useRef(true);

  useEffect(() => {
    if (isInitialRef.current) {
      isInitialRef.current = false;
      return;
    }
    let isMounted = true;
    Promise.all([
      DataService.getArticles(language),
      DataService.getTrendingArticles(5, language),
    ]).then(([fetchedArticles, fetchedTrending]) => {
      if (isMounted) {
        if (fetchedArticles && fetchedArticles.length > 0) {
          setArticles(fetchedArticles);
        }
        if (fetchedTrending && fetchedTrending.length > 0) {
          setTrending(fetchedTrending);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [language]);

  const latestNews = articles.slice(0, 6);

  // Industry special news: for Sandalwood filter by category 'sandalwood'; for other languages filter by language or take articles
  const industrySpecial =
    language === "kn"
      ? articles.filter((a) => a.category === "sandalwood").slice(0, 3)
      : articles.filter((a) => a.language === language || a.industry === config.industry).slice(0, 3);

  const finalSpecial = industrySpecial.length > 0 ? industrySpecial : articles.slice(0, 3);

  const latestSectionTitle = `${t("sec_latest_news")} (${config.industryName})`;

  const newsGridContent = (
    <div>
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-crimson/10 text-brand-crimson border border-brand-crimson/20">
            <Newspaper className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 font-sans">
              {latestSectionTitle}
            </h2>
            <span
              className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-black uppercase tracking-wider ${config.badgeColor} border shadow-2xs`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
              {config.industryName}
            </span>
          </div>
        </div>

        <Link
          href={localizeUrl("/category/latest")}
          className="text-xs sm:text-sm font-semibold text-brand-crimson hover:text-[#8e1d27] flex items-center gap-1 transition-colors"
        >
          <span>{t("btn_all_news")}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid of latest articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {latestNews.map((article) => (
          <ArticleCard key={article.id} article={article} variant="grid" />
        ))}
      </div>

      {/* Load more button in glass styling */}
      <div className="mt-8 text-center">
        <Link
          href={localizeUrl("/category/latest")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-gray-50 text-gray-900 text-sm font-bold transition-all border border-gray-200 shadow-sm hover:shadow-md active:scale-95"
        >
          <span>{t("btn_more_news")}</span>
          <ChevronRight className="w-4 h-4 text-brand-crimson" />
        </Link>
      </div>
    </div>
  );

  const industrySpecialContent = (
    <div className="pt-2">
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 font-sans">
                {config.newsSectionTitle}
              </h2>
              <span
                className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-black uppercase tracking-wider ${config.badgeColor} border shadow-2xs`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                {config.industryName}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{config.tagline}</p>
          </div>
        </div>

        <Link
          href={localizeUrl(language === "kn" ? "/category/sandalwood" : "/category/latest")}
          className="text-xs sm:text-sm font-semibold text-amber-800 hover:underline flex items-center gap-1 transition-colors"
        >
          <span>
            {config.industryName} {t("btn_view_all")}
          </span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {finalSpecial.map((article) => (
          <ArticleCard key={article.id} article={article} variant="grid" />
        ))}
      </div>
    </div>
  );

  if (hideSidebar) {
    return (
      <div className="space-y-10">
        {newsGridContent}
        {industrySpecialContent}
      </div>
    );
  }

  return (
    <>
      {/* Main Content Grid: Latest News (Col 8) + Trending Sidebar (Col 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-10">
        <div className="lg:col-span-8">{newsGridContent}</div>
        <div className="lg:col-span-4 space-y-6">
          <TrendingSidebar articles={trending} />
          <AdBanner placement="sidebar_rectangle" ad={sidebarAd} />
        </div>
      </div>

      {/* Industry Special News Section */}
      <section className="my-12">{industrySpecialContent}</section>
    </>
  );
}
