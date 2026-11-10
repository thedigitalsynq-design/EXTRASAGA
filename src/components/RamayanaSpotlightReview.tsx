"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Crown, Shield, ArrowRight, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  RAMAYANA_REVIEWS_BY_LANGUAGE,
  RAMAYANA_POSTER_IMAGE,
} from "@/data/ramayanaReviewData";

export default function RamayanaSpotlightReview() {
  const { localizeUrl } = useLanguage();
  const review = RAMAYANA_REVIEWS_BY_LANGUAGE.en || RAMAYANA_REVIEWS_BY_LANGUAGE.kn;

  return (
    <div className="w-full my-6 relative">
      <article className="bg-sheet border border-line rounded-lg shadow-sm p-5 sm:p-7 relative overflow-hidden">
        {/* Halftone grain overlay */}
        <div aria-hidden="true" className="absolute inset-0 halftone-faint opacity-20 pointer-events-none" />

        {/* Top Header Ribbon & Clearance Badges */}
        <div className="pb-4 mb-6 border-b border-line flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 py-1 px-3 text-xs font-poster font-bold uppercase tracking-wider bg-marquee text-ink border border-line rounded shadow-sm select-none">
              <Crown className="w-4 h-4 text-ink" />
              <span>MAGNUM OPUS SPECIAL REVIEW</span>
            </span>

            <span className="inline-flex items-center gap-1.5 py-1 px-3 text-[11px] font-poster font-bold uppercase tracking-wider bg-press text-paper border border-line rounded shadow-sm select-none">
              <Shield className="w-3.5 h-3.5 text-paper" />
              <span>NO RATINGS · ONLY RESPECT</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-surface text-ink border border-line rounded shadow-sm text-[10px] font-poster font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-marquee animate-pulse"></span>
            <span>All-India Cinema Milestone · English Verdict</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
          {/* Left Col: High-Res Official Artwork */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full overflow-hidden border border-line rounded-lg shadow-sm bg-band">
              <Image
                src={RAMAYANA_POSTER_IMAGE}
                alt="Ramayana Part 1 - Yash as Ravana, Ranbir Kapoor as Lord Rama, Sai Pallavi as Sita"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div aria-hidden="true" className="absolute inset-0 halftone-faint opacity-25 pointer-events-none" />

              {/* Picture Caption Tag */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-1 bg-surface text-ink border border-line rounded shadow-sm text-[10px] font-poster font-bold uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-press" />
                  <span>OFFICIAL MAGNUM OPUS POSTER</span>
                </span>
              </div>

              {/* Bottom Info Plate */}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-surface/90 text-ink border-t border-line backdrop-blur-xs">
                <div className="text-xs sm:text-sm font-poster font-bold uppercase">
                  Yash as Ravana · Ranbir as Rama · Sai Pallavi as Sita
                </div>
                <div className="text-[10px] text-ink-dim font-mono mt-0.5">
                  Directed by Nitesh Tiwari · Music: A.R. Rahman & Hans Zimmer
                </div>
              </div>
            </div>

            {/* Sacred Reverence Stamp */}
            <div className="p-3 bg-marquee text-ink border border-line rounded-lg shadow-sm text-center text-xs font-poster font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-ink" />
              <span>NO STAR RATINGS · ONLY RESPECT!</span>
            </div>
          </div>

          {/* Right Col: Editorial Review Content */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4 text-left">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-poster font-bold text-violet uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-press" />
                  <span>{review.subheadline}</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-poster font-bold text-ink leading-tight uppercase tracking-tight">
                {review.headline}
              </h2>

              {/* Pull-quote on newsprint paper */}
              <blockquote className="my-3 p-3.5 bg-surface border-l-4 border-press border border-line rounded-r-lg text-xs sm:text-sm font-medium text-ink-dim italic leading-relaxed shadow-sm">
                &ldquo;{review.closingLine}&rdquo;
              </blockquote>

              <p className="text-xs sm:text-sm text-ink-dim leading-relaxed font-sans font-medium line-clamp-3">
                {review.summary}
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-line">
              {review.characterHighlights.slice(0, 4).map((item, idx) => (
                <div key={idx} className="p-2.5 bg-surface border border-line rounded shadow-sm">
                  <div className="text-[10px] font-poster font-bold text-press uppercase truncate">
                    {item.character}
                  </div>
                  <div className="text-[11px] font-bold text-ink truncate mt-0.5">
                    {item.actor}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA action */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-ink-dim">
                Author: Editorial Desk · Pan-India Dispatch
              </span>
              <Link
                href={localizeUrl("/reviews/ramayana-part-1-ranbir-kapoor-yash-first-look-analysis")}
                className="px-5 py-2.5 bg-surface hover:bg-press text-ink hover:text-paper border border-line rounded-lg shadow-sm text-xs font-poster font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95"
              >
                <span>Read Full In-Depth Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
