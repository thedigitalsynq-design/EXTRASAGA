"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
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
  const diff = previous - current;
  if (diff > 0)
    return (
      <span className="inline-flex items-center gap-0.5 change-positive font-bold text-[11px] font-mono">
        <ChevronUp className="w-3.5 h-3.5" />
        {diff}
      </span>
    );
  if (diff < 0)
    return (
      <span className="inline-flex items-center gap-0.5 change-negative font-bold text-[11px] font-mono">
        <ChevronDown className="w-3.5 h-3.5" />
        {Math.abs(diff)}
      </span>
    );
  return <Minus className="w-3.5 h-3.5 text-ink-mute" />;
}

function DailyChangeCell({ value, pct }: { value: number; pct: number }) {
  const isPos = value >= 0;
  if (value === 0) return <span className="text-ink-mute text-xs font-mono">—</span>;
  return (
    <div className={`flex items-center gap-1 font-mono font-bold text-xs ${isPos ? "change-positive" : "change-negative"}`}>
      {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
      <span>{isPos ? "+" : ""}{value.toFixed(1)} Cr</span>
      <span className={`text-[10px] px-1.5 py-0.5 border border-ink font-bold ${isPos ? "bg-paper change-positive" : "bg-paper change-negative"}`}>
        {isPos ? "+" : ""}{pct.toFixed(2)}%
      </span>
    </div>
  );
}

function PodiumCard({ entry, podiumPos }: { entry: CineStarEntry; podiumPos: 1 | 2 | 3 }) {
  const heights = { 1: "h-76 sm:h-84", 2: "h-64 sm:h-72", 3: "h-60 sm:h-68" };
  const crowns = { 1: "🥇", 2: "🥈", 3: "🥉" };
  const badgeBg = {
    1: "bg-marquee text-ink border-2 border-ink shadow-sticker",
    2: "bg-paper text-ink border-2 border-ink shadow-sticker",
    3: "bg-violet text-paper border-2 border-ink shadow-sticker",
  };
  const isGain = entry.dailyChangeCr >= 0;

  return (
    <div className={`relative ${podiumPos === 1 ? "bg-marquee/15" : "bg-sheet"} card-press-interactive border-2 border-ink shadow-press overflow-hidden ${heights[podiumPos]} flex flex-col group`}>
      {/* Rank badge */}
      <div className={`absolute top-4 left-4 w-9 h-9 ${badgeBg[podiumPos]} flex items-center justify-center font-poster text-sm z-10`}>
        {podiumPos === 1 ? <Crown className="w-4 h-4" /> : entry.rank}
      </div>

      {/* Live indicator */}
      {entry.isLive && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 sticker bg-press text-paper border-2 border-ink z-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-paper opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-paper" />
          </span>
          <span className="text-[9px] font-poster uppercase tracking-wider">Live</span>
        </div>
      )}

      {/* Profile image area */}
      <div className="relative flex-1 overflow-hidden bg-band">
        <Image
          src={entry.profileImage}
          alt={entry.name}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />

        {/* Bottom content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-lg">{crowns[podiumPos]}</span>
            <h3 className="text-paper font-poster uppercase text-base sm:text-lg leading-none tracking-tight line-clamp-1">
              {entry.name}
            </h3>
          </div>
          <p className="text-[11px] font-bold text-paper/85 mb-2 truncate">{entry.sourceOfPower}</p>

          {/* Key stats */}
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-[10px] text-paper/70 font-mono uppercase tracking-wider">Lifetime Power</div>
              <div className="font-mono font-bold text-xl sm:text-2xl text-paper leading-none">
                ₹{entry.boxOfficePowerCr >= 1000
                  ? `${(entry.boxOfficePowerCr / 1000).toFixed(1)}K`
                  : entry.boxOfficePowerCr} Cr
              </div>
            </div>
            <div className={`text-right ${isGain ? "change-positive" : "change-negative"}`}>
              <div className="text-[10px] font-mono uppercase tracking-wider text-paper/70">Today</div>
              <div className="font-bold text-sm font-mono flex items-center gap-0.5 text-paper">
                {isGain ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {isGain ? "+" : ""}{entry.dailyChangeCr.toFixed(1)} Cr
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry tag */}
      <div className="px-4 py-2.5 border-t-2 border-ink flex items-center justify-between bg-band">
        <span className="text-[10px] font-poster uppercase px-2.5 py-0.5 border border-ink bg-paper text-ink shadow-sticker">
          {entry.industryLabel}
        </span>
        <span className="text-[10px] text-ink-dim font-mono font-bold">{entry.nationality}</span>
      </div>
    </div>
  );
}

function SummaryStatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="card-press-interactive bg-sheet border-2 border-ink shadow-sticker p-5 flex flex-col gap-3">
      <div className="w-10 h-10 bg-band border-2 border-ink flex items-center justify-center">
        <Icon className="w-5 h-5 text-ink" />
      </div>
      <div>
        <div className="text-xs font-bold text-ink-dim uppercase tracking-wider font-mono mb-1">{label}</div>
        <div className="text-2xl font-poster uppercase text-ink leading-none">{value}</div>
        <div className="text-xs font-grotesk font-bold mt-1 text-ink-dim">{sub}</div>
      </div>
    </div>
  );
}

export default function CineStarLeaderboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CineStarCategory | "all">("all");
  const [industryFilter, setIndustryFilter] = useState<CineStarIndustry | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "rank" ? "asc" : "desc");
    }
  };

  const filtered = useMemo(() => {
    let data = [...CINESTAR_LEADERBOARD];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
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
      className={`btn-press-interactive flex items-center gap-1 group hover:text-press transition-colors ${
        sortKey === col ? "text-press-deep font-bold" : "text-ink font-bold"
      }`}
    >
      <span className="whitespace-nowrap font-poster uppercase">{label}</span>
      <span className="flex flex-col opacity-60 group-hover:opacity-100">
        <ChevronUp className={`w-2.5 h-2.5 -mb-0.5 ${sortKey === col && sortDir === "asc" ? "opacity-100 text-press" : ""}`} />
        <ChevronDown className={`w-2.5 h-2.5 ${sortKey === col && sortDir === "desc" ? "opacity-100 text-press" : ""}`} />
      </span>
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryStatCard
          label="Tracked Stars"
          value={`${CINESTAR_SUMMARY_STATS.totalTracked}`}
          sub="Across all 6 industries"
          icon={Users}
        />
        <SummaryStatCard
          label="Combined Power"
          value={`₹${(CINESTAR_SUMMARY_STATS.totalBoxOfficePowerCr / 1000).toFixed(0)}K Cr`}
          sub="Lifetime box office"
          icon={Film}
        />
        <SummaryStatCard
          label="Top Gainer Today"
          value={`+${CINESTAR_SUMMARY_STATS.topGainerChangePct}%`}
          sub={CINESTAR_SUMMARY_STATS.topGainerToday}
          icon={TrendingUp}
        />
        <SummaryStatCard
          label="Top Mover Down"
          value={`${CINESTAR_SUMMARY_STATS.topLoserChangePct}%`}
          sub={CINESTAR_SUMMARY_STATS.topLoserToday}
          icon={TrendingDown}
        />
      </div>

      {/* TOP 3 PODIUM */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-4 h-4 text-marquee" />
          <span className="text-sm font-poster uppercase tracking-wider text-ink">
            TOP 3 — PODIUM CINESTARS
          </span>
          <span className="flex-1 h-0.5 bg-ink" />
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

      {/* FILTERS & SEARCH */}
      <div className="bg-sheet border-2 border-ink shadow-press p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-mute" />
            <input
              type="text"
              placeholder="Search name, film, or source of power..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-ink bg-paper text-sm text-ink placeholder:text-ink-mute focus:outline-none shadow-sticker font-grotesk font-medium"
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {([
              { id: "all", label: "All" },
              { id: "actor", label: "Actors" },
              { id: "director", label: "Directors" },
              { id: "producer", label: "Producers" },
            ] as { id: CineStarCategory | "all"; label: string }[]).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoryFilter(c.id)}
                className={`btn-press-interactive px-3 py-1.5 text-xs font-poster uppercase whitespace-nowrap transition-all border-2 border-ink ${
                  categoryFilter === c.id
                    ? "bg-ink text-paper shadow-sticker"
                    : "bg-paper text-ink hover:bg-band shadow-sticker"
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
                className={`btn-press-interactive px-3 py-1.5 text-xs font-poster uppercase whitespace-nowrap transition-all border-2 border-ink ${
                  industryFilter === ind.id
                    ? "bg-press text-paper shadow-sticker"
                    : "bg-paper text-ink hover:bg-band shadow-sticker"
                }`}
              >
                {ind.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN LEADERBOARD TABLE */}
      <div className="bg-sheet border-2 border-ink shadow-press overflow-hidden">
        {/* Table metadata bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-ink bg-band">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-press" />
            <span className="text-sm font-poster uppercase text-ink">
              {filtered.length} CineStars Tracked
            </span>
            <span className="text-xs text-ink-dim font-mono font-bold">
              • Updated {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} IST
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-ink font-mono font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-press-deep" />
            CONSOLIDATED TRADE RADAR
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-ink bg-band text-[10px] uppercase font-poster">
                <th className="py-3.5 px-4 font-bold text-ink w-16 text-center">
                  <SortButton col="rank" label="Rank" />
                </th>
                <th className="py-3.5 px-4 font-bold text-ink">
                  CineStar &amp; Profile
                </th>
                <th className="py-3.5 px-4 font-bold text-ink hidden sm:table-cell">
                  Source of Power
                </th>
                <th className="py-3.5 px-4 font-bold text-ink hidden md:table-cell">
                  <SortButton col="currentYearGrossCr" label="2026 Gross" />
                </th>
                <th className="py-3.5 px-4 font-bold text-ink">
                  <SortButton col="boxOfficePowerCr" label="Lifetime Power" />
                </th>
                <th className="py-3.5 px-4 font-bold text-ink">
                  <SortButton col="dailyChangeCr" label="Today's Move" />
                </th>
                <th className="py-3.5 px-4 font-bold text-ink hidden lg:table-cell">
                  Latest Film
                </th>
              </tr>
            </thead>
            <tbody className="divide-y border-t border-line font-grotesk">
              {filtered.map((entry) => {
                const isExpanded = expandedId === entry.id;
                return (
                  <React.Fragment key={entry.id}>
                    <tr
                      className="hover:bg-band/40 transition-colors cursor-pointer group"
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    >
                      {/* Rank */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-base font-poster uppercase text-ink leading-none">
                            {entry.rank}
                          </span>
                          <RankChangeIndicator current={entry.rank} previous={entry.previousRank} />
                        </div>
                      </td>

                      {/* Profile */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 border-2 border-ink overflow-hidden shrink-0 bg-band shadow-sticker">
                            <Image
                              src={entry.profileImage}
                              alt={entry.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                            {entry.isLive && (
                              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-press border border-ink" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-poster uppercase text-ink text-sm group-hover:text-press transition-colors leading-none">
                                {entry.name}
                              </span>
                              {entry.verified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-press-deep shrink-0" />
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] px-2 py-0.5 bg-paper text-ink border border-ink font-bold uppercase">
                                {entry.industryLabel}
                              </span>
                              <span className="text-[10px] text-ink-dim font-mono">{entry.nationality}</span>
                              {entry.age && (
                                <span className="text-[10px] text-ink-mute font-mono">· {entry.age} yrs</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Source of power */}
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <div className="text-xs text-ink font-bold">{entry.sourceOfPower}</div>
                        <div className="text-[10px] text-ink-dim mt-0.5">🎬 {entry.primaryFilm}</div>
                      </td>

                      {/* 2026 gross */}
                      <td className="py-4 px-4 font-mono font-bold text-sm text-ink hidden md:table-cell">
                        ₹{entry.currentYearGrossCr} Cr
                      </td>

                      {/* Lifetime Power */}
                      <td className="py-4 px-4">
                        <div className="font-poster uppercase text-ink text-base leading-none">
                          ₹{entry.boxOfficePowerCr >= 1000
                            ? `${(entry.boxOfficePowerCr / 1000).toFixed(1)}K`
                            : entry.boxOfficePowerCr} Cr
                        </div>
                        <div className="text-[10px] text-ink-mute mt-0.5 font-mono">
                          Peak #{entry.peakRank}
                        </div>
                      </td>

                      {/* Daily change */}
                      <td className="py-4 px-4">
                        <DailyChangeCell value={entry.dailyChangeCr} pct={entry.dailyChangePercent} />
                      </td>

                      {/* Latest film */}
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <div className="text-xs font-bold text-ink leading-none mb-1 max-w-[140px] line-clamp-1">
                          {entry.recentFilm.title}
                        </div>
                        <div className="text-[10px] text-ink-dim mb-1.5 font-mono">{entry.recentFilm.releaseDate}</div>
                        <span className="text-[10px] font-poster uppercase px-2.5 py-0.5 bg-marquee text-ink border border-ink shadow-sticker">
                          {entry.recentFilm.verdict}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isExpanded && (
                      <tr className="bg-paper">
                        <td colSpan={7} className="px-6 py-5 border-t-2 border-b-2 border-ink">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <div className="text-[11px] font-poster uppercase tracking-wider text-ink mb-2">
                                Tags &amp; Associations
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {entry.tags.map((tag) => (
                                  <span key={tag} className="text-[11px] px-2.5 py-1 bg-sheet border border-ink text-ink font-bold uppercase">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] font-poster uppercase tracking-wider text-ink mb-2">
                                Career Metrics
                              </div>
                              <div className="space-y-1 text-xs font-mono">
                                <div className="flex justify-between">
                                  <span className="text-ink-dim">Lifetime Box Office</span>
                                  <span className="font-bold text-ink">₹{entry.boxOfficePowerCr} Cr</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-ink-dim">2026 Gross</span>
                                  <span className="font-bold text-ink">₹{entry.currentYearGrossCr} Cr</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-ink-dim">Peak Rank</span>
                                  <span className="font-bold text-ink">#{entry.peakRank}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] font-poster uppercase tracking-wider text-ink mb-2">
                                Latest Film
                              </div>
                              <div className="text-sm font-poster uppercase text-ink">{entry.recentFilm.title}</div>
                              <div className="text-xs text-ink-dim mt-0.5 font-mono">{entry.recentFilm.releaseDate}</div>
                              {entry.recentFilm.grossCr > 0 && (
                                <div className="text-sm font-mono font-bold text-press-deep mt-1">
                                  ₹{entry.recentFilm.grossCr} Cr
                                </div>
                              )}
                              <span className="mt-2 inline-block text-[10px] font-poster uppercase px-2.5 py-0.5 bg-marquee text-ink border border-ink shadow-sticker">
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
              <Clapperboard className="w-10 h-10 text-ink mx-auto mb-3" />
              <p className="text-ink font-poster uppercase text-sm">No results found</p>
              <p className="text-ink-dim text-xs mt-1">No CineStars match your search criteria. Try adjusting filters.</p>
            </div>
          )}
        </div>

        {/* Table footer */}
        <div className="px-6 py-4 border-t-2 border-ink bg-band flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-ink-dim">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-press-deep" />
            <span>Figures sourced from consolidated multi-source trade reports across all Indian cinema industries.</span>
          </div>
          <span className="font-mono font-bold">
            Updated: {new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} IST
          </span>
        </div>
      </div>
    </div>
  );
}
