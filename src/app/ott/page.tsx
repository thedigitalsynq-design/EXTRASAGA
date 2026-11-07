import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { DataService } from "@/lib/dataService";
import OttSection from "@/components/OttSection";
import TrendingSidebar from "@/components/TrendingSidebar";
import AdBanner from "@/components/AdBanner";
import { getLanguageConfig } from "@/lib/languages";
import { getTranslation } from "@/lib/translations";
import { LanguageCode } from "@/types";

interface OttPageProps {
  searchParams?: {
    lang?: string;
  };
}

export async function generateMetadata({ searchParams }: OttPageProps): Promise<Metadata> {
  const lang = (searchParams?.lang || "kn") as LanguageCode;
  const config = getLanguageConfig(lang);

  return {
    title: `${config.ottTitle} | FILMY GARAGE`,
    description: `${config.industryName} OTT streaming dates and upcoming digital releases.`,
  };
}

export default async function OttPage({ searchParams }: OttPageProps) {
  const activeLang = (searchParams?.lang || "kn") as LanguageCode;
  const config = getLanguageConfig(activeLang);

  const [ottReleases, trendingArticles] = await Promise.all([
    DataService.getOttReleases(activeLang),
    DataService.getTrendingArticles(5, activeLang),
  ]);

  return (
    <div className="w-full">
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/90 py-8 px-4 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Link href={`/?lang=${activeLang}`} className="hover:text-gray-950 font-medium">
              {getTranslation(activeLang, "nav_home")}
            </Link>
            <span>/</span>
            <span className="text-sky-700 font-bold">
              {getTranslation(activeLang, "nav_ott")}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-black uppercase tracking-wider ${config.badgeColor} border`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
              {config.industryName}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            {config.ottTitle}
          </h1>
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
