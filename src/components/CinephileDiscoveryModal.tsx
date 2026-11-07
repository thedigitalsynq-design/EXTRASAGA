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
          label: "Sandalwood (ಕನ್ನಡ ಸಿನಿಮಾ)",
          desc: "Home of Kantara, Toxic, KGF & rooted narrative epics",
        },
        {
          id: "tollywood",
          label: "Tollywood (తెలుగు సినిమా)",
          desc: "Pan-Indian grandiosity, Kalki 2898 AD & Pushpa 2",
        },
        {
          id: "kollywood",
          label: "Kollywood (தமிழ் சினிமா)",
          desc: "Gritty realism, Coolie, Vettaiyan & auteur craft",
        },
        {
          id: "mollywood",
          label: "Mollywood (മലയാളം സിനിമ)",
          desc: "Unmatched scriptwriting, Manjummel Boys & Aavesham",
        },
        {
          id: "bollywood",
          label: "Bollywood (हिन्दी सिनेमा)",
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
        title: "ಕಾಂತಾರ: ಚಾಪ್ಟರ್ 1 (Kantara: Chapter 1)",
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
        title: "ಕೂಲಿ (Coolie) & ರಂಗಿತರಂಗ (RangiTaranga Archive)",
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
      title: "ರಾಮಾಯಣ: ಭಾಗ 1 (Ramayana: Part 1)",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-fadeIn">
      {/* Background Dim click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Layered Card Container (matches design reference) */}
      <div className="relative w-full max-w-lg">
        {/* Layered Under-Cards for Card Stack Effect */}
        <div className="absolute inset-0 bg-gray-200/90 rounded-3xl translate-y-2 scale-[0.98] -rotate-1 pointer-events-none shadow-sm" />
        <div className="absolute inset-0 bg-gray-100 rounded-3xl translate-y-1 scale-[0.99] rotate-1 pointer-events-none shadow-xs" />

        {/* Main Card (Clean Minimalist Aesthetic) */}
        <div className="relative rounded-3xl bg-white text-gray-950 p-6 sm:p-8 shadow-2xl border border-gray-100 flex flex-col min-h-[460px] justify-between z-10">
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
                        ? "w-8 bg-gray-950"
                        : currentStep > stepIdx
                        ? "w-8 bg-emerald-500"
                        : "w-8 bg-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-950 flex items-center justify-center transition-spring text-sm"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Question Screen */}
            {currentStep < totalSteps ? (
              <div className="space-y-4">
                {/* Step Pill */}
                <span className="text-[11px] font-bold tracking-widest text-gray-400 font-mono uppercase block">
                  {q.stepLabel}
                </span>

                {/* Headline */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-950 tracking-tight leading-snug font-sans">
                  {q.title}
                </h3>

                {/* Select Only One helper */}
                <p className="text-[10px] font-bold tracking-widest text-gray-400 font-mono uppercase">
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
                            ? "bg-gray-50 border-gray-950 ring-1 ring-gray-950 shadow-sm"
                            : "bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50/50"
                        }`}
                      >
                        {/* Radio Circle */}
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                            isSelected
                              ? "border-gray-950 bg-gray-950 text-white"
                              : "border-gray-300 group-hover:border-gray-400"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>

                        {/* Label & Description */}
                        <div>
                          <div className="text-sm font-bold text-gray-950 font-sans">
                            {opt.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 font-normal leading-relaxed">
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
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold font-mono uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cinephile Match Verified</span>
                </div>

                <h3 className="text-2xl font-black text-gray-950 font-sans">
                  {rec.title}
                </h3>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 font-bold uppercase font-mono">
                    {rec.industry}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-emerald-700 font-semibold">{rec.status}</span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-2">
                  <p className="leading-relaxed font-normal">{rec.summary}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-gray-600">
                    <span>Director: <strong className="text-gray-900">{rec.director}</strong></span>
                    <span className="font-bold text-gray-900">{rec.rating}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={localizeUrl(rec.slug)}
                    onClick={onClose}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gray-950 hover:bg-gray-800 text-white font-bold text-sm tracking-tight transition-spring shadow-lg"
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
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => s - 1)}
                  className="text-xs font-bold text-gray-600 hover:text-gray-950 tracking-wide uppercase font-mono transition-colors"
                >
                  Back
                </button>
              ) : (
                <span />
              )}

              {/* Next Button (Vibrant Pill lime matching reference) */}
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s + 1)}
                className="px-6 py-2.5 rounded-2xl bg-[#9ef06a] hover:bg-[#8ee058] text-gray-950 text-xs sm:text-sm font-extrabold tracking-tight shadow-md hover:shadow-lg active:scale-95 transition-spring font-sans flex items-center gap-1.5"
              >
                <span>{currentStep === totalSteps - 1 ? "Discover Match" : "Next"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(0);
                }}
                className="text-xs font-bold text-gray-600 hover:text-gray-950 inline-flex items-center gap-1.5 font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start Over</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-gray-900 hover:underline"
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

