"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface DualLuminousDiscsProps {
  sectionIndex?: string; // e.g. "01"
  totalSections?: string; // e.g. "06"
  categoryLabel?: string; // e.g. "Narrative & Craft"
  heading?: string;
  problemTitle?: string;
  problemDesc?: string;
  solutionTitle?: string;
  solutionDesc?: string;
}

export default function DualLuminousDiscs({
  sectionIndex = "01",
  totalSections = "06",
  categoryLabel = "Narrative & Craft",
  heading = "Real Narrative Tension Met With Cinematic Craft",
  problemTitle = "Narrative Conflict",
  problemDesc = "Rooted folklore demands raw visceral authenticity without losing pacing across mass-appeal commercial boundaries.",
  solutionTitle = "Cinematic Solution",
  solutionDesc = "Dynamic anamorphic framing, tribal acoustic percussion, and grounded performances unite folklore into a national cinematic triumph.",
}: DualLuminousDiscsProps) {
  const { language } = useLanguage();

  return (
    <section aria-label="Cinematic Dual Analysis" className="w-full my-12 py-8 overflow-hidden">
      {/* Top Pagination & Chapter Index */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-glow-line">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-popcorn-muted uppercase tracking-widest">
          <span className="text-marquee-soft">◄</span>
          <span className="text-popcorn">{categoryLabel}</span>
          <span className="text-marquee-soft">►</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs font-bold text-popcorn-muted font-mono-tabular">
          <span className="text-popcorn text-sm font-black">{sectionIndex}</span>
          <span className="w-12 h-[1.5px] bg-marquee inline-block rounded-full"></span>
          <span>{totalSections}</span>
        </div>
      </div>

      {/* Editorial Headline */}
      <div className="mt-8 mb-10 max-w-2xl">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-popcorn tracking-tight leading-tight font-display-latin">
          {heading}
        </h2>
      </div>

      {/* Overlapping Dual Discs Composition */}
      <div className="relative flex flex-col md:flex-row items-center justify-center py-10 min-h-[380px] sm:min-h-[440px]">
        {/* Disc 1: Matte Obsidian Circle (Problem / Narrative Friction) */}
        <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full bg-gradient-to-br from-hall to-void text-white p-8 sm:p-12 flex flex-col justify-center shadow-[inset_0_1px_1px_rgba(245,245,250,0.08),0_25px_60px_-10px_rgba(0,0,0,0.7)] border border-glow-line-strong transition-spring hover:scale-[1.02] z-10 shrink-0">
          <span className="text-[10px] uppercase font-bold text-signal-soft font-mono tracking-widest block mb-2">
            EVALUATION AXIS A
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-popcorn tracking-tight font-display-latin mb-3">
            {problemTitle}
          </h3>
          <p className="text-xs sm:text-sm text-popcorn-dim leading-relaxed font-normal">
            {problemDesc}
          </p>
        </div>

        {/* Disc 2: Luminous Ultra Circle (Solution / Craft Mastery) */}
        <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] rounded-full bg-gradient-to-br from-ultra/25 via-screen to-hall backdrop-blur-2xl text-popcorn p-8 sm:p-12 flex flex-col justify-center shadow-[inset_0_1px_1px_rgba(155,109,255,0.35),0_0_60px_rgba(155,109,255,0.15)] border border-ultra/40 transition-spring hover:scale-[1.02] z-20 shrink-0 -mt-20 md:-mt-0 md:-ml-24">
          <span className="text-[10px] uppercase font-bold text-marquee-soft font-mono tracking-widest block mb-2">
            EVALUATION AXIS B
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-popcorn tracking-tight font-display-latin mb-3">
            {solutionTitle}
          </h3>
          <p className="text-xs sm:text-sm text-popcorn-dim leading-relaxed font-normal">
            {solutionDesc}
          </p>

          <div className="mt-4 pt-3 border-t border-glow-line flex items-center gap-1.5 text-xs font-bold text-marquee-soft">
            <Sparkles className="w-3.5 h-3.5 text-marquee-soft" />
            <span>Audited Critical Consensus</span>
          </div>
        </div>
      </div>
    </section>
  );
}
