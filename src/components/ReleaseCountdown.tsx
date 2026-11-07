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
      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-sans">
        <Clock className="w-3 h-3 text-amber-400" />
        <span>ಲೆಕ್ಕಾಚಾರ... (Calculating)</span>
      </div>
    );
  }

  if (timeLeft.isReleased) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-sans font-bold shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>ಚಿತ್ರಮಂದಿರಗಳಲ್ಲಿ ಪ್ರದರ್ಶನ (NOW IN THEATRES)</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/30 text-[10px] font-sans font-bold text-amber-300">
        <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
        <span>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      </div>
    );
  }

  return (
    <div className="bg-black/80 backdrop-blur-md rounded-xl p-2 border border-white/10 shadow-lg">
      <div className="flex items-center justify-between text-[9px] uppercase font-bold text-amber-400 tracking-wider mb-1 font-sans">
        <span className="flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          <span>ಬಿಡುಗಡೆ ಕೌಂಟ್‌ಡೌನ್ (IST)</span>
        </span>
        <span className="text-gray-400">Asia/Kolkata</span>
      </div>
      <div className="grid grid-cols-4 gap-1 text-center font-sans">
        <div className="bg-white/[0.06] rounded p-1">
          <span className="text-sm font-black text-white block">{timeLeft.days}</span>
          <span className="text-[8px] text-gray-400 uppercase font-medium">ದಿನ</span>
        </div>
        <div className="bg-white/[0.06] rounded p-1">
          <span className="text-sm font-black text-white block">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="text-[8px] text-gray-400 uppercase font-medium">ಗಂಟೆ</span>
        </div>
        <div className="bg-white/[0.06] rounded p-1">
          <span className="text-sm font-black text-white block">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="text-[8px] text-gray-400 uppercase font-medium">ನಿಮಿಷ</span>
        </div>
        <div className="bg-white/[0.06] rounded p-1">
          <span className="text-sm font-black text-amber-400 block font-mono">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="text-[8px] text-gray-400 uppercase font-medium">ಸೆಕೆಂಡ್</span>
        </div>
      </div>
    </div>
  );
}

