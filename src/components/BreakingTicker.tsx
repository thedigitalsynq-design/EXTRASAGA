"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Pause, Play, ChevronRight } from "lucide-react";
import { Article } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface BreakingTickerProps {
  articles: Article[];
}

export default function BreakingTicker({ articles }: BreakingTickerProps) {
  const { language, config, t, localizeUrl } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liveItems, setLiveItems] = useState<{ id: string; title: string; slug: string }[]>([]);

  // Filter breaking news matching active language / industry
  const languageFiltered = articles.filter(
    (a) => a.language === language || (!a.language && language === "kn")
  );

  const activeList = languageFiltered.length > 0 ? languageFiltered : articles;

  const defaultList = [
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
  ];

  const mergedList = [
    ...liveItems,
    ...(activeList.length > 0 ? activeList : defaultList),
  ];

  // Poll for real-time live breaking items every 35 seconds
  useEffect(() => {
    let isMounted = true;
    const fetchLatest = async () => {
      try {
        const res = await fetch(`/api/live-updates?lang=${language}&category=breaking&limit=5`);
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.updates && data.updates.length > 0) {
            const formatted = data.updates.map((u: { id: string; title: string; relatedSlug?: string }) => ({
              id: u.id,
              title: u.title,
              slug: u.relatedSlug || "latest",
            }));
            setLiveItems(formatted);
          }
        }
      } catch (e) {
        // Fallback gracefully
      }
    };

    // Start polling after the first 35 seconds to keep initial page load instant
    const interval = setInterval(fetchLatest, 35000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [language]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [language]);

  useEffect(() => {
    if (isPaused || mergedList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mergedList.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, mergedList.length]);

  const current = mergedList[currentIndex] || mergedList[0];

  return (
    <div className="w-full bg-hall border-y border-glow-line py-2 px-3 sm:px-6 relative overflow-hidden">
      {/* Void-on-hall projector tray */}
      <div aria-hidden="true" className="absolute inset-0 bg-void/80 backdrop-blur-md pointer-events-none" />
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 relative z-10">
        {/* Breaking plate — signal-red projection chip */}
        <div className="flex items-stretch shrink-0 rounded-md overflow-hidden border border-signal/40 shadow-[0_0_24px_rgba(255,46,80,0.25)] animate-stamp-in">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-signal-deep text-popcorn px-2.5 sm:px-3 py-1 text-xs font-bold tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-signal"></span>
            </span>
            <Zap className="w-3.5 h-3.5 text-marquee" fill="currentColor" />
            <span className="hidden sm:inline font-sans uppercase tracking-wider">{t("sec_breaking")}</span>
            <span className="sm:hidden font-sans uppercase tracking-wider">{t("sec_breaking").split(" ")[0]}</span>
          </div>
          <div className="hidden sm:flex items-center px-2.5 text-[10px] font-sans uppercase tracking-widest bg-revealed/80 text-popcorn-dim">
            {config.industryName}
          </div>
        </div>

        {/* Dynamic News Headline */}
        <div className="flex-1 overflow-hidden">
          <Link
            href={localizeUrl(current.slug === "latest" ? "/category/latest" : `/news/${current.slug}`)}
            className="block text-xs sm:text-sm font-semibold text-popcorn hover:text-signal transition-colors truncate"
          >
            {current.title}
          </Link>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0 text-popcorn-dim">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded-md border border-transparent hover:border-glow-line-strong hover:text-popcorn transition-colors"
            title={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[11px] text-popcorn-muted font-mono-tabular">
            {currentIndex + 1}/{mergedList.length}
          </span>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % mergedList.length)}
            className="p-1 rounded-md border border-transparent hover:border-glow-line-strong hover:text-popcorn transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
