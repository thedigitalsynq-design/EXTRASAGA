"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Layers, Film, Sparkles, BookOpen, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface StoryCard {
  id: string;
  date: string;
  day: string;
  title: string;
  author: string;
  href: string;
  bgClass: string;
  textClass: string;
  iconBg: string;
  rotation: string;
  zIndex: number;
}

export default function EditorialStoryDeck() {
  const { language, config, localizeUrl } = useLanguage();
  const [activeCard, setActiveCard] = useState<number>(2); // Foreground card default

  const cards: StoryCard[] = [
    {
      id: "card-1",
      day: "05",
      date: "NOV '26",
      title: "How Sandalwood built the most rooted folklore cinematic universe in modern history.",
      author: "BY PRAVEEN KUMAR",
      href: "/news/kantara-chapter-1-shooting-kundapura-rishab-shetty-look",
      bgClass: "bg-[#e5c7d1]",
      textClass: "text-[#28141d]",
      iconBg: "bg-white/40 text-[#28141d]",
      rotation: "-rotate-6 sm:-rotate-8 group-hover:-rotate-12",
      zIndex: 10,
    },
    {
      id: "card-2",
      day: "22",
      date: "OCT '26",
      title: "Is the surge of Pan-India IMAX exhibitions fundamentally reshaping the soul of regional cinema?",
      author: "BY ANANYA IYER",
      href: "/category/latest",
      bgClass: "bg-[#dc6940]",
      textClass: "text-white",
      iconBg: "bg-black/20 text-white",
      rotation: "rotate-3 sm:rotate-4 group-hover:rotate-6",
      zIndex: 20,
    },
    {
      id: "card-3",
      day: "31",
      date: "OCT '26",
      title: "The 100-Year Canvas: Why Ramayana Part 1 chose reverent silence and monumental scale over commercial noise.",
      author: "BY EDITORIAL DESK",
      href: "/reviews/ramayana-part-1-ranbir-kapoor-yash-first-look-analysis",
      bgClass: "bg-[#fcfbf9]",
      textClass: "text-gray-950",
      iconBg: "bg-gray-100 text-gray-900",
      rotation: "-rotate-1 group-hover:-rotate-2",
      zIndex: 30,
    },
  ];

  const headerText = {
    kn: {
      pill: "ಕ್ಯೂರೇಟೆಡ್ ಸ್ಟೋರಿ ಡೆಕ್",
      title: "ಸಿನಿಮಾ ಸ್ಟೋರಿ ಸ್ಟ್ಯಾಕ್ಸ್: ದೀರ್ಘಾವಧಿಯ ವಿಶ್ಲೇಷಣೆಗಳು",
      subtitle: "ಪ್ರತಿ ವಾರ ನಮ್ಮ ಹಿರಿಯ ಸಂಪಾದಕರು ಸಿದ್ಧಪಡಿಸುವ ಆಳವಾದ ಸಿನಿಮೀಯ ಪ್ರಬಂಧಗಳು ಮತ್ತು ಸಂಶೋಧನಾ ವರದಿಗಳು.",
    },
    en: {
      pill: "CURATED STORY DECK",
      title: "Cinema Story Stacks: The Deep-Dive Collection",
      subtitle: "Tactile, long-form film essays and investigative retrospectives published weekly by our senior editorial board.",
    },
  }[language === "kn" ? "kn" : "en"];

  return (
    <section aria-label="Curated Story Stacks" className="w-full py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Editorial Narrative (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gray-100 border border-gray-200 text-gray-700 select-none shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-rose-600" />
            <span>{headerText.pill}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight font-sans">
            {headerText.title}
          </h2>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            {headerText.subtitle}
          </p>

          <div className="pt-2">
            <span className="text-xs text-gray-500 flex items-center gap-2 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Tap or hover over any card to bring it to the forefront</span>
            </span>
          </div>
        </div>

        {/* Right Fanned Story Deck (7 cols) - Inspired by reference image */}
        <div className="lg:col-span-7 flex items-center justify-center py-10 px-4 relative min-h-[440px]">
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
                      ? "translateY(-16px) scale(1.03) rotate(0deg)"
                      : undefined,
                  }}
                  className={`absolute inset-0 rounded-3xl ${card.bgClass} ${card.textClass} p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 cursor-pointer select-none border border-black/10 group ${
                    !isSelected ? card.rotation : ""
                  }`}
                >
                  {/* Top Bar: Icon + Date */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center font-bold shadow-sm`}
                    >
                      <Film className="w-6 h-6" />
                    </div>

                    <div className="text-right">
                      <span className="text-3xl sm:text-4xl font-black block tracking-tight font-sans">
                        {card.day}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider block opacity-75 font-mono">
                        {card.date}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Headline */}
                  <div className="space-y-3 my-auto py-4">
                    <h3 className="text-lg sm:text-2xl font-bold leading-snug tracking-tight font-sans">
                      {card.title}
                    </h3>
                  </div>

                  {/* Bottom: Author + Read Link */}
                  <div className="flex items-center justify-between pt-4 border-t border-black/10">
                    <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase opacity-80">
                      {card.author}
                    </span>

                    <Link
                      href={localizeUrl(card.href)}
                      className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider hover:underline"
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

