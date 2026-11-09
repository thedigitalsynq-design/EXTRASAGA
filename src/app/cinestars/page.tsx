import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import CineStarLeaderboard from "@/components/CineStarLeaderboard";
import TrendingSidebar from "@/components/TrendingSidebar";
import AdBanner from "@/components/AdBanner";
import { DataService } from "@/lib/dataService";
import { CINESTAR_SUMMARY_STATS } from "@/data/cineStarData";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `CineStar Leaderboard — Real-Time Rankings | EXTRA-SAAGA`,
    description: `India's most powerful cinema personalities ranked by box office power, cultural impact & daily momentum across all Indian film industries.`,
  };
}

export default async function CineStarsPage() {
  const trendingArticles = await DataService.getTrendingArticles(5, "en");

  return (
    <div className="w-full bg-paper min-h-screen text-ink">
      {/* CineStar Power Rankings — Broadsheet Hero Band */}
      <div className="bg-sheet border-b-2 border-ink py-8 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-ink-dim mb-3 font-mono">
            <Link href="/" className="hover:text-press font-bold transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-press-deep font-bold">CineStar Leaderboard</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="sticker bg-press text-paper border-2 border-ink px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-paper animate-ping" />
                  REAL-TIME RANKINGS
                </span>
                <span className="text-ink-mute text-[11px] font-mono font-bold">
                  UPDATED: {new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} IST
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-poster uppercase tracking-tight text-ink mt-2">
                CINESTAR<span className="text-press"> LEADERBOARD</span>
              </h1>
              <p className="text-ink-dim text-xs sm:text-sm mt-2 max-w-xl font-grotesk font-medium leading-relaxed">
                India&apos;s living index of screen sovereignty. Tracking the stars whose names fill single screens with thunder and whose craft leaves an indelible stamp upon the cultural fabric of Indian cinema.
              </p>
            </div>

            {/* Summary pill strip */}
            <div className="flex flex-wrap gap-3 shrink-0">
              <div className="bg-paper border-2 border-ink shadow-sticker px-4 py-3 text-center">
                <div className="text-2xl font-poster uppercase text-ink">{CINESTAR_SUMMARY_STATS.totalTracked}</div>
                <div className="text-[10px] text-ink-dim font-grotesk font-bold uppercase">Stars Tracked</div>
              </div>
              <div className="bg-paper border-2 border-ink shadow-sticker px-4 py-3 text-center">
                <div className="text-2xl font-poster uppercase text-ink">
                  ₹{(CINESTAR_SUMMARY_STATS.totalBoxOfficePowerCr / 1000).toFixed(0)}K Cr
                </div>
                <div className="text-[10px] text-ink-dim font-grotesk font-bold uppercase">Combined Power</div>
              </div>
              <div className="bg-marquee text-ink border-2 border-ink shadow-sticker px-4 py-3 text-center">
                <div className="text-2xl font-poster uppercase text-ink">
                  +{CINESTAR_SUMMARY_STATS.topGainerChangePct}%
                </div>
                <div className="text-[10px] text-ink font-grotesk font-bold uppercase">Top Gainer Today</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Leaderboard — 9 cols */}
          <main className="lg:col-span-9">
            <CineStarLeaderboard />
          </main>

          {/* Sidebar — 3 cols */}
          <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-20 self-start">
            {/* Methodology card */}
            <div className="bg-sheet border-2 border-ink shadow-press p-5">
              <h3 className="text-xs font-poster uppercase tracking-wider text-ink mb-3 flex items-center gap-2">
                <span className="w-5 h-5 bg-ink text-paper border border-ink flex items-center justify-center text-[10px] font-bold">?</span>
                <span>RANKING METHODOLOGY</span>
              </h3>
              <ul className="space-y-2 text-xs font-grotesk text-ink-dim">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-press mt-1.5 shrink-0" />
                  Box office power — lifetime verified gross from consolidated trade
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-press mt-1.5 shrink-0" />
                  Daily momentum — opening collections of active releases
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-press mt-1.5 shrink-0" />
                  Cultural influence — social &amp; editorial coverage weight
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-press mt-1.5 shrink-0" />
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
