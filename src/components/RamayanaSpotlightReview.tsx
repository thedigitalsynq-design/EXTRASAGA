"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Crown, Shield, ArrowRight, Globe, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageCode } from "@/types";
import {
  RAMAYANA_REVIEWS_BY_LANGUAGE,
  RAMAYANA_POSTER_IMAGE,
} from "@/data/ramayanaReviewData";

export default function RamayanaSpotlightReview() {
  const { language, setLanguage, config, languages, localizeUrl } = useLanguage();
  // Allow interactive preview toggle on the card itself or default to global active language
  const [selectedLang, setSelectedLang] = useState<LanguageCode | null>(null);

  const activeLang = selectedLang || language;
  const review =
    RAMAYANA_REVIEWS_BY_LANGUAGE[activeLang] || RAMAYANA_REVIEWS_BY_LANGUAGE.kn;

  return (
    <div className="w-full my-8 relative group gpu-layer">
      {/* Double-Bezel Shell — marquee-gold frame on dark card */}
      <div className="relative p-1.5 rounded-3xl bg-gradient-to-b from-marquee-faint via-transparent to-transparent border border-marquee/30 transition-all duration-300">
        <div className="relative overflow-hidden rounded-[calc(1.5rem-2px)] bg-revealed border border-glow-line">
          {/* Top marquee aura line */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-marquee-faint via-marquee to-marquee-faint"></div>

          {/* Header Ribbon & Language Quick-Toggle */}
          <div className="px-5 sm:px-8 pt-5 pb-3 border-b border-glow-line flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 py-1 px-3.5 text-xs font-black uppercase tracking-widest rounded-full border border-marquee/40 bg-marquee/10 text-marquee-soft glow-marquee-text marquee-halo select-none">
                <Crown className="w-3.5 h-3.5 text-marquee" />
                <span>MAGNUM OPUS SPECIAL REVIEW</span>
              </span>

              <span className="inline-flex items-center gap-1.5 py-1 px-3.5 text-[11px] font-bold uppercase tracking-wider rounded-full border border-glow-line text-popcorn-dim bg-revealed select-none">
                <Shield className="w-3.5 h-3.5 text-marquee" />
                <span>NO RATINGS • ONLY RESPECT</span>
              </span>

              <span
                className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase border ${config.badgeColor}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                {config.industryName}
              </span>
            </div>

            {/* Interactive Language Selector Tabs */}
            <div className="flex items-center gap-1 bg-revealed p-1 rounded-xl border border-glow-line">
              <span className="text-[10px] text-popcorn-muted px-2 font-bold uppercase tracking-wider hidden sm:inline flex items-center gap-1">
                <Globe className="w-3 h-3 text-marquee" />
                <span>ಭಾಷೆ:</span>
              </span>
              {languages.map((l) => {
                const isCurrent = activeLang === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setSelectedLang(l.code);
                      setLanguage(l.code);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1 ${
                      isCurrent
                        ? "bg-marquee text-void shadow-[0_0_16px_rgba(255,176,32,0.3)] font-black"
                        : "text-popcorn-dim hover:text-popcorn hover:bg-screen"
                    }`}
                    title={`${l.name} (${l.industryName})`}
                  >
                    <span>{l.flagEmoji}</span>
                    <span className="hidden sm:inline text-[11px]">{l.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              {/* Left Col: High-Res Official Artwork */}
              <div className="lg:col-span-5 relative group/img">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full rounded-2xl overflow-hidden border border-marquee/40 shadow-[0_0_30px_rgba(255,176,32,0.12)] group-hover/img:border-marquee/70 transition-all duration-300 bg-hall">
                  <Image
                    src={RAMAYANA_POSTER_IMAGE}
                    alt="Ramayana Part 1 - Yash as Ravana, Ranbir Kapoor as Lord Rama, Sai Pallavi as Sita"
                    fill
                    priority
                    className="object-cover group-hover/img:scale-[1.025] transition-transform duration-250 ease-out"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/25 to-transparent"></div>

                  {/* Picture Caption Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-void/85 backdrop-blur-md border border-marquee/30 text-[10px] font-sans font-bold text-marquee-soft flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-marquee animate-pulse" />
                      <span>OFFICIAL MAGNUM OPUS POSTER</span>
                    </span>
                  </div>

                  {/* Bottom Overlay Info on Picture */}
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <div className="text-sm sm:text-base font-black text-popcorn font-sans drop-shadow-md">
                      Yash as Ravana • Ranbir as Rama • Sai Pallavi as Sita
                    </div>
                    <div className="text-[11px] text-marquee-soft font-bold tracking-wide mt-0.5">
                      Directed by Nitesh Tiwari • Music: A.R. Rahman & Hans Zimmer
                    </div>
                  </div>
                </div>

                {/* Reverence Badge under image — marquee-gold glow, zero star ratings */}
                <div className="mt-3 p-3 rounded-xl bg-marquee/10 border border-marquee/50 text-center text-xs sm:text-sm text-marquee-soft glow-marquee-text marquee-halo font-black uppercase tracking-wide flex items-center justify-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-marquee fill-marquee animate-pulse" />
                  <span>NO STAR RATINGS • ONLY RESPECT!</span>
                </div>
              </div>

              {/* Right Col: Multilingual Review Content */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4 text-left">
                <div>
                  {/* Industry Sub-headline */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-marquee-soft uppercase tracking-widest font-sans flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-marquee" />
                      <span>{review.subheadline}</span>
                    </span>
                  </div>

                  {/* Main Headline */}
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-popcorn leading-tight tracking-tight font-sans">
                    {review.headline}
                  </h2>

                  {/* Summary Quote */}
                  <p className="mt-3 text-xs sm:text-sm text-popcorn-dim leading-relaxed font-medium bg-void/50 p-4 rounded-xl border border-marquee/20">
                    {review.summary}
                  </p>
                </div>

                {/* Character Cast Highlights Grid */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-bold text-popcorn-dim uppercase tracking-wider flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-marquee" />
                    <span>ಪ್ರಮುಖ ಪಾತ್ರಧಾರಿಗಳ ಅದ್ಭುತ ಚಿತ್ರಣ (Star Cast & Characters):</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {review.characterHighlights.map((char, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-screen border border-glow-line hover:border-marquee/40 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-black text-popcorn font-sans">
                            {char.actor}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-marquee/10 text-marquee-soft font-bold border border-marquee/25">
                            {char.character}
                          </span>
                        </div>
                        <p className="text-[11px] text-popcorn-dim mt-1 line-clamp-2 leading-relaxed">
                          {char.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verdict Banner */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-marquee-faint via-transparent to-marquee-faint border border-glow-line text-center">
                  <div className="text-xs sm:text-sm font-black text-marquee-soft tracking-wide font-sans">
                    🚩 {review.closingLine}
                  </div>
                </div>

                {/* Action Buttons with Button-in-Button kinetic tension */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link href={localizeUrl(`/reviews/${review.slug}`)} className="flex-1 sm:flex-initial group/btn">
                    <div className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs sm:text-sm font-black h-12 pl-6 pr-3 bg-gradient-to-r from-marquee to-marquee-soft text-void shadow-[0_0_24px_rgba(255,176,32,0.3)] hover:shadow-[0_0_32px_rgba(255,176,32,0.45)] active:scale-[0.98] transition-all duration-300 gap-3 cursor-pointer select-none">
                      <span>ಸಂಪೂರ್ಣ ವಿಮರ್ಶೆ ಓದಿ (Read Full Review)</span>
                      <div className="w-8 h-8 rounded-full bg-void/10 flex items-center justify-center group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5 transition-transform duration-300">
                        <ArrowRight className="w-4 h-4 text-void" />
                      </div>
                    </div>
                  </Link>

                  <Link href={localizeUrl("/reviews")} className="flex-1 sm:flex-initial">
                    <div className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs sm:text-sm font-bold h-12 px-6 border border-marquee/40 hover:bg-marquee/10 text-marquee-soft active:scale-[0.98] transition-all duration-300 cursor-pointer select-none">
                      ಎಲ್ಲಾ ಸಿನಿಮಾ ವಿಮರ್ಶೆಗಳು
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
