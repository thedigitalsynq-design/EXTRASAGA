"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Layers, Film, Sparkles, ArrowUpRight } from "lucide-react";

interface StoryCard {
  id: string;
  date: string;
  day: string;
  title: string;
  author: string;
  href: string;
  bgClass: string;
  badgeBg: string;
  rotation: string;
  zIndex: number;
}

export default function EditorialStoryDeck() {
  const [activeCard, setActiveCard] = useState<number>(2); // Foreground card default

  const cards: StoryCard[] = [
    {
      id: "card-1",
      day: "05",
      date: "NOV '26",
      title: "How folklore and rooted regional storytelling conquered the global box office.",
      author: "BY PRAVEEN KUMAR",
      href: "/news/kantara-chapter-1-shooting-kundapura-rishab-shetty-look",
      bgClass: "bg-paper text-ink",
      badgeBg: "bg-band text-ink border-ink",
      rotation: "-rotate-6 sm:-rotate-8",
      zIndex: 10,
    },
    {
      id: "card-2",
      day: "22",
      date: "OCT '26",
      title: "Is the surge of Pan-Indian IMAX exhibitions fundamentally reshaping cinema's soul?",
      author: "BY ANANYA IYER",
      href: "/category/latest",
      bgClass: "bg-band text-ink",
      badgeBg: "bg-poster-gold/30 text-ink border-ink",
      rotation: "rotate-3 sm:rotate-4",
      zIndex: 20,
    },
    {
      id: "card-3",
      day: "31",
      date: "OCT '26",
      title: "The 100-Year Canvas: Why Ramayana Part 1 chose reverent silence over commercial noise.",
      author: "BY EDITORIAL DESK",
      href: "/reviews/ramayana-part-1-ranbir-kapoor-yash-first-look-analysis",
      bgClass: "bg-sheet text-ink",
      badgeBg: "bg-poster-red text-paper border-ink",
      rotation: "-rotate-1",
      zIndex: 30,
    },
  ];

  return (
    <section aria-label="Curated Story Stacks" className="w-full py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Editorial Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-band text-ink font-black text-xs uppercase tracking-widest border border-ink shadow-sticker">
            <Layers className="w-3.5 h-3.5 text-poster-red" />
            <span>Curated Story Deck</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-ink uppercase tracking-tight leading-tight">
            Cinema Story Stacks: The Deep-Dive Collection
          </h2>

          <p className="text-base text-ink-muted font-medium leading-relaxed">
            Tactile, long-form film essays and investigative retrospectives published weekly by our senior editorial board.
          </p>

          <div className="pt-2">
            <span className="text-xs text-ink-muted flex items-center gap-2 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-poster-red" />
              <span>Click any card below to bring it to the forefront</span>
            </span>
          </div>
        </div>

        {/* Right Fanned Story Deck */}
        <div className="lg:col-span-7 flex items-center justify-center py-6 px-4 relative min-h-[440px]">
          <div className="relative w-full max-w-sm sm:max-w-md h-[360px] sm:h-[400px]">
            {cards.map((card, idx) => {
              const isSelected = activeCard === idx;
              return (
                <div
                  key={card.id}
                  onClick={() => setActiveCard(idx)}
                  style={{
                    zIndex: isSelected ? 40 : card.zIndex,
                    transform: isSelected
                      ? "translateY(-14px) scale(1.02) rotate(0deg)"
                      : undefined,
                  }}
                  className={`absolute inset-0 border-2 border-ink ${card.bgClass} p-6 sm:p-8 flex flex-col justify-between shadow-press transition-all duration-300 cursor-pointer select-none card-press-interactive group ${
                    !isSelected ? card.rotation : ""
                  }`}
                >
                  {/* Top Bar: Icon + Date */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-12 h-12 ${card.badgeBg} border-2 flex items-center justify-center font-bold shadow-sticker`}
                    >
                      <Film className="w-6 h-6" />
                    </div>

                    <div className="text-right">
                      <span className="text-3xl sm:text-4xl font-black block tracking-tight font-mono-tabular leading-none">
                        {card.day}
                      </span>
                      <span className="text-[11px] font-mono-tabular font-bold uppercase tracking-widest block text-ink-muted mt-1">
                        {card.date}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Headline */}
                  <div className="space-y-3 my-auto py-4">
                    <h3 className="text-lg sm:text-2xl font-black leading-snug tracking-tight text-ink uppercase">
                      {card.title}
                    </h3>
                  </div>

                  {/* Bottom: Author + Read Link */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-ink">
                    <span className="text-xs font-mono-tabular font-bold tracking-widest uppercase text-ink-muted">
                      {card.author}
                    </span>

                    <Link
                      href={card.href}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-ink text-paper text-xs font-black uppercase tracking-wider border border-ink shadow-sticker hover:bg-poster-red transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Read Story</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
