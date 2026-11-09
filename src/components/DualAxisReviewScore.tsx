"use client";

import React, { useState } from "react";
import { Film, Sparkles, ShieldCheck, Award, Eye, EyeOff } from "lucide-react";
import { MovieReview } from "@/types";

interface DualAxisReviewScoreProps {
  review: MovieReview;
}

export default function DualAxisReviewScore({ review }: DualAxisReviewScoreProps) {
  const [showSpoilers, setShowSpoilers] = useState(false);

  const narrative = review.narrativeScore || {
    overall: 8.4,
    story: 8.5,
    screenplay: 8.0,
    performances: 8.8,
  };

  const craft = review.craftScore || {
    overall: 9.1,
    cinematography: 9.2,
    soundAndScore: 9.4,
    vfxAndProduction: 8.8,
    editing: 8.9,
  };

  const formatRec = review.screenFormatRecommendation || "IMAX 70mm / Dolby Atmos";

  return (
    <div className="w-full my-8 bg-sheet border-2 border-ink shadow-press p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-ink">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-band border-2 border-ink flex items-center justify-center text-ink shadow-sticker">
            <Award className="w-5 h-5 text-press" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono-tabular font-black text-press tracking-widest block">
              EXTRASAGA CRITICAL AUDIT
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-ink uppercase tracking-tight">
              Dual-Axis Review Matrix
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold text-ink-mute uppercase">Recommended Screen:</span>
          <span className="px-3 py-1 bg-band text-ink font-mono-tabular font-black text-xs border-2 border-ink shadow-sticker uppercase">
            🎬 {formatRec}
          </span>
        </div>
      </div>

      {/* Dual Axis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Axis 1: Narrative & Soul */}
        <div className="p-5 bg-paper border-2 border-ink shadow-sticker flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-ink/20 pb-2">
              <span className="text-xs uppercase font-black text-ink tracking-wider flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-press" />
                <span>AXIS 1: NARRATIVE & SOUL</span>
              </span>
              <span className="text-xl font-mono-tabular font-black text-press">
                {narrative.overall} <span className="text-xs text-ink-mute font-bold">/ 10</span>
              </span>
            </div>
            <p className="text-xs text-ink-mute font-medium mb-4 leading-relaxed">
              Screenplay structure, dialogue weight, character arcs, and emotional depth.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-ink font-bold mb-1">
                  <span>Story & Screenplay</span>
                  <span className="font-mono-tabular font-black">{narrative.story * 10}%</span>
                </div>
                <div className="w-full h-2.5 bg-band border border-ink overflow-hidden">
                  <div
                    className="h-full bg-press"
                    style={{ width: `${narrative.story * 10}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-ink font-bold mb-1">
                  <span>Acting & Performances</span>
                  <span className="font-mono-tabular font-black">{narrative.performances * 10}%</span>
                </div>
                <div className="w-full h-2.5 bg-band border border-ink overflow-hidden">
                  <div
                    className="h-full bg-press"
                    style={{ width: `${narrative.performances * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Axis 2: Technical Craft Index */}
        <div className="p-5 bg-paper border-2 border-ink shadow-sticker flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-ink/20 pb-2">
              <span className="text-xs uppercase font-black text-ink tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-soft" />
                <span>AXIS 2: TECHNICAL CRAFT INDEX</span>
              </span>
              <span className="text-xl font-mono-tabular font-black text-violet-soft">
                {craft.overall} <span className="text-xs text-ink-mute font-bold">/ 10</span>
              </span>
            </div>
            <p className="text-xs text-ink-mute font-medium mb-4 leading-relaxed">
              Cinematography, background score, Atmos acoustic sound mix, VFX, and editing.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-ink font-bold mb-1">
                  <span>Cinematography & Lighting</span>
                  <span className="font-mono-tabular font-black">{craft.cinematography * 10}%</span>
                </div>
                <div className="w-full h-2.5 bg-band border border-ink overflow-hidden">
                  <div
                    className="h-full bg-violet"
                    style={{ width: `${craft.cinematography * 10}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-ink font-bold mb-1">
                  <span>Sound Design & Score</span>
                  <span className="font-mono-tabular font-black">{craft.soundAndScore * 10}%</span>
                </div>
                <div className="w-full h-2.5 bg-band border border-ink overflow-hidden">
                  <div
                    className="h-full bg-violet"
                    style={{ width: `${craft.soundAndScore * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spoiler Shield Protection */}
      <div className="mt-6 pt-5 border-t-2 border-ink">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-press" />
            <span className="text-xs font-black text-ink uppercase tracking-wider">
              Editorial Spoiler Shield Protection
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowSpoilers(!showSpoilers)}
            className="px-3 py-1 bg-paper border-2 border-ink text-xs font-black uppercase text-ink flex items-center gap-1.5 shadow-sticker btn-press-interactive"
          >
            {showSpoilers ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-press" />
                <span>Hide Spoilers</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-ink" />
                <span>Reveal Climax Notes</span>
              </>
            )}
          </button>
        </div>

        <div
          className={`p-4 border-2 border-ink transition-all duration-300 ${
            showSpoilers
              ? "bg-band text-ink font-medium"
              : "bg-paper text-ink/20 select-none blur-sm cursor-pointer"
          }`}
          onClick={() => !showSpoilers && setShowSpoilers(true)}
        >
          <p className="text-sm leading-relaxed">
            {review.spoilers && review.spoilers.length > 0
              ? review.spoilers.join(" ")
              : "Critical notes regarding key narrative twists, intermission reveals, and climax resolutions are held behind this shield so your first theatrical experience remains unspoiled."}
          </p>
        </div>
      </div>
    </div>
  );
}
