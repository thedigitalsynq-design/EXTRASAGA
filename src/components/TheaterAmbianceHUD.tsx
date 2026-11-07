"use client";

import React, { useState, useEffect } from "react";
import { Moon, Film, X } from "lucide-react";
import CinephileDiscoveryModal from "@/components/CinephileDiscoveryModal";

export default function TheaterAmbianceHUD() {
  const [isFilmGrainActive, setIsFilmGrainActive] = useState(false);
  const [isTheaterDimActive, setIsTheaterDimActive] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isFilmGrainActive) {
      document.body.classList.add("film-grain-active");
    } else {
      document.body.classList.remove("film-grain-active");
    }

    if (isTheaterDimActive) {
      document.body.classList.add("theater-dim-active");
    } else {
      document.body.classList.remove("theater-dim-active");
    }
  }, [isFilmGrainActive, isTheaterDimActive]);

  return (
    <>
      {/* Floating HUD Pill (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <div className="relative">
          {/* Main Floating Trigger Button */}
          <button
            type="button"
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-ink text-paper hover:bg-press border-2 border-ink shadow-press active:translate-x-0.5 active:translate-y-0.5 transition-all group"
            aria-label="Press Room Controls"
          >
            <div className="w-2 h-2 bg-press animate-ping" />
            <Film className="w-4 h-4 text-marquee group-hover:rotate-45 transition-transform" />
            <span className="text-xs font-poster uppercase tracking-wider hidden sm:inline">
              PRESS ROOM HUD
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-sheet text-ink border border-ink">
              CTRL
            </span>
          </button>

          {/* Expanded Control Palette */}
          {isPanelOpen && (
            <div className="absolute bottom-14 right-0 w-72 bg-sheet border-2 border-ink p-5 shadow-press space-y-4 animate-fadeIn z-50">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-press" />
                  <span className="text-xs font-poster uppercase tracking-wider text-ink">
                    PRINT ROOM CONTROLS
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPanelOpen(false)}
                  className="w-6 h-6 bg-band hover:bg-press hover:text-paper text-ink border border-ink flex items-center justify-center transition-colors text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5">
                {/* 1. 35mm Tactile Grain Toggle */}
                <div className="flex items-center justify-between p-2.5 bg-paper border-2 border-ink">
                  <div className="space-y-0.5">
                    <span className="text-xs font-grotesk font-bold text-ink block">
                      35mm Tactile Grain
                    </span>
                    <span className="text-[10px] text-ink-mute block font-mono">
                      Analog print plate
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFilmGrainActive(!isFilmGrainActive)}
                    className={`w-11 h-6 border-2 border-ink transition-colors relative p-0.5 ${
                      isFilmGrainActive ? "bg-marquee" : "bg-band"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-ink transition-transform ${
                        isFilmGrainActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* 2. Late-Show Focus Canvas */}
                <div className="flex items-center justify-between p-2.5 bg-paper border-2 border-ink">
                  <div className="space-y-0.5">
                    <span className="text-xs font-grotesk font-bold text-ink block">
                      <Moon className="w-3 h-3 inline mr-1 text-violet" />
                      Late-Show Canvas
                    </span>
                    <span className="text-[10px] text-ink-mute block font-mono">
                      Night press run (#17140F)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTheaterDimActive(!isTheaterDimActive)}
                    className={`w-11 h-6 border-2 border-ink transition-colors relative p-0.5 ${
                      isTheaterDimActive ? "bg-violet" : "bg-band"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-ink transition-transform ${
                        isTheaterDimActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* 3. Cinephile Discovery Modal Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setIsPanelOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 bg-ink text-paper hover:bg-press border-2 border-ink shadow-sticker font-poster text-xs uppercase tracking-wider transition-all mt-2"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Interactive Vibe Matcher</span>
                </button>
              </div>

              {/* Status Footer */}
              <div className="pt-2 border-t border-line flex items-center justify-between text-[9px] font-mono text-ink-mute">
                <span>HOUSE FULL PRESS v4.0</span>
                <span>DESK ENGINE ACTIVE</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cinephile Discovery Modal */}
      <CinephileDiscoveryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
