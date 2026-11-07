"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Sparkles, Film, ArrowRight, RotateCcw, Clapperboard, Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CinephileDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CinephileDiscoveryModal({
  isOpen,
  onClose,
}: CinephileDiscoveryModalProps) {
  const { language, config, localizeUrl } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  // Selections
  const [selectedMood, setSelectedMood] = useState<string>("spectacle");
  const [selectedFormat, setSelectedFormat] = useState<string>("theatre");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("sandalwood");

  if (!isOpen) return null;

  const totalSteps = 3;

  const questions = [
    {
      stepLabel: "QUESTION 01",
      title: "What cinema mood are you craving tonight?",
      subtitle: "SELECT ONLY ONE",
      options: [
        {
          id: "spectacle",
          label: "Adrenaline & Spectacle",
          desc: "Massive scale, high-stakes action & jaw-dropping VFX",
        },
        {
          id: "cerebral",
          label: "Cerebral Mystery & Suspense",
          desc: "Neo-noir, psychological twists & intellectual grit",
        },
        {
          id: "soulful",
          label: "Rooted Drama & Emotional Depth",
          desc: "Folkloric storytelling, family sagas & poignant performances",
        },
        {
          id: "escapism",
          label: "Pure Escapism & Celebration",
          desc: "Wholesome comedy, musical energy & feel-good vibes",
        },
      ],
      selected: selectedMood,
      onChange: (val: string) => setSelectedMood(val),
    },
    {
      stepLabel: "QUESTION 02",
      title: "Where would you like to watch?",
      subtitle: "SELECT ONLY ONE",
      options: [
        {
          id: "theatre",
          label: "Theatrical Big Screen (IMAX / Dolby Atmos)",
          desc: "First-day experience in full cinematic sound & scale",
        },
        {
          id: "ott",
          label: "OTT Streaming from Home",
          desc: "Curated 4K HDR releases on Netflix, Prime, ZEE5",
        },
        {
          id: "retro",
          label: "Golden Era Archive & Cult Classics",
          desc: "Restored masterpieces and legendary performances",
        },
      ],
      selected: selectedFormat,
      onChange: (val: string) => setSelectedFormat(val),
    },
    {
      stepLabel: "QUESTION 03",
      title: "Which film industry inspires you today?",
      subtitle: "SELECT ONLY ONE",
      options: [
        {
          id: "sandalwood",
          label: "Sandalwood (Kannada Cinema)",
          desc: "Home of Kantara, Toxic, KGF & rooted narrative epics",
        },
        {
          id: "tollywood",
          label: "Tollywood (Telugu Cinema)",
          desc: "Pan-Indian grandiosity, Kalki 2898 AD & Pushpa 2",
        },
        {
          id: "kollywood",
          label: "Kollywood (Tamil Cinema)",
          desc: "Gritty realism, Coolie, Vettaiyan & auteur craft",
        },
        {
          id: "mollywood",
          label: "Mollywood (Malayalam Cinema)",
          desc: "Unmatched scriptwriting, Manjummel Boys & Aavesham",
        },
        {
          id: "bollywood",
          label: "Bollywood (Hindi Cinema)",
          desc: "Grand mythologies, Ramayana Part 1 & War 2",
        },
        {
          id: "hollywood",
          label: "Hollywood & Global Cinema",
          desc: "Auteur masterworks, Dune 3, Avatar & Christopher Nolan",
        },
      ],
      selected: selectedIndustry,
      onChange: (val: string) => setSelectedIndustry(val),
    },
  ];

  // Dynamic recommendation based on answers
  const getRecommendation = () => {
    if (selectedIndustry === "sandalwood" || selectedMood === "soulful") {
      return {
        title: "Kantara: Chapter 1",
        industry: "Sandalwood",
        status: "In Theatres / Pre-Release Radar",
        director: "Rishab Shetty",
        verdict: "Essential Mythological Masterpiece",
        rating: "4.9 / 5.0",
        slug: "/news/kantara-chapter-1-shooting-kundapura-rishab-shetty-look",
        summary:
          "Matched for your love of rooted storytelling and breathtaking visceral spectacle. Rishab Shetty brings Kadamba-era folklore to life.",
      };
    }
    if (selectedMood === "cerebral" || selectedIndustry === "kollywood") {
      return {
        title: "Coolie & RangiTaranga Archive",
        industry: selectedIndustry.toUpperCase(),
        status: "Curated Theatrical / Streaming",
        director: "Lokesh Kanagaraj / Anup Bhandari",
        verdict: "Must-Watch Suspense Thriller",
        rating: "4.8 / 5.0",
        slug: "/reviews/kantara-chapter-1-first-look-breakdown-analysis",
        summary:
          "Matched for your analytical taste in high-stakes mystery, technical cinematography, and edge-of-the-seat tension.",
      };
    }
    return {
      title: "Ramayana: Part 1",
      industry: "Pan-India / Bollywood",
      status: "National Cultural Monument",
      director: "Nitesh Tiwari",
      verdict: "Revered Cinematic Milestone (Part 1)",
      rating: "Historic Reverence",
      slug: "/reviews/ramayana-part-1-ranbir-kapoor-yash-first-look-analysis",
      summary:
        "The definitive Indian cultural cinematic epic crafted with zero sensationalism and uncompromised dignity.",
    };
  };

  const rec = getRecommendation();
  const q = questions[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-void/80 backdrop-blur-sm animate-fadeIn">
      {/* Background Dim click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Layered Card Container (dark glass stack) */}
      <div className="relative w-full max-w-lg">
        {/* Layered Under-Cards for Card Stack Effect */}
        <div className="absolute inset-0 bg-screen/90 rounded-3xl translate-y-2 scale-[0.98] -rotate-1 pointer-events-none border border-glow-line" />
        <div className="absolute inset-0 bg-revealed rounded-3xl translate-y-1 scale-[0.99] rotate-1 pointer-events-none border border-glow-line" />

        {/* Main Card (Dark Glass) */}
        <div className="relative rounded-3xl bg-hall/95 backdrop-blur-2xl border border-glow-line text-popcorn p-6 sm:p-8 shadow-2xl flex flex-col min-h-[460px] justify-between z-10">
          {/* Top Bar: Progress Dashes & Close Button */}
          <div>
            <div className="flex items-center justify-between pb-6">
              {/* Segmented Progress Dashes */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {[0, 1, 2].map((stepIdx) => (
                  <div
                    key={stepIdx}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      currentStep === stepIdx
                        ? "w-8 bg-signal animate-glow-pulse"
                        : currentStep > stepIdx
                        ? "w-8 bg-ultra"
                        : "w-8 bg-glow-line"
                    }`}
                  />
                ))}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-screen hover:bg-signal-deep text-popcorn-dim hover:text-popcorn flex items-center justify-center transition-spring text-sm border border-glow-line"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Question Screen */}
            {currentStep < totalSteps ? (
              <div className="space-y-4">
                {/* Step Pill */}
                <span className="text-[11px] font-bold tracking-widest text-popcorn-muted font-mono uppercase block">
                  {q.stepLabel}
                </span>

                {/* Headline */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-popcorn tracking-tight leading-snug font-display-latin">
                  {q.title}
                </h3>

                {/* Select Only One helper */}
                <p className="text-[10px] font-bold tracking-widest text-signal-soft font-mono uppercase">
                  {q.subtitle}
                </p>

                {/* Options List */}
                <div className="space-y-2.5 pt-2">
                  {q.options.map((opt) => {
                    const isSelected = q.selected === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => q.onChange(opt.id)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-spring flex items-start gap-3.5 group ${
                          isSelected
                            ? "bg-screen border-signal ring-1 ring-signal/40 shadow-[0_0_20px_rgba(255,46,80,0.15)]"
                            : "bg-revealed border-glow-line hover:border-glow-line-strong hover:bg-screen/50"
                        }`}
                      >
                        {/* Radio Circle */}
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                            isSelected
                              ? "border-signal bg-signal-deep text-popcorn"
                              : "border-glow-line-strong group-hover:border-popcorn-muted"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-popcorn" />
                          )}
                        </div>

                        {/* Label & Description */}
                        <div>
                          <div className="text-sm font-bold text-popcorn">
                            {opt.label}
                          </div>
                          <div className="text-xs text-popcorn-muted mt-0.5 font-normal leading-relaxed">
                            {opt.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Recommendation Screen (Result) */
              <div className="space-y-4 py-2 animate-fadeIn">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ultra-faint border border-ultra/30 text-ultra-soft text-xs font-bold font-mono uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-ultra-soft" />
                  <span>Cinephile Match Verified</span>
                </div>

                <h3 className="text-2xl font-black text-popcorn font-display-latin">
                  {rec.title}
                </h3>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-hall text-popcorn-dim font-bold uppercase font-mono border border-glow-line">
                    {rec.industry}
                  </span>
                  <span className="text-popcorn-muted">•</span>
                  <span className="text-marquee-soft font-semibold">{rec.status}</span>
                </div>

                <div className="p-4 rounded-2xl bg-screen border border-glow-line text-xs text-popcorn-dim space-y-2">
                  <p className="leading-relaxed font-normal">{rec.summary}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-glow-line text-popcorn-muted">
                    <span>Director: <strong className="text-popcorn">{rec.director}</strong></span>
                    <span className="font-bold text-marquee-soft font-mono-tabular">{rec.rating}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={localizeUrl(rec.slug)}
                    onClick={onClose}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-signal-deep hover:bg-signal text-popcorn font-bold text-sm tracking-tight transition-spring shadow-[0_0_28px_rgba(255,46,80,0.25)]"
                  >
                    <span>Read Full Editorial Dossier</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          {currentStep < totalSteps ? (
            <div className="flex items-center justify-between pt-6 border-t border-glow-line mt-6">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => s - 1)}
                  className="text-xs font-bold text-popcorn-dim hover:text-popcorn tracking-wide uppercase font-mono transition-colors"
                >
                  Back
                </button>
              ) : (
                <span />
              )}

              {/* Next Button (marquee gold pill) */}
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s + 1)}
                className="px-6 py-2.5 rounded-2xl bg-marquee hover:bg-marquee-soft text-void text-xs sm:text-sm font-extrabold tracking-tight shadow-[0_0_24px_rgba(255,176,32,0.3)] active:scale-95 transition-spring flex items-center gap-1.5"
              >
                <span>{currentStep === totalSteps - 1 ? "Discover Match" : "Next"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-4 border-t border-glow-line mt-4">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(0);
                }}
                className="text-xs font-bold text-popcorn-dim hover:text-popcorn inline-flex items-center gap-1.5 font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start Over</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-popcorn hover:underline"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
