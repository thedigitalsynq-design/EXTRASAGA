"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Clock, Flame } from "lucide-react";
import { Article } from "@/types";
import { formatKannadaDate, formatKannadaNumber } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface HeroTopStoriesProps {
  articles: Article[];
}

export default function HeroTopStories({ articles }: HeroTopStoriesProps) {
  const { language, config, t, localizeUrl } = useLanguage();
  if (!articles || articles.length === 0) return null;

  const langArticles = articles.filter(
    (a) => a.language === language || (!a.language && language === "kn")
  );
  const activeArticles = langArticles.length > 0 ? langArticles : articles;

  const leadStory = activeArticles[0];
  const secondaryStories = activeArticles.slice(1, 3);

  const readTimeLabel: Record<string, string> = {
    kn: "ನಿಮಿಷ ಓದು",
    te: "నిమిషాల పఠనం",
    ta: "நிமிட வாசிப்பு",
    ml: "മിനിറ്റ് വായന",
    hi: "मिनट पढ़ें",
    en: "min read",
  };

  const viewsLabel: Record<string, string> = {
    kn: "ವೀಕ್ಷಣೆಗಳು",
    te: "వీక్షణలు",
    ta: "பார்வைகள்",
    ml: "കാഴ്ചകൾ",
    hi: "व्यूज",
    en: "views",
  };

  return (
    <section aria-label="Lead Cinema Stories" className="w-full relative">
      {/* Floating Ambient Info Ribbon (Grid-breaking luxury element) */}
      <div className="flex items-center justify-between pb-3 px-1 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#288760] animate-pulse shadow-sm shadow-[#288760]/40" />
          <span className="text-[11px] font-sans uppercase font-extrabold tracking-widest text-[#1A5140]">
            {config.industryName} Cinema • Curated Frontpage Bento
          </span>
        </div>
        <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8F8EB] border border-[#B7E5BA] text-[11px] font-bold text-[#1A5140] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#288760]"></span>
          <span>Dual-Axis Verified Journalism</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* Dominant Hero Bento Card (~60% of visual weight: 7 cols on lg) */}
        {leadStory && (
          <div className="lg:col-span-7 group relative gpu-layer">
            <div className="relative h-full rounded-[28px] overflow-hidden bg-white border border-[#E5EBE7] shadow-[0_16px_40px_-10px_rgba(26,81,64,0.08)] group-hover:shadow-[0_24px_50px_-10px_rgba(40,135,96,0.18)] group-hover:border-[#5CA87C]/50 transition-all duration-300">
              <Link href={localizeUrl(`/news/${leadStory.slug}`)} className="block relative h-full min-h-[380px] sm:min-h-[460px] w-full">
                <Image
                  src={leadStory.featuredImage}
                  alt={leadStory.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                {/* Multi-Stop Cinematic Vignette for crystal-clear readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B251D]/95 via-[#0B251D]/45 via-45% to-black/15"></div>

                {/* Top Badges (Glass / Jade Pills) */}
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex flex-wrap items-center gap-2 z-10">
                  <span className="px-3.5 py-1 rounded-full bg-[#288760] text-white text-xs font-bold tracking-wide shadow-md">
                    {leadStory.categoryName}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-extrabold uppercase tracking-wider bg-black/50 text-white border border-white/25 backdrop-blur-md shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B7E5BA] animate-pulse"></span>
                    {config.industryName}
                  </span>
                  {leadStory.isTopStory && (
                    <span className="px-3 py-1 rounded-full bg-[#E8F8EB] text-[#1A5140] border border-[#B7E5BA] text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                      <Flame className="w-3.5 h-3.5 fill-[#288760] text-[#288760]" />
                      {t("sec_top_stories")}
                    </span>
                  )}
                </div>

                {/* Bottom Content within Frosted Glass Floating Cushion */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 p-5 sm:p-6 rounded-2xl bg-[#0B251D]/80 backdrop-blur-md border border-[#5CA87C]/30 text-white z-10 shadow-lg">
                  <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white leading-snug group-hover:text-[#B7E5BA] transition-colors duration-200 line-clamp-2 drop-shadow-sm font-sans">
                    {leadStory.title}
                  </h1>
                  <p className="mt-2 text-xs sm:text-sm text-gray-200 line-clamp-2 leading-relaxed hidden sm:block font-normal">
                    {leadStory.summary}
                  </p>

                  {/* Metadata Row */}
                  <div className="mt-3.5 pt-3 border-t border-white/15 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-300 font-sans">
                    <span className="text-white font-semibold">
                      ✍️ {leadStory.author.name}
                    </span>
                    <span>•</span>
                    <span>📅 {formatKannadaDate(leadStory.publishedAt)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#B7E5BA]" />
                      <span>{leadStory.readTimeMinutes} {readTimeLabel[language] || readTimeLabel.kn}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-white">
                      <Eye className="w-3.5 h-3.5 text-[#B7E5BA]" />
                      <span>{formatKannadaNumber(leadStory.views)} {viewsLabel[language] || viewsLabel.kn}</span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Supporting Bento Cards (5 cols on lg: Varied proportions) */}
        <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6 justify-between">
          {secondaryStories.map((item, idx) => (
            <div
              key={item.id}
              className={`group relative rounded-[28px] overflow-hidden bg-white border border-[#E5EBE7] shadow-[0_12px_32px_-8px_rgba(26,81,64,0.06)] group-hover:shadow-[0_20px_40px_-8px_rgba(40,135,96,0.15)] group-hover:border-[#5CA87C]/50 transition-all duration-300 flex-1 ${idx === 0 ? "min-h-[220px]" : "min-h-[200px]"
                }`}
            >
              <Link href={localizeUrl(`/news/${item.slug}`)} className="block relative h-full w-full">
                <div className="relative h-full min-h-[210px] w-full">
                  <Image
                    src={item.featuredImage}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B251D]/90 via-[#0B251D]/40 via-50% to-transparent"></div>

                  {/* Category Pill */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="px-3 py-1 rounded-full bg-black/60 text-white text-[11px] font-bold border border-white/20 backdrop-blur-md">
                      {item.categoryName}
                    </span>
                  </div>

                  {/* Bottom Text in Frosted Capsule */}
                  <div className="absolute bottom-3 left-3 right-3 p-3.5 sm:p-4 rounded-xl bg-[#0B251D]/75 backdrop-blur-md border border-[#5CA87C]/25 z-10">
                    <h2 className="text-xs sm:text-base font-bold text-white leading-snug group-hover:text-[#B7E5BA] transition-colors duration-200 line-clamp-2 font-sans">
                      {item.title}
                    </h2>
                    <div className="mt-2 flex items-center gap-2.5 text-[11px] text-gray-300 font-sans">
                      <span>{formatKannadaDate(item.publishedAt)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-white">
                        <Eye className="w-3 h-3 text-[#B7E5BA]" />
                        <span>{formatKannadaNumber(item.views)}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

