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
      {/* Double-Bezel Shell */}
      <div className="relative p-1.5 rounded-3xl bg-gradient-to-b from-amber-100 via-amber-50 to-orange-50 border border-amber-300 shadow-sm transition-all duration-200 ease-out">
        <div className="relative overflow-hidden rounded-[calc(1.5rem-2px)] bg-white border border-amber-200">
          {/* Top ambient golden aura line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"></div>

          {/* Header Ribbon & Language Quick-Toggle */}
          <div className="px-5 sm:px-8 pt-5 pb-3 border-b border-amber-200 flex flex-wrap items-center justify-between gap-3 bg-amber-50/60">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 py-1 px-3.5 text-xs font-black uppercase tracking-wider rounded-full border border-amber-300 bg-amber-100 text-amber-900 shadow-2xs select-none">
                <Crown className="w-3.5 h-3.5 text-amber-700" />
                <span>MAGNUM OPUS SPECIAL REVIEW</span>
              </span>

              <span className="inline-flex items-center gap-1.5 py-1 px-3.5 text-xs font-bold rounded-full border border-amber-300 text-amber-900 bg-white select-none shadow-2xs">
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span>NO RATINGS • ONLY RESPECT</span>
              </span>

              <span
                className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase border shadow-2xs ${config.badgeColor}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                {config.industryName}
              </span>
            </div>

            {/* Interactive Language Selector Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] text-gray-500 px-2 font-bold uppercase tracking-wider hidden sm:inline flex items-center gap-1">
                <Globe className="w-3 h-3 text-amber-600" />
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
                        ? "bg-amber-500 text-white shadow-xs font-black"
                        : "text-gray-700 hover:text-gray-950 hover:bg-gray-100"
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
                <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md group-hover/img:border-amber-400 transition-all duration-200 ease-out bg-gray-100">
                  <Image
                    src={RAMAYANA_POSTER_IMAGE}
                    alt="Ramayana Part 1 - Yash as Ravana, Ranbir Kapoor as Lord Rama, Sai Pallavi as Sita"
                    fill
                    priority
                    className="object-cover group-hover/img:scale-[1.025] transition-transform duration-250 ease-out"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Picture Caption Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md border border-amber-300 text-[10px] font-sans font-bold text-amber-900 flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3 text-amber-600 animate-pulse" />
                      <span>OFFICIAL MAGNUM OPUS POSTER</span>
                    </span>
                  </div>

                  {/* Bottom Overlay Info on Picture */}
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <div className="text-sm sm:text-base font-black text-white font-sans drop-shadow-md">
                      Yash as Ravana • Ranbir as Rama • Sai Pallavi as Sita
                    </div>
                    <div className="text-[11px] text-amber-300 font-bold tracking-wide mt-0.5">
                      Directed by Nitesh Tiwari • Music: A.R. Rahman & Hans Zimmer
                    </div>
                  </div>
                </div>

                {/* Reverence Badge under image */}
                <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center text-xs text-amber-900 font-bold flex items-center justify-center gap-1.5 shadow-2xs">
                  <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-600 animate-pulse" />
                  <span>NO STAR RATINGS • ONLY RESPECT!</span>
                </div>
              </div>

              {/* Right Col: Multilingual Review Content */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4 text-left">
                <div>
                  {/* Industry Sub-headline */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest font-sans flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>{review.subheadline}</span>
                    </span>
                  </div>

                  {/* Main Headline */}
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-950 leading-tight tracking-tight font-sans">
                    {review.headline}
                  </h2>

                  {/* Summary Quote */}
                  <p className="mt-3 text-xs sm:text-sm text-gray-800 leading-relaxed font-medium bg-amber-50/70 p-4 rounded-xl border border-amber-200">
                    {review.summary}
                  </p>
                </div>

                {/* Character Cast Highlights Grid */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span>ಪ್ರಮುಖ ಪಾತ್ರಧಾರಿಗಳ ಅದ್ಭುತ ಚಿತ್ರಣ (Star Cast & Characters):</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {review.characterHighlights.map((char, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-gray-50 border border-amber-200/70 hover:border-amber-400 hover:bg-amber-50/40 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-black text-amber-900 font-sans">
                            {char.actor}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                            {char.character}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                          {char.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verdict Banner */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 border border-amber-300 text-center shadow-2xs">
                  <div className="text-xs sm:text-sm font-black text-amber-950 tracking-wide font-sans">
                    🚩 {review.closingLine}
                  </div>
                </div>

                {/* Action Buttons with Button-in-Button kinetic tension */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link href={localizeUrl(`/reviews/${review.slug}`)} className="flex-1 sm:flex-initial group/btn">
                    <div className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs sm:text-sm font-black h-12 pl-6 pr-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-gray-950 shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-300 gap-3 cursor-pointer select-none">
                      <span>ಸಂಪೂರ್ಣ ವಿಮರ್ಶೆ ಓದಿ (Read Full Review)</span>
                      <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5 transition-transform duration-300">
                        <ArrowRight className="w-4 h-4 text-gray-950" />
                      </div>
                    </div>
                  </Link>

                  <Link href={localizeUrl("/reviews")} className="flex-1 sm:flex-initial">
                    <div className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs sm:text-sm font-bold h-12 px-6 border border-amber-400 bg-white hover:bg-amber-50 text-amber-900 active:scale-[0.98] transition-all duration-300 cursor-pointer select-none shadow-2xs">
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
