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
      <span className="inline-flex items-center gap-0.5 text-[#288760] font-black text-[11px]">
        <ChevronUp className="w-3.5 h-3.5" />
        {diff}
      </span>
    );
  if (diff < 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-red-500 font-black text-[11px]">
        <ChevronDown className="w-3.5 h-3.5" />
        {Math.abs(diff)}
      </span>
    );
  return <Minus className="w-3.5 h-3.5 text-[#A3B8B0]" />;
}

function DailyChangeCell({ value, pct }: { value: number; pct: number }) {
  const isPos = value >= 0;
  if (value === 0) return <span className="text-[#A3B8B0] text-xs font-mono">—</span>;
  return (
    <div className={`flex items-center gap-1 font-mono font-black text-xs ${isPos ? "text-[#288760]" : "text-red-500"}`}>
      {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
      <span>{isPos ? "+" : ""}{value.toFixed(1)} Cr</span>
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isPos ? "bg-[#E8F8EB] text-[#1A5140]" : "bg-red-50 text-red-700"}`}>
        {isPos ? "+" : ""}{pct.toFixed(2)}%
      </span>
    </div>
  );
}

function PodiumCard({ entry, podiumPos }: { entry: CineStarEntry; podiumPos: 1 | 2 | 3 }) {
  const heights = { 1: "h-72 sm:h-80", 2: "h-60 sm:h-68", 3: "h-56 sm:h-64" };
  const crowns = { 1: "🥇", 2: "🥈", 3: "🥉" };
  const borders = {
    1: "border-[#5CA87C] shadow-[0_0_40px_rgba(40,135,96,0.25)]",
    2: "border-[#B7E5BA] shadow-[0_8px_30px_rgba(40,135,96,0.12)]",
    3: "border-[#E5EBE7] shadow-[0_8px_24px_rgba(26,81,64,0.08)]",
  };
  const badgeBg = {
    1: "bg-gradient-to-br from-[#1A5140] to-[#288760]",
    2: "bg-gradient-to-br from-[#374151] to-[#6B7280]",
    3: "bg-gradient-to-br from-[#78350F] to-[#92400E]",
  };
  const isGain = entry.dailyChangeCr >= 0;

  return (
    <div className={`relative bg-white rounded-[28px] border-2 ${borders[podiumPos]} overflow-hidden transition-all duration-300 hover:scale-[1.02] group ${heights[podiumPos]} flex flex-col`}>
      {/* Background gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAF9]/60 to-transparent pointer-events-none" />

      {/* Rank badge */}
      <div className={`absolute top-4 left-4 w-9 h-9 rounded-full ${badgeBg[podiumPos]} flex items-center justify-center text-white font-black text-sm shadow-lg z-10`}>
        {podiumPos === 1 ? <Crown className="w-4 h-4" /> : entry.rank}
      </div>

      {/* Live indicator */}
      {entry.isLive && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8F8EB] border border-[#B7E5BA] z-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#288760] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#288760]" />
          </span>
          <span className="text-[9px] font-black text-[#1A5140] uppercase tracking-wider">Live</span>
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F3529]/90 via-[#0F3529]/30 to-transparent" />

        {/* Bottom content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-lg">{crowns[podiumPos]}</span>
            <h3 className="text-white font-black text-base sm:text-lg leading-none tracking-tight line-clamp-1">
              {entry.name}
            </h3>
          </div>
          <p className="text-[#B7E5BA] text-[11px] font-semibold mb-2">{entry.sourceOfPower}</p>

          {/* Key stats */}
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-[10px] text-[#B7E5BA]/70 font-mono uppercase">Lifetime Power</div>
              <div className="text-white font-black text-xl sm:text-2xl font-mono leading-none">
                ₹{entry.boxOfficePowerCr >= 1000
                  ? `${(entry.boxOfficePowerCr / 1000).toFixed(1)}K`
                  : entry.boxOfficePowerCr} Cr
              </div>
            </div>
            <div className={`text-right ${isGain ? "text-[#B7E5BA]" : "text-red-300"}`}>
              <div className="text-[10px] font-mono uppercase opacity-70">Today</div>
              <div className="font-black text-sm font-mono flex items-center gap-0.5">
                {isGain ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {isGain ? "+" : ""}{entry.dailyChangeCr.toFixed(1)} Cr
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry tag */}
      <div className="px-4 py-2.5 border-t border-[#E5EBE7] flex items-center justify-between bg-white">
        <span className="text-[11px] font-bold text-[#1A5140] bg-[#E8F8EB] px-2.5 py-0.5 rounded-full border border-[#B7E5BA]">
          {entry.industryLabel}
        </span>
        <span className="text-[10px] text-[#4B6358] font-mono">{entry.nationality}</span>
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
    jade: { bg: "bg-[#E8F8EB]", border: "border-[#B7E5BA]", text: "text-[#288760]", badge: "text-[#1A5140]" },
    gold: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", badge: "text-amber-800" },
    red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-500", badge: "text-red-700" },
    blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", badge: "text-blue-800" },
  };
  const c = colorMap[color];
  return (
    <div className={`bg-white rounded-[24px] border border-[#E5EBE7] p-5 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-[#5CA87C]/40 transition-all`}>
      <div className={`w-10 h-10 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${c.text}`} />
      </div>
      <div>
        <div className="text-xs font-semibold text-[#4B6358] uppercase tracking-wider mb-1">{label}</div>
        <div className="text-2xl font-black text-[#0F3529] font-mono leading-none">{value}</div>
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
      className={`flex items-center gap-1 group hover:text-[#0F3529] transition-colors ${
        sortKey === col ? "text-[#288760] font-black" : "text-[#4B6358] font-semibold"
      }`}
    >
      <span className="whitespace-nowrap">{label}</span>
      <span className="flex flex-col opacity-50 group-hover:opacity-100">
        <ChevronUp className={`w-2.5 h-2.5 -mb-0.5 ${sortKey === col && sortDir === "asc" ? "opacity-100 text-[#288760]" : ""}`} />
        <ChevronDown className={`w-2.5 h-2.5 ${sortKey === col && sortDir === "desc" ? "opacity-100 text-[#288760]" : ""}`} />
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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#288760] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#288760]" />
            </span>
            <span className="text-[11px] font-black text-[#1A5140] uppercase tracking-widest">
              Real-Time CineStar Intelligence
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F3529] tracking-tight leading-none">
            ಸಿನಿ<span className="text-[#288760]">ಸ್ಟಾರ್</span> ಲೀಡರ್‌ಬೋರ್ಡ್
          </h1>
          <p className="text-sm text-[#4B6358] mt-1 font-medium">
            India's most powerful cinema personalities — ranked by box office power, daily momentum & industry influence
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8F8EB] border border-[#B7E5BA] text-[#1A5140] text-sm font-bold hover:bg-[#B7E5BA]/40 transition-all shadow-2xs self-start sm:self-auto"
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
          <Crown className="w-4 h-4 text-[#288760]" />
          <span className="text-sm font-black text-[#0F3529] uppercase tracking-wider">
            Top 3 — Podium CineStars
          </span>
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
      <div className="bg-white rounded-[24px] border border-[#E5EBE7] p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B6358]" />
            <input
              type="text"
              placeholder="ಹೆಸರು, ಸಿನಿಮಾ, ಉದ್ಯಮ ಹುಡುಕಿ... (Search name, film, source...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#E5EBE7] bg-[#F8FAF9] text-sm text-[#0F3529] placeholder:text-[#A3B8B0] focus:outline-none focus:border-[#288760] focus:ring-2 focus:ring-[#288760]/10 transition-all font-medium"
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
                    ? "bg-[#1A5140] text-white border-[#1A5140] shadow-sm"
                    : "bg-white text-[#4B6358] border-[#E5EBE7] hover:border-[#5CA87C] hover:text-[#0F3529]"
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
                    ? "bg-[#288760] text-white border-[#288760] shadow-sm"
                    : "bg-white text-[#4B6358] border-[#E5EBE7] hover:border-[#5CA87C] hover:text-[#0F3529]"
                }`}
              >
                {ind.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── MAIN LEADERBOARD TABLE (Forbes-exact layout) ─── */}
      <div className="bg-white rounded-[28px] border border-[#E5EBE7] shadow-sm overflow-hidden">
        {/* Table metadata bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5EBE7] bg-[#F8FAF9]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#288760]" />
            <span className="text-sm font-black text-[#0F3529]">
              {filtered.length} CineStars tracked
            </span>
            <span className="text-xs text-[#4B6358] font-medium">
              • Updated {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} IST
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#1A5140] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#288760]" />
            Consolidated Trade Intelligence
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5EBE7] bg-[#F8FAF9] text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-black text-[#1A5140] w-16 text-center">
                  <SortButton col="rank" label="Rank" />
                </th>
                <th className="py-3.5 px-4 font-black text-[#1A5140]">
                  CineStar &amp; Profile
                </th>
                <th className="py-3.5 px-4 font-black text-[#1A5140] hidden sm:table-cell">
                  Source of Power
                </th>
                <th className="py-3.5 px-4 font-black text-[#1A5140] hidden md:table-cell">
                  <SortButton col="currentYearGrossCr" label="2026 Gross" />
                </th>
                <th className="py-3.5 px-4 font-black text-[#1A5140]">
                  <SortButton col="boxOfficePowerCr" label="Lifetime Power" />
                </th>
                <th className="py-3.5 px-4 font-black text-[#1A5140]">
                  <SortButton col="dailyChangeCr" label="Today's Move" />
                </th>
                <th className="py-3.5 px-4 font-black text-[#1A5140] hidden lg:table-cell">
                  Latest Film
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EBE7]">
              {filtered.map((entry) => {
                const isExpanded = expandedId === entry.id;
                return (
                  <React.Fragment key={entry.id}>
                    <tr
                      className="hover:bg-[#F8FAF9] transition-colors cursor-pointer group"
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    >
                      {/* Rank */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-lg font-black text-[#0F3529] font-mono leading-none">
                            {entry.rank}
                          </span>
                          <RankChangeIndicator current={entry.rank} previous={entry.previousRank} />
                        </div>
                      </td>

                      {/* Profile */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-[#E5EBE7] shrink-0 bg-[#F0F4F2]">
                            <Image
                              src={entry.profileImage}
                              alt={entry.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                            {entry.isLive && (
                              <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#288760] border-2 border-white" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-[#0F3529] text-sm group-hover:text-[#288760] transition-colors leading-none">
                                {entry.name}
                              </span>
                              {entry.verified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#288760] shrink-0" />
                              )}
                            </div>
                            {entry.nameKn && (
                              <div className="text-[11px] text-[#4B6358] font-semibold mt-0.5">{entry.nameKn}</div>
                            )}
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8F8EB] text-[#1A5140] border border-[#B7E5BA] font-bold">
                                {entry.industryLabel}
                              </span>
                              <span className="text-[10px] text-[#6B7280]">{entry.nationality}</span>
                              {entry.age && (
                                <span className="text-[10px] text-[#6B7280]">· {entry.age} yrs</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Source of power */}
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <div className="text-xs text-[#0F3529] font-semibold">{entry.sourceOfPower}</div>
                        <div className="text-[10px] text-[#4B6358] mt-0.5">🎬 {entry.primaryFilm}</div>
                      </td>

                      {/* 2026 gross */}
                      <td className="py-4 px-4 font-mono font-bold text-sm text-[#0F3529] hidden md:table-cell">
                        ₹{entry.currentYearGrossCr} Cr
                      </td>

                      {/* Lifetime Power */}
                      <td className="py-4 px-4">
                        <div className="font-black text-[#0F3529] font-mono text-base leading-none">
                          ₹{entry.boxOfficePowerCr >= 1000
                            ? `${(entry.boxOfficePowerCr / 1000).toFixed(1)}K`
                            : entry.boxOfficePowerCr} Cr
                        </div>
                        <div className="text-[10px] text-[#4B6358] mt-0.5 font-mono">
                          Peak #{entry.peakRank}
                        </div>
                      </td>

                      {/* Daily change */}
                      <td className="py-4 px-4">
                        <DailyChangeCell value={entry.dailyChangeCr} pct={entry.dailyChangePercent} />
                      </td>

                      {/* Latest film */}
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <div className="text-xs font-bold text-[#0F3529] leading-none mb-1 max-w-[140px] line-clamp-1">
                          {entry.recentFilm.title}
                        </div>
                        <div className="text-[10px] text-[#4B6358] mb-1.5">{entry.recentFilm.releaseDate}</div>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${entry.recentFilm.verdictColor}`}>
                          {entry.recentFilm.verdict}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isExpanded && (
                      <tr className="bg-[#F8FAF9]">
                        <td colSpan={7} className="px-6 py-5">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <div className="text-[11px] font-black text-[#1A5140] uppercase tracking-wider mb-2">
                                Tags &amp; Associations
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {entry.tags.map((tag) => (
                                  <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-[#E5EBE7] text-[#0F3529] font-semibold">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] font-black text-[#1A5140] uppercase tracking-wider mb-2">
                                Career Metrics
                              </div>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-[#4B6358]">Lifetime Box Office</span>
                                  <span className="font-black text-[#0F3529] font-mono">₹{entry.boxOfficePowerCr} Cr</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#4B6358]">2026 Gross</span>
                                  <span className="font-black text-[#0F3529] font-mono">₹{entry.currentYearGrossCr} Cr</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#4B6358]">Peak Rank</span>
                                  <span className="font-black text-[#0F3529]">#{entry.peakRank}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] font-black text-[#1A5140] uppercase tracking-wider mb-2">
                                Latest Film
                              </div>
                              <div className="text-sm font-bold text-[#0F3529]">{entry.recentFilm.title}</div>
                              <div className="text-xs text-[#4B6358] mt-0.5">{entry.recentFilm.releaseDate}</div>
                              {entry.recentFilm.grossCr > 0 && (
                                <div className="text-sm font-black text-[#288760] font-mono mt-1">
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
              <Clapperboard className="w-10 h-10 text-[#B7E5BA] mx-auto mb-3" />
              <p className="text-[#4B6358] font-semibold text-sm">ಯಾವುದೇ ಫಲಿತಾಂಶ ಕಂಡುಬಂದಿಲ್ಲ</p>
              <p className="text-[#A3B8B0] text-xs mt-1">No CineStars match your search criteria. Try adjusting filters.</p>
            </div>
          )}
        </div>

        {/* Table footer */}
        <div className="px-6 py-4 border-t border-[#E5EBE7] bg-[#F8FAF9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#4B6358]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#288760]" />
            <span>Figures sourced from consolidated multi-source trade reports. Zero paid AI dependency.</span>
          </div>
          <span className="text-[#A3B8B0] font-mono">
            Updated: {new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} IST
          </span>
        </div>
      </div>
    </div>
  );
}

