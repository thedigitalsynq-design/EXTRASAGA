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

export async function generateMetadata(): Promise<Metadata> {
  const config = getLanguageConfig("en");

  return {
    title: `${config.boxOfficeTitle} — Real-Time Multi-Source Cinema Tracking | EXTRA-SAAGA`,
    description: `All Indian cinema automated box office tracking, multi-source consolidated gross, net, distributor share and live theatre occupancy telemetry.`,
  };
}

export default async function BoxOfficePage() {
  const activeLang = "en" as LanguageCode;
  const config = getLanguageConfig(activeLang);

  const [records, cityTelemetry, trendingArticles] = await Promise.all([
    BoxOfficeEngineService.getConsolidatedRecords(),
    BoxOfficeEngineService.getCityTelemetry(),
    DataService.getTrendingArticles(5, activeLang),
  ]);

  return (
    <div className="w-full bg-paper min-h-screen text-ink">
      {/* The Receipts — Cinema Hero Band */}
      <div className="bg-sheet border-b border-line py-8 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-ink-dim mb-2 font-mono">
                <Link href="/" className="hover:text-press font-bold transition-colors">
                  {getTranslation(activeLang, "nav_home")}
                </Link>
                <span>/</span>
                <span className="text-press-soft font-bold">
                  {getTranslation(activeLang, "nav_boxoffice")}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="sticker bg-press text-paper border border-line px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded">
                  THE RECEIPTS
                </span>
                <span className="px-3 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-band text-ink border border-line rounded shadow-sm">
                  MULTI-SOURCE CONSOLIDATED
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-poster uppercase tracking-tight text-ink mt-2">
                CONSOLIDATED <span className="text-press">BOX OFFICE</span> LEDGER
              </h1>
              <p className="text-xs sm:text-sm text-ink-dim mt-2 font-medium max-w-2xl">
                Where trade hearsay gives way to audited truth. Rigorously cross-verified theatrical grosses, distributor shares, and real-time screen occupancy reconciled across every territory in Indian cinema.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-ink bg-band border border-line rounded shadow-sm px-3 py-1.5 font-poster uppercase self-start sm:self-center">
              <span className="w-2 h-2 rounded-full bg-press animate-ping" />
              <span>UNBIASED CONSENSUS ACTIVE</span>
            </div>
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
