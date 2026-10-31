"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Pause, Play, ChevronRight } from "lucide-react";
import { Article } from "@/types";

interface BreakingTickerProps {
  articles: Article[];
}

export default function BreakingTicker({ articles }: BreakingTickerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const breakingList = articles.length > 0 ? articles : [
    {
      id: "b-default",
      title: "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1: ಕುಂದಾಪುರದಲ್ಲಿ ಬಿರುಸಿನ ಚಿತ್ರೀಕರಣ ಆರಂಭ - ರಿಷಬ್ ಶೆಟ್ಟಿ ರಗಡ್ ಲುಕ್ ವೈರಲ್!",
      slug: "kantara-chapter-1-shooting-kundapura-rishab-shetty-look",
    },
    {
      id: "b-default-2",
      title: "ರಾಕಿಂಗ್ ಸ್ಟಾರ್ ಯಶ್ 'ಟಾಕ್ಸಿಕ್' ಚಿತ್ರಕ್ಕಾಗಿ ಹಾಲಿವುಡ್ ಜಾನ್ ವಿಕ್ ಸ್ಟಂಟ್ ಮಾಸ್ಟರ್ ಆಗಮನ!",
      slug: "yash-toxic-movie-hollywood-stunt-master-geetu-mohandas",
    },
    {
      id: "b-default-3",
      title: "ಕಿಚ್ಚ ಸುದೀಪ್ 'ಮ್ಯಾಕ್ಸ್' ಚಿತ್ರದ ಧಮಾಕಾ ಟೀಸರ್ ರಿಲೀಸ್ ಡೇಟ್ ಅಧಿಕೃತ ಪ್ರಕಟ!",
      slug: "kiccha-sudeep-max-movie-release-date-teaser-update",
    },
  ];

  useEffect(() => {
    if (isPaused || breakingList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingList.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, breakingList.length]);

  const current = breakingList[currentIndex] || breakingList[0];

  return (
    <div className="w-full bg-[#181112] border-b border-brand-red/30 py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Breaking Badge */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-brand-red to-brand-crimson text-white px-3 py-1 rounded text-xs font-bold font-kannada tracking-wide shadow-md shrink-0">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <Zap className="w-3.5 h-3.5 text-white" />
          <span>ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್</span>
        </div>

        {/* Dynamic News Headline */}
        <div className="flex-1 overflow-hidden">
          <Link
            href={`/news/${current.slug}`}
            className="block text-xs sm:text-sm font-medium text-gray-200 hover:text-brand-red transition-colors font-kannada truncate"
          >
            {current.title}
          </Link>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0 text-brand-muted">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded hover:bg-brand-card hover:text-white transition-colors"
            title={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[11px] font-sans text-gray-400">
            {currentIndex + 1}/{breakingList.length}
          </span>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % breakingList.length)}
            className="p-1 rounded hover:bg-brand-card hover:text-white transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

