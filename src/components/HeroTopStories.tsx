"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  Clock,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Crown,
  ShieldCheck,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Article } from "@/types";
import { formatEditorialDate, formatCineNumber } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { CINESTAR_LEADERBOARD } from "@/data/cineStarData";

interface HeroTopStoriesProps {
  articles: Article[];
}

export default function HeroTopStories({ articles }: HeroTopStoriesProps) {
  const { localizeUrl } = useLanguage();
  const [listTab, setListTab] = useState<"power" | "gainers">("power");

  if (!articles || articles.length === 0) return null;

  const leadStory = articles[0];
  const editorsPicks = articles.slice(1, 4);

  // Industry badge color map in House Full Press tokens
  const getIndustrySticker = (industry?: string) => {
    switch (industry) {
      case "bollywood":
        return "bg-press text-paper";
      case "tollywood":
        return "bg-[#F79D65] text-ink";
      case "kollywood":
        return "bg-[#CBB2FE] text-ink";
      case "mollywood":
        return "bg-[#D4EDDA] text-ink";
      case "sandalwood":
        return "bg-[#FFE082] text-ink";
      default:
        return "bg-band text-ink";
    }
  };

  const getIndustryLabel = (industry?: string) => {
    switch (industry) {
      case "bollywood":
        return "Bollywood";
      case "tollywood":
        return "Tollywood";
      case "kollywood":
        return "Kollywood";
      case "mollywood":
        return "Mollywood";
      case "sandalwood":
        return "Sandalwood";
      case "hollywood":
        return "Hollywood";
      default:
        return "Pan-India";
    }
  };

  const cineStars = listTab === "power"
    ? CINESTAR_LEADERBOARD.slice(0, 5)
    : [...CINESTAR_LEADERBOARD].sort((a, b) => b.dailyChangeCr - a.dailyChangeCr).slice(0, 5);

  return (
    <section aria-label="Lead Cinema Stories and Power Index" className="w-full relative">
      {/* Front-page Editorial Masthead Ribbon inspired by Forbes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 px-1 mb-5 border-b-2 border-ink gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 bg-press border border-ink rotate-45 shrink-0" />
          <h2 className="text-xs sm:text-sm font-poster uppercase tracking-[0.2em] text-ink font-bold flex items-center gap-2">
            <span>THE FRONTPAGE DISPATCH</span>
            <span className="text-ink/40">/</span>
            <span className="text-press font-bold">COVER STORY &amp; POWER LISTS</span>
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sheet border-2 border-ink shadow-sticker text-[10px] font-poster font-bold uppercase tracking-wider text-ink select-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Forbes-Calibrated Trade Telemetry · Verified Bylines</span>
        </div>
      </div>

      {/* Signature Forbes 3-Column Asymmetric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Column 1: Dominant Cover Story (6 cols) */}
        {leadStory && (
          <div className="lg:col-span-6 group relative flex flex-col">
            <article className="relative h-full bg-sheet border-2 border-ink shadow-press hover:shadow-press-lg transition-all duration-200 flex flex-col justify-between overflow-hidden">
              <Link href={localizeUrl(`/news/${leadStory.slug}`)} className="block relative h-full w-full flex flex-col">
                {/* Media Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-band border-b-2 border-ink">
                  <Image
                    src={leadStory.featuredImage}
                    alt={leadStory.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div aria-hidden="true" className="absolute inset-0 halftone-faint opacity-25 pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2 z-10">
                    <span className="px-3 py-1 bg-ink text-paper text-xs font-poster font-bold uppercase tracking-wider border-2 border-ink shadow-sticker">
                      COVER STORY
                    </span>
                    <span
                      className={`px-2.5 py-1 text-[10px] font-poster font-bold uppercase tracking-wider border-2 border-ink shadow-sticker ${getIndustrySticker(
                        leadStory.industry
                      )}`}
                    >
                      {getIndustryLabel(leadStory.industry)}
                    </span>
                    {leadStory.isTopStory && (
                      <span className="px-2.5 py-1 bg-[#E2F952] text-ink border-2 border-ink text-[11px] font-poster font-bold uppercase flex items-center gap-1 shadow-sticker">
                        <Flame className="w-3.5 h-3.5 fill-ink text-ink" />
                        <span>TOP WIRE</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Newsprint Headline & Copy */}
                <div className="p-6 bg-sheet flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-poster font-bold text-ink leading-tight group-hover:text-press transition-colors duration-150 line-clamp-3 uppercase tracking-tight">
                      {leadStory.title}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-ink-dim line-clamp-3 leading-relaxed font-sans font-medium">
                      {leadStory.summary}
                    </p>
                  </div>

                  {/* Metadata Bar */}
                  <div className="mt-6 pt-4 border-t-2 border-ink/20 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-dim font-mono-tabular">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink uppercase font-poster tracking-wider text-[11px]">
                        BY {leadStory.author.name}
                      </span>
                      <span className="text-ink/30">·</span>
                      <span>{formatEditorialDate(leadStory.publishedAt)}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-bold">
                      <span className="flex items-center gap-1 text-ink-mute">
                        <Clock className="w-3.5 h-3.5 text-ink" />
                        <span>{leadStory.readTimeMinutes} min read</span>
                      </span>
                      <span className="flex items-center gap-1 text-press font-black">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{formatCineNumber(leadStory.views)}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          </div>
        )}

        {/* Column 2: Editors' Picks Stack (3 cols) */}
        <div className="lg:col-span-3 flex flex-col bg-sheet border-2 border-ink shadow-press p-5 justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-ink">
              <span className="text-xs font-poster font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-press" />
                <span>EDITORS&apos; PICKS</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-ink-dim">CURATED</span>
            </div>

            <div className="divide-y divide-ink/15 space-y-4">
              {editorsPicks.map((item, idx) => (
                <article key={item.id} className={idx > 0 ? "pt-4" : ""}>
                  <Link href={localizeUrl(`/news/${item.slug}`)} className="group block space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-press tracking-wider">
                        0{idx + 1} · {getIndustryLabel(item.industry)}
                      </span>
                      <span className="text-ink/30">·</span>
                      <span className="text-[10px] font-mono text-ink-mute">
                        {item.readTimeMinutes} min
                      </span>
                    </div>

                    <h4 className="text-sm font-poster uppercase font-bold text-ink leading-snug group-hover:text-press transition-colors line-clamp-2">
                      {item.title}
                    </h4>

                    <p className="text-xs text-ink-dim font-grotesk line-clamp-2">
                      {item.summary}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-ink/20">
            <Link
              href="/category/latest"
              className="text-xs font-poster uppercase font-bold text-ink hover:text-press flex items-center justify-between transition-colors"
            >
              <span>View All Editors&apos; Picks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Column 3: Forbes-style CineStar Power Rankings (3 cols) */}
        <div className="lg:col-span-3 bg-sheet border-2 border-ink shadow-press flex flex-col justify-between overflow-hidden">
          {/* Header with Switcher Tabs */}
          <div>
            <div className="p-4 bg-band border-b-2 border-ink flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-ink" />
                <h3 className="text-xs font-poster uppercase font-bold text-ink tracking-tight">
                  THE CINESTAR 100
                </h3>
              </div>

              <div className="flex items-center gap-1 border border-ink p-0.5 bg-paper rounded-xs">
                <button
                  type="button"
                  onClick={() => setListTab("power")}
                  className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase transition-colors ${
                    listTab === "power" ? "bg-ink text-paper" : "text-ink hover:bg-band"
                  }`}
                >
                  Rank
                </button>
                <button
                  type="button"
                  onClick={() => setListTab("gainers")}
                  className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase transition-colors ${
                    listTab === "gainers" ? "bg-ink text-paper" : "text-ink hover:bg-band"
                  }`}
                >
                  Movers
                </button>
              </div>
            </div>

            {/* List Rows */}
            <div className="divide-y divide-ink/15">
              {cineStars.map((star, idx) => {
                const isGain = star.dailyChangeCr >= 0;
                return (
                  <div
                    key={star.id}
                    className="p-3 hover:bg-band/40 transition-colors flex items-center justify-between gap-2.5 group"
                  >
                    {/* Rank & Avatar */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-paper border border-ink text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                        {star.rank}
                      </span>
                      <div className="relative w-8 h-8 rounded-full border border-ink overflow-hidden shrink-0">
                        <Image src={star.profileImage} alt={star.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-poster uppercase font-bold text-ink truncate group-hover:text-press transition-colors">
                          {star.name}
                        </div>
                        <div className="text-[10px] font-mono text-ink-dim truncate">
                          {star.industryLabel}
                        </div>
                      </div>
                    </div>

                    {/* Financial Metric & Movement */}
                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-ink">
                        ₹{star.boxOfficePowerCr} Cr
                      </div>
                      <div
                        className={`text-[10px] font-mono font-bold flex items-center justify-end gap-0.5 ${
                          isGain ? "text-emerald-700" : "text-press"
                        }`}
                      >
                        {isGain ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        <span>{isGain ? "+" : ""}{star.dailyChangeCr.toFixed(1)} Cr</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Link to Full Leaderboard */}
          <div className="p-3 bg-band border-t-2 border-ink">
            <Link
              href={localizeUrl("/cinestars")}
              className="text-xs font-poster uppercase font-bold text-ink hover:text-press flex items-center justify-between transition-colors"
            >
              <span>Explore Complete 50-Star Index</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
