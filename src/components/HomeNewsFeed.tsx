"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Newspaper, Sparkles, Layers } from "lucide-react";
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
  const { language, t, localizeUrl } = useLanguage();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [trending, setTrending] = useState<Article[]>(initialTrending);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
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

  const filteredArticles = selectedIndustry === "all"
    ? articles
    : articles.filter((a) => {
        if (a.industry === selectedIndustry) return true;
        const cat = a.category as string;
        if (selectedIndustry === "bollywood" && (cat === "bollywood" || a.title.includes("Bollywood") || a.title.includes("Ranbir") || a.title.includes("War"))) return true;
        if (selectedIndustry === "tollywood" && (cat === "tollywood" || a.title.includes("Pushpa") || a.title.includes("Mahesh") || a.title.includes("Devara"))) return true;
        if (selectedIndustry === "sandalwood" && (cat === "sandalwood" || a.title.includes("Kantara") || a.title.includes("Yash") || a.title.includes("UI") || a.title.includes("Bagheera"))) return true;
        if (selectedIndustry === "kollywood" && (cat === "kollywood" || a.title.includes("Coolie") || a.title.includes("Vettaiyan") || a.title.includes("Rajinikanth"))) return true;
        if (selectedIndustry === "mollywood" && (cat === "mollywood" || a.title.includes("Empuraan") || a.title.includes("Mohanlal"))) return true;
        return false;
      });

  const latestNews = filteredArticles.slice(0, 6);
  const industrySpecial = filteredArticles.slice(6, 12).length > 0 ? filteredArticles.slice(6, 12) : filteredArticles.slice(0, 3);

  const newsGridContent = (
    <div className="bg-sheet border-2 border-ink shadow-press p-5 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b-2 border-ink gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-press border-2 border-ink shadow-sticker flex items-center justify-center -rotate-3 text-paper shrink-0">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-poster font-bold text-ink uppercase tracking-tight">
                THE FEED — INDIAN CINEMA WIRE
              </h2>
            </div>
            <p className="text-[11px] text-ink-dim font-medium font-sans">
              All 6 industries · Verified trade dispatches · Zero promotional fluff
            </p>
          </div>
        </div>

        {/* Industry Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[10px] text-ink font-poster font-bold uppercase tracking-widest shrink-0 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-press" />
            <span>FILTER:</span>
          </span>
          {[
            { id: "all", label: "All Cinema" },
            { id: "bollywood", label: "Bollywood" },
            { id: "tollywood", label: "Tollywood" },
            { id: "sandalwood", label: "Sandalwood" },
            { id: "kollywood", label: "Kollywood" },
            { id: "mollywood", label: "Mollywood" },
          ].map((ind) => (
            <button
              key={ind.id}
              type="button"
              onClick={() => setSelectedIndustry(ind.id)}
              className={`px-3 py-1 text-[11px] font-poster font-bold uppercase tracking-wider shrink-0 transition-all border-2 border-ink ${
                selectedIndustry === ind.id
                  ? "bg-press text-paper shadow-sticker -rotate-1"
                  : "bg-paper text-ink hover:bg-marquee shadow-2xs"
              }`}
            >
              {ind.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of latest articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {latestNews.map((article) => (
          <ArticleCard key={article.id} article={article} variant="grid" />
        ))}
      </div>

      {/* Load more button in ticket-stub styling */}
      <div className="mt-8 text-center pt-5 border-t-2 border-dashed border-ink/20">
        <Link
          href={localizeUrl("/category/latest")}
          className="inline-flex items-center gap-2 px-8 py-3 bg-ink text-paper hover:bg-press border-2 border-ink shadow-sticker hover:shadow-press text-xs font-poster font-bold uppercase tracking-widest transition-all -rotate-1 active:scale-95"
        >
          <span>PULL UP THE WHOLE FEED</span>
          <ChevronRight className="w-4 h-4 text-marquee" />
        </Link>
      </div>
    </div>
  );

  const industrySpecialContent = (
    <div className="bg-sheet border-2 border-ink shadow-press p-5 sm:p-7">
      <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-ink gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-violet border-2 border-ink shadow-sticker flex items-center justify-center rotate-2 text-paper shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-poster font-bold text-ink uppercase tracking-tight">
              TRADE DOSSIER — MULTI-INDUSTRY DESK
            </h2>
            <p className="text-[11px] text-ink-dim font-medium font-sans">
              Exclusive production scoops, shooting schedules, and casting confirmations
            </p>
          </div>
        </div>

        <Link
          href={localizeUrl("/category/latest")}
          className="px-3.5 py-1.5 bg-marquee text-ink hover:bg-paper border-2 border-ink text-xs font-poster font-bold uppercase tracking-wider shadow-sticker flex items-center gap-1 transition-colors"
        >
          <span>FULL WIRE</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {industrySpecial.map((article) => (
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-10">
        <div className="lg:col-span-8">{newsGridContent}</div>
        <div className="lg:col-span-4 space-y-6">
          <TrendingSidebar articles={trending} />
          <AdBanner placement="sidebar_rectangle" ad={sidebarAd} />
        </div>
      </div>

      <section className="my-12">{industrySpecialContent}</section>
    </>
  );
}
