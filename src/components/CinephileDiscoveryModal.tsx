"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Sparkles, ArrowRight, RotateCcw } from "lucide-react";

interface CinephileDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CinephileDiscoveryModal({
  isOpen,
  onClose,
}: CinephileDiscoveryModalProps) {
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
          label: "Adrenaline & High Spectacle",
          desc: "Massive scale, high-stakes action & jaw-dropping VFX choreography",
        },
        {
          id: "cerebral",
          label: "Cerebral Mystery & Suspense",
          desc: "Neo-noir, psychological twists & intellectual storytelling grit",
        },
        {
          id: "soulful",
          label: "Rooted Drama & Cultural Resonance",
          desc: "Indigenous folklore, family sagas & profound performances",
        },
        {
          id: "escapism",
          label: "Pure Escapism & Celebration",
          desc: "Wholesome comedy, musical energy & feel-good commercial entertainment",
        },
      ],
      selected: selectedMood,
      onChange: (val: string) => setSelectedMood(val),
    },
    {
      stepLabel: "QUESTION 02",
      title: "Where do you want to experience it?",
      subtitle: "SELECT ONLY ONE",
      options: [
        {
          id: "theatre",
          label: "Theatrical Big Screen (IMAX 70mm / Dolby Atmos)",
          desc: "First-day experience in full cinematic sound & visual scale",
        },
        {
          id: "ott",
          label: "OTT Digital Streaming from Home",
          desc: "Curated 4K HDR releases on Netflix, Prime, ZEE5, Hotstar",
        },
        {
          id: "retro",
          label: "Golden Era Archive & Cult Classics",
          desc: "Restored masterpieces and legendary performances in 4K",
        },
      ],
      selected: selectedFormat,
      onChange: (val: string) => setSelectedFormat(val),
    },
    {
      stepLabel: "QUESTION 03",
      title: "Which film industry inspires you right now?",
      subtitle: "SELECT ONLY ONE",
      options: [
        {
          id: "sandalwood",
          label: "Sandalwood (Kannada Cinema)",
          desc: "Home of Kantara, Toxic, KGF & rooted folkloric narrative epics",
        },
        {
          id: "tollywood",
          label: "Tollywood (Telugu Cinema)",
          desc: "Pan-Indian grandiosity, Kalki 2898 AD & Pushpa 2",
        },
        {
          id: "kollywood",
          label: "Kollywood (Tamil Cinema)",
          desc: "Grounded character writing, Jailer, Coolie & intense auteur craft",
        },
        {
          id: "bollywood",
          label: "Bollywood (Hindi Cinema)",
          desc: "Grand scale spectacles, War 2, Alpha & cultural epics like Ramayana",
        },
        {
          id: "mollywood",
          label: "Mollywood (Malayalam Cinema)",
          desc: "Peerless realism, world-class screenplays & technical mastery",
        },
      ],
      selected: selectedIndustry,
      onChange: (val: string) => setSelectedIndustry(val),
    },
  ];

  const q = questions[currentStep];

  // Recommendations calculation
  const getRecommendation = () => {
    if (selectedMood === "soulful" || selectedIndustry === "sandalwood") {
      return {
        title: "Kantara: Chapter 1",
        industry: "Sandalwood",
        status: "Coming to Theatres October 2026",
        director: "Rishab Shetty",
        rating: "Most Anticipated",
        summary:
          "The mythical prequel diving into the ancient origins of the Panjurli folklore. Shot in IMAX with intense traditional action.",
        slug: "/news/kantara-chapter-1-shooting-kundapura-rishab-shetty-look",
      };
    }
    if (selectedMood === "spectacle") {
      return {
        title: "Toxic: A Fairy Tale for Grown-ups",
        industry: "Sandalwood / Pan-India",
        status: "In Theatres 2026",
        director: "Geetu Mohandas",
        rating: "High-Octane Masterpiece",
        summary:
          "Rocking Star Yash returns in an international gangster drama set against the retro drug cartel underworld of 1970s coastal India.",
        slug: "/news/toxic-rocking-star-yash-geetu-mohandas-release-date-censor",
      };
    }
    return {
      title: "Ramayana: Part 1",
      industry: "Pan-Indian / Bollywood",
      status: "Diwali 2026 Worldwide",
      director: "Nitesh Tiwari",
      rating: "Cultural Monument",
      summary:
        "The definitive cinematic retelling featuring Ranbir Kapoor as Lord Rama, Sai Pallavi as Mata Sita, and Yash as Ravana in IMAX 70mm.",
      slug: "/reviews/ramayana-part-1-ranbir-kapoor-yash-first-look-analysis",
    };
  };

  const rec = getRecommendation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md font-sans animate-in fade-in duration-200">
      {/* Background Dim click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Ticket Stack Card */}
      <div className="relative w-full max-w-lg z-10">
        <div className="bg-sheet border border-line rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col min-h-[480px] justify-between">
          {/* Top Bar: Progress Dashes & Close Button */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-line mb-6">
              {/* Segmented Progress Dashes */}
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((stepIdx) => (
                  <div
                    key={stepIdx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentStep === stepIdx
                        ? "w-10 bg-press"
                        : currentStep > stepIdx
                        ? "w-10 bg-surface border border-line"
                        : "w-10 bg-surface/40"
                    }`}
                  />
                ))}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 bg-surface hover:bg-surface/80 text-ink flex items-center justify-center border border-line rounded-lg text-sm transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Question Screen */}
            {currentStep < totalSteps ? (
              <div className="space-y-4">
                <span className="text-[11px] font-bold tracking-widest text-press font-mono-tabular uppercase block">
                  {q.stepLabel}
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-ink uppercase tracking-tight leading-snug">
                  {q.title}
                </h3>

                <p className="text-[10px] font-semibold tracking-widest text-ink-mute font-mono-tabular uppercase">
                  {q.subtitle}
                </p>

                {/* Options List */}
                <div className="space-y-2.5 pt-1">
                  {q.options.map((opt) => {
                    const isSelected = q.selected === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => q.onChange(opt.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                          isSelected
                            ? "bg-surface border-press shadow-md scale-[1.01]"
                            : "bg-surface/40 border-line hover:border-line/80 hover:bg-surface/70"
                        }`}
                      >
                        {/* Radio Checkbox Stamp */}
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                            isSelected
                              ? "border-press bg-press text-white"
                              : "border-line bg-surface"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>

                        {/* Label & Description */}
                        <div>
                          <div className="text-sm font-bold text-ink uppercase">
                            {opt.label}
                          </div>
                          <div className="text-xs text-ink-mute mt-0.5 font-normal leading-relaxed">
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
              <div className="space-y-4 py-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-line rounded-lg text-ink text-xs font-bold font-mono-tabular uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-press" />
                  <span>Cinephile Match Verified</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-ink uppercase tracking-tight">
                  {rec.title}
                </h3>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 bg-surface text-ink font-mono-tabular font-semibold uppercase border border-line rounded-md">
                    {rec.industry}
                  </span>
                  <span className="text-ink-mute">•</span>
                  <span className="text-press font-bold uppercase">{rec.status}</span>
                </div>

                <div className="p-4 bg-surface/60 border border-line rounded-xl text-xs text-ink space-y-2">
                  <p className="leading-relaxed font-normal">{rec.summary}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-line/40 font-mono-tabular">
                    <span>Director: <strong className="text-ink uppercase font-semibold">{rec.director}</strong></span>
                    <span className="font-bold text-press uppercase">{rec.rating}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={rec.slug}
                    onClick={onClose}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-press hover:bg-press/90 text-white font-bold text-xs uppercase tracking-wider border border-press/60 rounded-xl shadow-md transition-all"
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
            <div className="flex items-center justify-between pt-6 border-t border-line mt-6">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => s - 1)}
                  className="text-xs font-semibold text-ink-mute hover:text-ink tracking-wider uppercase font-mono-tabular transition-colors"
                >
                  Back
                </button>
              ) : (
                <span />
              )}

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s + 1)}
                className="px-6 py-2.5 bg-press text-white hover:bg-press/90 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>{currentStep === totalSteps - 1 ? "Discover Match" : "Next"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-4 border-t border-line mt-4">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(0);
                }}
                className="text-xs font-semibold text-ink-mute hover:text-ink inline-flex items-center gap-1.5 font-mono-tabular uppercase transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start Over</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-ink uppercase hover:text-press transition-colors"
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
