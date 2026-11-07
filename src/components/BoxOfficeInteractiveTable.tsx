"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Activity,
  Layers,
} from "lucide-react";
import { ConsolidatedBoxOfficeRecord } from "@/types/boxOffice";
import { useLanguage } from "@/context/LanguageContext";
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
  const { language, config, t, localizeUrl } = useLanguage();
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
    { id: "all", label: "ಎಲ್ಲಾ ಚಿತ್ರರಂಗಗಳು (All)" },
    { id: "sandalwood", label: "ಸ್ಯಾಂಡಲ್‌ವುಡ್ (Kannada)" },
    { id: "tollywood", label: "ಟಾಲಿವುಡ್ (Telugu)" },
    { id: "kollywood", label: "ಕಾಲಿವುಡ್ (Tamil)" },
    { id: "mollywood", label: "ಮಾಲಿವುಡ್ (Malayalam)" },
    { id: "bollywood", label: "ಬಾಲಿವುಡ್ (Hindi)" },
    { id: "hollywood", label: "ಹಾಲಿವುಡ್ (Global)" },
  ];

  return (
    <div className="space-y-6">
      {/* Industry Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 text-xs font-sans">
        {industries.map((ind) => (
          <button
            key={ind.id}
            type="button"
            onClick={() => setSelectedIndustry(ind.id)}
            className={`px-4 py-2 rounded-2xl font-bold transition-all whitespace-nowrap border ${
              selectedIndustry === ind.id
                ? "bg-[#A92732] text-white border-[#A92732] shadow-sm"
                : "bg-white text-gray-700 hover:text-gray-950 border-gray-200 hover:border-gray-300"
            }`}
          >
            {ind.label}
          </button>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase font-mono tracking-wider bg-gray-50/80">
                <th className="py-3.5 px-4 font-semibold w-12 text-center">ಸ್ಥಾನ</th>
                <th className="py-3.5 px-4 font-semibold">ಸಿನಿಮಾ & ಸ್ಥಿತಿ (Movie)</th>
                <th className="py-3.5 px-4 font-semibold">ಡೇ-1</th>
                <th className="py-3.5 px-4 font-semibold">ಮೊದಲ ವಾರಾಂತ್ಯ</th>
                <th className="py-3.5 px-4 font-semibold text-[#A92732]">
                  {viewMode === "gross"
                    ? "ಸಾರ್ವಕಾಲಿಕ ಗ್ರಾಸ್"
                    : viewMode === "net"
                    ? "ನಿವ್ವಳ (Net)"
                    : "ವಿತರಕರ ಪಾಲು (Share)"}
                </th>
                <th className="py-3.5 px-4 font-semibold">ತೀರ್ಪು</th>
                <th className="py-3.5 px-4 font-semibold">ವಿಶ್ವಾಸಾರ್ಹತೆ</th>
                <th className="py-3.5 px-4 text-right font-semibold">ವಿಶ್ಲೇಷಣೆ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    ಯಾವುದೇ ಸಿನಿಮಾಗಳು ಲಭ್ಯವಿಲ್ಲ (No movies found)
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item, idx) => {
                  const isExpanded = expandedMovieSlug === item.slug;
                  const activeTotal = getCollectionValue(item);

                  const statusBadge =
                    item.figureStatus === "verified" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>ದೃಢೀಕೃತ ಲೆಕ್ಕಾಚಾರ</span>
                      </span>
                    ) : item.figureStatus === "live_estimate" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[10px] font-bold border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <span>ಲೈವ್ ಅಂದಾಜು</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 text-[10px] font-bold border border-sky-200">
                        <span>ಕ್ರೋಢೀಕೃತ ಅಂಕಿಅಂಶ</span>
                      </span>
                    );

                  const classBadge =
                    item.dataClass === "measured" ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-50 text-amber-900 border border-amber-200">
                        ಟೆಲಿಮೆಟ್ರಿ
                      </span>
                    ) : item.dataClass === "reported" ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-gray-100 text-gray-700 border border-gray-200">
                        ವರದಿ
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-gray-50 text-gray-600 border border-gray-200">
                        ಅಂದಾಜು
                      </span>
                    );

                  return (
                    <React.Fragment key={item.id}>
                      <tr className="hover:bg-gray-50/70 transition-colors group">
                        {/* Rank */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`w-7 h-7 rounded-full inline-flex items-center justify-center font-black text-xs font-mono shadow-2xs ${
                              idx === 0
                                ? "bg-amber-400 text-gray-950 ring-2 ring-amber-300"
                                : idx === 1
                                ? "bg-gray-200 text-gray-900"
                                : idx === 2
                                ? "bg-amber-100 text-amber-900"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </td>

                        {/* Title & Poster */}
                        <td className="py-3.5 px-4 font-bold text-gray-950">
                          <div className="flex items-center gap-3">
                            <div className="relative w-11 h-14 rounded-lg overflow-hidden shrink-0 hidden sm:block bg-gray-100 border border-gray-200 shadow-2xs">
                              <Image
                                src={item.posterImage}
                                alt={item.movieTitle}
                                fill
                                sizes="50px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-black text-gray-950 truncate font-sans">
                                {language === "kn" ? item.movieTitle : item.movieTitleEn}
                              </div>
                              <div className="text-[11px] text-gray-400 font-sans truncate font-normal">
                                {item.movieTitleEn} ({item.releaseYear})
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                {statusBadge}
                                {classBadge}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Day 1 */}
                        <td className="py-3.5 px-4 font-mono font-medium text-gray-800">
                          {formatAmount(item.trajectory.day1InCrores)}
                        </td>

                        {/* Weekend */}
                        <td className="py-3.5 px-4 font-mono font-medium text-gray-800">
                          {formatAmount(item.trajectory.openingWeekendInCrores)}
                        </td>

                        {/* Consolidated Main Metric */}
                        <td className="py-3.5 px-4 font-mono font-black text-sm text-[#A92732]">
                          {formatAmount(activeTotal)}
                        </td>

                        {/* Verdict */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-sans">
                            {item.verdict}
                          </span>
                        </td>

                        {/* Confidence Indicator */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span className="font-mono font-bold text-xs text-gray-900 block">
                              {item.confidenceScore}%
                            </span>
                            <div className="w-16 h-1 rounded-full bg-gray-200 overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
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
                            className={`p-2 rounded-xl transition-all border ${
                              isExpanded
                                ? "bg-[#A92732] text-white border-[#A92732]"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200"
                            }`}
                            title="ಪ್ರಾದೇಶಿಕ ವಿವರ ವೀಕ್ಷಿಸಿ"
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
                          <td colSpan={8} className="p-4 sm:p-6 bg-gray-50/70 border-b border-gray-200">
                            <div className="space-y-6">
                              {/* Trajectory Tracker */}
                              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono flex items-center gap-1.5">
                                  <TrendingUp className="w-3.5 h-3.5 text-[#A92732]" />
                                  <span>ದೈನಂದಿನ ಮತ್ತು ಜೀವಮಾನದ ಆದಾಯ ಪಥ (Lifecycle Trajectory)</span>
                                </h4>

                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center font-mono text-xs">
                                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                                    <span className="text-[10px] text-gray-400 block font-sans">
                                      ಡೇ 1
                                    </span>
                                    <span className="font-bold text-gray-900 mt-0.5 block">
                                      {formatAmount(item.trajectory.day1InCrores)}
                                    </span>
                                  </div>

                                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                                    <span className="text-[10px] text-gray-400 block font-sans">
                                      ಡೇ 2
                                    </span>
                                    <span className="font-bold text-gray-900 mt-0.5 block">
                                      {formatAmount(item.trajectory.day2InCrores)}
                                    </span>
                                  </div>

                                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                                    <span className="text-[10px] text-gray-400 block font-sans">
                                      ವಾರಾಂತ್ಯ (Weekend)
                                    </span>
                                    <span className="font-bold text-gray-900 mt-0.5 block">
                                      {formatAmount(item.trajectory.openingWeekendInCrores)}
                                    </span>
                                  </div>

                                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                                    <span className="text-[10px] text-gray-400 block font-sans">
                                      ಮೊದಲ ವಾರ (Week 1)
                                    </span>
                                    <span className="font-bold text-gray-900 mt-0.5 block">
                                      {formatAmount(item.trajectory.week1InCrores)}
                                    </span>
                                  </div>

                                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                                    <span className="text-[10px] text-amber-800 block font-sans font-bold">
                                      ಜೀವಮಾನ ಅಂದಾಜು
                                    </span>
                                    <span className="font-bold text-amber-900 mt-0.5 block">
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

