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
  const { localizeUrl } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liveItems, setLiveItems] = useState<{ id: string; title: string; slug: string }[]>([]);

  const activeList = articles;

  const defaultList = [
    {
      id: "b-default",
      title: "Kantara Chapter 1: Ancient Legends Awaken as Rishab Shetty Commences Filming in Kundapura",
      slug: "kantara-chapter-1-shooting-kundapura-rishab-shetty-look",
    },
    {
      id: "b-default-2",
      title: "Toxic: Hollywood Stunt Directors Join Rocking Star Yash for a Gritty, High-Stakes Spectacle",
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
        const res = await fetch("/api/live-updates?category=breaking&limit=5");
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

    const interval = setInterval(fetchLatest, 35000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isPaused || mergedList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mergedList.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, mergedList.length]);

  const current = mergedList[currentIndex] || mergedList[0];

  return (
    <div className="w-full bg-band border-y-2 border-ink py-2 px-3 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 relative z-10">
        {/* Breaking plate */}
        <div className="flex items-stretch shrink-0 border-2 border-ink shadow-sticker">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-press text-paper px-2.5 sm:px-3 py-1 text-xs font-bold tracking-wider uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-paper opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-paper"></span>
            </span>
            <Zap className="w-3.5 h-3.5 text-marquee" fill="currentColor" />
            <span>BREAKING</span>
          </div>
          <div className="hidden sm:flex items-center px-2.5 text-[10px] font-bold uppercase tracking-wider bg-paper text-ink border-l-2 border-ink">
            ALL INDIAN CINEMA WIRE
          </div>
        </div>

        {/* Dynamic News Headline */}
        <div className="flex-1 overflow-hidden">
          <Link
            href={localizeUrl(current.slug === "latest" ? "/category/latest" : `/news/${current.slug}`)}
            className="block text-xs sm:text-sm font-bold text-ink hover:text-press transition-colors truncate"
          >
            {current.title}
          </Link>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0 text-ink-dim">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 border border-ink bg-paper hover:bg-press hover:text-paper transition-colors"
            title={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[11px] text-ink-mute font-mono font-bold">
            {currentIndex + 1}/{mergedList.length}
          </span>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % mergedList.length)}
            className="p-1 border border-ink bg-paper hover:bg-press hover:text-paper transition-colors"
            title="Next Story"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
