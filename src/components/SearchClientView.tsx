"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon, AlertCircle } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import TrendingSidebar from "@/components/TrendingSidebar";
import { Article } from "@/types";
import { LanguageConfig } from "@/lib/languages";

interface SearchClientViewProps {
  allArticles: Article[];
  trendingArticles: Article[];
  config: LanguageConfig;
}

export default function SearchClientView({
  allArticles,
  trendingArticles,
  config,
}: SearchClientViewProps) {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const selectedCat = searchParams.get("cat") || "";

  const results = useMemo(() => {
    return allArticles.filter((article) => {
      const matchesCat = selectedCat ? article.category === selectedCat : true;
      if (!matchesCat) return false;
      if (!query) return true;

      const inTitle = article.title.toLowerCase().includes(query);
      const inTitleEn = article.titleEn?.toLowerCase().includes(query);
      const inSummary = article.summary.toLowerCase().includes(query);
      const inContent = (article.content ?? "").toLowerCase().includes(query);
      const inTags = article.tags.some((t) => t.toLowerCase().includes(query));

      return inTitle || inTitleEn || inSummary || inContent || inTags;
    });
  }, [allArticles, query, selectedCat]);

  return (
    <div className="w-full bg-paper min-h-screen text-ink">
      {/* The Search Deck — Cinema Hero Band */}
      <div className="bg-sheet border-b border-line py-8 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="sticker bg-violet text-paper border border-line px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded">
              THE SEARCH DECK
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-band text-ink border border-line rounded shadow-sm">
              ALL INDIAN FILM INDUSTRIES
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-poster uppercase tracking-tight text-ink mt-2">
            SEARCH <span className="text-press">EXTRA-SAAGA</span> WIRE
          </h1>

          {/* Search Form */}
          <form method="GET" action="/search" className="mt-5 max-w-2xl flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search across all Indian cinema headlines, reviews, lore..."
                className="w-full bg-surface border border-line rounded pl-10 pr-4 py-3 text-sm text-ink placeholder-ink-mute focus:outline-none focus:border-acc shadow-sm font-medium"
              />
              <SearchIcon className="w-4 h-4 text-ink-dim absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-press hover:bg-press-deep text-paper font-poster uppercase text-xs tracking-wider transition-all rounded-lg shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Quick trending tags */}
          <div className="mt-4 flex items-center gap-2 flex-wrap text-xs font-mono text-ink-dim">
            <span className="text-ink font-poster uppercase">Hot Topics:</span>
            {config.hotTopics.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="px-2.5 py-1 bg-surface hover:bg-band text-ink text-xs border border-line rounded shadow-sm hover:border-press/40 transition-colors font-bold uppercase"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-8">
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-line">
              <span className="text-sm font-poster uppercase text-ink">
                {query ? (
                  <>
                    &ldquo;<span className="text-press">{query}</span>&rdquo; ({results.length} results)
                  </>
                ) : (
                  <>All Cinema Stories ({results.length})</>
                )}
              </span>
            </div>

            {results.length === 0 ? (
              <div className="bg-sheet p-12 border border-dashed border-line rounded-xl text-center space-y-3 shadow-lg">
                <AlertCircle className="w-10 h-10 text-press mx-auto" />
                <h3 className="text-base font-poster uppercase text-ink">
                  No stories found for this query!
                </h3>
                <p className="text-xs text-ink-dim font-medium">
                  Try searching with different actor names, movie titles, or explore latest cinema news on the home page.
                </p>
                <Link
                  href="/"
                  className="inline-block mt-3 px-5 py-2.5 bg-band text-ink text-xs font-poster uppercase tracking-wider hover:bg-surface border border-line rounded-lg shadow-sm hover:border-press/40 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>
            )}
          </main>

          <aside className="lg:col-span-4 space-y-6">
            <TrendingSidebar articles={trendingArticles} />
          </aside>
        </div>
      </div>
    </div>
  );
}

