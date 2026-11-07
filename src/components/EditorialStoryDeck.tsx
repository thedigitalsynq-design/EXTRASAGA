"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Layers, Film, Sparkles, ArrowUpRight } from "lucide-react";
import DotGrid from "@/components/DotGrid";

interface StoryCard {
  id: string;
  num: string;
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
      num: "01",
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
      num: "02",
      day: "22",
      date: "OCT '26",
      title: "Is the surge of Pan-Indian IMAX exhibitions fundamentally reshaping cinema's soul?",
      author: "BY ANANYA IYER",
      href: "/category/latest",
      bgClass: "bg-band text-ink",
      badgeBg: "bg-marquee text-ink border-ink",
      rotation: "rotate-3 sm:rotate-4",
      zIndex: 20,
    },
    {
      id: "card-3",
      num: "03",
      day: "31",
      date: "OCT '26",
      title: "The 100-Year Canvas: Why Ramayana Part 1 chose reverent silence over commercial noise.",
      author: "BY EDITORIAL DESK",
      href: "/reviews/ramayana-part-1-ranbir-kapoor-yash-first-look-analysis",
      bgClass: "bg-sheet text-ink",
      badgeBg: "bg-press text-paper border-ink",
      rotation: "-rotate-1",
      zIndex: 30,
    },
  ];

  return (
    <section aria-label="Curated Story Stacks" className="w-full py-12 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Editorial Column */}
        <div className="lg:col-span-5 space-y-4 relative">
          <DotGrid className="absolute -top-6 left-0" rows={2} cols={5} />

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-band text-ink font-bold text-xs uppercase tracking-widest border-2 border-ink shadow-sticker">
            <Layers className="w-3.5 h-3.5 text-press-deep" />
            <span>Curated Story Deck</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-poster uppercase text-ink tracking-tight leading-tight">
            Cinema Story Stacks · The Deep-Dive Collection
          </h2>

          <p className="text-sm text-ink-dim font-grotesk font-medium leading-relaxed">
            Long-form film essays and investigative retrospectives published weekly — written for readers who see movies as literature in motion.
          </p>

          <div className="pt-2">
            <span className="text-xs text-ink-dim flex items-center gap-2 font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-press-deep" />
              <span>Click any card to bring its story into focus</span>
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
                  <DotGrid className="absolute top-4 right-4" rows={2} cols={3} />

                  {/* Top Bar: Icon + Date */}
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-11 h-11 ${card.badgeBg} border-2 border-ink flex items-center justify-center font-bold shadow-sticker`}
                      >
                        <Film className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-paper border border-ink shadow-2xs uppercase">
                        STORY #{card.num}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-3xl sm:text-4xl font-poster uppercase block tracking-tight leading-none text-ink">
                        {card.day}
                      </span>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-widest block text-ink-dim mt-1">
                        {card.date}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Headline */}
                  <div className="space-y-3 my-auto py-4 relative z-10">
                    <h3 className="text-base sm:text-xl font-poster uppercase leading-snug tracking-tight text-ink group-hover:text-press transition-colors">
                      {card.title}
                    </h3>
                  </div>

                  {/* Bottom: Author + Read Link */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-ink relative z-10">
                    <span className="text-xs font-mono font-bold tracking-widest uppercase text-ink-dim">
                      {card.author}
                    </span>

                    <Link
                      href={card.href}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-ink text-paper text-xs font-poster uppercase tracking-wider border-2 border-ink shadow-sticker hover:bg-press transition-colors"
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
