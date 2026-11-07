import React, { Suspense } from "react";
import { Metadata } from "next";
import { DataService } from "@/lib/dataService";
import { getLanguageConfig } from "@/lib/languages";
import SearchClientView from "@/components/SearchClientView";

export const metadata: Metadata = {
  title: "Search Indian Cinema Wire | EXTRASAGA",
  description: "Search across all Indian cinema headlines, reviews, lore, and stars.",
};

export default async function SearchPage() {
  const config = getLanguageConfig("en");

  const [allArticles, trendingArticles] = await Promise.all([
    DataService.getArticles(undefined, "en"),
    DataService.getTrendingArticles(5, "en"),
  ]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper text-ink p-12 text-center font-poster uppercase text-sm">
          Loading Search Deck...
        </div>
      }
    >
      <SearchClientView
        allArticles={allArticles}
        trendingArticles={trendingArticles}
        config={config}
      />
    </Suspense>
  );
}
