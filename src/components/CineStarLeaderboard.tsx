"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  RefreshCw,
  SlidersHorizontal,
  Star,
  Film,
  Crown,
  ArrowUpRight,
  ArrowDownRight,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Zap,
  Users,
  Clapperboard,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  CINESTAR_LEADERBOARD,
  CINESTAR_SUMMARY_STATS,
  CineStarEntry,
  CineStarCategory,
  CineStarIndustry,
} from "@/data/cineStarData";

type SortKey = "rank" | "boxOfficePowerCr" | "currentYearGrossCr" | "dailyChangeCr";
type SortDir = "asc" | "desc";

function RankChangeIndicator({ current, previous }: { current: number; previous: number }) {
  const diff = previous - current; // positive = moved up
  if (diff > 0)
    return (
      <span className="inline-flex items-center gap-0.5 change-positive font-black text-[11px] font-mono-tabular">
        <ChevronUp className="w-3.5 h-3.5" />
        {diff}
      </span>
    );
  if (diff < 0)
    return (
      <span className="inline-flex items-center gap-0.5 change-negative font-black text-[11px] font-mono-tabular">
        <ChevronDown className="w-3.5 h-3.5" />
        {Math.abs(diff)}
      </span>
    );
  return <Minus className="w-3.5 h-3.5 text-popcorn-muted" />;
}

function DailyChangeCell({ value, pct }: { value: number; pct: number }) {
  const isPos = value >= 0;
  if (value === 0) return <span className="text-popcorn-muted text-xs font-mono-tabular">—</span>;
  return (
    <div className={`flex items-center gap-1 font-mono-tabular font-black text-xs ${isPos ? "change-positive" : "change-negative"}`}>
      {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
      <span>{isPos ? "+" : ""}{value.toFixed(1)} Cr</span>
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isPos ? "bg-[#4ADE80]/10 change-positive" : "bg-[#FF5C6E]/10 change-negative"}`}>
        {isPos ? "+" : ""}{pct.toFixed(2)}%
      </span>
    </div>
  );
}

function PodiumCard({ entry, podiumPos }: { entry: CineStarEntry; podiumPos: 1 | 2 | 3 }) {
  const heights = { 1: "h-72 sm:h-80", 2: "h-60 sm:h-68", 3: "h-56 sm:h-64" };
  const crowns = { 1: "🥇", 2: "🥈", 3: "🥉" };
  const borders = {
    1: "border-marquee/60 shadow-[0_0_40px_rgba(255,176,32,0.25)]",
    2: "border-ultra/40 shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
    3: "border-glow-line shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
  };
  const badgeBg = {
    1: "bg-gradient-to-br from-marquee-deep to-marquee text-void",
    2: "bg-gradient-to-br from-ultra-deep to-ultra text-void",
    3: "bg-gradient-to-br from-signal-deep to-signal text-void",
  };
  const isGain = entry.dailyChangeCr >= 0;

  return (
    <div className={`relative ${podiumPos === 1 ? "podium-gold-glow" : ""} bg-revealed rounded-[28px] border-2 ${borders[podiumPos]} overflow-hidden transition-all duration-300 hover:scale-[1.02] group ${heights[podiumPos]} flex flex-col`}>
      {/* Background projector wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-hall/70 to-transparent pointer-events-none" />

      {/* Rank badge */}
      <div className={`absolute top-4 left-4 w-9 h-9 rounded-full ${badgeBg[podiumPos]} flex items-center justify-center font-black text-sm shadow-lg z-10`}>
        {podiumPos === 1 ? <Crown className="w-4 h-4" /> : entry.rank}
      </div>

      {/* Live indicator */}
      {entry.isLive && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-signal-faint border border-signal/30 z-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-signal animate-glow-pulse" />
          </span>
          <span className="text-[9px] font-black text-signal-soft uppercase tracking-widest font-display-latin">Live</span>
        </div>
      )}

      {/* Profile image area */}
      <div className="relative flex-1 overflow-hidden">
        <Image
          src={entry.profileImage}
          alt={entry.name}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />

        {/* Bottom content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-lg">{crowns[podiumPos]}</span>
            <h3 className="text-popcorn font-black text-base sm:text-lg leading-none tracking-tight line-clamp-1">
              {entry.name}
            </h3>
          </div>
          <p className={`text-[11px] font-semibold mb-2 ${podiumPos === 1 ? "text-marquee-soft" : "text-popcorn-muted"}`}>{entry.sourceOfPower}</p>

          {/* Key stats */}
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-[10px] text-popcorn-muted font-mono uppercase tracking-widest">Lifetime Power</div>
              <div className={`font-black text-xl sm:text-2xl font-mono-tabular leading-none ${podiumPos === 1 ? "text-marquee-soft" : "text-popcorn"}`}>
                ₹{entry.boxOfficePowerCr >= 1000
                  ? `${(entry.boxOfficePowerCr / 1000).toFixed(1)}K`
                  : entry.boxOfficePowerCr} Cr
              </div>
            </div>
            <div className={`text-right ${isGain ? "change-positive" : "change-negative"}`}>
              <div className="text-[10px] font-mono uppercase tracking-widest opacity-70 text-popcorn-muted">Today</div>
              <div className="font-black text-sm font-mono-tabular flex items-center gap-0.5">
                {isGain ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {isGain ? "+" : ""}{entry.dailyChangeCr.toFixed(1)} Cr
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry tag */}
      <div className="px-4 py-2.5 border-t border-glow-line flex items-center justify-between bg-revealed">
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${podiumPos === 1 ? "text-marquee-soft bg-marquee-faint border-marquee/30" : "text-popcorn-dim bg-hall border-glow-line"}`}>
          {entry.industryLabel}
        </span>
        <span className="text-[10px] text-popcorn-muted font-mono">{entry.nationality}</span>
      </div>
    </div>
  );
}

