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
      <aside className="rounded-[28px] bg-white border border-[#E5EBE7] shadow-sm p-5 sm:p-6 relative overflow-hidden">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#E5EBE7]">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#288760] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#288760]"></span>
              </span>
              <h3 className="text-sm font-black text-[#0F3529] flex items-center gap-1.5 font-sans tracking-tight">
                <span>{currentHeader.title}</span>
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-sans">
              <button
                type="button"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="text-[#1A5140] bg-[#E8F8EB] border border-[#B7E5BA] px-2.5 py-0.5 rounded-full font-bold shadow-2xs hover:bg-[#B7E5BA]/40 transition-colors"
                title="Toggle Auto Refresh"
              >
                {autoRefresh ? `${countdown}s` : "OFF"}
              </button>
              <button
                type="button"
                onClick={fetchLiveUpdates}
                disabled={isLoading}
                className="text-[#4B6358] hover:text-[#0F3529] p-1 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Updates List */}
          <div className="space-y-3">
            {updates.slice(0, 4).map((item) => (
              <article key={item.id} className="pb-3 border-b border-[#E5EBE7] last:border-none last:pb-0 group">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-sans font-bold bg-[#E8F8EB] text-[#1A5140] border border-[#B7E5BA]">
                    {item.badgeText}
                  </span>
                  <span className="text-[10px] text-[#4B6358] font-sans flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-[#288760]" />
                    {item.timeAgoText}
                  </span>
                </div>
                <Link
                  href={item.relatedSlug ? localizeUrl(`/news/${item.relatedSlug}`) : localizeUrl("/live")}
                  className="block"
                >
                  <h4 className="text-xs font-bold text-gray-900 group-hover:text-brand-crimson leading-snug line-clamp-2 transition-colors duration-200">
                    {item.title}
                  </h4>
                </Link>
              </article>
            ))}
          </div>

          {/* Footer Link */}
          <div className="mt-3 pt-3 border-t border-gray-100 text-right">
            <Link
              href={localizeUrl("/live")}
              className="text-[11px] font-bold text-brand-crimson hover:underline inline-flex items-center gap-1 transition-colors font-sans group/link"
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
    <section className="w-full my-8 bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-7 shadow-sm relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-crimson/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-200 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="w-3.5 h-3.5 rounded-full bg-brand-crimson inline-block animate-ping absolute -top-0.5 -left-0.5"></span>
            <div className="w-9 h-9 rounded-xl bg-brand-crimson text-white flex items-center justify-center shadow-md relative z-10">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-sans font-black bg-brand-crimson text-white uppercase tracking-wider">
                LIVE
              </span>
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gray-950 tracking-tight">
                {currentHeader.title}{" "}
                <span className="text-xs sm:text-sm font-sans font-bold text-amber-700">
                  ({config.industryName})
                </span>
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {currentHeader.subtitle}
            </p>
          </div>
        </div>

        {/* Live Controls: Countdown & Auto-Refresh Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all border ${
              autoRefresh
                ? "bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs"
                : "bg-gray-100 text-gray-600 border-gray-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                autoRefresh ? "bg-emerald-600 animate-pulse" : "bg-gray-400"
              }`}
            ></span>
            <span>{autoRefresh ? `Auto: ${countdown}s` : "Auto-Refresh: OFF"}</span>
          </button>

          <button
            type="button"
            onClick={fetchLiveUpdates}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-crimson hover:bg-[#8e1d27] disabled:opacity-50 text-white text-xs font-bold font-sans transition-all shadow-sm active:scale-95"
            aria-label="Refresh updates"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Refreshing..." : "Refresh Now"}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-3.5 border-b border-gray-200 text-xs">
        <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0 mr-1" />
        {categoryPills.map((pill) => (
          <button
            key={pill.id}
            type="button"
            onClick={() => setSelectedCategory(pill.id)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
              selectedCategory === pill.id
                ? "bg-brand-crimson text-white border-brand-crimson shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
            }`}
          >
            {pill.label[language] || pill.label.en}
          </button>
        ))}
        <span className="text-[10px] text-gray-500 ml-auto font-sans hidden sm:inline">
          Updated: {lastUpdated.toLocaleTimeString()}
        </span>
      </div>

      {/* Live Stream List */}
      <div className="space-y-3.5 mt-4">
        {updates.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600 font-medium">
              No live updates available in this category right now.
            </p>
          </div>
        ) : (
          updates.map((item, idx) => (
            <article
              key={item.id}
              className="group p-4 rounded-xl bg-white hover:bg-gray-50/80 border border-gray-200/90 hover:border-gray-300 transition-all duration-200 relative shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-sans font-bold border ${item.badgeColor}`}
                  >
                    {item.badgeText}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-sans font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {item.source}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-gray-500 font-sans">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-700 font-medium">{item.timeAgoText}</span>
                </div>
              </div>

              {/* Title & Link */}
              {item.relatedSlug ? (
                <Link href={localizeUrl(`/news/${item.relatedSlug}`)} className="block group">
                  <h3 className="text-sm sm:text-base font-bold text-gray-950 group-hover:text-brand-crimson transition-colors leading-snug">
                    {item.title}
                  </h3>
                </Link>
              ) : (
                <h3 className="text-sm sm:text-base font-bold text-gray-950 leading-snug">
                  {item.title}
                </h3>
              )}

              {/* Verified Brief */}
              <p className="text-xs text-gray-600 mt-1.5 leading-relaxed line-clamp-2">
                {item.summary}
              </p>
            </article>
          ))
        )}
      </div>

      {/* Footer Link to /live Hub */}
      <div className="mt-5 pt-4 border-t border-brand-border/50 flex items-center justify-between text-xs">
        <span className="text-brand-muted font-sans text-[11px]">
          Live trade feeds synced with Sacnilk, Ormax Media, BoxOfficeMojo & official film production desks.
        </span>
        <Link
          href={localizeUrl("/live")}
          className="flex items-center gap-1 text-brand-red hover:text-white font-bold transition-colors font-sans shrink-0 ml-3"
        >
          <span>Open Full Live Wire</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

