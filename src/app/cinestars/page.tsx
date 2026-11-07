import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import CineStarLeaderboard from "@/components/CineStarLeaderboard";
import TrendingSidebar from "@/components/TrendingSidebar";
import AdBanner from "@/components/AdBanner";
import { DataService } from "@/lib/dataService";
import { getLanguageConfig } from "@/lib/languages";
import { LanguageCode } from "@/types";
import { CINESTAR_SUMMARY_STATS } from "@/data/cineStarData";

interface CineStarsPageProps {
  searchParams?: { lang?: string };
}

export async function generateMetadata({ searchParams }: CineStarsPageProps): Promise<Metadata> {
  const lang = (searchParams?.lang || "kn") as LanguageCode;
  const config = getLanguageConfig(lang);
  return {
    title: `ಸಿನಿಸ್ಟಾರ್ ಲೀಡರ್‌ಬೋರ್ಡ್ — CineStar Real-Time Rankings | CiniJaatre`,
    description: `India's most powerful cinema personalities ranked by box office power, cultural impact & daily momentum. ${CINESTAR_SUMMARY_STATS.totalTracked} stars tracked across Sandalwood, Tollywood, Kollywood, Mollywood & Bollywood.`,
    openGraph: {
      title: "CineStar Real-Time Leaderboard — India's Most Powerful Cinema Personalities",
      description: `${CINESTAR_SUMMARY_STATS.totalTracked} cinema stars. ₹${(CINESTAR_SUMMARY_STATS.totalBoxOfficePowerCr / 1000).toFixed(0)}K Cr combined power. Updated daily.`,
    },
  };
}

export default async function CineStarsPage({ searchParams }: CineStarsPageProps) {
  const activeLang = (searchParams?.lang || "kn") as LanguageCode;
  const config = getLanguageConfig(activeLang);
  const trendingArticles = await DataService.getTrendingArticles(5, activeLang);

  return (
    <div className="w-full">
      {/* ─── Forbes-style Page Header Banner ─── */}
      <div className="bg-[#0F3529] text-white py-6 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(183,229,186,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(183,229,186,0.4) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="max-w-7xl mx-auto relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#B7E5BA]/70 mb-3 font-medium">
            <Link href={`/?lang=${activeLang}`} className="hover:text-[#B7E5BA] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#B7E5BA]">CineStar Leaderboard</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                {/* Live pulse badge */}
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#288760]/30 border border-[#5CA87C]/40 text-[#B7E5BA] text-[11px] font-black uppercase tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B7E5BA] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B7E5BA]" />
                  </span>
                  Real-Time Rankings
                </span>
                <span className="text-[#5CA87C]/60 text-[11px] font-mono">
                  Updated: {new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} IST
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
                CineStar<span className="text-[#5CA87C]"> Leaderboard</span>
              </h1>
              <p className="text-[#B7E5BA]/80 text-sm sm:text-base mt-2 max-w-xl font-medium">
                India's definitive real-time ranking of the most powerful cinema personalities — by box office dominance, cultural influence, and daily market momentum.
              </p>
            </div>

            {/* Summary pill strip */}
            <div className="flex flex-wrap gap-3 shrink-0">
              <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 text-center">
                <div className="text-2xl font-black text-white font-mono">{CINESTAR_SUMMARY_STATS.totalTracked}</div>
                <div className="text-[11px] text-[#B7E5BA]/80 font-semibold">Stars Tracked</div>
              </div>
              <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 text-center">
                <div className="text-2xl font-black text-white font-mono">
                  ₹{(CINESTAR_SUMMARY_STATS.totalBoxOfficePowerCr / 1000).toFixed(0)}K Cr
                </div>
                <div className="text-[11px] text-[#B7E5BA]/80 font-semibold">Combined Power</div>
              </div>
              <div className="bg-[#288760]/40 border border-[#5CA87C]/40 backdrop-blur-sm rounded-2xl px-4 py-3 text-center">
                <div className="text-2xl font-black text-[#B7E5BA] font-mono">
                  +{CINESTAR_SUMMARY_STATS.topGainerChangePct}%
                </div>
                <div className="text-[11px] text-[#B7E5BA]/80 font-semibold">Top Gainer Today</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Leaderboard — 9 cols */}
          <main className="lg:col-span-9">
            <CineStarLeaderboard />
          </main>

          {/* Sidebar — 3 cols */}
          <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-20 self-start">
            {/* Methodology card */}
            <div className="bg-white rounded-[24px] border border-[#E5EBE7] p-5 shadow-sm">
              <h3 className="text-sm font-black text-[#0F3529] mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E8F8EB] border border-[#B7E5BA] flex items-center justify-center text-[#288760] text-[10px] font-black">?</span>
                ರ‍್ಯಾಂಕಿಂಗ್ ವಿಧಾನ
              </h3>
              <ul className="space-y-2 text-xs text-[#4B6358]">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#288760] mt-1.5 shrink-0" />
                  Box office power — lifetime verified gross from consolidated trade
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#288760] mt-1.5 shrink-0" />
                  Daily momentum — opening collections of active releases
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#288760] mt-1.5 shrink-0" />
                  Cultural influence — social & editorial coverage weight
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#288760] mt-1.5 shrink-0" />
                  Zero paid AI — 100% deterministic algorithm
                </li>
              </ul>
            </div>

            {/* Trending news */}
            <TrendingSidebar articles={trendingArticles} />

            <AdBanner placement="sidebar_rectangle" />
          </aside>
        </div>
      </div>
    </div>
  );
}
