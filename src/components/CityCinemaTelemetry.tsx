"use client";

import React from "react";
import { Activity, Clock, MapPin } from "lucide-react";
import { CityCinemaTelemetry } from "@/types/boxOffice";

interface CityCinemaTelemetryProps {
  telemetry: CityCinemaTelemetry[];
  currency: "INR" | "USD";
}

export default function CityCinemaTelemetrySection({
  telemetry,
  currency,
}: CityCinemaTelemetryProps) {
  const formatGross = (crores: number) => {
    if (currency === "USD") {
      const millions = ((crores * 10_000_000) / 84.0 / 1_000_000).toFixed(2);
      return `$${millions}M`;
    }
    return `₹${crores.toFixed(2)} Cr`;
  };

  return (
    <section className="w-full bg-sheet border-2 border-ink shadow-press p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b-2 border-ink">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 text-xs font-poster uppercase tracking-wider bg-marquee text-ink border-2 border-ink shadow-sticker">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>CITY-WISE CINEMA OPERATIONS</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-poster uppercase text-ink tracking-tight">
            METROPOLITAN OCCUPANCY &amp; THEATRICAL RADAR
          </h2>

          <p className="text-xs text-ink-dim max-w-2xl font-grotesk font-medium">
            Real-time theatre telemetry monitoring seat occupancy, fast-filling show counts, and average ticket price (ATP) across primary circuits.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-ink self-start sm:self-auto bg-band px-2.5 py-1 border border-ink">
          <Clock className="w-3.5 h-3.5 text-press-deep" />
          <span>Real-time polling active</span>
        </div>
      </div>

      {/* City Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {telemetry.map((item) => {
          const isLive = item.status === "live";

          return (
            <div
              key={item.city}
              className="p-5 bg-paper border-2 border-ink shadow-sticker hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-4 group"
            >
              {/* City Name & Status Pill */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-ink text-paper border border-ink flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-paper" />
                  </div>
                  <div>
                    <h3 className="font-poster uppercase text-ink text-sm">
                      {item.city}
                    </h3>
                    <span className="text-[10px] text-ink-dim font-mono block">
                      {item.state} • {item.trackedTheatres} Theatres
                    </span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold border-2 border-ink shadow-sticker ${
                    isLive
                      ? "bg-marquee text-ink"
                      : "bg-band text-ink"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 ${isLive ? "bg-press animate-ping" : "bg-ink"}`} />
                  <span>{isLive ? "LIVE TRACKING" : "CONSOLIDATED"}</span>
                </span>
              </div>

              {/* Occupancy Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-dim font-grotesk font-bold uppercase">Occupancy Rate</span>
                  <span className="font-bold text-ink font-mono text-sm">
                    {item.occupancyPercent}%
                  </span>
                </div>
                <div className="w-full h-2.5 border border-ink bg-sheet overflow-hidden">
                  <div
                    className="h-full bg-press transition-all duration-500"
                    style={{ width: `${item.occupancyPercent}%` }}
                  />
                </div>
              </div>

              {/* Operational Stats Grid */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-line text-center font-mono">
                <div className="p-2 bg-sheet border border-ink">
                  <span className="text-[9px] text-ink-mute uppercase block font-grotesk font-bold">
                    Shows
                  </span>
                  <span className="text-xs font-bold text-ink mt-0.5 block">
                    {item.trackedShows.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="p-2 bg-sheet border border-ink">
                  <span className="text-[9px] text-ink-mute uppercase block font-grotesk font-bold">
                    Fast Fill
                  </span>
                  <span className="text-xs font-bold text-press-deep mt-0.5 block">
                    {item.fastFillingPercent}%
                  </span>
                </div>

                <div className="p-2 bg-sheet border border-ink">
                  <span className="text-[9px] text-ink-mute uppercase block font-grotesk font-bold">
                    ATP
                  </span>
                  <span className="text-xs font-bold text-ink mt-0.5 block">
                    ₹{item.averageTicketPriceINR}
                  </span>
                </div>
              </div>

              {/* Bottom Daily Gross */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-line">
                <span className="text-ink-dim font-grotesk font-bold uppercase">Estimated Daily Gross</span>
                <span className="font-bold text-press-deep font-mono text-sm">
                  {formatGross(item.dailyGrossInCrores)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
