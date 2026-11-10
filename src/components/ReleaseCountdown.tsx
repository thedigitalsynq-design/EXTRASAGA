"use client";

import React, { useState, useEffect } from "react";
import { Clock, Sparkles } from "lucide-react";

interface ReleaseCountdownProps {
  releaseDate: string; // "YYYY-MM-DD" or ISO string
  compact?: boolean;
}

export default function ReleaseCountdown({
  releaseDate,
  compact = false,
}: ReleaseCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isReleased: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isReleased: false,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculate = () => {
      // Midnight IST of the release date
      const targetDateStr = `${releaseDate.slice(0, 10)}T00:00:00+05:30`;
      const targetTime = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isReleased: true,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isReleased: false });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [releaseDate]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-ink-mute font-mono-tabular">
        <Clock className="w-3.5 h-3.5 text-ink-mute animate-spin" />
        <span>Calculating live IST clock...</span>
      </div>
    );
  }

  if (timeLeft.isReleased) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#4ADE80]/20 text-[#4ADE80] font-black text-xs border border-[#4ADE80]/40 shadow-sm tracking-wider uppercase">
        <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
        <span>NOW IN THEATRES</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-line text-[11px] font-mono-tabular font-bold text-ink shadow-sm">
        <Clock className="w-3 h-3 text-press animate-pulse" />
        <span>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      </div>
    );
  }

  return (
    <div className="bg-sheet rounded-xl p-3.5 border border-line shadow-lg">
      <div className="flex items-center justify-between text-[10px] uppercase font-black text-ink tracking-widest mb-2 border-b border-line pb-1.5">
        <span className="flex items-center gap-1.5 text-press">
          <Sparkles className="w-3 h-3" />
          <span>Release Countdown</span>
        </span>
        <span className="text-ink-mute font-mono-tabular font-bold bg-surface px-1.5 py-0.5 rounded border border-line">Asia/Kolkata</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 text-center">
        <div className="bg-surface rounded-lg p-2 border border-line">
          <span className="text-base font-black text-ink block font-mono-tabular leading-none">{timeLeft.days}</span>
          <span className="text-[9px] text-ink-mute uppercase font-bold tracking-wider mt-1 block">Days</span>
        </div>
        <div className="bg-surface rounded-lg p-2 border border-line">
          <span className="text-base font-black text-ink block font-mono-tabular leading-none">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="text-[9px] text-ink-mute uppercase font-bold tracking-wider mt-1 block">Hrs</span>
        </div>
        <div className="bg-surface rounded-lg p-2 border border-line">
          <span className="text-base font-black text-ink block font-mono-tabular leading-none">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="text-[9px] text-ink-mute uppercase font-bold tracking-wider mt-1 block">Min</span>
        </div>
        <div className="bg-band rounded-lg p-2 border border-line">
          <span className="text-base font-black text-press block font-mono-tabular leading-none">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="text-[9px] text-ink uppercase font-bold tracking-wider mt-1 block">Sec</span>
        </div>
      </div>
    </div>
  );
}
