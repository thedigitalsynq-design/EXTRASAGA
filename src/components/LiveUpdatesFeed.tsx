"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Radio,
  RefreshCw,
  CheckCircle2,
  Clock,
  Flame,
  Film,
  Sparkles,
  TrendingUp,
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
  const { language, config, t, localizeUrl } = useLanguage();
  const [updates, setUpdates] = useState<LiveCinemaUpdate[]>(initialUpdates);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [hasNewUpdates, setHasNewUpdates] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchLiveUpdates = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/live-updates?lang=${language}&category=${selectedCategory}`);
      if (res.ok) {
        const data = await res.json();
        if (data.updates && data.updates.length > 0) {
          setUpdates(data.updates);
          setLastUpdated(new Date());
          setHasNewUpdates(false);
        }
      }
    } catch (err) {
      console.error("Live feed fetch error:", err);
    } finally {
      setIsLoading(false);
      setCountdown(30);
    }
  }, [language, selectedCategory]);

  // Initial fetch on language or category change
  useEffect(() => {
    fetchLiveUpdates();
  }, [fetchLiveUpdates]);

  // Real-time polling timer
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

  const categoryPills: { id: string; label: Record<string, string> }[] = [
    {
      id: "all",
      label: {
        kn: "ಎಲ್ಲವೂ",
        te: "అన్నీ",
        ta: "அனைத்தும்",
        ml: "എല്ലാം",
        hi: "सभी",
        en: "All Wire",
      },
    },
    {
      id: "breaking",
      label: {
        kn: "ಬ್ರೇಕಿಂಗ್",
        te: "బ్రేకింగ్",
        ta: "பிரேக்கிங்",
        ml: "ബ്രേക്കിംഗ്",
        hi: "ब्रेकिंग",
        en: "Breaking",
      },
    },
    {
      id: "boxoffice",
      label: {
        kn: "ಬಾಕ್ಸ್ ಆಫೀಸ್",
        te: "బాక్సాఫీస్",
        ta: "பாக்ஸ் ஆபீஸ்",
        ml: "ബോക്സ് ഓഫീസ്",
        hi: "बॉक्स ऑफिस",
        en: "Box Office",
      },
    },
    {
      id: "shooting",
      label: {
        kn: "ಶೂಟಿಂಗ್",
        te: "షూటింగ్",
        ta: "படப்பிடிப்பு",
        ml: "ഷൂട്ടിംഗ്",
        hi: "शूटिंग",
        en: "Shooting",
      },
    },
    {
      id: "ott",
      label: {
        kn: "OTT",
        te: "OTT",
        ta: "OTT",
        ml: "OTT",
        hi: "OTT",
        en: "OTT",
      },
    },
  ];

  const headers: Record<string, { title: string; subtitle: string; verified: string }> = {
    kn: {
      title: "ರಿಯಲ್-ಟೈಮ್ ಲೈವ್ ಸಿನಿಮಾ ವೈರ್",
      subtitle: "ಕ್ಷಣಕ್ಷಣದ ಅಧಿಕೃತ ಸಿನಿಮಾ ಸಮಾಚಾರ, ಬಾಕ್ಸ್ ಆಫೀಸ್ ಹಾಗೂ ಶೂಟಿಂಗ್ ಅಪ್ಡೇಟ್ಸ್",
      verified: "ಅಧಿಕೃತ ಟ್ರೇಡ್ ರಿಪೋರ್ಟ್",
    },
    te: {
      title: "రియల్-టైమ్ లైవ్ సినిమా వైర్",
      subtitle: "తాజా టాలీవుడ్ అధికారిక సినిమా వార్తలు, బాక్సాఫీస్ & ఈవెంట్స్",
      verified: "ధృవీకరించబడిన ట్రేడ్ నివేదిక",
    },
    ta: {
      title: "ரியல்-டைம் லைவ் சினிமா வயர்",
      subtitle: "கோலிவுட் அதிகாரப்பூர்வ திரைப்பட செய்திகள் மற்றும் பாக்ஸ் ஆபீஸ்",
      verified: "உறுதிப்படுத்தப்பட்ட வர்த்தக அறிக்கை",
    },
    ml: {
      title: "തത്സമയ സിനിമാ വാർത്തകൾ",
      subtitle: "മോളിവുഡ് പുതിയ വാർത്തകൾ, ഷൂട്ടിംഗ് വിശേഷങ്ങൾ & കളക്ഷൻ",
      verified: "സ്ഥിരീകരിച്ച ട്രേഡ് റിപ്പോർട്ട്",
    },
    hi: {
      title: "रियल-टाइम लाइव सिनेमा वायर",
      subtitle: "ताज़ा बॉलीवुड खबरें, बॉक्स ऑफिस और एक्सक्लूसिव अपडेट्स",
      verified: "सत्यापित ट्रेड रिपोर्ट",
    },
    en: {
      title: "Real-Time Cinema Live Wire",
      subtitle: "Minute-by-minute verified box office records, shooting buzz and trade headlines",
      verified: "Verified Trade Intelligence",
    },
  };

  const currentHeader = headers[language] || headers.en;

  if (compact) {
    return (
      <aside className="rounded-[28px] bg-revealed border border-glow-line shadow-sm p-5 sm:p-6 relative overflow-hidden">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-glow-line">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-signal animate-glow-pulse"></span>
              </span>
              <h3 className="text-sm font-black text-popcorn flex items-center gap-1.5 tracking-tight">
                <span>{currentHeader.title}</span>
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="text-signal-soft bg-signal-faint border border-signal/25 px-2.5 py-0.5 rounded-full font-bold font-mono-tabular hover:border-signal/50 transition-colors"
                title="Toggle Auto Refresh"
              >
                {autoRefresh ? `${countdown}s` : "OFF"}
              </button>
              <button
                type="button"
                onClick={fetchLiveUpdates}
                disabled={isLoading}
                className="text-popcorn-dim hover:text-popcorn p-1 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Updates List */}
          <div className="space-y-3">
            {updates.slice(0, 4).map((item) => (
              <article key={item.id} className="pb-3 border-b border-glow-line last:border-none last:pb-0 group">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-hall text-popcorn-dim border border-glow-line">
                    {item.badgeText}
                  </span>
                  <span className="text-[10px] text-popcorn-muted font-mono-tabular flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-signal-soft" />
                    {item.timeAgoText}
                  </span>
                </div>
                <Link
                  href={item.relatedSlug ? localizeUrl(`/news/${item.relatedSlug}`) : localizeUrl("/live")}
                  className="block"
                >
                  <h4 className="text-xs font-bold text-popcorn group-hover:text-signal leading-snug line-clamp-2 transition-colors duration-200">
                    {item.title}
                  </h4>
                </Link>
              </article>
            ))}
          </div>

          {/* Footer Link */}
          <div className="mt-3 pt-3 border-t border-glow-line text-right">
            <Link
              href={localizeUrl("/live")}
              className="text-[11px] font-bold text-signal-soft hover:text-signal underline-offset-2 hover:underline inline-flex items-center gap-1 transition-colors group/link"
            >
              <span>Open Live Wire ({config.industryName})</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <section className="w-full my-8 bg-hall rounded-2xl border border-glow-line p-5 sm:p-7 relative overflow-hidden">
      {/* Projector Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-signal/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-glow-line relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="w-3.5 h-3.5 rounded-full bg-signal inline-block animate-ping absolute -top-0.5 -left-0.5"></span>
            <div className="w-9 h-9 rounded-xl bg-signal-deep text-popcorn flex items-center justify-center shadow-[0_0_24px_rgba(255,46,80,0.35)] relative z-10">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-display-latin font-black bg-signal-deep text-popcorn uppercase tracking-widest">
                LIVE
              </span>
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-popcorn tracking-tight">
                {currentHeader.title}{" "}
                <span className="text-xs sm:text-sm font-bold text-marquee-soft">
                  ({config.industryName})
                </span>
              </h2>
            </div>
            <p className="text-xs text-popcorn-muted mt-0.5">
              {currentHeader.subtitle}
            </p>
          </div>
        </div>

        {/* Live Controls: Countdown & Auto-Refresh Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              autoRefresh
                ? "bg-signal-faint text-signal-soft border-signal/30"
                : "bg-revealed text-popcorn-dim border-glow-line hover:border-glow-line-strong"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                autoRefresh ? "bg-signal animate-pulse" : "bg-glow-line-strong"
              }`}
            ></span>
            <span className="font-mono-tabular">{autoRefresh ? `Auto: ${countdown}s` : "Auto-Refresh: OFF"}</span>
          </button>

          <button
            type="button"
            onClick={fetchLiveUpdates}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-signal-deep hover:bg-signal disabled:opacity-50 text-popcorn text-xs font-bold transition-all active:scale-95"
            aria-label="Refresh updates"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Refreshing..." : "Refresh Now"}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-3.5 border-b border-glow-line text-xs">
        <Filter className="w-3.5 h-3.5 text-popcorn-muted shrink-0 mr-1" />
        {categoryPills.map((pill) => (
          <button
            key={pill.id}
            type="button"
            onClick={() => setSelectedCategory(pill.id)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
              selectedCategory === pill.id
                ? "bg-signal-deep text-popcorn border-signal"
                : "bg-revealed text-popcorn-dim hover:bg-screen hover:border-glow-line-strong border-glow-line"
            }`}
          >
            {pill.label[language] || pill.label.en}
          </button>
        ))}
        <span className="text-[10px] text-popcorn-muted ml-auto font-mono-tabular hidden sm:inline">
          Updated: {lastUpdated.toLocaleTimeString()}
        </span>
      </div>

      {/* Live Stream List */}
      <div className="space-y-3.5 mt-4">
        {updates.length === 0 ? (
          <div className="p-8 text-center bg-void/60 rounded-xl border border-glow-line">
            <p className="text-sm text-popcorn-dim font-medium">
              No live updates available in this category right now.
            </p>
          </div>
        ) : (
          updates.map((item, idx) => (
            <article
              key={item.id}
              className="group p-4 rounded-xl bg-revealed hover:bg-screen border border-glow-line hover:border-glow-line-strong transition-all duration-200 relative"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${item.badgeColor}`}
                  >
                    {item.badgeText}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] change-positive font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    {item.source}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-popcorn-muted font-mono-tabular">
                  <Clock className="w-3 h-3 text-popcorn-muted" />
                  <span className="text-popcorn-dim font-medium">{item.timeAgoText}</span>
                </div>
              </div>

              {/* Title & Link */}
              {item.relatedSlug ? (
                <Link href={localizeUrl(`/news/${item.relatedSlug}`)} className="block group">
                  <h3 className="text-sm sm:text-base font-bold text-popcorn group-hover:text-signal transition-colors leading-snug">
                    {item.title}
                  </h3>
                </Link>
              ) : (
                <h3 className="text-sm sm:text-base font-bold text-popcorn leading-snug">
                  {item.title}
                </h3>
              )}

              {/* Verified Brief */}
              <p className="text-xs text-popcorn-dim mt-1.5 leading-relaxed line-clamp-2">
                {item.summary}
              </p>
            </article>
          ))
        )}
      </div>

      {/* Footer Link to /live Hub */}
      <div className="mt-5 pt-4 border-t border-glow-line flex items-center justify-between text-xs">
        <span className="text-popcorn-muted text-[11px]">
          Live trade feeds synced with Sacnilk, Ormax Media, BoxOfficeMojo & official film production desks.
        </span>
        <Link
          href={localizeUrl("/live")}
          className="flex items-center gap-1 text-signal-soft hover:text-signal font-bold transition-colors shrink-0 ml-3"
        >
          <span>Open Full Live Wire</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
