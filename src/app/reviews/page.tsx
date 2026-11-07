import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Star, ShieldCheck, Film } from "lucide-react";
import { DataService } from "@/lib/dataService";
import ReviewsSection from "@/components/ReviewsSection";
import TrendingSidebar from "@/components/TrendingSidebar";
import AdBanner from "@/components/AdBanner";
import { getLanguageConfig } from "@/lib/languages";
import { getTranslation } from "@/lib/translations";
import { LanguageCode } from "@/types";

interface ReviewsPageProps {
  searchParams?: {
    lang?: string;
  };
}

export async function generateMetadata({ searchParams }: ReviewsPageProps): Promise<Metadata> {
  const lang = (searchParams?.lang || "kn") as LanguageCode;
  const config = getLanguageConfig(lang);

  return {
    title: `${config.reviewsSectionTitle} | EXTRASAGA`,
    description: `Unbiased movie reviews, dual-axis ratings, and critical verdicts for ${config.industryName} and Indian cinema.`,
  };
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const activeLang = (searchParams?.lang || "kn") as LanguageCode;
  const config = getLanguageConfig(activeLang);

  const [reviews, trendingArticles] = await Promise.all([
    DataService.getReviews(activeLang),
    DataService.getTrendingArticles(5, activeLang),
  ]);

  return (
    <div className="w-full">
      {/* The Verdict Desk — Header Band */}
      <div className="projector-beam relative bg-hall border-b border-glow-line py-8 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-popcorn-dim mb-3 font-mono-tabular">
            <Link href={`/?lang=${activeLang}`} className="hover:text-popcorn transition-colors">
              {getTranslation(activeLang, "nav_home")}
            </Link>
            <span>/</span>
            <span className="text-marquee-soft font-bold">
              {config.reviewsSectionTitle}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-block mb-3 uppercase font-display-latin text-[10px] tracking-[0.25em] text-ultra-soft border border-ultra/25 bg-ultra/10 rounded-full px-3 py-0.5">
                The Verdict Desk
              </span>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-display-latin font-black uppercase tracking-[0.2em] ${config.badgeColor} border border-glow-line`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                  {config.industryName}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-display-latin font-bold bg-marquee/10 text-marquee-soft border border-marquee/25">
                  <Star className="w-3 h-3 text-marquee-soft fill-marquee" />
                  Dual-Axis Storytelling & Technical Audits
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display-latin text-popcorn tracking-tight">
                {config.reviewsSectionTitle}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-popcorn-dim max-w-2xl font-normal leading-relaxed">
                ನಿಷ್ಪಕ್ಷಪಾತ ವಿಮರ್ಶೆಗಳು, ಕಥಾಹಂದರ ಮತ್ತು ತಾಂತ್ರಿಕ ಮೌಲ್ಯಮಾಪನ. 100% ಸ್ಪಾಯ್ಲರ್-ಮುಕ್ತ ಸಿನಿಮಾ ಮಾರ್ಗದರ್ಶಿ.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-revealed text-marquee-soft border border-marquee/25 uppercase tracking-wider font-mono-tabular">
                {reviews.length} Verified Reviews
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
