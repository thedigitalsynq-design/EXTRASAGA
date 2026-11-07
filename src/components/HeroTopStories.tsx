"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Clock, Flame, ArrowUpRight, Zap } from "lucide-react";
import { Article } from "@/types";
import { formatEditorialDate, formatCineNumber } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface HeroTopStoriesProps {
  articles: Article[];
}

export default function HeroTopStories({ articles }: HeroTopStoriesProps) {
  const { localizeUrl } = useLanguage();
  if (!articles || articles.length === 0) return null;

  const leadStory = articles[0];
  const secondaryStories = articles.slice(1, 3);

  // Industry badge color map in House Full Press tokens
  const getIndustrySticker = (industry?: string) => {
    switch (industry) {
      case "bollywood":
        return "bg-press text-paper";
      case "tollywood":
        return "bg-marquee text-ink";
      case "kollywood":
        return "bg-violet text-paper";
      case "mollywood":
        return "bg-sheet text-ink border-ink";
      case "sandalwood":
        return "bg-marquee text-ink";
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

  return (
    <section aria-label="Lead Cinema Stories" className="w-full relative">
      {/* Front-page Press Lead Ribbon */}
      <div className="flex items-center justify-between pb-3 px-1 mb-4 border-b-2 border-ink flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 bg-press border border-ink rotate-45 shrink-0" />
          <h2 className="text-xs sm:text-sm font-poster uppercase tracking-[0.2em] text-ink font-bold flex items-center gap-2">
            <span>THE FRONTPAGE CUT</span>
            <span className="text-ink/40">/</span>
            <span className="text-press font-bold">ALL INDIAN CINEMA</span>
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-sheet border-2 border-ink shadow-sticker text-[10px] font-poster font-bold uppercase tracking-wider text-ink select-none -rotate-1">
          <span className="w-2 h-2 rounded-full bg-press animate-pulse"></span>
          <span>Receipts First · Zero Fake Tea</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Dominant Hero Broadsheet Poster (7 cols) */}
        {leadStory && (
          <div className="lg:col-span-7 group relative">
            <article className="relative h-full bg-sheet border-2 border-ink shadow-press hover:shadow-press-lg transition-all duration-200 flex flex-col justify-between overflow-hidden">
              <Link href={localizeUrl(`/news/${leadStory.slug}`)} className="block relative h-full w-full flex flex-col">
                {/* Media Container with Halftone texture */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] w-full overflow-hidden bg-band border-b-2 border-ink">
                  <Image
                    src={leadStory.featuredImage}
                    alt={leadStory.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div aria-hidden="true" className="absolute inset-0 halftone-faint opacity-30 pointer-events-none" />

                  {/* Stamp badges on photo */}
                  <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2 z-10">
                    <span className="px-3 py-1 bg-press text-paper text-xs font-poster font-bold uppercase tracking-wider border-2 border-ink shadow-sticker -rotate-2 select-none">
                      {leadStory.categoryName || "Lead Story"}
                    </span>
                    <span
                      className={`px-2.5 py-1 text-[10px] font-poster font-bold uppercase tracking-wider border-2 border-ink shadow-sticker rotate-1 select-none ${getIndustrySticker(
                        leadStory.industry
                      )}`}
                    >
                      {getIndustryLabel(leadStory.industry)}
                    </span>
                    {leadStory.isTopStory && (
                      <span className="px-2.5 py-1 bg-marquee text-ink border-2 border-ink text-xs font-poster font-bold uppercase flex items-center gap-1 shadow-sticker select-none">
                        <Flame className="w-3.5 h-3.5 fill-ink text-ink" />
                        <span>TOP WIRE</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Newsprint Headline & Copy Plate */}
                <div className="p-5 sm:p-6 bg-sheet flex-1 flex flex-col justify-between">
                  <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-poster font-bold text-ink leading-tight group-hover:text-press transition-colors duration-150 line-clamp-3 uppercase tracking-tight">
                      {leadStory.title}
                    </h1>
                    <p className="mt-2.5 text-xs sm:text-sm text-ink-dim line-clamp-2 leading-relaxed font-sans font-medium">
                      {leadStory.summary}
                    </p>
                  </div>

                  {/* Metadata Bar */}
                  <div className="mt-4 pt-3.5 border-t-2 border-ink/20 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-dim font-mono-tabular">
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

        {/* Supporting Frontpage Stacks (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
          {secondaryStories.map((item, idx) => (
            <article
              key={item.id}
              className="group relative bg-sheet border-2 border-ink shadow-press hover:shadow-press-lg transition-all duration-200 flex-1 flex flex-col overflow-hidden"
            >
              <Link href={localizeUrl(`/news/${item.slug}`)} className="flex flex-col h-full justify-between">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-band border-b-2 border-ink">
                  <Image
                    src={item.featuredImage}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div aria-hidden="true" className="absolute inset-0 halftone-faint opacity-25 pointer-events-none" />

                  {/* Industry & Category badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <span className="px-2 py-0.5 bg-paper text-ink text-[10px] font-poster font-bold uppercase border-2 border-ink shadow-sticker">
                      {item.categoryName || "Exclusive"}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-poster font-bold uppercase border-2 border-ink shadow-sticker ${getIndustrySticker(
                        item.industry
                      )}`}
                    >
                      {getIndustryLabel(item.industry)}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 bg-sheet flex-1 flex flex-col justify-between">
                  <h3 className="text-sm sm:text-base font-poster font-bold text-ink leading-snug group-hover:text-press transition-colors line-clamp-2 uppercase">
                    {item.title}
                  </h3>

                  <div className="mt-3 pt-2.5 border-t-2 border-dashed border-ink/20 flex items-center justify-between text-[11px] font-mono-tabular text-ink-dim">
                    <span>{formatEditorialDate(item.publishedAt)}</span>
                    <span className="flex items-center gap-1 font-bold text-ink">
                      <Eye className="w-3 h-3 text-press" />
                      <span>{formatCineNumber(item.views)} views</span>
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
