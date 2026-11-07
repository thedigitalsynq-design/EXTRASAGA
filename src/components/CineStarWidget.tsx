"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, ChevronRight, Crown, Zap } from "lucide-react";
import { CINESTAR_LEADERBOARD } from "@/data/cineStarData";
import { useLanguage } from "@/context/LanguageContext";

export default function CineStarWidget() {
  const { localizeUrl } = useLanguage();
  const top5 = CINESTAR_LEADERBOARD.slice(0, 5);

  return (
    <div className="bg-revealed rounded-[28px] border border-glow-line shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-glow-line bg-hall/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-marquee-faint border border-marquee/25 flex items-center justify-center">
            <Crown className="w-4 h-4 text-marquee-soft" />
          </div>
          <div>
            <h3 className="text-sm font-black text-popcorn tracking-tight leading-none">CineStar Top 5</h3>
            <p className="text-[10px] text-popcorn-muted font-medium mt-0.5 font-display-latin uppercase tracking-widest">Power Rankings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-signal animate-glow-pulse" />
          </span>
          <Link
            href={localizeUrl("/cinestars")}
            className="flex items-center gap-1 text-xs font-bold text-signal-soft hover:text-signal transition-colors"
          >
            <span>Full List</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Top 5 rows */}
      <div className="divide-y divide-glow-line">
        {top5.map((entry, idx) => {
          const isGain = entry.dailyChangeCr >= 0;
          const rankColors = [
            "bg-marquee-faint text-marquee-soft border border-marquee/40 font-mono-tabular",
            "bg-ultra-faint text-ultra-soft border border-ultra/25",
            "bg-signal-faint text-signal-soft border border-signal/25",
            "bg-hall text-popcorn-dim border border-glow-line",
            "bg-hall text-popcorn-dim border border-glow-line",
          ];
          return (
            <div
              key={entry.id}
              className={`flex items-center gap-3 px-5 py-3.5 hover:bg-screen transition-colors group ${
                idx === 0 ? "podium-gold-glow bg-screen/40" : ""
              }`}
            >
              {/* Rank */}
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${rankColors[idx]}`}>
                {entry.rank}
              </span>

              {/* Avatar */}
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-glow-line shrink-0 bg-hall">
                <Image src={entry.profileImage} alt={entry.name} fill className="object-cover" sizes="36px" />
                {entry.isLive && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-signal border-2 border-revealed" />
                )}
              </div>

              {/* Name & source */}
              <div className="flex-1 min-w-0">
                <div className="font-black text-xs text-popcorn group-hover:text-signal-soft transition-colors leading-none truncate">
                  {entry.name}
                </div>
                <div className="text-[10px] text-popcorn-muted mt-0.5 truncate">{entry.sourceOfPower}</div>
              </div>

              {/* Daily change */}
              <div
                className={`flex items-center gap-0.5 font-black text-[11px] font-mono-tabular shrink-0 ${
                  isGain ? "change-positive" : "change-negative"
                }`}
              >
                {isGain ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span>{isGain ? "+" : ""}{entry.dailyChangeCr.toFixed(1)}</span>
              </div>

              {/* Lifetime power */}
              <div className="text-right shrink-0">
                <div className={`font-black text-xs font-mono-tabular leading-none ${idx === 0 ? "text-marquee-soft" : "text-popcorn"}`}>
                  ₹{entry.boxOfficePowerCr >= 1000 ? `${(entry.boxOfficePowerCr / 1000).toFixed(1)}K` : entry.boxOfficePowerCr} Cr
                </div>
                <div className="text-[10px] text-popcorn-muted font-semibold">Lifetime</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-3.5 border-t border-glow-line bg-hall/60">
        <Link
          href={localizeUrl("/cinestars")}
          className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-signal-deep hover:bg-signal text-popcorn text-xs font-black transition-all group"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>View the Full 50-Star Leaderboard</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
