import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { DataService } from "@/lib/dataService";
import OttSection from "@/components/OttSection";
import TrendingSidebar from "@/components/TrendingSidebar";
import AdBanner from "@/components/AdBanner";
import { getLanguageConfig } from "@/lib/languages";
import { getTranslation } from "@/lib/translations";

export async function generateMetadata(): Promise<Metadata> {
  const config = getLanguageConfig("en");

  return {
    title: `${config.ottTitle} | EXTRASAGA`,
    description: `All Indian cinema verified OTT streaming dates and upcoming digital premiere radar.`,
  };
}

export default async function OttPage() {
  const config = getLanguageConfig("en");

  const [ottReleases, trendingArticles] = await Promise.all([
    DataService.getOttReleases(),
    DataService.getTrendingArticles(5, "en"),
  ]);

  return (
    <div className="w-full bg-paper min-h-screen text-ink">
      {/* Now Streaming — Broadsheet Hero Band */}
      <div className="bg-sheet border-b-2 border-ink py-8 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs text-ink-dim mb-2 font-mono">
            <Link href="/" className="hover:text-press font-bold transition-colors">
              {getTranslation("en", "nav_home")}
            </Link>
            <span>/</span>
            <span className="text-press-deep font-bold">
              {getTranslation("en", "nav_ott")}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="sticker bg-violet text-paper border-2 border-ink px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase">
              NOW STREAMING
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-band text-ink border-2 border-ink shadow-sticker">
              ALL INDIAN FILM INDUSTRIES
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-poster uppercase tracking-tight text-ink mt-2">
            DIGITAL STREAM<span className="text-violet">ING</span> WIRE
          </h1>
          <p className="text-xs sm:text-sm text-ink-dim mt-2 font-grotesk font-medium max-w-2xl">
            Bringing the magic of the silver screen straight into your living room. Independently verified digital premiere dates, direct streaming links, and curated watchlists across every major platform.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-8 space-y-8">
            <OttSection releases={ottReleases} />
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
