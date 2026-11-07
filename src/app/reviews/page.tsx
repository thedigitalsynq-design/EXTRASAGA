import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Star, ShieldCheck, Film, Award } from "lucide-react";
import { DataService } from "@/lib/dataService";
import ReviewsSection from "@/components/ReviewsSection";
import TrendingSidebar from "@/components/TrendingSidebar";
import AdBanner from "@/components/AdBanner";
import { getLanguageConfig } from "@/lib/languages";
import { getTranslation } from "@/lib/translations";

export const metadata: Metadata = {
  title: "The Verdict Desk — All-India Film Reviews & Dual-Axis Audits | EXTRASAGA",
  description:
    "Unbiased movie reviews, dual-axis storytelling and technical audits, and spoiler-free critical verdicts covering all Indian film industries.",
};

export default async function ReviewsPage() {
  const config = getLanguageConfig("en");

  const [reviews, trendingArticles] = await Promise.all([
    DataService.getReviews(),
    DataService.getTrendingArticles(5, "en"),
  ]);

  return (
    <div className="w-full">
      {/* The Verdict Desk — Press Header Band */}
      <div className="relative bg-sheet border-b-2 border-ink py-8 px-4 sm:px-6 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 halftone-faint opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-ink-dim mb-3 font-mono-tabular">
            <Link href="/" className="hover:text-press font-semibold transition-colors">
              Home
            </Link>
            <span className="text-ink/30">/</span>
            <span className="text-ink font-bold font-poster uppercase tracking-wider text-[11px]">
              The Verdict Desk
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-violet text-paper border-2 border-ink shadow-sticker text-[10px] font-poster font-bold uppercase tracking-widest -rotate-1 select-none">
                  <Award className="w-3.5 h-3.5" />
                  <span>The Verdict Desk</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-paper text-ink border-2 border-ink shadow-sticker text-[10px] font-poster font-bold uppercase tracking-wider select-none rotate-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-press animate-pulse"></span>
                  <span>All Indian Cinema</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-marquee text-ink border border-ink text-[10px] font-mono font-bold uppercase select-none">
                  <Star className="w-3 h-3 fill-ink text-ink" />
                  <span>Dual-Axis Storytelling & Technical Audits</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-poster font-bold text-ink uppercase tracking-tight leading-tight">
                CRITICAL VERDICTS · ALL FILM INDUSTRIES
              </h1>

              <p className="mt-2 text-xs sm:text-sm text-ink-dim max-w-2xl font-sans font-medium leading-relaxed">
                Cinema dissected with respect and fearless honesty. From technical visual mastery to the deepest emotional cadence of storytelling, explore spoiler-free verdicts covering every corner of Indian cinema.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <span className="text-xs font-poster font-bold px-4 py-2 bg-marquee text-ink border-2 border-ink shadow-sticker uppercase tracking-wider">
                {reviews.length} VERIFIED REVIEWS
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Reviews Pavilion */}
          <main className="lg:col-span-8">
            <ReviewsSection reviews={reviews} />
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
