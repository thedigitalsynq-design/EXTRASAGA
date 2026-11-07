"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Sliders, Moon, Sun, Film, X } from "lucide-react";
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
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 hover:bg-gray-50 text-gray-900 border border-gray-200 backdrop-blur-xl shadow-xl hover:scale-105 active:scale-95 transition-spring group"
            aria-label="Director's Cut Theater Controls"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Film className="w-4 h-4 text-brand-crimson group-hover:rotate-45 transition-transform" />
            <span className="text-xs font-bold tracking-tight hidden sm:inline font-sans">
              Director&apos;s Cut
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
              HUD
            </span>
          </button>

          {/* Expanded Control Palette */}
          {isPanelOpen && (
            <div className="absolute bottom-14 right-0 w-72 rounded-3xl bg-white border border-gray-200 backdrop-blur-2xl p-5 shadow-2xl space-y-4 animate-fadeIn z-50">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-brand-crimson" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-gray-950 font-sans">
                    Reading Atmosphere
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPanelOpen(false)}
                  className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5">
                {/* 1. 24fps Film Grain Toggle */}
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-gray-900 block">
                      35mm Tactile Grain
                    </span>
                    <span className="text-[10px] text-gray-500 block font-normal">
                      Subtle tactile film grain
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFilmGrainActive(!isFilmGrainActive)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-1 ${isFilmGrainActive ? "bg-amber-500" : "bg-gray-300"
                      }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${isFilmGrainActive ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>

                {/* 2. Reading Focus Canvas */}
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-gray-900 block">
                      Focus Reading Canvas
                    </span>
                    <span className="text-[10px] text-gray-500 block font-normal">
                      Serene distraction-free tone
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTheaterDimActive(!isTheaterDimActive)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-1 ${isTheaterDimActive ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${isTheaterDimActive ? "translate-x-5" : "translate-x-0"
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
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#111827] hover:bg-black text-white font-bold text-xs tracking-tight shadow-md hover:shadow-lg active:scale-95 transition-spring mt-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Launch Cinema Vibe Match</span>
                </button>
              </div>

              {/* Footer Note */}
              <p className="text-[10px] text-gray-500 text-center font-mono">
                Awwwards-Tier Micro-Architecture • 60 FPS
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

