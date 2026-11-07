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
    <div className="w-full my-8 p-1 rounded-3xl bg-gray-100/80 border border-gray-200/90 shadow-sm">
      <div className="rounded-[calc(1.5rem-2px)] bg-white p-5 sm:p-7 shadow-2xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider font-sans block">
                FILMY GARAGE CRITICAL EVALUATION
              </span>
              <h3 className="text-lg sm:text-xl font-black text-gray-950 font-sans tracking-tight">
                Dual-Axis Review Matrix (ದ್ವಿಮುಖ ವಿಮರ್ಶಾ ಮಾಪಕ)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-gray-500 font-sans">ಶಿಫಾರಸು ಸ್ಕ್ರೀನ್:</span>
            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 font-sans font-bold text-xs shadow-2xs">
              🎬 {formatRec}
            </span>
          </div>
        </div>

        {/* Dual Axis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          {/* Axis 1: Narrative & Emotion */}
          <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-extrabold text-amber-800 tracking-wider font-sans flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-amber-700" />
                  <span>AXIS 1: NARRATIVE & SOUL</span>
                </span>
                <span className="text-xl font-black text-gray-950 font-sans">
                  {narrative.overall} <span className="text-xs text-gray-500 font-normal">/ 10</span>
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                ಕಥಾವಸ್ತು, ಸಂಭಾಷಣೆ, ನಟ-ನಟಿಯರ ಅಭಿನಯ ಮತ್ತು ಭಾವನಾತ್ಮಕ ನಿರೂಪಣಾ ಸಾಮರ್ಥ್ಯ.
              </p>

              <div className="space-y-3 text-xs font-sans">
                <div>
                  <div className="flex justify-between text-gray-700 mb-1">
                    <span>ಕಥೆ & ಚಿತ್ರಕಥೆ (Story & Screenplay)</span>
                    <span className="font-bold text-gray-950">{narrative.story * 10}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                      style={{ width: `${narrative.story * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-gray-700 mb-1">
                    <span>ಪಾತ್ರ ಚಿತ್ರಣ & ನಟನೆ (Acting Performances)</span>
                    <span className="font-bold text-gray-950">{narrative.performances * 10}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                      style={{ width: `${narrative.performances * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Axis 2: Technical Craft Index */}
          <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-extrabold text-cyan-800 tracking-wider font-sans flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
                  <span>AXIS 2: TECHNICAL CRAFT INDEX</span>
                </span>
                <span className="text-xl font-black text-gray-950 font-sans">
                  {craft.overall} <span className="text-xs text-gray-500 font-normal">/ 10</span>
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                ಛಾಯಾಗ್ರಹಣ (Camera), ಹಿನ್ನೆಲೆ ಸಂಗೀತ, ಶಬ್ದ ಗ್ರಹಣ ಮತ್ತು ದೃಶ್ಯ ವೈಭವ (VFX).
              </p>

              <div className="space-y-3 text-xs font-sans">
                <div>
                  <div className="flex justify-between text-gray-700 mb-1">
                    <span>ಛಾಯಾಗ್ರಹಣ (Cinematography)</span>
                    <span className="font-bold text-gray-950">{craft.cinematography * 10}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full"
                      style={{ width: `${craft.cinematography * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-gray-700 mb-1">
                    <span>ಹಿನ್ನೆಲೆ ಸಂಗೀತ & ಸೌಂಡ್ (Sound & Score)</span>
                    <span className="font-bold text-gray-950">{craft.soundAndScore * 10}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full"
                      style={{ width: `${craft.soundAndScore * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spoiler Shield Feature */}
        <div className="mt-6 pt-5 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-gray-900 font-sans">
                ಇಂಟರ್ಯಾಕ್ಟಿವ್ ಸ್ಪಾಯ್ಲರ್ ಶೀಲ್ಡ್ (Spoiler Shield Protection)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowSpoilers(!showSpoilers)}
              className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-sans font-bold text-gray-900 flex items-center gap-1.5 transition-colors border border-gray-200"
            >
              {showSpoilers ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>ಸ್ಪಾಯ್ಲರ್ ಮರೆಮಾಡಿ (Hide Spoilers)</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ಸ್ಪಾಯ್ಲರ್ ವೀಕ್ಷಿಸಿ (Reveal Spoilers)</span>
                </>
              )}
            </button>
          </div>

          <div
            className={`p-4 rounded-xl border transition-all duration-300 ${
              showSpoilers
                ? "bg-amber-50/70 border-amber-200 text-gray-800"
                : "bg-gray-100 border-gray-200 text-transparent select-none blur-sm cursor-pointer"
            }`}
            onClick={() => !showSpoilers && setShowSpoilers(true)}
          >
            <p className="text-xs sm:text-sm leading-relaxed font-kannada">
              {review.spoilers && review.spoilers.length > 0
                ? review.spoilers.join(" ")
                : "ಕ್ಲೈಮ್ಯಾಕ್ಸ್ ಟ್ವಿಸ್ಟ್ ಹಾಗೂ ವಿಶೇಷ ಅತಿಥಿ ಪಾತ್ರಗಳ ಕುರಿತು ಗೌಪ್ಯ ವಿಮರ್ಶಾ ವಿವರಗಳು ಇಲ್ಲಿ ಅಡಕವಾಗಿವೆ. ಮೊದಲ ಬಾರಿಗೆ ಚಿತ್ರಮಂದಿರದಲ್ಲಿ ವೀಕ್ಷಿಸುವ ಅನುಭವವನ್ನು ಹಾಳುಮಾಡದಂತೆ ರಕ್ಷಿಸಲಾಗಿದೆ."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

