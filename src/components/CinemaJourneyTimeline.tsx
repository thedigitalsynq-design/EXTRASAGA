"use client";

import React from "react";
import {
  Compass,
  Sparkles,
  Film,
  Clapperboard,
  Video,
  Award,
  Radio,
  Quote,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import DotGrid from "@/components/DotGrid";

interface Step {
  num: string;
  stageName: string;
  title: string;
  body: string;
  handwrittenNote: string;
  accentBorder: string;
  accentBadge: string;
  icon: React.ElementType;
}

export default function CinemaJourneyTimeline() {
  const steps: Step[] = [
    {
      num: "01",
      stageName: "THE SPARK",
      title: "Writing Room to Trade Verification",
      body: "Every cinematic masterpiece begins in quiet dialogue. We verify narrative concepts, writer collaborations, and core cast chemistry directly with trusted creators before rumors cloud the story.",
      handwrittenNote: "verified at the source ✍️",
      accentBorder: "border-l-4 border-l-press",
      accentBadge: "bg-press text-paper",
      icon: Film,
    },
    {
      num: "02",
      stageName: "THE CRUCIBLE",
      title: "On-Set Logs & Camera Rigs",
      body: "From remote coastal forests to high-tech soundstages, we document the sweat, discipline, and spirit of the crew. Stunt milestones and IMAX camera setups are logged with unfiltered honesty.",
      handwrittenNote: "truth from the trenches 🎥",
      accentBorder: "border-l-4 border-l-marquee",
      accentBadge: "bg-marquee text-ink",
      icon: Video,
    },
    {
      num: "03",
      stageName: "THE FIRST GLIMPSE",
      title: "Poster Reveal & Teaser Audit",
      body: "When the first artwork drops, we decode every hidden symbol, color palette, and musical motif — measuring genuine audience anticipation with verifiable analytics rather than bots.",
      handwrittenNote: "every frame tells a story 🔍",
      accentBorder: "border-l-4 border-l-violet",
      accentBadge: "bg-violet text-paper",
      icon: Sparkles,
    },
    {
      num: "04",
      stageName: "THE FINAL POLISH",
      title: "Censor Clearance & Sound Design",
      body: "We audit uncut runtimes, certify Dolby Atmos and IMAX soundscapes, and confirm territorial screen allocations so audiences know exactly what to anticipate on opening morning.",
      handwrittenNote: "uncut runtime verified ⏱️",
      accentBorder: "border-l-4 border-l-press",
      accentBadge: "bg-press text-paper",
      icon: Clapperboard,
    },
    {
      num: "05",
      stageName: "CURTAINS UP",
      title: "Theatrical Day-1 & Dual-Axis Review",
      body: "When the auditorium goes pitch black, our verdict drops. We evaluate technical visual wizardry and emotional storytelling separately — completely spoiler-free and strictly unbiased.",
      handwrittenNote: "heart + craft evaluated ⭐️",
      accentBorder: "border-l-4 border-l-marquee",
      accentBadge: "bg-marquee text-ink",
      icon: Award,
    },
    {
      num: "06",
      stageName: "THE LIVING ARCHIVE",
      title: "Digital Streaming & Cultural Legacy",
      body: "A great film never truly ends. We track 4K digital streaming homes, audited lifetime box office ledgers, and retrospective tributes that preserve cinema for future generations.",
      handwrittenNote: "etched into cinematic memory 🎞️",
      accentBorder: "border-l-4 border-l-violet",
      accentBadge: "bg-violet text-paper",
      icon: Radio,
    },
  ];

  return (
    <section aria-label="Cinema Journey Timeline" className="w-full py-12 relative">
      {/* Cinema Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-line">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-band text-ink font-bold text-xs uppercase tracking-widest border border-line rounded-lg shadow-sm mb-3">
            <Compass className="w-3.5 h-3.5 text-press" />
            <span>The Cinema Odyssey</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-poster uppercase text-ink tracking-tight">
            From Blank Page to Cultural Monument
          </h2>
          <p className="text-sm text-ink-dim font-medium mt-1 max-w-2xl">
            How our newsroom documents, audits, and honors each film&apos;s journey — from the first spark of inspiration to an immortal cultural memory.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-ink bg-surface px-3 py-1.5 border border-line rounded-lg shadow-sm self-start md:self-end">
          <span className="w-2 h-2 rounded-full bg-press animate-ping" />
          <span>6-Stage Editorial Audit</span>
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
        {/* Left Sticky Hero Column (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="bg-sheet border border-line rounded-2xl shadow-xl p-6 sm:p-8 relative overflow-hidden">
            {/* Dot grid decoration */}
            <DotGrid className="absolute top-4 right-4 opacity-20" rows={3} cols={4} />

            <div className="flex items-center gap-2 text-xs font-mono text-ink-dim mb-3">
              <span className="w-2 h-2 rounded-full bg-press" />
              <span className="font-bold uppercase tracking-wider">EDITORIAL METHODOLOGY</span>
            </div>

            <div className="text-4xl sm:text-6xl font-poster text-press uppercase tracking-tighter leading-none mb-3">
              6
            </div>

            <h3 className="text-xl sm:text-2xl font-poster uppercase text-ink tracking-tight mb-3">
              Editorial Pillars Every Film Undergoes
            </h3>

            <p className="text-xs sm:text-sm text-ink-dim font-medium leading-relaxed mb-6">
              Great cinema is not born overnight. By shadowing every transition from production sets to premiere midnight screenings, our coverage guarantees integrity, depth, and genuine respect for the art form.
            </p>

            {/* Impact Stat Cards */}
            <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-line">
              <div className="bg-surface border border-line rounded-xl shadow-sm p-2.5 text-center">
                <div className="text-base sm:text-lg font-poster text-ink">100%</div>
                <div className="text-[9px] text-ink-dim font-mono font-bold uppercase mt-0.5">Verified</div>
              </div>
              <div className="bg-surface border border-line rounded-xl shadow-sm p-2.5 text-center">
                <div className="text-base sm:text-lg font-poster text-ink">2-AXIS</div>
                <div className="text-[9px] text-ink-dim font-mono font-bold uppercase mt-0.5">Dual Audit</div>
              </div>
              <div className="bg-band text-ink border border-line rounded-xl shadow-sm p-2.5 text-center">
                <div className="text-base sm:text-lg font-poster text-ink">0%</div>
                <div className="text-[9px] text-ink font-mono font-bold uppercase mt-0.5">Fake Tea</div>
              </div>
            </div>
          </div>

          {/* Pull Quote Card */}
          <div className="bg-sheet border border-line rounded-2xl shadow-xl p-5 relative overflow-hidden">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-press text-paper border border-line flex items-center justify-center shrink-0 shadow-sm">
                <Quote className="w-4 h-4 fill-current" />
              </div>
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-semibold text-ink leading-relaxed italic">
                  &ldquo;Cinema is not built by chance. It is crafted with sweat, heart, and the relentless pursuit of truth on screen.&rdquo;
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-line">
                  <div className="w-6 h-6 rounded-full bg-surface border border-line text-[10px] font-poster flex items-center justify-center font-bold">
                    ES
                  </div>
                  <div>
                    <div className="text-[11px] font-poster uppercase text-ink">EXTRA-SAAGA Editorial Board</div>
                    <div className="text-[9px] font-mono text-ink-dim">Standards &amp; Verification Protocol</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Connected Timeline Column (7 cols) */}
        <div className="lg:col-span-7 relative">
          {/* Vertical connecting spine line */}
          <div
            aria-hidden="true"
            className="absolute left-6 top-8 bottom-8 w-0.5 bg-line"
          />

          <div className="space-y-6">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.num} className="relative flex items-start gap-4 sm:gap-6 group">
                  {/* Circular Node on Timeline with Step Number Badge */}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-sheet border border-line flex flex-col items-center justify-center shadow-md shrink-0 transition-transform group-hover:scale-105 group-hover:border-press/50">
                    <span className="text-[11px] font-poster font-bold text-ink leading-none">{step.num}</span>
                    <Icon className="w-3.5 h-3.5 text-press mt-0.5" />
                  </div>

                  {/* Step Card with Edge Accent Tab */}
                  <div
                    className={`flex-1 bg-sheet rounded-2xl border border-line shadow-lg p-5 sm:p-6 group-hover:border-press/40 transition-all duration-300 ${step.accentBorder}`}
                  >
                    {/* Header Row: Number + Stage Tag */}
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-line">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 bg-band text-ink border border-line rounded">
                          STAGE {step.num}
                        </span>
                        <span className="text-[10px] font-poster uppercase tracking-wider text-press">
                          {step.stageName}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono italic text-ink-dim hidden sm:inline-block">
                        {step.handwrittenNote}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h4 className="text-base sm:text-lg font-poster uppercase tracking-tight text-ink mb-1.5 group-hover:text-press transition-colors">
                      {step.title}
                    </h4>

                    {/* Step Body */}
                    <p className="text-xs sm:text-sm text-ink-dim font-medium leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
