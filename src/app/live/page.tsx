import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import LiveUpdatesFeed from "@/components/LiveUpdatesFeed";
import TrendingSidebar from "@/components/TrendingSidebar";
import AdBanner from "@/components/AdBanner";
import { DataService } from "@/lib/dataService";
import { getLanguageConfig } from "@/lib/languages";
import { getTranslation } from "@/lib/translations";

export async function generateMetadata(): Promise<Metadata> {
  const config = getLanguageConfig("en");

  return {
    title: `EXTRA-SAAGA Live Wire | Real-Time All Indian Cinema Updates`,
    description: `Real-time minute-by-minute cinema breaking news, live box office tracking, and shooting updates across all Indian film industries.`,
  };
}

export default async function LiveWirePage() {
  const trendingArticles = await DataService.getTrendingArticles(5, "en");

  return (
    <div className="w-full bg-paper min-h-screen text-ink">
      {/* The Live Wire — Broadsheet Hero Band */}
      <div className="bg-sheet border-b-2 border-ink py-8 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs text-ink-dim mb-2 font-mono">
            <Link href="/" className="hover:text-press font-bold transition-colors">
              {getTranslation("en", "nav_home")}
            </Link>
            <span>/</span>
            <span className="text-press-deep font-bold">LIVE WIRE</span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="sticker bg-press text-paper border-2 border-ink px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 bg-paper animate-ping"></span>
              <span>LIVE WIRE</span>
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-band text-ink border-2 border-ink shadow-sticker">
              ALL INDIAN FILM INDUSTRIES
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-poster uppercase tracking-tight text-ink mt-2">
            REAL-TIME CINEMA <span className="text-press">LIVE WIRE</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-ink-dim max-w-2xl leading-relaxed font-grotesk font-medium">
            Direct from the heartbeat of the film industry. Continuous, authenticated dispatches capturing set whispers, midnight box office receipts, sudden casting breakthroughs, and the live rhythm of Indian cinema.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-8">
            <LiveUpdatesFeed />
          </main>

          <aside className="lg:col-span-4 space-y-6">
            <TrendingSidebar articles={trendingArticles} />
            <AdBanner placement="sidebar_rectangle" />
          </aside>
        </div>
      </div>
    </div>
  );
}
