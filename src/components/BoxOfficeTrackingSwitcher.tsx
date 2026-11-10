"use client";

import React from "react";
import { BarChart3, Ticket, Building2, MapPin, Trophy } from "lucide-react";

export type BoxOfficeMode = "all_india" | "by_year" | "advance" | "national_chains" | "circuits";

interface BoxOfficeTrackingSwitcherProps {
  activeMode: BoxOfficeMode;
  onModeChange: (mode: BoxOfficeMode) => void;
  advanceBadgeCount?: number;
}

export default function BoxOfficeTrackingSwitcher({
  activeMode,
  onModeChange,
  advanceBadgeCount = 6,
}: BoxOfficeTrackingSwitcherProps) {
  const tabs = [
    {
      id: "by_year" as BoxOfficeMode,
      label: "Yearly Leaderboard",
      subtitle: "2026 Rankings & Verdicts",
      icon: Trophy,
      badge: "NEW",
    },
    {
      id: "all_india" as BoxOfficeMode,
      label: "All-India Gross & Net",
      subtitle: "Consolidated Ledgers",
      icon: BarChart3,
    },
    {
      id: "advance" as BoxOfficeMode,
      label: "Advance Booking Radar",
      subtitle: "Live Tickets & Shows",
      icon: Ticket,
      badge: `${advanceBadgeCount} LIVE`,
    },
    {
      id: "national_chains" as BoxOfficeMode,
      label: "National Chains (PIC)",
      subtitle: "PVR • INOX • Cinépolis",
      icon: Building2,
    },
    {
      id: "circuits" as BoxOfficeMode,
      label: "Circuit & State Telemetry",
      subtitle: "Regional Exhibition",
      icon: MapPin,
    },
  ];

  return (
    <nav
      aria-label="Box Office Telemetry Modes"
      className="w-full bg-sheet border border-line rounded-xl shadow-lg p-2.5 select-none"
    >
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMode === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onModeChange(tab.id)}
              className={`flex flex-col items-start p-3 text-left transition-all rounded-lg border relative ${
                isActive
                  ? "bg-surface text-ink border-line shadow-sm font-bold"
                  : "bg-sheet text-ink-dim hover:text-ink hover:bg-surface/50 border-transparent"
              }`}
            >
              {tab.badge && (
                <span className={`absolute top-2 right-2 px-1.5 py-0.5 text-[9px] font-mono-tabular font-bold uppercase border rounded ${
                  tab.badge === "NEW" ? "bg-marquee text-ink border-line" : "bg-press text-paper border-press animate-pulse"
                }`}>
                  {tab.badge}
                </span>
              )}

              <div className="flex items-center gap-2 mb-1">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-press" : "text-ink-dim"
                  }`}
                />
                <span className="text-xs font-poster uppercase tracking-wide text-ink">
                  {tab.label}
                </span>
              </div>
              <span className="text-[10px] font-mono-tabular text-ink-dim uppercase">
                {tab.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

