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
      {/* ─── CineStar Power Rankings — Hero Band ─── */}
      <div className="projector-beam relative bg-hall border-b border-glow-line py-8 px-4 sm:px-6 overflow-hidden">
        {/* Cinema grid pattern */}
        <div className="cinema-grid-bg absolute inset-0 opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-popcorn-dim mb-3 font-mono-tabular">
            <Link href={`/?lang=${activeLang}`} className="hover:text-popcorn transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-marquee-soft">CineStar Leaderboard</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                {/* Live pulse badge */}
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-signal/10 border border-signal/25 text-signal-soft text-[11px] font-black uppercase tracking-[0.2em] font-display-latin">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-signal" />
                  </span>
                  Real-Time Rankings
                </span>
                <span className="text-popcorn-muted text-[11px] font-mono-tabular">
                  Updated: {new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} IST
                </span>
              </div>
              <span className="inline-block mb-2 uppercase font-display-latin text-[10px] tracking-[0.25em] text-ultra-soft border border-ultra/25 bg-ultra/10 rounded-full px-3 py-0.5">
                CineStar Power Rankings
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold font-display-latin text-popcorn tracking-tight leading-none">
                CineStar<span className="text-marquee-soft"> Leaderboard</span>
              </h1>
              <p className="text-popcorn-dim text-sm sm:text-base mt-2 max-w-xl font-medium">
                India's definitive real-time ranking of the most powerful cinema personalities — by box office dominance, cultural influence, and daily market momentum.
              </p>
            </div>

            {/* Summary pill strip */}
            <div className="flex flex-wrap gap-3 shrink-0">
              <div className="bg-revealed border border-glow-line rounded-2xl px-4 py-3 text-center">
                <div className="text-2xl font-black font-mono-tabular text-popcorn">{CINESTAR_SUMMARY_STATS.totalTracked}</div>
                <div className="text-[11px] text-popcorn-dim font-semibold">Stars Tracked</div>
              </div>
              <div className="bg-revealed border border-glow-line rounded-2xl px-4 py-3 text-center">
                <div className="text-2xl font-black font-mono-tabular text-popcorn">
                  ₹{(CINESTAR_SUMMARY_STATS.totalBoxOfficePowerCr / 1000).toFixed(0)}K Cr
                </div>
                <div className="text-[11px] text-popcorn-dim font-semibold">Combined Power</div>
              </div>
              <div className="bg-marquee/10 border border-marquee/25 rounded-2xl px-4 py-3 text-center">
                <div className="text-2xl font-black font-mono-tabular text-marquee-soft">
                  +{CINESTAR_SUMMARY_STATS.topGainerChangePct}%
                </div>
                <div className="text-[11px] text-marquee-soft/80 font-semibold">Top Gainer Today</div>
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
            <div className="bg-revealed rounded-[24px] border border-glow-line p-5 shadow-sm">
              <h3 className="text-sm font-black text-popcorn mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-ultra/15 border border-ultra/30 flex items-center justify-center text-ultra-soft text-[10px] font-black">?</span>
                ರ‍್ಯಾಂಕಿಂಗ್ ವಿಧಾನ
              </h3>
              <ul className="space-y-2 text-xs text-popcorn-dim">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-marquee mt-1.5 shrink-0" />
                  Box office power — lifetime verified gross from consolidated trade
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-marquee mt-1.5 shrink-0" />
                  Daily momentum — opening collections of active releases
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-marquee mt-1.5 shrink-0" />
                  Cultural influence — social & editorial coverage weight
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-marquee mt-1.5 shrink-0" />
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
