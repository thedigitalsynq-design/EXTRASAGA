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
      {/* Frontpage ambient rail */}
      <div className="flex items-center justify-between pb-3 px-1 mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-signal animate-pulse shadow-[0_0_16px_rgba(255,46,80,0.35)]" />
          <span className="text-[11px] font-sans uppercase font-bold tracking-widest text-popcorn-dim">
            {config.industryName} Cinema — The Frontpage Cut
          </span>
        </div>
        <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-revealed/90 border border-glow-line text-[11px] text-popcorn-dim backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-ultra"></span>
          <span className="font-display-latin uppercase tracking-wider">
            Receipts-first • Source-verified
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-5 items-stretch">
        {/* Dominant Hero Poster (7 cols) — big screen, vignette-to-void */}
        {leadStory && (
          <div className="lg:col-span-7 group relative gpu-layer">
            <div className="relative h-full rounded-[28px] overflow-hidden bg-revealed border border-glow-line group-hover:border-glow-line-strong transition-all duration-300">
              <Link href={localizeUrl(`/news/${leadStory.slug}`)} className="block relative h-full min-h-[380px] sm:min-h-[460px] w-full">
                <Image
                  src={leadStory.featuredImage}
                  alt={leadStory.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                {/* Vignette-to-void scrim for the deck block */}
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 via-45% to-transparent"></div>

                {/* Top projection chips */}
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex flex-wrap items-center gap-2 z-10">
                  <span className="px-3 py-1 rounded-full bg-signal-deep text-popcorn text-xs font-bold uppercase tracking-wider shadow-[0_0_18px_rgba(255,46,80,0.3)]">
                    {leadStory.categoryName}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-void/60 text-popcorn-dim border border-glow-line backdrop-blur-md"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-ultra"></span>
                    {config.industryName}
                  </span>
                  {leadStory.isTopStory && (
                    <span className="px-3 py-1 rounded-full bg-revealed text-marquee-soft border border-marquee/30 text-xs font-extrabold uppercase flex items-center gap-1.5 backdrop-blur-md">
                      <Flame className="w-3.5 h-3.5 fill-marquee text-marquee" />
                      {t("sec_top_stories")}
                    </span>
                  )}
                </div>

                {/* Bottom deck block — glass cushion floats over the still */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 rounded-2xl bg-void/85 backdrop-blur-md border border-glow-line z-10 p-5 sm:p-6">
                  <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-popcorn leading-snug group-hover:text-signal-soft transition-colors duration-200 line-clamp-2 font-sans">
                    {leadStory.title}
                  </h1>
                  <p className="mt-2 text-xs sm:text-sm text-popcorn-dim line-clamp-2 leading-relaxed hidden sm:block">
                    {leadStory.summary}
                  </p>

                  {/* Metadata Row */}
                  <div className="mt-3.5 pt-3 border-t border-glow-line flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-popcorn-dim font-sans">
                    <span className="text-popcorn font-semibold">
                      ✍️ {leadStory.author.name}
                    </span>
                    <span>•</span>
                    <span>📅 {formatKannadaDate(leadStory.publishedAt)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-ultra" />
                      <span>{leadStory.readTimeMinutes} {readTimeLabel[language] || readTimeLabel.kn}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-popcorn">
                      <Eye className="w-3.5 h-3.5 text-ultra" />
                      <span>{formatKannadaNumber(leadStory.views)} {viewsLabel[language] || viewsLabel.kn}</span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Supporting Poster Stubs (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-5 justify-between">
          {secondaryStories.map((item, idx) => (
            <div
              key={item.id}
              className={`group relative rounded-[28px] overflow-hidden bg-revealed border border-glow-line group-hover:border-glow-line-strong transition-all duration-300 flex-1 ${idx === 0 ? "min-h-[220px]" : "min-h-[200px]"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 via-50% to-transparent"></div>

                  {/* Category Chip */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="px-3 py-1 rounded-full bg-void/70 text-popcorn-dim text-[11px] font-bold uppercase border border-glow-line backdrop-blur-md">
                      {item.categoryName}
                    </span>
                  </div>

                  {/* Bottom Glass Capsule */}
                  <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-void/80 backdrop-blur-md border border-glow-line z-10 p-3.5 sm:p-4">
                    <h2 className="text-xs sm:text-base font-bold text-popcorn leading-snug group-hover:text-signal-soft transition-colors duration-200 line-clamp-2 font-sans">
                      {item.title}
                    </h2>
                    <div className="mt-2 flex items-center gap-2.5 text-[11px] text-popcorn-dim font-sans">
                      <span>{formatKannadaDate(item.publishedAt)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-popcorn">
                        <Eye className="w-3 h-3 text-ultra" />
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
