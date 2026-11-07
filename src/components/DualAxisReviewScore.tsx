"use client";

import React, { useState } from "react";
import { Film, Sparkles, Volume2, Video, Eye, EyeOff, ShieldCheck, Award } from "lucide-react";
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

  const formatRec = review.screenFormatRecommendation || "IMAX / Dolby Atmos";

  return (
    <div className="w-full my-8 p-1 rounded-3xl bg-hall border border-glow-line shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
      <div className="rounded-[calc(1.5rem-2px)] bg-revealed p-5 sm:p-7">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-glow-line">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-marquee-faint text-marquee-soft border border-marquee/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-marquee-soft tracking-widest font-display-latin block">
                EXTRASAGA CRITICAL EVALUATION
              </span>
              <h3 className="text-lg sm:text-xl font-black text-popcorn tracking-tight">
                Dual-Axis Review Matrix
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-popcorn-muted">Recommended Screen:</span>
            <span className="px-3 py-1 rounded-full bg-ultra-faint text-ultra-soft border border-ultra/30 font-bold text-xs shadow-[0_0_16px_rgba(155,109,255,0.2)]">
              🎬 {formatRec}
            </span>
          </div>
        </div>

        {/* Dual Axis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          {/* Axis 1: Narrative & Emotion */}
          <div className="p-5 rounded-2xl bg-hall border border-glow-line flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-extrabold text-marquee-soft tracking-widest font-display-latin flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-marquee-soft" />
                  <span>AXIS 1: NARRATIVE & SOUL</span>
                </span>
                <span className="text-xl font-black text-popcorn font-display-latin">
                  {narrative.overall} <span className="text-xs text-popcorn-muted font-normal">/ 10</span>
                </span>
              </div>
              <p className="text-xs text-popcorn-muted mb-4 leading-relaxed">
                Story, dialogue, acting performances, and emotional narrative power.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-popcorn-dim mb-1">
                    <span>Story & Screenplay</span>
                    <span className="font-bold text-popcorn font-mono-tabular">{narrative.story * 10}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-screen overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-marquee-deep to-marquee rounded-full"
                      style={{ width: `${narrative.story * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-popcorn-dim mb-1">
                    <span>Acting Performances</span>
                    <span className="font-bold text-popcorn font-mono-tabular">{narrative.performances * 10}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-screen overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-marquee-deep to-marquee rounded-full"
                      style={{ width: `${narrative.performances * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Axis 2: Technical Craft Index */}
          <div className="p-5 rounded-2xl bg-hall border border-glow-line flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-extrabold text-ultra-soft tracking-widest font-display-latin flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-ultra-soft" />
                  <span>AXIS 2: TECHNICAL CRAFT INDEX</span>
                </span>
                <span className="text-xl font-black text-popcorn font-display-latin">
                  {craft.overall} <span className="text-xs text-popcorn-muted font-normal">/ 10</span>
                </span>
              </div>
              <p className="text-xs text-popcorn-muted mb-4 leading-relaxed">
                Cinematography, background score, sound design & visual scale (VFX).
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-popcorn-dim mb-1">
                    <span>Cinematography</span>
                    <span className="font-bold text-popcorn font-mono-tabular">{craft.cinematography * 10}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-screen overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-ultra-deep to-ultra rounded-full shadow-[0_0_12px_rgba(155,109,255,0.4)]"
                      style={{ width: `${craft.cinematography * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-popcorn-dim mb-1">
                    <span>Sound & Score</span>
                    <span className="font-bold text-popcorn font-mono-tabular">{craft.soundAndScore * 10}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-screen overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-ultra-deep to-ultra rounded-full shadow-[0_0_12px_rgba(155,109,255,0.4)]"
                      style={{ width: `${craft.soundAndScore * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spoiler Shield Feature */}
        <div className="mt-6 pt-5 border-t border-glow-line">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-signal-soft" />
              <span className="text-xs font-bold text-popcorn">
                Spoiler Shield Protection
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowSpoilers(!showSpoilers)}
              className="px-3 py-1 rounded-full bg-hall hover:bg-screen text-xs font-bold text-popcorn flex items-center gap-1.5 transition-colors border border-glow-line hover:border-glow-line-strong"
            >
              {showSpoilers ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-signal-soft" />
                  <span>Hide Spoilers</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 change-positive" />
                  <span>Reveal Spoilers</span>
                </>
              )}
            </button>
          </div>

          <div
            className={`p-4 rounded-xl border transition-all duration-300 ${
              showSpoilers
                ? "bg-hall border-marquee/40 text-popcorn-dim"
                : "bg-screen border-glow-line text-transparent select-none blur-sm cursor-pointer"
            }`}
            onClick={() => !showSpoilers && setShowSpoilers(true)}
          >
            <p className="text-xs sm:text-sm leading-relaxed font-kannada">
              {review.spoilers && review.spoilers.length > 0
                ? review.spoilers.join(" ")
                : "Hidden review details on the climax twist and surprise cameo appearances are locked away here — sealed so your first theatrical viewing stays unspoiled."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
