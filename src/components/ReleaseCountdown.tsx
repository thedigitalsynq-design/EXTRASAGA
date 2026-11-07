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
      <div className="flex items-center gap-1 text-[10px] text-popcorn-muted font-mono-tabular">
        <Clock className="w-3 h-3 text-marquee-soft" />
        <span>ಲೆಕ್ಕಾಚಾರ... (Calculating)</span>
      </div>
    );
  }

  if (timeLeft.isReleased) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#4ADE80]/10 change-positive border border-[#4ADE80]/40 text-[10px] font-bold shadow-[0_0_16px_rgba(74,222,128,0.2)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-glow-pulse"></span>
        <span>ಚಿತ್ರಮಂದಿರಗಳಲ್ಲಿ ಪ್ರದರ್ಶನ (NOW IN THEATRES)</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-void/80 backdrop-blur-md border border-marquee/40 text-[10px] font-mono-tabular font-bold text-marquee-soft">
        <Clock className="w-3 h-3 text-marquee-soft animate-pulse" />
        <span>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      </div>
    );
  }

  return (
    <div className="bg-hall/90 backdrop-blur-md rounded-xl p-2 border border-glow-line shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between text-[9px] uppercase font-bold text-marquee-soft tracking-widest mb-1 font-display-latin">
        <span className="flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          <span>ಬಿಡುಗಡೆ ಕೌಂಟ್‌ಡೌನ್ (IST)</span>
        </span>
        <span className="text-popcorn-muted font-mono-tabular">Asia/Kolkata</span>
      </div>
      <div className="grid grid-cols-4 gap-1 text-center">
        <div className="bg-screen/80 rounded p-1 border border-glow-line">
          <span className="text-sm font-black text-popcorn block font-mono-tabular">{timeLeft.days}</span>
          <span className="text-[8px] text-popcorn-muted uppercase font-medium font-display-latin tracking-widest">ದಿನ</span>
        </div>
        <div className="bg-screen/80 rounded p-1 border border-glow-line">
          <span className="text-sm font-black text-popcorn block font-mono-tabular">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="text-[8px] text-popcorn-muted uppercase font-medium font-display-latin tracking-widest">ಗಂಟೆ</span>
        </div>
        <div className="bg-screen/80 rounded p-1 border border-glow-line">
          <span className="text-sm font-black text-popcorn block font-mono-tabular">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="text-[8px] text-popcorn-muted uppercase font-medium font-display-latin tracking-widest">ನಿಮಿಷ</span>
        </div>
        <div className="bg-screen/80 rounded p-1 border border-glow-line">
          <span className="text-sm font-black text-marquee-soft block font-mono-tabular">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="text-[8px] text-popcorn-muted uppercase font-medium font-display-latin tracking-widest">ಸೆಕೆಂಡ್</span>
        </div>
      </div>
    </div>
  );
}
