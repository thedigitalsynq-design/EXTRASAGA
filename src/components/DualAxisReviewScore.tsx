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
    <div className="w-full my-8 bg-sheet border border-line rounded-xl shadow-lg p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-line">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-surface border border-line rounded-lg flex items-center justify-center text-ink">
            <Award className="w-5 h-5 text-press" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono-tabular font-bold text-press tracking-widest block">
              EXTRA-SAAGA CRITICAL AUDIT
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-ink uppercase tracking-tight">
              Dual-Axis Review Matrix
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-ink-mute uppercase">Recommended Screen:</span>
          <span className="px-3 py-1 bg-surface text-ink font-mono-tabular font-bold text-xs border border-line rounded-lg uppercase">
            🎬 {formatRec}
          </span>
        </div>
      </div>

      {/* Dual Axis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Axis 1: Narrative & Soul */}
        <div className="p-5 bg-surface/60 border border-line rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-line/40 pb-2">
              <span className="text-xs uppercase font-bold text-ink tracking-wider flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-press" />
                <span>AXIS 1: NARRATIVE & SOUL</span>
              </span>
              <span className="text-xl font-mono-tabular font-bold text-press">
                {narrative.overall} <span className="text-xs text-ink-mute font-normal">/ 10</span>
              </span>
            </div>
            <p className="text-xs text-ink-mute font-normal mb-4 leading-relaxed">
              Screenplay structure, dialogue weight, character arcs, and emotional depth.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-ink font-medium mb-1">
                  <span>Story & Screenplay</span>
                  <span className="font-mono-tabular font-bold">{narrative.story * 10}%</span>
                </div>
                <div className="w-full h-2.5 bg-surface border border-line/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-press rounded-full transition-all duration-500"
                    style={{ width: `${narrative.story * 10}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-ink font-medium mb-1">
                  <span>Acting & Performances</span>
                  <span className="font-mono-tabular font-bold">{narrative.performances * 10}%</span>
                </div>
                <div className="w-full h-2.5 bg-surface border border-line/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-press rounded-full transition-all duration-500"
                    style={{ width: `${narrative.performances * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Axis 2: Technical Craft Index */}
        <div className="p-5 bg-surface/60 border border-line rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-line/40 pb-2">
              <span className="text-xs uppercase font-bold text-ink tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>AXIS 2: TECHNICAL CRAFT INDEX</span>
              </span>
              <span className="text-xl font-mono-tabular font-bold text-gold">
                {craft.overall} <span className="text-xs text-ink-mute font-normal">/ 10</span>
              </span>
            </div>
            <p className="text-xs text-ink-mute font-normal mb-4 leading-relaxed">
              Cinematography, background score, Atmos acoustic sound mix, VFX, and editing.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-ink font-medium mb-1">
                  <span>Cinematography & Lighting</span>
                  <span className="font-mono-tabular font-bold">{craft.cinematography * 10}%</span>
                </div>
                <div className="w-full h-2.5 bg-surface border border-line/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all duration-500"
                    style={{ width: `${craft.cinematography * 10}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-ink font-medium mb-1">
                  <span>Sound Design & Score</span>
                  <span className="font-mono-tabular font-bold">{craft.soundAndScore * 10}%</span>
                </div>
                <div className="w-full h-2.5 bg-surface border border-line/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all duration-500"
                    style={{ width: `${craft.soundAndScore * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spoiler Shield Protection */}
      <div className="mt-6 pt-5 border-t border-line">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-press" />
            <span className="text-xs font-bold text-ink uppercase tracking-wider">
              Editorial Spoiler Shield Protection
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowSpoilers(!showSpoilers)}
            className="px-3 py-1.5 bg-surface border border-line rounded-lg text-xs font-bold uppercase text-ink flex items-center gap-1.5 shadow-sm hover:border-press/50 transition-colors"
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
          className={`p-4 border border-line rounded-xl transition-all duration-300 ${
            showSpoilers
              ? "bg-surface/80 text-ink font-normal"
              : "bg-surface/30 text-ink/20 select-none blur-sm cursor-pointer"
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
