"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Moon, Film, X } from "lucide-react";
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
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-hall/90 hover:bg-screen text-popcorn border border-glow-line hover:border-ultra/40 backdrop-blur-xl shadow-xl shadow-black/50 hover:scale-105 active:scale-95 transition-spring group"
            aria-label="Projector Room Controls"
          >
            <div className="w-2 h-2 rounded-full bg-signal animate-glow-pulse" />
            <Film className="w-4 h-4 text-ultra-soft group-hover:rotate-45 transition-transform" />
            <span className="text-xs font-display-latin font-bold tracking-tight hidden sm:inline">
              Projector Room
            </span>
            <span className="text-[10px] font-display-latin font-bold px-1.5 py-0.5 rounded bg-revealed text-popcorn-muted border border-glow-line">
              HUD
            </span>
          </button>

          {/* Expanded Control Palette */}
          {isPanelOpen && (
            <div className="absolute bottom-14 right-0 w-72 rounded-3xl bg-hall/95 backdrop-blur-2xl border border-glow-line p-5 shadow-2xl shadow-black/70 space-y-4 animate-fadeIn z-50">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-glow-line">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-ultra-soft" />
                  <span className="text-[10px] font-display-latin font-extrabold uppercase tracking-[0.2em] text-popcorn">
                    House Controls
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPanelOpen(false)}
                  className="w-6 h-6 rounded-full bg-revealed hover:bg-screen text-popcorn-muted hover:text-popcorn flex items-center justify-center transition-colors text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5">
                {/* 1. 24fps Film Grain Toggle */}
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-revealed border border-glow-line hover:border-glow-line-strong transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-popcorn block">
                      35mm Tactile Grain
                    </span>
                    <span className="text-[10px] text-popcorn-muted block font-normal">
                      Analog cloth in the air
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFilmGrainActive(!isFilmGrainActive)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-1 ${isFilmGrainActive ? "bg-marquee" : "bg-glow-line"
                      }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-void transition-transform ${isFilmGrainActive ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>

                {/* 2. Late-Show Focus Canvas */}
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-revealed border border-glow-line hover:border-glow-line-strong transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-popcorn block">
                      <Moon className="w-3 h-3 inline mr-1 text-ultra-soft" />
                      Late-Show Focus
                    </span>
                    <span className="text-[10px] text-popcorn-muted block font-normal">
                      Chrome dims, screen stays on
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTheaterDimActive(!isTheaterDimActive)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-1 ${isTheaterDimActive ? "bg-ultra" : "bg-glow-line"
                      }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-void transition-transform ${isTheaterDimActive ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>

                {/* 3. Launch Cinephile Vibe Matcher */}
                <button
                  type="button"
                  onClick={() => {
                    setIsPanelOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-ultra/15 hover:bg-ultra-deep text-ultra-soft hover:text-popcorn font-display-latin font-bold text-xs tracking-tight border border-ultra/25 hover:border-ultra shadow-lg shadow-ultra/10 active:scale-95 transition-spring mt-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-ultra-soft" />
                  <span>Vibe Match</span>
                </button>
              </div>

              {/* Footer Note */}
              <p className="text-[10px] text-popcorn-muted text-center font-display-latin tracking-[0.2em] uppercase">
                Projector running · 24 fps · lights down
              </p>
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
