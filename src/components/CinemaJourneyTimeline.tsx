"use client";

import React from "react";
import { Compass, Sparkles, Film, Clapperboard, Video, Award, Radio } from "lucide-react";

interface Step {
  num: string;
  title: string;
  body: string;
  handwrittenNote: string;
  icon: React.ElementType;
}

export default function CinemaJourneyTimeline() {
  const steps: Step[] = [
    {
      num: "01",
      title: "Script Conception & Pre-Production Scoop",
      body: "We verify initial writer room announcements, cast chemistry, and production budgets directly with accredited trade insiders before speculation spreads.",
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
      body: "Pixel-perfect visual breakdowns, easter egg deciphering, and audience anticipation metrics calculated using verified analytics.",
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

  return (
    <section aria-label="Cinema Journey Timeline" className="w-full py-12">
      {/* Broadsheet Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b-2 border-ink">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-band text-ink font-black text-xs uppercase tracking-widest border border-ink shadow-sticker mb-3">
            <Compass className="w-3.5 h-3.5 text-poster-red" />
            <span>The Cinema Odyssey</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-ink uppercase tracking-tight">
            From Conception to Cultural Legacy
          </h2>
          <p className="text-base text-ink-muted font-medium mt-1">
            How our editorial newsroom documents, audits, and archives every major cinematic creation through its complete lifespan.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono-tabular font-bold text-ink bg-paper px-3 py-1.5 border border-ink shadow-sticker self-start md:self-end">
          <span>6-Stage Editorial Audit</span>
        </div>
      </div>

      {/* Narrative Path (Center Ink Line) */}
      <div className="relative max-w-5xl mx-auto">
        <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-0.5 -translate-x-1/2 bg-ink/40" />

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
                  <div className="bg-sheet border-2 border-ink shadow-press p-6 sm:p-7 card-press-interactive group">
                    {/* Top Step Number + Icon */}
                    <div
                      className={`flex items-center gap-3 mb-3 ${
                        isEven ? "justify-start" : "md:justify-end justify-start"
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl font-black text-poster-red font-mono-tabular tracking-tighter">
                        {step.num}
                      </span>
                      <div className="w-9 h-9 bg-band border border-ink flex items-center justify-center text-ink shadow-sticker">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-black text-ink mb-2 uppercase tracking-tight">
                      {step.title}
                    </h3>

                    {/* Body */}
                    <p className="text-sm text-ink-muted leading-relaxed font-medium">
                      {step.body}
                    </p>

                    {/* Editorial Stamp Annotation */}
                    <div
                      className={`pt-4 mt-4 border-t border-ink/20 flex items-center ${
                        isEven ? "justify-start" : "md:justify-end justify-start"
                      }`}
                    >
                      <span className="inline-block px-3 py-1 bg-paper border border-ink text-ink text-xs font-mono-tabular tracking-wide italic font-bold shadow-sticker">
                        {step.handwrittenNote}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center Node on Timeline */}
                <div className="hidden md:flex relative z-10 w-9 h-9 bg-sheet border-2 border-ink items-center justify-center text-xs font-mono-tabular font-black text-ink shadow-sticker">
                  <div className="w-2.5 h-2.5 rounded-full bg-poster-red animate-pulse" />
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
