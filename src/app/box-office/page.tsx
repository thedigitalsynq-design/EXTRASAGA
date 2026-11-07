import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { DataService } from "@/lib/dataService";
import { BoxOfficeEngineService } from "@/lib/boxOfficeEngine/boxOfficeService";
import BoxOfficeClientHub from "@/components/BoxOfficeClientHub";
import TrendingSidebar from "@/components/TrendingSidebar";
import AdBanner from "@/components/AdBanner";
import { getLanguageConfig } from "@/lib/languages";
import { getTranslation } from "@/lib/translations";
import { LanguageCode } from "@/types";

interface BoxOfficePageProps {
  searchParams?: {
    lang?: string;
  };
}

export async function generateMetadata({ searchParams }: BoxOfficePageProps): Promise<Metadata> {
  const lang = (searchParams?.lang || "kn") as LanguageCode;
  const config = getLanguageConfig(lang);

  return {
    title: `${config.boxOfficeTitle} — Real-Time Multi-Source Cinema Tracking | CINI JAATRE`,
    description: `${config.industryName} automated box office tracking, multi-source consolidated gross, net, distributor share and live theatre occupancy telemetry.`,
  };
}

export default async function BoxOfficePage({ searchParams }: BoxOfficePageProps) {
  const activeLang = (searchParams?.lang || "kn") as LanguageCode;
  const config = getLanguageConfig(activeLang);

  const [records, cityTelemetry, trendingArticles] = await Promise.all([
    BoxOfficeEngineService.getConsolidatedRecords(activeLang),
    BoxOfficeEngineService.getCityTelemetry(),
    DataService.getTrendingArticles(5, activeLang),
  ]);

  return (
    <div className="w-full">
      {/* Top Header Breadcrumb Bar */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/90 py-6 px-4 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Link href={`/?lang=${activeLang}`} className="hover:text-gray-950 font-medium">
                {getTranslation(activeLang, "nav_home")}
              </Link>
              <span>/</span>
              <span className="text-[#A92732] font-bold">
                {getTranslation(activeLang, "nav_boxoffice")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-sans font-black uppercase tracking-wider ${config.badgeColor} border shadow-2xs`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                <span>{config.industryName} ರೇಡಾರ್</span>
              </span>
              <span className="text-xs font-mono font-bold text-gray-400">•</span>
              <span className="text-xs font-mono text-gray-500 font-bold uppercase tracking-wider">
                Multi-Source Aggregation Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-2xl font-sans font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ಏಕೀಕೃತ ನಿಷ್ಪಕ್ಷಪಾತ ವರದಿ (Consolidated Consensus)</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-8 space-y-8">
            <BoxOfficeClientHub
              initialRecords={records}
              initialCityTelemetry={cityTelemetry}
            />
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
