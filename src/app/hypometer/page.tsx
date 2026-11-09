import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { DataService } from "@/lib/dataService";
import { getSiteUrl } from "@/lib/siteUrl";
import HypoMeterRanking from "@/components/HypoMeterRanking";
import TrendingSidebar from "@/components/TrendingSidebar";
import AdBanner from "@/components/AdBanner";
import { HypoMeterService } from "@/lib/hypoMeterService";

export const metadata: Metadata = {
  title: "HypoMeter — Most Awaited Movies & Fan Hype Radar | EXTRASAGA",
  description:
    "Live audience pulse, hype rankings, and opening day consensus projections for upcoming Indian theatrical releases.",
  openGraph: {
    title: "HypoMeter — Most Awaited Movies & Audience Pulse | EXTRASAGA",
    description:
      "Track fan interest velocity, release countdowns, and opening day predictions across Bollywood, Tollywood, Sandalwood, and Kollywood.",
    url: `${getSiteUrl()}/hypometer`,
  },
};

export default async function HypoMeterPage() {
  const [trendingArticles] = await Promise.all([
    DataService.getTrendingArticles(5, "en"),
  ]);

  const siteUrl = getSiteUrl();
  const films = HypoMeterService.getFilms();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "EXTRASAGA HypoMeter — Most Awaited Theatrical Releases",
    description: "Audience hype rankings and fan expectations for upcoming Indian movies.",
    itemListElement: films.map((film, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Movie",
        name: film.titleEn,
        image: film.posterImage,
        datePublished: film.releaseDate,
        director: {
          "@type": "Person",
          name: film.director,
        },
      },
    })),
  };

  return (
    <div className="w-full bg-paper min-h-screen text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-sheet border-b-2 border-ink py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-mono-tabular font-bold text-ink-dim">
          <Link href="/" className="hover:text-press transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/box-office" className="hover:text-press transition-colors">
            Box Office
          </Link>
          <span>/</span>
          <span className="text-press uppercase font-black">HypoMeter</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main HypoMeter Column */}
          <main className="lg:col-span-8">
            <HypoMeterRanking />
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
