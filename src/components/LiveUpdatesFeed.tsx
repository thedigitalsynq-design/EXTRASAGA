"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Radio,
  RefreshCw,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LiveCinemaUpdate } from "@/data/liveUpdatesData";

interface LiveUpdatesFeedProps {
  initialUpdates?: LiveCinemaUpdate[];
  compact?: boolean;
}

export default function LiveUpdatesFeed({
  initialUpdates = [],
  compact = false,
}: LiveUpdatesFeedProps) {
  const { localizeUrl } = useLanguage();
  const [updates, setUpdates] = useState<LiveCinemaUpdate[]>(initialUpdates);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const fetchLiveUpdates = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/live-updates?category=${selectedCategory}`);
      if (res.ok) {
        const data = await res.json();
        if (data.updates && data.updates.length > 0) {
          setUpdates(data.updates);
        }
      }
    } catch (err) {
      console.error("Live feed fetch error:", err);
    } finally {
      setIsLoading(false);
      setCountdown(30);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchLiveUpdates();
  }, [fetchLiveUpdates]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchLiveUpdates();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLiveUpdates]);

  const categoryPills = [
    { id: "all", label: "All Wire" },
    { id: "breaking", label: "Breaking" },
    { id: "boxoffice", label: "Box Office" },
    { id: "shooting", label: "Production" },
    { id: "trailer", label: "Trailers" },
  ];

  if (compact) {
    return (
      <aside className="bg-sheet border-2 border-ink shadow-press p-5 sm:p-6 relative overflow-hidden">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b-2 border-ink">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-press opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-press"></span>
              </span>
              <h3 className="text-sm font-poster uppercase text-ink flex items-center gap-1.5 tracking-tight">
                <span>Real-Time Cinema Live Wire</span>
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="btn-press-interactive text-ink bg-paper border border-ink px-2 py-0.5 font-mono font-bold hover:bg-band transition-colors"
                title="Toggle Auto Refresh"
              >
                {autoRefresh ? `${countdown}s` : "OFF"}
              </button>
              <button
                type="button"
                onClick={fetchLiveUpdates}
                disabled={isLoading}
                className="btn-press-interactive text-ink hover:text-press p-1 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Updates List */}
          <div className="space-y-3">
            {updates.slice(0, 4).map((item) => (
              <article key={item.id} className="pb-3 border-b border-line last:border-none last:pb-0 group">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-band text-ink border border-ink">
                    {item.badgeText}
                  </span>
                  <span className="text-[10px] text-ink-mute font-mono flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-press-deep" />
                    {item.timeAgoText}
                  </span>
                </div>
                <Link
                  href={item.relatedSlug ? localizeUrl(`/news/${item.relatedSlug}`) : localizeUrl("/live")}
                  className="block"
                >
                  <h4 className="text-xs font-poster uppercase text-ink group-hover:text-press leading-snug line-clamp-2 transition-colors">
                    {item.title}
                  </h4>
                </Link>
              </article>
            ))}
          </div>

          {/* Footer Link */}
          <div className="mt-3 pt-3 border-t-2 border-ink text-right">
            <Link
              href={localizeUrl("/live")}
              className="text-[11px] font-poster uppercase text-ink hover:text-press inline-flex items-center gap-1 transition-colors group/link"
            >
              <span>Open Live Cinema Wire &rarr;</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <section className="w-full my-8 bg-sheet border-2 border-ink shadow-press p-5 sm:p-7 relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b-2 border-ink relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-press text-paper border-2 border-ink shadow-sticker flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="sticker bg-press text-paper border-2 border-ink px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                LIVE
              </span>
              <h2 className="text-lg sm:text-xl font-poster uppercase text-ink tracking-tight">
                REAL-TIME CINEMA LIVE WIRE
              </h2>
            </div>
            <p className="text-xs text-ink-dim font-grotesk font-medium mt-0.5">
              Minute-by-minute verified box office records, shooting buzz and trade headlines across all Indian film industries
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`btn-press-interactive flex items-center gap-1.5 px-3 py-1.5 text-xs font-poster uppercase transition-all border-2 border-ink ${
              autoRefresh
                ? "bg-marquee text-ink shadow-sticker"
                : "bg-paper text-ink shadow-sticker"
            }`}
          >
            <span
              className={`w-2 h-2 ${
                autoRefresh ? "bg-press animate-ping" : "bg-ink"
              }`}
            ></span>
            <span className="font-mono">{autoRefresh ? `Auto: ${countdown}s` : "Auto-Refresh: OFF"}</span>
          </button>

          <button
            type="button"
            onClick={fetchLiveUpdates}
            disabled={isLoading}
            className="btn-press-interactive flex items-center gap-1.5 px-3.5 py-1.5 bg-ink hover:bg-press disabled:opacity-50 text-paper text-xs font-poster uppercase tracking-wider transition-all border-2 border-ink shadow-sticker"
            aria-label="Refresh updates"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Refreshing..." : "Refresh Now"}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3.5 border-b-2 border-ink text-xs">
        <Filter className="w-3.5 h-3.5 text-ink shrink-0 mr-1" />
        {categoryPills.map((pill) => (
          <button
            key={pill.id}
            type="button"
            onClick={() => setSelectedCategory(pill.id)}
            className={`btn-press-interactive px-3.5 py-1 text-xs font-poster uppercase transition-all whitespace-nowrap border-2 border-ink ${
              selectedCategory === pill.id
                ? "bg-press text-paper shadow-sticker"
                : "bg-paper text-ink hover:bg-band shadow-sticker"
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Live Stream List */}
      <div className="space-y-3.5 mt-4">
        {updates.length === 0 ? (
          <div className="p-8 text-center bg-paper border-2 border-dashed border-ink">
            <p className="text-sm font-poster uppercase text-ink-dim">
              No live updates available in this category right now.
            </p>
          </div>
        ) : (
          updates.map((item) => (
            <article
              key={item.id}
              className="card-press-interactive group p-4 bg-paper hover:bg-band border-2 border-ink shadow-sticker transition-all relative"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-marquee text-ink border border-ink font-mono">
                    {item.badgeText}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-press-deep font-bold font-mono">
                    <CheckCircle2 className="w-3 h-3 text-press-deep" />
                    {item.source}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-ink-mute font-mono">
                  <Clock className="w-3 h-3 text-ink-dim" />
                  <span className="font-bold">{item.timeAgoText}</span>
                </div>
              </div>

              {/* Title & Link */}
              {item.relatedSlug ? (
                <Link href={localizeUrl(`/news/${item.relatedSlug}`)} className="block group">
                  <h3 className="text-sm sm:text-base font-poster uppercase text-ink group-hover:text-press transition-colors leading-snug">
                    {item.title}
                  </h3>
                </Link>
              ) : (
                <h3 className="text-sm sm:text-base font-poster uppercase text-ink leading-snug">
                  {item.title}
                </h3>
              )}

              {/* Verified Brief */}
              <p className="text-xs text-ink-dim mt-1.5 leading-relaxed line-clamp-2 font-grotesk font-medium">
                {item.summary}
              </p>
            </article>
          ))
        )}
      </div>

      {/* Footer Link to /live Hub */}
      <div className="mt-5 pt-4 border-t-2 border-ink flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <span className="text-ink-mute text-[11px] font-mono">
          Live trade feeds synced with verified film desks across India.
        </span>
        <Link
          href={localizeUrl("/live")}
          className="btn-press-interactive flex items-center gap-1 text-ink hover:text-press font-poster uppercase transition-colors shrink-0"
        >
          <span>Open Full Live Wire</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
