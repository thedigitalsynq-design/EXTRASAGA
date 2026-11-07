"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowDownRight, ChevronRight, Crown, Zap } from "lucide-react";
import { CINESTAR_LEADERBOARD } from "@/data/cineStarData";
import { useLanguage } from "@/context/LanguageContext";

export default function CineStarWidget() {
  const { localizeUrl } = useLanguage();
  const top5 = CINESTAR_LEADERBOARD.slice(0, 5);

  return (
    <div className="bg-sheet border-2 border-ink shadow-press overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b-2 border-ink bg-band">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-marquee text-ink border-2 border-ink shadow-sticker flex items-center justify-center">
            <Crown className="w-4 h-4 text-ink" />
          </div>
          <div>
            <h3 className="text-sm font-poster uppercase text-ink tracking-tight leading-none">CineStar Top 5</h3>
            <p className="text-[10px] text-ink-dim font-mono uppercase tracking-wider mt-0.5 font-bold">Power Rankings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={localizeUrl("/cinestars")}
            className="btn-press-interactive flex items-center gap-1 text-xs font-poster uppercase text-ink hover:text-press transition-colors"
          >
            <span>Full List</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Top 5 rows */}
      <div className="divide-y border-t border-line">
        {top5.map((entry, idx) => {
          const isGain = entry.dailyChangeCr >= 0;
          const rankColors = [
            "bg-marquee text-ink shadow-sticker",
            "bg-paper text-ink shadow-sticker",
            "bg-violet text-paper shadow-sticker",
            "bg-band text-ink",
            "bg-band text-ink",
          ];
          return (
            <div
              key={entry.id}
              className={`flex items-center gap-3 px-5 py-3.5 hover:bg-band/40 transition-colors group ${
                idx === 0 ? "bg-marquee/15" : ""
              }`}
            >
              {/* Rank */}
              <span className={`w-7 h-7 border-2 border-ink flex items-center justify-center text-xs font-poster uppercase shrink-0 ${rankColors[idx]}`}>
                {entry.rank}
              </span>

              {/* Avatar */}
              <div className="relative w-9 h-9 border-2 border-ink overflow-hidden shrink-0 bg-band shadow-sticker">
                <Image src={entry.profileImage} alt={entry.name} fill className="object-cover" sizes="36px" />
                {entry.isLive && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-press border border-ink" />
                )}
              </div>

              {/* Name & source */}
              <div className="flex-1 min-w-0">
                <div className="font-poster uppercase text-xs text-ink group-hover:text-press transition-colors leading-none truncate">
                  {entry.name}
                </div>
                <div className="text-[10px] text-ink-dim font-grotesk mt-0.5 truncate">{entry.sourceOfPower}</div>
              </div>

              {/* Daily change */}
              <div
                className={`flex items-center gap-0.5 font-bold text-[11px] font-mono shrink-0 ${
                  isGain ? "change-positive" : "change-negative"
                }`}
              >
                {isGain ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span>{isGain ? "+" : ""}{entry.dailyChangeCr.toFixed(1)}</span>
              </div>

              {/* Lifetime power */}
              <div className="text-right shrink-0">
                <div className="font-mono font-bold text-xs text-ink leading-none">
                  ₹{entry.boxOfficePowerCr >= 1000 ? `${(entry.boxOfficePowerCr / 1000).toFixed(1)}K` : entry.boxOfficePowerCr} Cr
                </div>
                <div className="text-[10px] text-ink-mute font-grotesk">Lifetime</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-3.5 border-t-2 border-ink bg-band">
        <Link
          href={localizeUrl("/cinestars")}
          className="btn-press-interactive flex items-center justify-center gap-2 py-2.5 bg-ink hover:bg-press text-paper text-xs font-poster uppercase tracking-wider transition-all border-2 border-ink shadow-sticker group"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>View the Full 50-Star Leaderboard</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
