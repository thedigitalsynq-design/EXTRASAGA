"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  TrendingUp,
  Globe2,
  Calendar,
  Sparkles,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import {
  getYearlyLeaderboard,
  getYearlyAggregateStats,
  LeaderboardSortDimension,
} from "@/lib/boxOfficeEngine/yearlyLeaderboardData";
import VerdictBadge from "@/components/VerdictBadge";

const YEARS_AVAILABLE = [2026, 2025, 2024];

export default function BoxOfficeYearlyLeaderboard() {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedSort, setSelectedSort] = useState<LeaderboardSortDimension>("net");

  const items = getYearlyLeaderboard(selectedYear, selectedSort);
  const stats = getYearlyAggregateStats(selectedYear);

  return (
    <div className="space-y-6">
      {/* Aggregate Stats Banner */}
      <div className="bg-sheet border border-line rounded-xl shadow-lg p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-line">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="sticker bg-press text-paper border border-line px-2.5 py-0.5 text-[10px] font-mono-tabular font-black uppercase tracking-wider rounded shadow-sm flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>OFFICIAL TRADE RECORD</span>
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-mono-tabular font-bold uppercase bg-band text-ink border border-line rounded shadow-sm">
                YEARLY RANKING
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-poster uppercase text-ink tracking-tight">
              {selectedYear} Box Office Leaderboard
            </h2>
            <p className="text-xs sm:text-sm text-ink-dim mt-1 font-medium">
              Multi-source audited theatrical revenue rankings across all Indian cinema industries.
            </p>
          </div>

          {/* Year Switcher Chips */}
          <div className="flex items-center gap-1.5 bg-surface p-1.5 border border-line rounded-lg shadow-sm self-start md:self-auto">
            <span className="text-[10px] font-mono-tabular uppercase font-bold text-ink-mute px-2 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-press" />
              Year:
            </span>
            {YEARS_AVAILABLE.map((year) => {
              const isActive = selectedYear === year;
              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => setSelectedYear(year)}
                  className={`px-3 py-1 text-xs font-mono-tabular font-black uppercase border rounded transition-all ${
                    isActive
                      ? "bg-band text-ink border-line font-bold shadow-sm"
                      : "bg-surface text-ink-dim border-transparent hover:border-line hover:text-ink"
                  }`}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>

        {/* Aggregate Stats Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-5">
          <div className="p-4 bg-surface border border-line rounded-xl shadow-sm">
            <span className="text-[10px] font-mono-tabular uppercase font-bold text-ink-mute block">
              Films Documented
            </span>
            <div className="text-xl sm:text-2xl font-poster uppercase text-ink mt-0.5">
              {stats.filmsTrackedCount} Releases
            </div>
            <span className="text-[10px] font-mono-tabular text-ink-dim block mt-1">
              Audited Box Office Reports
            </span>
          </div>

          <div className="p-4 bg-surface border border-line rounded-xl shadow-sm">
            <span className="text-[10px] font-mono-tabular uppercase font-bold text-ink-mute block">
              Total India Net
            </span>
            <div className="text-xl sm:text-2xl font-poster uppercase text-press mt-0.5">
              ₹{stats.totalIndiaNetCrores.toLocaleString("en-IN")} Cr
            </div>
            <span className="text-[10px] font-mono-tabular text-ink-dim block mt-1">
              Excluding Entertainment Tax
            </span>
          </div>

          <div className="p-4 bg-surface border border-line rounded-xl shadow-sm">
            <span className="text-[10px] font-mono-tabular uppercase font-bold text-ink-mute block">
              Total Worldwide Gross
            </span>
            <div className="text-xl sm:text-2xl font-poster uppercase text-ink mt-0.5">
              ₹{stats.totalWorldwideCrores.toLocaleString("en-IN")} Cr
            </div>
            <span className="text-[10px] font-mono-tabular text-ink-dim block mt-1">
              Domestic + Overseas Gross
            </span>
          </div>

          <div className="p-4 bg-band text-ink border border-line rounded-xl shadow-sm">
            <span className="text-[10px] font-mono-tabular uppercase font-black text-ink/70 block flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-press" />
              Year Top Grosser
            </span>
            <div className="text-sm sm:text-base font-poster uppercase text-ink mt-0.5 truncate" title={stats.topGrosserName}>
              {stats.topGrosserName}
            </div>
            <span className="text-xs font-mono-tabular font-black text-press block mt-0.5">
              {stats.topGrosserCollection} Worldwide
            </span>
          </div>
        </div>
      </div>

      {/* Sort Dimension Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-sheet border border-line rounded-xl p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-press shrink-0" />
          <span className="text-xs font-mono-tabular uppercase font-black text-ink">
            Rank By Dimension:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { key: "net", label: "India Net (₹ Cr)", icon: TrendingUp },
              { key: "open", label: "Opening Day", icon: Calendar },
              { key: "ww", label: "Worldwide Gross", icon: Globe2 },
              { key: "os", label: "Overseas ($M)", icon: ArrowUpDown },
            ] as const
          ).map((dim) => {
            const isActive = selectedSort === dim.key;
            const Icon = dim.icon;
            return (
              <button
                key={dim.key}
                type="button"
                onClick={() => setSelectedSort(dim.key)}
                className={`px-3 py-1.5 text-xs font-mono-tabular font-black uppercase rounded-lg border flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-press text-paper border-press shadow-sm"
                    : "bg-surface text-ink border-line hover:bg-band"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{dim.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-sheet border border-line rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-line text-xs font-mono-tabular font-black uppercase text-ink">
                <th scope="col" className="py-3.5 px-4 w-14 text-center">Rank</th>
                <th scope="col" className="py-3.5 px-4 min-w-[240px]">Film</th>
                <th scope="col" className="py-3.5 px-4 min-w-[110px]">Release Date</th>
                <th scope="col" className="py-3.5 px-4 text-right min-w-[120px]">Opening Day</th>
                <th scope="col" className="py-3.5 px-4 text-right min-w-[130px]">India Net</th>
                <th scope="col" className="py-3.5 px-4 text-right min-w-[140px]">Worldwide</th>
                <th scope="col" className="py-3.5 px-4 text-right min-w-[110px]">Overseas</th>
                <th scope="col" className="py-3.5 px-4 text-center min-w-[160px]">Trade Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-xs font-mono-tabular">
              {items.map((item) => {
                const isTop3 = item.rank <= 3;
                return (
                  <tr
                    key={item.slug}
                    className="hover:bg-surface/50 transition-colors bg-sheet"
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 text-xs font-black rounded border ${
                          item.rank === 1
                            ? "bg-marquee text-ink border-line font-bold"
                            : item.rank === 2
                            ? "bg-surface text-ink border-line"
                            : item.rank === 3
                            ? "bg-band text-ink border-line"
                            : "bg-surface/50 text-ink-dim border-transparent"
                        }`}
                      >
                        {item.rank}
                      </span>
                    </td>

                    {/* Film Poster + Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-14 border border-line rounded overflow-hidden bg-band shrink-0 shadow-sm">
                          <Image
                            src={item.posterImage}
                            alt={item.movieTitleEn}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/movies/${item.slug}`}
                            className="font-poster uppercase text-ink hover:text-press transition-colors text-sm font-bold block truncate"
                          >
                            {item.movieTitle}
                          </Link>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[9px] px-1.5 py-0.5 bg-surface text-ink border border-line rounded uppercase font-bold">
                              {item.language.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-ink-mute uppercase font-bold truncate">
                              {item.industry}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Release Date */}
                    <td className="py-3.5 px-4 font-bold text-ink-dim">
                      {item.releaseDate}
                    </td>

                    {/* Opening Day */}
                    <td className="py-3.5 px-4 text-right font-black text-ink">
                      ₹{item.openingDayNettCrores.toFixed(2)} Cr
                    </td>

                    {/* India Net */}
                    <td className="py-3.5 px-4 text-right font-black text-press">
                      ₹{item.indiaNettCrores.toFixed(2)} Cr
                    </td>

                    {/* Worldwide */}
                    <td className="py-3.5 px-4 text-right font-black text-ink">
                      ₹{item.worldwideGrossCrores.toFixed(2)} Cr
                    </td>

                    {/* Overseas */}
                    <td className="py-3.5 px-4 text-right font-bold text-ink-dim">
                      ${item.overseasGrossUSDMillions.toFixed(1)}M
                    </td>

                    {/* Trade Verdict Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <VerdictBadge verdict={item.verdict} size="sm" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-surface border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono-tabular text-ink-dim">
          <span>
            * All figures reconciliated via independent exhibitor telemetry and certified trade returns.
          </span>
          <span className="text-ink font-bold">
            Updated in Real-Time (IST)
          </span>
        </div>
      </div>
    </div>
  );
}

