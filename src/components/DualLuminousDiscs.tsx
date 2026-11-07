"use client";

import React from "react";
import { Sparkles } from "lucide-react";

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
    <section aria-label="Cinematic Dual Analysis" className="w-full my-12 py-8 overflow-hidden">
      {/* Top Chapter Index */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-ink">
        <div className="flex items-center gap-2 text-xs font-mono-tabular font-black text-ink uppercase tracking-widest">
          <span className="text-poster-red">◄</span>
          <span className="bg-band px-2 py-0.5 border border-ink shadow-sticker">{categoryLabel}</span>
          <span className="text-poster-red">►</span>
        </div>

        <div className="flex items-center gap-3 font-mono-tabular text-xs font-bold text-ink">
          <span className="text-poster-red text-base font-black">{sectionIndex}</span>
          <span className="w-12 h-0.5 bg-ink inline-block" />
          <span>{totalSections}</span>
        </div>
      </div>

      {/* Editorial Headline */}
      <div className="mt-8 mb-10 max-w-2xl">
        <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight uppercase leading-tight">
          {heading}
        </h2>
      </div>

      {/* Overlapping Dual Broadsheet Plates */}
      <div className="relative flex flex-col md:flex-row items-center justify-center py-6 gap-6 md:gap-0">
        {/* Plate 1: Narrative Friction */}
        <div className="relative w-full max-w-[340px] rounded-full sm:rounded-full bg-paper text-ink p-8 sm:p-10 aspect-square flex flex-col justify-center border-2 border-ink shadow-press card-press-interactive z-10 shrink-0 text-center">
          <span className="text-[10px] uppercase font-mono-tabular font-black text-poster-red tracking-widest block mb-2 border-b border-ink/20 pb-1">
            EVALUATION AXIS A
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-ink tracking-tight uppercase mb-2">
            {problemTitle}
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-medium">
            {problemDesc}
          </p>
        </div>

        {/* Plate 2: Cinematic Craft Solution */}
        <div className="relative w-full max-w-[360px] rounded-full sm:rounded-full bg-band text-ink p-8 sm:p-10 aspect-square flex flex-col justify-center border-2 border-ink shadow-press card-press-interactive z-20 shrink-0 md:-ml-8 text-center">
          <span className="text-[10px] uppercase font-mono-tabular font-black text-poster-violet tracking-widest block mb-2 border-b border-ink/20 pb-1">
            EVALUATION AXIS B
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-ink tracking-tight uppercase mb-2">
            {solutionTitle}
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-medium">
            {solutionDesc}
          </p>

          <div className="mt-3 pt-2 border-t border-ink/30 flex items-center justify-center gap-1.5 text-xs font-black uppercase text-ink">
            <Sparkles className="w-3.5 h-3.5 text-poster-red" />
            <span>Audited Critical Consensus</span>
          </div>
        </div>
      </div>
    </section>
  );
}
