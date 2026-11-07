"use client";

import React from "react";
import { Compass, Sparkles, Film, CheckCircle2, Clapperboard, Video, Award, Radio } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Step {
  num: string;
  title: string;
  body: string;
  handwrittenNote: string;
  icon: React.ElementType;
}

export default function CinemaJourneyTimeline() {
  const { language, config } = useLanguage();

  const steps: Step[] = [
    {
      num: "01",
      title: "Script Conception & Pre-Production Scoop",
      body: "We verify the initial script announcements, writing room collaborations, and cast chemistry directly with trusted trade sources.",
      handwrittenNote: "verified before rumors spread ✍️",
      icon: Film,
    },
    {
      num: "02",
      title: "Principal Photography & Location Logs",
      body: "Continuous on-location updates, IMAX camera rigs, technical crew additions, and stunt choreography milestones tracked in real time.",
      handwrittenNote: "zero unverified set gossip 🎥",
      icon: Video,
    },
    {
      num: "03",
      title: "First Look Poster & Teaser Breakdown",
      body: "Pixel-perfect visual breakdowns, Easter egg deciphering, and audience anticipation metrics calculated using verified analytics.",
      handwrittenNote: "frame-by-frame analysis 🔍",
      icon: Sparkles,
    },
    {
      num: "04",
      title: "Censor Clearance & Trailer Premiere",
      body: "Certification runtime audit, Dolby Atmos / IMAX sound specs verification, and nationwide screen distribution territory allocation.",
      handwrittenNote: "uncut runtime confirmed ⏱️",
      icon: Clapperboard,
    },
    {
      num: "05",
      title: "Theatrical Day-1 & Dual-Axis Review",
      body: "Our signature 100% spoiler-free review drops with separate artistic storytelling and technical execution evaluations.",
      handwrittenNote: "dual-axis review: craft + heart ⭐️",
      icon: Award,
    },
    {
      num: "06",
      title: "OTT Streaming & Cinema Archive Legacy",
      body: "Tracking 4K HDR digital streaming rights, box-office lifetime grossers, and long-term retrospective appreciation pieces.",
      handwrittenNote: "preserves cinematic history forever 🎞️",
      icon: Radio,
    },
  ];

  const headerText = {
    kn: {
      pill: "ಸಿನಿಮಾ ಜರ್ನಿ ರೋಡ್‌ಮ್ಯಾಪ್",
      title: "ಸಿನಿಮಾದ ಹುಟ್ಟಿನಿಂದ ಆರ್ಕೈವ್‌ವರೆಗಿನ ಪಯಣ",
      subtitle: "ಪ್ರತಿ ಸಿನಿಮಾದ ಆರಂಭಿಕ ಕಥಾಹಂದರದಿಂದ ಹಿಡಿದು ಚಿತ್ರಮಂದಿರ ಮತ್ತು OTT ಬಿಡುಗಡೆಯವರೆಗಿನ ಸಮಗ್ರ ವರದಿಗಾರಿಕೆಯ ಹೆಜ್ಜೆಗುರುತು.",
    },
    en: {
      pill: "THE CINEMA ODYSSEY",
      title: "From Conception to Cultural Legacy",
      subtitle: "How our editorial newsroom documents, audits, and archives every major cinematic creation through its complete lifespan.",
    },
  }[language === "kn" ? "kn" : "en"];

  return (
    <section aria-label="Cinema Journey Timeline" className="w-full py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gray-100 border border-gray-200 text-gray-700 select-none shadow-2xs">
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span>{headerText.pill}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950 tracking-tight font-sans">
          {headerText.title}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
          {headerText.subtitle}
        </p>
      </div>

      {/* Narrative Path (Inspired by handwriting + continuous curve aesthetic) */}
      <div className="relative max-w-5xl mx-auto">
        {/* Subtle Connecting Center Line */}
        <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#e2764b]/30 via-[#e2764b]/50 to-[#e2764b]/20" />

        <div className="space-y-8 md:space-y-12">
          {steps.map((step, idx) => {
            const isEven = idx % 2 === 1;
            const Icon = step.icon;

            return (
              <div
                key={step.num}
                className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Content Card (Half Width) */}
                <div className={`w-full md:w-1/2 ${isEven ? "md:text-left" : "md:text-right"}`}>
                  <div className="rounded-3xl bg-white border border-gray-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-gray-300 transition-cinema gpu-layer group">
                    {/* Top Step Number + Icon */}
                    <div
                      className={`flex items-center gap-3 mb-3 ${
                        isEven ? "justify-start" : "md:justify-end justify-start"
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl font-black text-[#dc6940] font-mono tracking-tighter">
                        {step.num}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-[#dc6940]/10 border border-[#dc6940]/20 flex items-center justify-center text-[#dc6940]">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-gray-950 mb-2 font-sans">
                      {step.title}
                    </h3>

                    {/* Body */}
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                      {step.body}
                    </p>

                    {/* Handwritten Style Annotation Pill */}
                    <div
                      className={`pt-4 mt-4 border-t border-gray-100 flex items-center ${
                        isEven ? "justify-start" : "md:justify-end justify-start"
                      }`}
                    >
                      <span className="inline-block px-3 py-1 rounded-full bg-[#dc6940]/10 border border-[#dc6940]/25 text-[#c14c22] text-[11px] font-mono tracking-wide italic font-medium">
                        {step.handwrittenNote}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center Node on Timeline */}
                <div className="hidden md:flex relative z-10 w-9 h-9 rounded-full bg-white border-2 border-[#dc6940] items-center justify-center text-xs font-mono font-bold text-gray-900 shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#dc6940] animate-pulse" />
                </div>

                {/* Blank Opposite Spacer for Desktop Balance */}
                <div className="hidden md:block w-1/2" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

