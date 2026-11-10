"use client";

import React from "react";
import { Sparkles, Layers } from "lucide-react";
import DotGrid from "@/components/DotGrid";

interface DualLuminousDiscsProps {
  sectionIndex?: string;
  totalSections?: string;
  categoryLabel?: string;
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
  problemTitle = "Narrative Friction",
  problemDesc = "Rooted folklore demands raw visceral authenticity without losing pacing across pan-Indian commercial boundaries.",
  solutionTitle = "Cinematic Solution",
  solutionDesc = "Dynamic anamorphic framing, tribal acoustic percussion, and grounded performances unite folklore into a national cinematic triumph.",
}: DualLuminousDiscsProps) {
  return (
    <section aria-label="Cinematic Dual Analysis" className="w-full my-12 py-8 overflow-hidden relative">
      {/* Top Chapter Index with pill indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-ink uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-press" />
          <span className="bg-surface px-2.5 py-0.5 border border-line rounded-lg shadow-sm">{categoryLabel}</span>
          <span className="text-ink-dim hidden sm:inline-block">· DUAL-AXIS AUDIT</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs font-bold text-ink">
          <span className="text-press text-base font-poster">{sectionIndex}</span>
          <span className="w-12 h-0.5 bg-line inline-block" />
          <span>{totalSections}</span>
        </div>
      </div>

      {/* Editorial Headline */}
      <div className="mt-8 mb-10 max-w-2xl relative">
        <DotGrid className="absolute -top-4 right-0 opacity-20" rows={2} cols={4} />
        <h2 className="text-3xl sm:text-4xl font-poster text-ink tracking-tight uppercase leading-tight">
          {heading}
        </h2>
      </div>

      {/* Overlapping Dual Plates */}
      <div className="relative flex flex-col md:flex-row items-center justify-center py-6 gap-6 md:gap-0">
        {/* Plate 1: Narrative Friction */}
        <div className="relative w-full max-w-[340px] rounded-2xl sm:rounded-3xl bg-sheet text-ink p-8 sm:p-10 aspect-square flex flex-col justify-center border border-line shadow-xl z-10 shrink-0 text-center hover:border-press/40 transition-all duration-300">
          <span className="text-[10px] uppercase font-mono font-bold text-press tracking-widest block mb-2 border-b border-line pb-1.5">
            EVALUATION AXIS A
          </span>
          <h3 className="text-xl sm:text-2xl font-poster text-ink tracking-tight uppercase mb-2">
            {problemTitle}
          </h3>
          <p className="text-xs sm:text-sm text-ink-dim leading-relaxed font-medium">
            {problemDesc}
          </p>
        </div>

        {/* Plate 2: Cinematic Craft Solution with Marquee Glow */}
        <div className="relative w-full max-w-[360px] rounded-2xl sm:rounded-3xl bg-surface text-ink p-8 sm:p-10 aspect-square flex flex-col justify-center border border-line shadow-2xl z-20 shrink-0 md:-ml-8 text-center hover:border-press/40 transition-all duration-300">
          <span className="text-[10px] uppercase font-mono font-bold text-violet-soft tracking-widest block mb-2 border-b border-line pb-1.5">
            EVALUATION AXIS B
          </span>
          <h3 className="text-xl sm:text-2xl font-poster text-ink tracking-tight uppercase mb-2">
            {solutionTitle}
          </h3>
          <p className="text-xs sm:text-sm text-ink-dim leading-relaxed font-medium">
            {solutionDesc}
          </p>

          <div className="mt-4 pt-3 border-t border-line flex items-center justify-center gap-1.5 text-xs font-poster uppercase text-ink">
            <Sparkles className="w-3.5 h-3.5 text-press" />
            <span>Audited Critical Consensus</span>
          </div>
        </div>
      </div>
    </section>
  );
}
