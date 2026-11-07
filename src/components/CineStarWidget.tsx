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
    <div className="bg-white rounded-[28px] border border-[#E5EBE7] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5EBE7] bg-[#F8FAF9]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#E8F8EB] border border-[#B7E5BA] flex items-center justify-center">
            <Crown className="w-4 h-4 text-[#288760]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#0F3529] tracking-tight leading-none">ಸಿನಿಸ್ಟಾರ್ ಟಾಪ್ 5</h3>
            <p className="text-[10px] text-[#4B6358] font-medium mt-0.5">Real-Time Box Office Power Rankings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#288760] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#288760]" />
          </span>
          <Link
            href={localizeUrl("/cinestars")}
            className="flex items-center gap-1 text-xs font-bold text-[#288760] hover:text-[#1A5140] transition-colors"
          >
            <span>Full List</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Top 5 rows */}
      <div className="divide-y divide-[#E5EBE7]">
        {top5.map((entry, idx) => {
          const isGain = entry.dailyChangeCr >= 0;
          const rankColors = [
            "bg-[#288760] text-white",
            "bg-[#5CA87C] text-white",
            "bg-[#B7E5BA] text-[#0F3529]",
            "bg-[#F8FAF9] text-[#1A5140] border border-[#E5EBE7]",
            "bg-[#F8FAF9] text-[#1A5140] border border-[#E5EBE7]",
          ];
          return (
            <div key={entry.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8FAF9] transition-colors group">
              {/* Rank */}
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${rankColors[idx]}`}>
                {entry.rank}
              </span>

              {/* Avatar */}
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#E5EBE7] shrink-0 bg-[#F0F4F2]">
                <Image src={entry.profileImage} alt={entry.name} fill className="object-cover" sizes="36px" />
                {entry.isLive && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#288760] border-2 border-white" />
                )}
              </div>

              {/* Name & source */}
              <div className="flex-1 min-w-0">
                <div className="font-black text-xs text-[#0F3529] group-hover:text-[#288760] transition-colors leading-none truncate">
                  {entry.name}
                </div>
                <div className="text-[10px] text-[#4B6358] mt-0.5 truncate">{entry.sourceOfPower}</div>
              </div>

              {/* Daily change */}
              <div className={`flex items-center gap-0.5 font-black text-[11px] font-mono shrink-0 ${isGain ? "text-[#288760]" : "text-red-500"}`}>
                {isGain ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span>{isGain ? "+" : ""}{entry.dailyChangeCr.toFixed(1)}</span>
              </div>

              {/* Lifetime power */}
              <div className="text-right shrink-0">
                <div className="font-black text-xs text-[#0F3529] font-mono leading-none">
                  ₹{entry.boxOfficePowerCr >= 1000 ? `${(entry.boxOfficePowerCr / 1000).toFixed(1)}K` : entry.boxOfficePowerCr} Cr
                </div>
                <div className="text-[10px] text-[#4B6358] font-semibold">Lifetime</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-3.5 border-t border-[#E5EBE7] bg-[#F8FAF9]">
        <Link
          href={localizeUrl("/cinestars")}
          className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#1A5140] hover:bg-[#288760] text-white text-xs font-black transition-all shadow-2xs group"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>50 ಸಿನಿಸ್ಟಾರ್ ರ‍್ಯಾಂಕಿಂಗ್ ನೋಡಿ (Full Leaderboard)</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