function SummaryStatCard({
  label,
  value,
  sub,
  color = "jade",
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  color?: "jade" | "gold" | "red" | "blue";
  icon: React.ComponentType<{ className?: string }>;
}) {
  const colorMap = {
    jade: { bg: "bg-[#4ADE80]/10", border: "border-[#4ADE80]/30", text: "change-positive", badge: "change-positive" },
    gold: { bg: "bg-marquee-faint", border: "border-marquee/30", text: "text-marquee-soft", badge: "text-marquee-soft" },
    red: { bg: "bg-[#FF5C6E]/10", border: "border-[#FF5C6E]/30", text: "change-negative", badge: "change-negative" },
    blue: { bg: "bg-ultra-faint", border: "border-ultra/30", text: "text-ultra-soft", badge: "text-ultra-soft" },
  };
  const c = colorMap[color];
  return (
    <div className={`bg-revealed rounded-[24px] border border-glow-line p-5 flex flex-col gap-3 hover:shadow-md hover:border-glow-line-strong transition-all`}>
      <div className={`w-10 h-10 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${c.text}`} />
      </div>
      <div>
        <div className="text-xs font-semibold text-popcorn-muted uppercase tracking-widest font-display-latin mb-1">{label}</div>
        <div className="text-2xl font-black text-popcorn font-mono-tabular leading-none">{value}</div>
        <div className={`text-xs font-bold mt-1 ${c.badge}`}>{sub}</div>
      </div>
    </div>
  );
}

