"use client";

import React from "react";
import { StateCinemaTelemetry } from "@/types/boxOffice";
import { AdvanceBookingService } from "@/lib/boxOfficeEngine/advanceBookingService";
import { MapPin, Film, Sparkles } from "lucide-react";

interface StateCircuitTelemetryTableProps {
  circuits?: StateCinemaTelemetry[];
}

export default function StateCircuitTelemetryTable({
  circuits = AdvanceBookingService.getStateCircuits(),
}: StateCircuitTelemetryTableProps) {
  return (
    <section
      aria-label="State and Circuit Theatrical Telemetry"
      className="bg-sheet border-2 border-ink shadow-press overflow-hidden"
    >
      {/* Header */}
      <div className="bg-band border-b-2 border-ink px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-press" />
          <h2 className="text-sm font-poster uppercase tracking-wide text-ink">
            Territory &amp; State Cinema Exhibition Breakdown
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-ink-dim">
          <span className="px-2 py-0.5 bg-paper border border-ink/30 uppercase font-bold text-ink">
            7 MAJOR INDIAN DISTRIBUTION CIRCUITS
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-paper border-b-2 border-ink text-ink-dim uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4 font-bold">Circuit &amp; Territory</th>
              <th className="py-3 px-3 font-bold text-right">Theatres</th>
              <th className="py-3 px-3 font-bold text-right">Shows Tracked</th>
              <th className="py-3 px-3 font-bold text-right">Occupancy %</th>
              <th className="py-3 px-3 font-bold text-right">Daily Gross</th>
              <th className="py-3 px-4 font-bold">Top Performing Film</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {circuits.map((item) => (
              <tr
                key={item.regionCode}
                className="hover:bg-paper/70 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="font-poster text-sm uppercase text-ink">
                    {item.state}
                  </div>
                  <div className="text-[10px] text-ink-dim font-grotesk mt-0.5">
                    Circuit: <span className="font-mono font-bold text-ink">{item.regionCode}</span> • Language: {item.leadLanguage}
                  </div>
                </td>

                <td className="py-3 px-3 text-right font-mono-tabular text-ink font-bold">
                  {item.trackedTheatres.toLocaleString("en-IN")}
                </td>

                <td className="py-3 px-3 text-right font-mono-tabular text-ink font-bold">
                  {item.trackedShows.toLocaleString("en-IN")}
                </td>

                <td className="py-3 px-3 text-right">
                  <span className="font-bold text-accent-moss block">
                    {item.occupancyPercent}%
                  </span>
                  <div className="w-16 h-1 bg-paper border border-ink/20 ml-auto mt-1 overflow-hidden">
                    <div
                      className="h-full bg-accent-moss"
                      style={{ width: `${Math.min(100, item.occupancyPercent)}%` }}
                    />
                  </div>
                </td>

                <td className="py-3 px-3 text-right font-mono-tabular">
                  <span className="font-poster text-sm text-press font-bold block">
                    ₹{item.dailyGrossInCrores.toFixed(1)} Cr
                  </span>
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 font-grotesk font-bold text-ink">
                    <Film className="w-3.5 h-3.5 text-press shrink-0" />
                    <span>{item.topMovie}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-paper border-t-2 border-ink px-5 py-3 flex items-center justify-between text-[11px] font-mono text-ink-dim">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-press" />
          <span>Regional distributor returns compiled from verified circuit logs.</span>
        </div>
      </div>
    </section>
  );
}
