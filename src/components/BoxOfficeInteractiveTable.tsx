"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { ConsolidatedBoxOfficeRecord } from "@/types/boxOffice";
import BoxOfficeTerritoryRadar from "./BoxOfficeTerritoryRadar";

interface BoxOfficeInteractiveTableProps {
  records: ConsolidatedBoxOfficeRecord[];
  viewMode: "gross" | "net" | "share";
  currency: "INR" | "USD";
}

export default function BoxOfficeInteractiveTable({
  records,
  viewMode,
  currency,
}: BoxOfficeInteractiveTableProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [expandedMovieSlug, setExpandedMovieSlug] = useState<string | null>(null);

  const filteredRecords = records.filter((r) => {
    if (selectedIndustry === "all") return true;
    return r.industry === selectedIndustry;
  });

  const formatAmount = (crores: number) => {
    if (currency === "USD") {
      const millions = ((crores * 10_000_000) / 84.0 / 1_000_000).toFixed(2);
      return `$${millions}M`;
    }
    return `₹${crores.toFixed(1)} Cr`;
  };

  const getCollectionValue = (record: ConsolidatedBoxOfficeRecord) => {
    if (viewMode === "net") return record.netInCrores;
    if (viewMode === "share") return record.distributorShareInCrores;
    return record.grossInCrores;
  };

  const industries = [
    { id: "all", label: "All Industries" },
    { id: "sandalwood", label: "Sandalwood (Kannada)" },
    { id: "tollywood", label: "Tollywood (Telugu)" },
    { id: "kollywood", label: "Kollywood (Tamil)" },
    { id: "mollywood", label: "Mollywood (Malayalam)" },
    { id: "bollywood", label: "Bollywood (Hindi)" },
    { id: "hollywood", label: "Hollywood (Global)" },
  ];

  return (
    <div className="space-y-6">
      {/* Industry Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
        {industries.map((ind) => (
          <button
            key={ind.id}
            type="button"
            onClick={() => setSelectedIndustry(ind.id)}
            className={`px-3.5 py-1.5 font-grotesk font-bold uppercase transition-all whitespace-nowrap border-2 border-ink ${
              selectedIndustry === ind.id
                ? "bg-ink text-paper shadow-press -translate-y-0.5"
                : "bg-sheet text-ink hover:bg-band shadow-sticker"
            }`}
          >
            {ind.label}
          </button>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-sheet border-2 border-ink shadow-press overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-ink text-ink uppercase font-poster tracking-wider bg-band">
                <th className="py-3 px-4 font-bold w-12 text-center">Rank</th>
                <th className="py-3 px-4 font-bold">Movie &amp; Status</th>
                <th className="py-3 px-4 font-bold">Day 1</th>
                <th className="py-3 px-4 font-bold">Opening Weekend</th>
                <th className="py-3 px-4 font-bold text-press-deep">
                  {viewMode === "gross"
                    ? "Worldwide Gross"
                    : viewMode === "net"
                    ? "Net"
                    : "Distributor Share"}
                </th>
                <th className="py-3 px-4 font-bold">Verdict</th>
                <th className="py-3 px-4 font-bold">Confidence</th>
                <th className="py-3 px-4 text-right font-bold">Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y border-t border-line font-grotesk">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-ink-dim font-poster uppercase">
                    No movies found for selected industry
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item, idx) => {
                  const isExpanded = expandedMovieSlug === item.slug;
                  const activeTotal = getCollectionValue(item);

                  const statusBadge =
                    item.figureStatus === "verified" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-paper text-ink text-[10px] font-bold border border-ink uppercase">
                        <ShieldCheck className="w-3 h-3 text-press-deep" />
                        <span>Verified Audit</span>
                      </span>
                    ) : item.figureStatus === "live_estimate" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-marquee text-ink text-[10px] font-bold border border-ink uppercase">
                        <span className="w-1.5 h-1.5 bg-ink animate-ping" />
                        <span>Live Estimate</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-band text-ink text-[10px] font-bold border border-ink uppercase">
                        <span>Consolidated</span>
                      </span>
                    );

                  const classBadge = (
                    <span className="px-1.5 py-0.5 border border-ink text-[9px] font-mono font-bold uppercase bg-paper text-ink">
                      {item.dataClass}
                    </span>
                  );

                  return (
                    <React.Fragment key={item.id}>
                      <tr className="hover:bg-band/40 transition-colors group">
                        {/* Rank */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`w-7 h-7 border-2 border-ink inline-flex items-center justify-center font-poster text-xs ${
                              idx === 0
                                ? "bg-marquee text-ink shadow-sticker"
                                : idx === 1
                                ? "bg-sheet text-ink shadow-sticker"
                                : idx === 2
                                ? "bg-violet text-paper shadow-sticker"
                                : "bg-band text-ink"
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </td>

                        {/* Title & Poster */}
                        <td className="py-3.5 px-4 font-bold text-ink">
                          <div className="flex items-center gap-3">
                            <div className="relative w-11 h-14 border-2 border-ink overflow-hidden shrink-0 hidden sm:block bg-band shadow-sticker">
                              <Image
                                src={item.posterImage}
                                alt={item.movieTitle}
                                fill
                                sizes="50px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-poster uppercase text-ink truncate">
                                {item.movieTitleEn || item.movieTitle}
                              </div>
                              <div className="text-[11px] text-ink-dim truncate font-normal">
                                {item.movieTitleEn} ({item.releaseYear}) · {item.industry.toUpperCase()}
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                {statusBadge}
                                {classBadge}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Day 1 */}
                        <td className="py-3.5 px-4 font-mono font-bold text-ink">
                          {formatAmount(item.trajectory.day1InCrores)}
                        </td>

                        {/* Weekend */}
                        <td className="py-3.5 px-4 font-mono font-bold text-ink">
                          {formatAmount(item.trajectory.openingWeekendInCrores)}
                        </td>

                        {/* Consolidated Main Metric */}
                        <td className="py-3.5 px-4 font-mono font-black text-sm text-press-deep">
                          {formatAmount(activeTotal)}
                        </td>

                        {/* Verdict */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 text-[10px] font-poster uppercase bg-marquee text-ink border-2 border-ink shadow-sticker">
                            {item.verdict}
                          </span>
                        </td>

                        {/* Confidence Indicator */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span className="font-mono font-bold text-xs text-ink block">
                              {item.confidenceScore}%
                            </span>
                            <div className="w-16 h-2 border border-ink bg-paper overflow-hidden">
                              <div
                                className="h-full bg-press"
                                style={{ width: `${item.confidenceScore}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Expand Trigger */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedMovieSlug(isExpanded ? null : item.slug)
                            }
                            className={`p-2 border-2 border-ink shadow-sticker transition-all ${
                              isExpanded
                                ? "bg-press text-paper"
                                : "bg-ink hover:bg-press text-paper"
                            }`}
                            title="View territory breakdown"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Drawer: Trajectory & Territory Radar */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} className="p-4 sm:p-6 bg-paper border-t-2 border-b-2 border-ink">
                            <div className="space-y-6">
                              {/* Trajectory Tracker */}
                              <div className="p-4 bg-sheet border-2 border-ink shadow-sticker space-y-3">
                                <h4 className="text-xs font-poster uppercase tracking-wider text-ink flex items-center gap-1.5">
                                  <TrendingUp className="w-3.5 h-3.5 text-press" />
                                  <span>LIFECYCLE TRAJECTORY</span>
                                </h4>

                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center font-mono text-xs">
                                  <div className="p-2.5 bg-paper border-2 border-ink">
                                    <span className="text-[10px] text-ink-dim block font-grotesk font-bold uppercase">
                                      Day 1
                                    </span>
                                    <span className="font-bold text-ink mt-0.5 block">
                                      {formatAmount(item.trajectory.day1InCrores)}
                                    </span>
                                  </div>

                                  <div className="p-2.5 bg-paper border-2 border-ink">
                                    <span className="text-[10px] text-ink-dim block font-grotesk font-bold uppercase">
                                      Day 2
                                    </span>
                                    <span className="font-bold text-ink mt-0.5 block">
                                      {formatAmount(item.trajectory.day2InCrores)}
                                    </span>
                                  </div>

                                  <div className="p-2.5 bg-paper border-2 border-ink">
                                    <span className="text-[10px] text-ink-dim block font-grotesk font-bold uppercase">
                                      Weekend
                                    </span>
                                    <span className="font-bold text-ink mt-0.5 block">
                                      {formatAmount(item.trajectory.openingWeekendInCrores)}
                                    </span>
                                  </div>

                                  <div className="p-2.5 bg-paper border-2 border-ink">
                                    <span className="text-[10px] text-ink-dim block font-grotesk font-bold uppercase">
                                      Week 1
                                    </span>
                                    <span className="font-bold text-ink mt-0.5 block">
                                      {formatAmount(item.trajectory.week1InCrores)}
                                    </span>
                                  </div>

                                  <div className="p-2.5 bg-marquee text-ink border-2 border-ink">
                                    <span className="text-[10px] text-ink block font-poster uppercase">
                                      Lifetime Est.
                                    </span>
                                    <span className="font-bold text-ink mt-0.5 block">
                                      {formatAmount(item.trajectory.projectedLifetimeInCrores)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Territory Radar */}
                              <BoxOfficeTerritoryRadar
                                movie={item}
                                currency={currency}
                                viewMode={viewMode}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
