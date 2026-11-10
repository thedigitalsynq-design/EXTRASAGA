"use client";

import React from "react";
import { Globe2 } from "lucide-react";
import { ConsolidatedBoxOfficeRecord, TerritoryFinancialBreakdown } from "@/types/boxOffice";

interface BoxOfficeTerritoryRadarProps {
  movie: ConsolidatedBoxOfficeRecord;
  currency: "INR" | "USD";
  viewMode: "gross" | "net" | "share";
}

export default function BoxOfficeTerritoryRadar({
  movie,
  currency,
  viewMode,
}: BoxOfficeTerritoryRadarProps) {
  const formatAmount = (crores: number) => {
    if (currency === "USD") {
      const millions = ((crores * 10_000_000) / 84.0 / 1_000_000).toFixed(2);
      return `$${millions}M`;
    }
    return `₹${crores.toFixed(2)} Cr`;
  };

  const getMetric = (t: TerritoryFinancialBreakdown) => {
    if (viewMode === "net") return t.netInCrores;
    if (viewMode === "share") return t.distributorShareInCrores;
    return t.grossInCrores;
  };

  return (
    <section className="w-full bg-sheet border border-line rounded-xl shadow-lg p-5 sm:p-6">
      {/* Header */}
      <div className="space-y-2 pb-5 mb-5 border-b border-line">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-poster uppercase tracking-wider bg-band text-ink border border-line rounded-lg shadow-sm">
          <Globe2 className="w-3.5 h-3.5 text-press" />
          <span>TERRITORY &amp; OVERSEAS AUDIT</span>
        </div>

        <h3 className="text-lg sm:text-xl font-poster uppercase text-ink tracking-tight">
          {movie.movieTitleEn} — Territorial Collection Distribution
        </h3>

        <p className="text-xs text-ink-dim font-medium">
          Comprehensive territory-wise segregation of theatrical gross, statutory ex-GST net, and realized distributor share.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-line text-ink uppercase font-poster tracking-wider bg-surface">
              <th className="py-2.5 px-3 font-bold">Territory / Market</th>
              <th className="py-2.5 px-3 font-bold">Gross</th>
              <th className="py-2.5 px-3 font-bold">Net (Ex-GST)</th>
              <th className="py-2.5 px-3 font-bold text-press">Distributor Share</th>
              <th className="py-2.5 px-3 font-bold">Avg Occupancy</th>
              <th className="py-2.5 px-3 text-right font-bold">Market Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {movie.territories.map((t) => {
              return (
                <tr key={t.territory} className="hover:bg-surface/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-ink">
                    <div className="font-poster uppercase">{t.territory}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-ink">
                    {formatAmount(t.grossInCrores)}
                  </td>
                  <td className="py-3 px-3 font-mono text-ink-dim">
                    {formatAmount(t.netInCrores)}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-press">
                    {formatAmount(t.distributorShareInCrores)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface text-ink border border-line rounded text-[10px] font-bold font-mono">
                      {t.occupancyRate}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 border border-line rounded-full bg-surface overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-press"
                          style={{ width: `${t.marketSharePercent}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-ink text-xs">
                        {t.marketSharePercent}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
