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
      {/* Top Pagination & Chapter Index (matches design reference: 05 ——— 13) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/80">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">
          <span className="text-amber-600">◄</span>
          <span className="text-gray-900">{categoryLabel}</span>
          <span className="text-amber-600">►</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs font-bold text-gray-500">
          <span className="text-gray-950 text-sm font-black">{sectionIndex}</span>
          <span className="w-12 h-[1.5px] bg-amber-600 inline-block rounded-full"></span>
          <span>{totalSections}</span>
        </div>
      </div>

      {/* Editorial Headline */}
      <div className="mt-8 mb-10 max-w-2xl">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight font-sans">
          {heading}
        </h2>
      </div>

      {/* Overlapping Dual Discs Composition (Directly from design reference) */}
      <div className="relative flex flex-col md:flex-row items-center justify-center py-10 min-h-[380px] sm:min-h-[440px]">
        {/* Disc 1: Matte Obsidian Circle (Problem / Narrative Friction) */}
        <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full bg-gradient-to-br from-gray-900 to-black text-white p-8 sm:p-12 flex flex-col justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_25px_60px_-10px_rgba(0,0,0,0.35)] transition-spring hover:scale-[1.02] z-10 shrink-0">
          <span className="text-[10px] uppercase font-bold text-gray-400 font-mono tracking-widest block mb-2">
            EVALUATION AXIS A
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans mb-3">
            {problemTitle}
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
            {problemDesc}
          </p>
        </div>

        {/* Disc 2: Frosted Pearl Luminous Circle (Solution / Craft Mastery) */}
        <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] rounded-full bg-gradient-to-br from-white via-white/95 to-gray-50 backdrop-blur-2xl text-gray-950 p-8 sm:p-12 flex flex-col justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_30px_70px_-15px_rgba(0,0,0,0.12)] border border-gray-100 transition-spring hover:scale-[1.02] z-20 shrink-0 -mt-20 md:-mt-0 md:-ml-24">
          <span className="text-[10px] uppercase font-bold text-amber-700 font-mono tracking-widest block mb-2">
            EVALUATION AXIS B
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight font-sans mb-3">
            {solutionTitle}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
            {solutionDesc}
          </p>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs font-bold text-amber-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Audited Critical Consensus</span>
          </div>
        </div>
      </div>
    </section>
  );
}

