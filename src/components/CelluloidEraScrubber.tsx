"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Film, Sparkles, ArrowRight, Clock, Award, Clapperboard } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Era {
  id: string;
  years: string;
  title: string;
  titleNative: string;
  tagline: string;
  keyFilms: string[];
  description: string;
  quote: string;
  quoteAuthor: string;
  image: string;
  accent: string;
}

export default function CelluloidEraScrubber() {
  const { language, localizeUrl } = useLanguage();
  const [selectedEra, setSelectedEra] = useState<number>(3); // Default to 2026 Global Vanguard

  const eras: Era[] = [
    {
      id: "era-1970",
      years: "1970 — 1989",
      title: "The Mythological & Cultural Epoch",
      titleNative: "ಪೌರಾಣಿಕ ಸುವರ್ಣ ಯುಗ",
      tagline: "Epic Storytelling & Timeless Folklore Roots",
      keyFilms: ["Mayura (1975)", "Babruvahana (1977)", "Bhakta Prahlada (1983)", "Sholay (1975)"],
      description:
        "The golden age when Indian cinema established its profound cultural resonance. Dr. Rajkumar and legendary auteurs fused classical literature, traditional music, and grand theatrical performances into cinematic monuments.",
      quote: "Cinema is not just entertainment; it is the spiritual mirror of our society's collective memory.",
      quoteAuthor: "Dr. Rajkumar",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
      accent: "from-amber-500/20 to-amber-700/10 border-amber-500/30 text-amber-300",
    },
    {
      id: "era-1990",
      years: "1990 — 2009",
      title: "Auteur Awakening & Gangster Realism",
      titleNative: "ನವ್ಯ ಸಿನಿಮಾ & ರಿಯಲಿಸಂ ಕ್ರಾಂತಿ",
      tagline: "The Reinvention of Narrative Form and Music",
      keyFilms: ["Om (1995)", "A (1998)", "Sparsha (2000)", "Mungaru Male (2006)"],
      description:
        "A revolutionary phase led by visionary directors Upendra, Sunil Kumar Desai, and Yogaraj Bhat. Realism, philosophical non-linear storytelling, and record-breaking monsoonal romances redefined the box office.",
      quote: "If you want to be original, dare to show what audience feels but never speaks.",
      quoteAuthor: "Real Star Upendra",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
      accent: "from-rose-500/20 to-rose-700/10 border-rose-500/30 text-rose-300",
    },
    {
      id: "era-2010",
      years: "2010 — 2024",
      title: "The Pan-Indian Frontier",
      titleNative: "ಪ್ಯಾನ್-ಇಂಡಿಯಾ ಹೆಬ್ಬಾಗಿಲು",
      tagline: "Regional Stories Conquering the Global Stage",
      keyFilms: ["KGF: Chapter 1 & 2", "Kantara", "777 Charlie", "Kantara: Chapter 1"],
      description:
        "The historic paradigm shift where regional storytelling dismantled Bollywood hegemony. Sandalwood and South Indian cinema emerged as the heartbeat of global Indian entertainment with unmatched technical audacity.",
      quote: "Our local folklore has the power to grip audiences across Tokyo, London, and New York.",
      quoteAuthor: "Rishab Shetty & Rocking Star Yash",
      image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1200&auto=format&fit=crop",
      accent: "from-cyan-500/20 to-cyan-700/10 border-cyan-500/30 text-cyan-300",
    },
    {
      id: "era-2026",
      years: "2026 & Beyond",
      title: "The Global Celluloid Vanguard",
      titleNative: "ಜಾಗತಿಕ ಸಿನಿಮಾ ಮುಂಚೂಣಿ",
      tagline: "IMAX Epics, Cultural Reverence & Dual-Axis Craft",
      keyFilms: ["Ramayana: Part 1", "Toxic: A Fairy Tale", "Kantara: Chapter 1", "Max"],
      description:
        "The contemporary renaissance characterized by uncompromised cultural dignity, Hollywood-grade visual effects collaborations, IMAX 70mm masterworks, and a return to purist film criticism.",
      quote: "When scale is matched with reverence, cinema transcends commerce and becomes cultural heritage.",
      quoteAuthor: "FILMY GARAGE Editorial Board",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
      accent: "from-emerald-500/20 to-emerald-700/10 border-emerald-500/30 text-emerald-300",
    },
  ];

  const current = eras[selectedEra];

  return (
    <section aria-label="Celluloid Era Time-Machine" className="w-full py-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gray-100 border border-gray-200 text-gray-700 select-none shadow-2xs">
          <Clapperboard className="w-3.5 h-3.5 text-amber-600" />
          <span>Celluloid Time-Machine</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950 tracking-tight font-sans">
          The Living Timeline of Cinema
        </h2>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
          Scrub through five decades of cinematic evolution — from classical mythological epics to the 2026 global vanguard.
        </p>
      </div>

      {/* 35mm Sprocket Film Strip Selector Bar */}
      <div className="rounded-3xl bg-gray-100 border border-gray-200 p-2 sm:p-3 relative overflow-hidden shadow-sm mb-8">
        {/* Top Sprocket Holes */}
        <div className="flex items-center justify-between px-3 py-1.5 opacity-50 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={`sprocket-top-${i}`} className="w-3 h-2 rounded-[2px] bg-gray-400 shrink-0 mx-1" />
          ))}
        </div>

        {/* Interactive Era Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-3 px-2">
          {eras.map((era, index) => {
            const isSelected = selectedEra === index;
            return (
              <button
                key={era.id}
                type="button"
                onClick={() => setSelectedEra(index)}
                className={`p-3 sm:p-4 rounded-2xl text-left transition-all relative overflow-hidden group select-none ${
                  isSelected
                    ? "bg-white border border-gray-300 shadow-md scale-[1.02]"
                    : "bg-gray-50/80 border border-gray-200 hover:bg-white hover:border-gray-300"
                }`}
              >
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-amber-700 block mb-1">
                  {era.years}
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-950 block truncate font-sans">
                  {language === "kn" ? era.titleNative : era.title}
                </span>
                <span className="text-[10px] text-gray-500 block truncate mt-0.5 font-normal">
                  {era.tagline}
                </span>

                {isSelected && (
                  <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Sprocket Holes */}
        <div className="flex items-center justify-between px-3 py-1.5 opacity-50 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={`sprocket-bottom-${i}`} className="w-3 h-2 rounded-[2px] bg-gray-400 shrink-0 mx-1" />
          ))}
        </div>
      </div>

      {/* Expanded Era Stage: Double-Bezel Concentric Frame */}
      <div className="rounded-[2.5rem] p-1.5 ring-1 ring-gray-200 bg-gray-50 shadow-sm">
        <div className="rounded-[calc(2.5rem-0.375rem)] bg-white border border-gray-200 p-6 sm:p-10 relative overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200">
                <Clock className="w-3.5 h-3.5" />
                <span>{current.years} • {current.title}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight leading-snug font-sans">
                {current.tagline}
              </h3>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                {current.description}
              </p>

              {/* Quote Card */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
                <p className="text-xs sm:text-sm text-gray-800 italic font-normal">
                  &ldquo;{current.quote}&rdquo;
                </p>
                <span className="text-[11px] font-mono font-bold text-amber-800 block">
                  — {current.quoteAuthor}
                </span>
              </div>

              {/* Key Landmark Films */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] uppercase font-bold tracking-wider text-gray-500 block font-mono">
                  Landmark Celluloid Works:
                </span>
                <div className="flex flex-wrap gap-2">
                  {current.keyFilms.map((film) => (
                    <span
                      key={film}
                      className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 font-sans"
                    >
                      {film}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Visual Plate */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-gray-200 shadow-md group">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${current.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-mono font-bold text-amber-300 uppercase tracking-wider">
                    35mm Archive Plate
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/20 text-[10px] font-mono">
                    Restored 4K
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

