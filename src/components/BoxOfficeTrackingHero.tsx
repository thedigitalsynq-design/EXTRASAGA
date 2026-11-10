"use client";

import React from "react";
import {
  RefreshCw,
  ShieldCheck,
  Building2,
  DollarSign,
  Activity,
} from "lucide-react";

interface BoxOfficeTrackingHeroProps {
  viewMode: "gross" | "net" | "share";
  onViewModeChange: (mode: "gross" | "net" | "share") => void;
  currency: "INR" | "USD";
  onCurrencyChange: (curr: "INR" | "USD") => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  lastUpdated: string;
  totalTrackedMovies: number;
}

export default function BoxOfficeTrackingHero({
  viewMode,
  onViewModeChange,
  currency,
  onCurrencyChange,
  isRefreshing,
  onRefresh,
  lastUpdated,
  totalTrackedMovies,
}: BoxOfficeTrackingHeroProps) {
  const formatLastUpdatedTime = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return "Just now";
    }
  };

  return (
    <section className="w-full bg-sheet border border-line rounded-xl shadow-lg p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-line">
        {/* Left Headline & Pill */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-poster uppercase tracking-wider bg-band text-ink border border-line rounded-lg shadow-sm">
            <span className="w-2 h-2 rounded-full bg-press animate-ping" />
            <span>AUTOMATED MULTI-SOURCE RADAR</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-poster uppercase text-ink tracking-tight leading-tight">
            CONSOLIDATED <span className="text-press">BOX OFFICE</span> ANALYTICS
          </h2>

          <p className="text-xs sm:text-sm text-ink-dim leading-relaxed font-medium">
            Statistically cleansed, outlier-free theatrical figures reconciled continuously from exhibitor telemetry, booking velocity, and audited statements across all Indian film industries.
          </p>
        </div>

        {/* Right Action Controls: Sync & Currency */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          {/* Currency Toggle */}
          <div className="inline-flex p-1 bg-surface border border-line rounded-lg shadow-sm text-xs font-poster uppercase">
            <button
              type="button"
              onClick={() => onCurrencyChange("INR")}
              className={`px-3 py-1.5 rounded transition-all ${
                currency === "INR"
                  ? "bg-band text-ink font-bold border border-line shadow-sm"
                  : "text-ink-dim hover:text-ink hover:bg-surface/60"
              }`}
            >
              ₹ INR (Cr)
            </button>
            <button
              type="button"
              onClick={() => onCurrencyChange("USD")}
              className={`px-3 py-1.5 rounded transition-all ${
                currency === "USD"
                  ? "bg-band text-ink font-bold border border-line shadow-sm"
                  : "text-ink-dim hover:text-ink hover:bg-surface/60"
              }`}
            >
              $ USD (M)
            </button>
          </div>

          {/* Sync Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-press hover:bg-press-deep text-paper text-xs font-poster uppercase tracking-wider rounded-lg shadow-sm transition-all hover:scale-[1.02] disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Recalculating..." : "Sync Telemetry"}</span>
          </button>
        </div>
      </div>

      {/* Metric Breakdown & Filter Switches */}
      <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Financial Metric Segregation Switch (7 cols) */}
        <div className="md:col-span-7 flex flex-wrap items-center gap-2">
          <span className="text-xs font-poster uppercase tracking-wider text-ink block sm:inline mr-1">
            Metric:
          </span>
          <div className="inline-flex p-1 bg-surface border border-line rounded-lg shadow-sm text-xs font-poster uppercase w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onViewModeChange("gross")}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded transition-all ${
                viewMode === "gross"
                  ? "bg-press text-paper font-bold shadow-sm"
                  : "text-ink-dim hover:text-ink hover:bg-surface/60"
              }`}
            >
              Worldwide Gross
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("net")}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded transition-all ${
                viewMode === "net"
                  ? "bg-violet text-paper font-bold shadow-sm"
                  : "text-ink-dim hover:text-ink hover:bg-surface/60"
              }`}
            >
              Domestic Net (Ex-GST)
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("share")}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded transition-all ${
                viewMode === "share"
                  ? "bg-band text-ink font-bold border border-line shadow-sm"
                  : "text-ink-dim hover:text-ink hover:bg-surface/60"
              }`}
            >
              Distributor Share
            </button>
          </div>
        </div>

        {/* Telemetry Status Indicators (5 cols) */}
        <div className="md:col-span-5 flex items-center justify-between md:justify-end gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-ink-mute font-bold">LAST SYNC:</span>
            <span className="font-bold text-ink px-2 py-0.5 bg-surface border border-line rounded">
              {formatLastUpdatedTime(lastUpdated)} IST
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-band text-ink border border-line rounded-lg shadow-sm text-[11px] font-poster uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-press" />
            <span>{totalTrackedMovies} Films Tracked</span>
          </div>
        </div>
      </div>
    </section>
  );
}
