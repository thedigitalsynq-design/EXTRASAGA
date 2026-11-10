"use client";

import React from "react";
import { Building2, ShieldCheck, Flame, PieChart } from "lucide-react";

interface ChainShareItem {
  chainName: string;
  sharePercent: number;
  ticketsSoldFormatted: string;
  trackedScreens: number;
  averageOccupancy: number;
  colorClass: string;
}

const CHAINS_DATA: ChainShareItem[] = [
  {
    chainName: "PVR INOX Ltd",
    sharePercent: 54.2,
    ticketsSoldFormatted: "24.8 Lakh",
    trackedScreens: 1720,
    averageOccupancy: 61.4,
    colorClass: "bg-press",
  },
  {
    chainName: "Cinépolis India",
    sharePercent: 22.8,
    ticketsSoldFormatted: "10.4 Lakh",
    trackedScreens: 460,
    averageOccupancy: 56.8,
    colorClass: "bg-accent-signal",
  },
  {
    chainName: "Miraj & Regional Multiplexes",
    sharePercent: 12.5,
    ticketsSoldFormatted: "5.7 Lakh",
    trackedScreens: 380,
    averageOccupancy: 48.2,
    colorClass: "bg-accent-moss",
  },
  {
    chainName: "Independent Single Screens",
    sharePercent: 10.5,
    ticketsSoldFormatted: "4.8 Lakh",
    trackedScreens: 1850,
    averageOccupancy: 67.5,
    colorClass: "bg-band",
  },
];

export default function NationalChainsPICCard() {
  return (
    <section
      aria-label="National Multiplex Chains Breakdown"
      className="bg-sheet border border-line rounded-lg shadow-sm p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-4 gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-band border border-line rounded">
            <Building2 className="w-5 h-5 text-press" />
          </div>
          <div>
            <h2 className="text-base font-poster uppercase tracking-tight text-ink">
              National Chains Multiplex Share (PIC Index)
            </h2>
            <span className="text-xs font-mono text-ink-dim uppercase">
              PVR-INOX • Cinépolis • Regional Chains Theatrical Penetration
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-ink bg-surface border border-line rounded px-3 py-1 self-start sm:self-center">
          <Flame className="w-3.5 h-3.5 text-press animate-pulse" />
          <span>77.0% Multiplex Dominance</span>
        </div>
      </div>

      {/* Progress Stack Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-ink-dim">
          <span>Market Share Concentration</span>
          <span>100% Tracked Theatrical Footprint</span>
        </div>
        <div className="h-5 w-full bg-surface border border-line rounded-full flex overflow-hidden">
          {CHAINS_DATA.map((chain) => (
            <div
              key={chain.chainName}
              style={{ width: `${chain.sharePercent}%` }}
              className={`h-full ${chain.colorClass} border-r border-line last:border-r-0`}
              title={`${chain.chainName}: ${chain.sharePercent}%`}
            />
          ))}
        </div>
      </div>

      {/* Grid of Chains */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CHAINS_DATA.map((chain) => (
          <div
            key={chain.chainName}
            className="p-4 bg-surface border border-line rounded-lg shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-poster text-xs uppercase tracking-wide text-ink">
                {chain.chainName}
              </span>
              <span className="text-xs font-mono font-bold px-1.5 py-0.5 bg-band border border-line rounded">
                {chain.sharePercent}%
              </span>
            </div>

            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between text-ink-dim">
                <span>Tickets:</span>
                <span className="font-bold text-ink">{chain.ticketsSoldFormatted}</span>
              </div>
              <div className="flex justify-between text-ink-dim">
                <span>Screens:</span>
                <span className="font-bold text-ink">{chain.trackedScreens}</span>
              </div>
              <div className="flex justify-between text-ink-dim">
                <span>Occupancy:</span>
                <span className="font-bold text-accent-moss">{chain.averageOccupancy}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="flex items-center gap-2 p-3 bg-band border border-line rounded-lg text-xs font-mono text-ink-dim">
        <ShieldCheck className="w-4 h-4 text-press shrink-0" />
        <span>
          National Chain telemetry is cross-referenced with electronic ticketing servers at 15-minute intervals.
        </span>
      </div>
    </section>
  );
}

