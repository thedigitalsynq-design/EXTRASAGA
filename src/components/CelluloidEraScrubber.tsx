"use client";

import React, { useState } from "react";
import { Sparkles, Clock, Clapperboard, Award, ChevronRight } from "lucide-react";

interface Era {
  id: string;
  years: string;
  title: string;
  tagline: string;
  keyFilms: string[];
  description: string;
  quote: string;
  quoteAuthor: string;
  image: string;
}

export default function CelluloidEraScrubber() {
  const [selectedEra, setSelectedEra] = useState<number>(3); // Default to 2026 Global Vanguard

  const eras: Era[] = [
    {
      id: "era-1970",
      years: "1970 — 1989",
      title: "The Golden Dawn · Folklore & Myth",
      tagline: "Epic Storytelling, Cultural Reverence, and Eternal Roots",
      keyFilms: ["Mayura (1975)", "Babruvahana (1977)", "Bhakta Prahlada (1983)", "Sholay (1975)"],
      description:
        "The defining era when Indian cinema found its beating heart. Visionary storytellers and screen legends turned ancient literature, classical music, and majestic folklore into monuments that still echo across generations.",
      quote: "Cinema is never just a passing show; it is the spiritual mirror of our society's collective memory.",
      quoteAuthor: "Dr. Rajkumar",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "era-1990",
      years: "1990 — 2009",
      title: "The Fearless Auteurs · Raw Realism",
      tagline: "Breaking the Formula with Street Poetry and Monsoonal Romance",
      keyFilms: ["Om (1995)", "A (1998)", "Sparsha (2000)", "Mungaru Male (2006)", "Dilwale Dulhania Le Jayenge (1995)"],
      description:
        "A fiery revolution led by daring writer-directors. Non-linear plots, honest street-level grit, and unforgettable musical romances shattered outdated templates and remade the Indian box office.",
      quote: "To be truly original, dare to put on screen what the audience feels deep inside but never dares to say out loud.",
      quoteAuthor: "Real Star Upendra",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "era-2010",
      years: "2010 — 2024",
      title: "The Pan-Indian Awakening · Borderless Cinema",
      tagline: "Regional Folklore Conquering the Global Stage",
      keyFilms: ["Baahubali 1 & 2", "KGF: Chapter 1 & 2", "RRR", "Kantara", "777 Charlie"],
      description:
        "The historic earthquake that dismantled linguistic boundaries forever. Rooted folklore, breathtaking courage, and visual wizardry turned regional storytellers into global cultural champions.",
      quote: "Our soil, our folklore, and our traditions possess the raw power to captivate audiences from Tokyo and London to New York.",
      quoteAuthor: "Rishab Shetty & Rocking Star Yash",
      image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "era-2026",
      years: "2026 & Beyond",
      title: "The Global Vanguard · Heritage Meets IMAX",
      tagline: "IMAX 70mm Epics, Cultural Dignity, and Fearless Craft",
      keyFilms: ["Ramayana: Part 1", "Toxic: A Fairy Tale", "Kantara: Chapter 1", "War 2", "Spirit"],
      description:
        "A golden renaissance where scale meets genuine reverence. Collaborating with world-class craftspeople, Indian cinema now commands global IMAX screens with head held high and soul intact.",
      quote: "When grand scale is blessed with authentic reverence, cinema ceases to be mere commerce — it becomes cultural heritage.",
      quoteAuthor: "EXTRASAGA Editorial Bureau",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const current = eras[selectedEra];

  return (
    <section aria-label="Celluloid Era Time-Machine" className="w-full py-12">
      {/* Broadsheet Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b-2 border-ink">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-band text-ink font-black text-xs uppercase tracking-widest border border-ink shadow-sticker mb-3">
            <Clapperboard className="w-3.5 h-3.5 text-press" />
            <span>Celluloid Time-Machine</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-ink uppercase tracking-tight">
            5 Decades of Cinema Evolution
          </h2>
          <p className="text-base text-ink-mute font-medium mt-1">
            Travel through fifty unforgettable years of cinematic wonder — from mythical legends that built our culture to global epics that shake the modern world.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono-tabular font-bold text-ink bg-paper px-3 py-1.5 border border-ink shadow-sticker self-start md:self-end">
          <Clock className="w-3.5 h-3.5 text-press" />
          <span>Interactive Historical Reel</span>
        </div>
      </div>

      {/* 35mm Sprocket Strip Selector */}
      <div className="bg-sheet border-2 border-ink shadow-press p-3 sm:p-4 mb-8">
        {/* Top Sprocket Rail */}
        <div className="flex items-center justify-between px-2 py-1 bg-ink/10 border-b border-ink/30 mb-3 overflow-hidden select-none">
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={`sprocket-top-${i}`} className="w-3 h-2 rounded-xs bg-ink shrink-0 mx-1" />
          ))}
        </div>

        {/* Interactive Era Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {eras.map((era, index) => {
            const isSelected = selectedEra === index;
            return (
              <button
                key={era.id}
                type="button"
                onClick={() => setSelectedEra(index)}
                className={`p-3.5 text-left border-2 transition-all duration-150 relative select-none card-press-interactive ${
                  isSelected
                    ? "bg-band border-ink shadow-press scale-[1.01]"
                    : "bg-paper border-ink/40 hover:border-ink hover:bg-sheet"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono-tabular font-black tracking-wider text-press">
                    {era.years}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-press animate-pulse" />
                  )}
                </div>
                <h4 className="text-sm font-black text-ink leading-tight mb-1">
                  {era.title}
                </h4>
                <p className="text-[11px] text-ink-mute line-clamp-1 font-medium">
                  {era.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Bottom Sprocket Rail */}
        <div className="flex items-center justify-between px-2 py-1 bg-ink/10 border-t border-ink/30 mt-3 overflow-hidden select-none">
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={`sprocket-bottom-${i}`} className="w-3 h-2 rounded-xs bg-ink shrink-0 mx-1" />
          ))}
        </div>
      </div>

      {/* Selected Era Feature Dossier */}
      <div className="bg-sheet border-2 border-ink shadow-press p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Narrative Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-marquee/20 text-ink font-mono-tabular font-black text-xs border border-ink shadow-sticker">
              <Clock className="w-3.5 h-3.5 text-press" />
              <span>{current.years} • {current.title}</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-ink leading-tight uppercase tracking-tight">
              {current.tagline}
            </h3>

            <p className="text-base text-ink-mute leading-relaxed font-medium">
              {current.description}
            </p>

            {/* Quote Card */}
            <div className="p-4 bg-paper border-2 border-ink shadow-sticker space-y-1.5">
              <p className="text-sm text-ink italic font-medium leading-relaxed">
                &ldquo;{current.quote}&rdquo;
              </p>
              <span className="text-xs font-black text-press uppercase tracking-wider block">
                — {current.quoteAuthor}
              </span>
            </div>

            {/* Landmark Films */}
            <div className="space-y-2 pt-2">
              <span className="text-xs uppercase font-black tracking-widest text-ink block">
                Landmark Celluloid Works:
              </span>
              <div className="flex flex-wrap gap-2">
                {current.keyFilms.map((film) => (
                  <span
                    key={film}
                    className="px-3 py-1 bg-paper border border-ink text-xs font-bold text-ink shadow-sticker hover:bg-band transition-colors"
                  >
                    {film}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Visual Archive Plate */}
          <div className="lg:col-span-5">
            <div className="border-2 border-ink bg-paper p-2 shadow-press relative group overflow-hidden">
              <div className="relative w-full aspect-[4/3] overflow-hidden border border-ink">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${current.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-paper font-bold">
                  <span className="font-mono-tabular text-marquee-soft uppercase tracking-wider">
                    35mm Historical Master
                  </span>
                  <span className="px-2 py-0.5 bg-paper text-ink font-mono-tabular text-[10px] font-black border border-ink">
                    Archival 4K
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
