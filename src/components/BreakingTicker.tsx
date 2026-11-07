"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Pause, Play, ChevronRight, Radio } from "lucide-react";
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
    <div className="w-full bg-white border-b border-gray-200 py-2 px-4 sm:px-6 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Breaking Badge with LIVE pulse */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-brand-crimson to-[#8e1d27] text-white px-2.5 sm:px-3 py-1 rounded text-xs font-bold tracking-wide shadow-sm shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <Zap className="w-3.5 h-3.5 text-white" />
          <span className="hidden sm:inline">{t("sec_breaking")}</span>
          <span className="sm:hidden">{t("sec_breaking").split(" ")[0]}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/25 font-sans font-bold uppercase tracking-wider">
            {config.industryName}
          </span>
        </div>

        {/* Dynamic News Headline */}
        <div className="flex-1 overflow-hidden">
          <Link
            href={localizeUrl(current.slug === "latest" ? "/category/latest" : `/news/${current.slug}`)}
            className="block text-xs sm:text-sm font-semibold text-gray-800 hover:text-brand-crimson transition-colors truncate"
          >
            {current.title}
          </Link>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0 text-gray-500">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded hover:bg-gray-100 hover:text-gray-900 transition-colors"
            title={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[11px] font-sans text-gray-500 font-medium">
            {currentIndex + 1}/{mergedList.length}
          </span>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % mergedList.length)}
            className="p-1 rounded hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