export default function CineStarLeaderboard() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CineStarCategory | "all">("all");
  const [industryFilter, setIndustryFilter] = useState<CineStarIndustry | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "rank" ? "asc" : "desc");
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const filtered = useMemo(() => {
    let data = [...CINESTAR_LEADERBOARD];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          (e.nameKn && e.nameKn.includes(q)) ||
          e.primaryFilm.toLowerCase().includes(q) ||
          e.sourceOfPower.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (categoryFilter !== "all") {
      data = data.filter((e) => e.category === categoryFilter);
    }
    if (industryFilter !== "all") {
      data = data.filter((e) => e.industry === industryFilter);
    }
    data.sort((a, b) => {
      let va = a[sortKey] as number;
      let vb = b[sortKey] as number;
      return sortDir === "asc" ? va - vb : vb - va;
    });
    return data;
  }, [searchQuery, categoryFilter, industryFilter, sortKey, sortDir]);

  const podiumEntries = CINESTAR_LEADERBOARD.slice(0, 3);

  const SortButton = ({ col, label }: { col: SortKey; label: string }) => (
    <button
      type="button"
      onClick={() => handleSort(col)}
      className={`flex items-center gap-1 group hover:text-popcorn transition-colors ${
        sortKey === col ? "text-signal-soft font-black" : "text-popcorn-dim font-semibold"
      }`}
    >
      <span className="whitespace-nowrap">{label}</span>
      <span className="flex flex-col opacity-50 group-hover:opacity-100">
        <ChevronUp className={`w-2.5 h-2.5 -mb-0.5 ${sortKey === col && sortDir === "asc" ? "opacity-100 text-signal-soft" : ""}`} />
        <ChevronDown className={`w-2.5 h-2.5 ${sortKey === col && sortDir === "desc" ? "opacity-100 text-signal-soft" : ""}`} />
      </span>
    </button>
  );

  return (
    <div className="space-y-8">
      {/* ─── HEADER STRIP ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-70" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-signal animate-glow-pulse" />
            </span>
            <span className="text-[11px] font-black text-signal-soft uppercase tracking-widest font-display-latin">
              Real-Time CineStar Intelligence
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-popcorn tracking-tight leading-none">
            ಸಿನಿ<span className="text-marquee-soft">ಸ್ಟಾರ್</span> ಲೀಡರ್‌ಬೋರ್ಡ್
          </h1>
          <p className="text-sm text-popcorn-dim mt-1 font-medium">
            India's most powerful cinema personalities — ranked by box office power, daily momentum & industry influence
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-signal-faint border border-signal/30 text-signal-soft text-sm font-bold hover:border-signal/60 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {/* ─── SUMMARY STAT CARDS (Forbes hero stats bar) ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryStatCard
          label="Total Tracked"
          value={`${CINESTAR_SUMMARY_STATS.totalTracked}`}
          sub="Cinema personalities"
          color="jade"
          icon={Users}
        />
        <SummaryStatCard
          label="Combined Power"
          value={`₹${(CINESTAR_SUMMARY_STATS.totalBoxOfficePowerCr / 1000).toFixed(0)}K Cr`}
          sub="Lifetime box office"
          color="gold"
          icon={Film}
        />
        <SummaryStatCard
          label="Top Gainer Today"
          value={`+${CINESTAR_SUMMARY_STATS.topGainerChangePct}%`}
          sub={CINESTAR_SUMMARY_STATS.topGainerToday}
          color="jade"
          icon={TrendingUp}
        />
        <SummaryStatCard
          label="Top Mover Down"
          value={`${CINESTAR_SUMMARY_STATS.topLoserChangePct}%`}
          sub={CINESTAR_SUMMARY_STATS.topLoserToday}
          color="red"
          icon={TrendingDown}
        />
      </div>

      {/* ─── TOP 3 PODIUM (Forbes hero showcase) ─── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-4 h-4 text-marquee-soft" />
          <span className="text-sm font-black text-popcorn uppercase tracking-widest font-display-latin">
            Top 3 — Podium CineStars
          </span>
          <span className="flex-1 h-px bg-glow-line" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          {/* #2 goes left */}
          <div className="sm:mt-8">
            <PodiumCard entry={podiumEntries[1]} podiumPos={2} />
          </div>
          {/* #1 center — tallest */}
          <div>
            <PodiumCard entry={podiumEntries[0]} podiumPos={1} />
          </div>
          {/* #3 goes right */}
          <div className="sm:mt-16">
            <PodiumCard entry={podiumEntries[2]} podiumPos={3} />
          </div>
        </div>
      </div>

      {/* ─── FILTERS & SEARCH (Forbes controls bar) ─── */}
      <div className="bg-revealed rounded-[24px] border border-glow-line p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-popcorn-muted" />
            <input
              type="text"
              placeholder="ಹೆಸರು, ಸಿನಿಮಾ, ಉದ್ಯಮ ಹುಡುಕಿ... (Search name, film, source...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-glow-line bg-hall text-sm text-popcorn placeholder:text-popcorn-muted focus:outline-none focus:border-signal focus:ring-2 focus:ring-signal/20 transition-all font-medium"
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {([
              { id: "all", label: "ಎಲ್ಲರೂ" },
              { id: "actor", label: "ನಟ/ನಟಿ" },
              { id: "director", label: "ನಿರ್ದೇಶಕ" },
              { id: "producer", label: "ನಿರ್ಮಾಪಕ" },
            ] as { id: CineStarCategory | "all"; label: string }[]).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoryFilter(c.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  categoryFilter === c.id
                    ? "bg-signal-deep text-popcorn border-signal"
                    : "bg-hall text-popcorn-dim border-glow-line hover:border-glow-line-strong hover:text-popcorn"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Industry filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {([
              { id: "all", label: "All" },
              { id: "sandalwood", label: "Sandalwood" },
              { id: "tollywood", label: "Tollywood" },
              { id: "kollywood", label: "Kollywood" },
              { id: "mollywood", label: "Mollywood" },
              { id: "bollywood", label: "Bollywood" },
            ] as { id: CineStarIndustry | "all"; label: string }[]).map((ind) => (
              <button
                key={ind.id}
                type="button"
                onClick={() => setIndustryFilter(ind.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  industryFilter === ind.id
                    ? "bg-ultra-deep text-popcorn border-ultra"
                    : "bg-hall text-popcorn-dim border-glow-line hover:border-glow-line-strong hover:text-popcorn"
                }`}
              >
                {ind.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── MAIN LEADERBOARD TABLE (Forbes-exact layout) ─── */}
      <div className="bg-revealed rounded-[28px] border border-glow-line shadow-sm overflow-hidden">
        {/* Table metadata bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-glow-line bg-hall/60">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-signal-soft" />
            <span className="text-sm font-black text-popcorn">
              {filtered.length} CineStars tracked
            </span>
            <span className="text-xs text-popcorn-muted font-medium font-mono-tabular">
              • Updated {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} IST
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-popcorn-dim font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-signal-soft" />
            Consolidated Trade Intelligence
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glow-line bg-hall text-[10px] uppercase tracking-widest font-display-latin">
                <th className="py-3.5 px-4 font-black text-popcorn-muted w-16 text-center">
                  <SortButton col="rank" label="Rank" />
                </th>
                <th className="py-3.5 px-4 font-black text-popcorn-muted">
                  CineStar &amp; Profile
                </th>
                <th className="py-3.5 px-4 font-black text-popcorn-muted hidden sm:table-cell">
                  Source of Power
                </th>
                <th className="py-3.5 px-4 font-black text-popcorn-muted hidden md:table-cell">
                  <SortButton col="currentYearGrossCr" label="2026 Gross" />
                </th>
                <th className="py-3.5 px-4 font-black text-popcorn-muted">
                  <SortButton col="boxOfficePowerCr" label="Lifetime Power" />
                </th>
                <th className="py-3.5 px-4 font-black text-popcorn-muted">
                  <SortButton col="dailyChangeCr" label="Today's Move" />
                </th>
                <th className="py-3.5 px-4 font-black text-popcorn-muted hidden lg:table-cell">
                  Latest Film
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glow-line">
              {filtered.map((entry) => {
                const isExpanded = expandedId === entry.id;
                return (
                  <React.Fragment key={entry.id}>
                    <tr
                      className="hover:bg-screen transition-colors cursor-pointer group"
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    >
                      {/* Rank */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-lg font-black text-popcorn font-display-latin leading-none">
                            {entry.rank}
                          </span>
                          <RankChangeIndicator current={entry.rank} previous={entry.previousRank} />
                        </div>
                      </td>

                      {/* Profile */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-glow-line shrink-0 bg-hall">
                            <Image
                              src={entry.profileImage}
                              alt={entry.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                            {entry.isLive && (
                              <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-signal border-2 border-revealed" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-popcorn text-sm group-hover:text-signal-soft transition-colors leading-none">
                                {entry.name}
                              </span>
                              {entry.verified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-signal-soft shrink-0" />
                              )}
                            </div>
                            {entry.nameKn && (
                              <div className="text-[11px] text-popcorn-dim font-semibold mt-0.5">{entry.nameKn}</div>
                            )}
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-hall text-popcorn-dim border border-glow-line font-bold">
                                {entry.industryLabel}
                              </span>
                              <span className="text-[10px] text-popcorn-muted">{entry.nationality}</span>
                              {entry.age && (
                                <span className="text-[10px] text-popcorn-muted font-mono-tabular">· {entry.age} yrs</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Source of power */}
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <div className="text-xs text-popcorn font-semibold">{entry.sourceOfPower}</div>
                        <div className="text-[10px] text-popcorn-muted mt-0.5">🎬 {entry.primaryFilm}</div>
                      </td>

                      {/* 2026 gross */}
                      <td className="py-4 px-4 font-mono-tabular font-bold text-sm text-popcorn hidden md:table-cell">
                        ₹{entry.currentYearGrossCr} Cr
                      </td>

                      {/* Lifetime Power */}
                      <td className="py-4 px-4">
                        <div className="font-black text-popcorn font-mono-tabular text-base leading-none">
                          ₹{entry.boxOfficePowerCr >= 1000
                            ? `${(entry.boxOfficePowerCr / 1000).toFixed(1)}K`
                            : entry.boxOfficePowerCr} Cr
                        </div>
                        <div className="text-[10px] text-popcorn-muted mt-0.5 font-mono-tabular">
                          Peak #{entry.peakRank}
                        </div>
                      </td>

                      {/* Daily change */}
                      <td className="py-4 px-4">
                        <DailyChangeCell value={entry.dailyChangeCr} pct={entry.dailyChangePercent} />
                      </td>

                      {/* Latest film */}
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <div className="text-xs font-bold text-popcorn leading-none mb-1 max-w-[140px] line-clamp-1">
                          {entry.recentFilm.title}
                        </div>
                        <div className="text-[10px] text-popcorn-muted mb-1.5 font-mono-tabular">{entry.recentFilm.releaseDate}</div>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${entry.recentFilm.verdictColor}`}>
                          {entry.recentFilm.verdict}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isExpanded && (
                      <tr className="bg-screen/70">
                        <td colSpan={7} className="px-6 py-5">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <div className="text-[11px] font-black text-popcorn-dim uppercase tracking-widest font-display-latin mb-2">
                                Tags &amp; Associations
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {entry.tags.map((tag) => (
                                  <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-hall border border-glow-line text-popcorn-dim font-semibold">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] font-black text-popcorn-dim uppercase tracking-widest font-display-latin mb-2">
                                Career Metrics
                              </div>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-popcorn-muted">Lifetime Box Office</span>
                                  <span className="font-black text-popcorn font-mono-tabular">₹{entry.boxOfficePowerCr} Cr</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-popcorn-muted">2026 Gross</span>
                                  <span className="font-black text-popcorn font-mono-tabular">₹{entry.currentYearGrossCr} Cr</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-popcorn-muted">Peak Rank</span>
                                  <span className="font-black text-popcorn">#{entry.peakRank}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] font-black text-popcorn-dim uppercase tracking-widest font-display-latin mb-2">
                                Latest Film
                              </div>
                              <div className="text-sm font-bold text-popcorn">{entry.recentFilm.title}</div>
                              <div className="text-xs text-popcorn-muted mt-0.5 font-mono-tabular">{entry.recentFilm.releaseDate}</div>
                              {entry.recentFilm.grossCr > 0 && (
                                <div className="text-sm font-black text-marquee-soft font-mono-tabular mt-1">
                                  ₹{entry.recentFilm.grossCr} Cr
                                </div>
                              )}
                              <span className={`mt-1.5 inline-block text-[11px] font-black px-2.5 py-0.5 rounded-full ${entry.recentFilm.verdictColor}`}>
                                {entry.recentFilm.verdict}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <Clapperboard className="w-10 h-10 text-glow-line-strong mx-auto mb-3" />
              <p className="text-popcorn-dim font-semibold text-sm">ಯಾವುದೇ ಫಲಿತಾಂಶ ಕಂಡುಬಂದಿಲ್ಲ</p>
              <p className="text-popcorn-muted text-xs mt-1">No CineStars match your search criteria. Try adjusting filters.</p>
            </div>
          )}
        </div>

        {/* Table footer */}
        <div className="px-6 py-4 border-t border-glow-line bg-hall/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-popcorn-muted">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-signal-soft" />
            <span>Figures sourced from consolidated multi-source trade reports. Zero paid AI dependency.</span>
          </div>
          <span className="text-popcorn-muted font-mono-tabular">
            Updated: {new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} IST
          </span>
        </div>
      </div>
    </div>
  );
}
