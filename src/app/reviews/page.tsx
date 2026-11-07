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
    title: `${config.reviewsSectionTitle} | FILMY GARAGE`,
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
      {/* Header Banner */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 py-8 px-4 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <Link href={`/?lang=${activeLang}`} className="hover:text-brand-crimson transition-colors">
              {getTranslation(activeLang, "nav_home")}
            </Link>
            <span>/</span>
            <span className="text-amber-700 font-bold">
              {config.reviewsSectionTitle}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-black uppercase tracking-wider ${config.badgeColor} border`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                  {config.industryName}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <Star className="w-3 h-3 text-amber-600 fill-amber-500" />
                  Dual-Axis Storytelling & Technical Audits
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-950 font-sans">
                {config.reviewsSectionTitle}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-gray-600 max-w-2xl font-normal leading-relaxed">
                ನಿಷ್ಪಕ್ಷಪಾತ ವಿಮರ್ಶೆಗಳು, ಕಥಾಹಂದರ ಮತ್ತು ತಾಂತ್ರಿಕ ಮೌಲ್ಯಮಾಪನ. 100% ಸ್ಪಾಯ್ಲರ್-ಮುಕ್ತ ಸಿನಿಮಾ ಮಾರ್ಗದರ್ಶಿ.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 uppercase tracking-wider font-mono">
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

