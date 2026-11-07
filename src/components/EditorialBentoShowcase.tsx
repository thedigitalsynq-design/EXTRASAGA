"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Award, Film, Users, CheckCircle2 } from "lucide-react";
import CinephileDiscoveryModal from "@/components/CinephileDiscoveryModal";

export default function EditorialBentoShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section aria-label="Editorial Innovation" className="w-full py-12">
      {/* Header with broadsheet styling */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b-2 border-ink">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-band text-ink font-black text-xs uppercase tracking-widest border border-ink shadow-sticker mb-3">
            <Sparkles className="w-3.5 h-3.5 text-poster-red" />
            <span>Innovation &amp; Cinema Craft</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-ink uppercase tracking-tight">
            Why Cinephiles Trust CINIJAATRE
          </h2>
          <p className="text-base text-ink-muted font-medium mt-1">
            Exceptional film journalism, dual-axis reviews, and real-time box office intelligence covering all Indian film industries under one destination.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono-tabular font-bold text-ink bg-paper px-3 py-1.5 border border-ink shadow-sticker self-start md:self-end">
          <span>Unbiased Film Criticism</span>
        </div>
      </div>

      {/* Bento Grid Layout (Broadsheet Brutalist) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Card 1: Left Tall Showcase Card (5 cols) */}
        <div className="md:col-span-5 glass-bento rounded-[28px] bg-sheet border-2 border-ink shadow-press p-6 sm:p-8 flex flex-col justify-between card-press-interactive group">
          {/* Top Visual */}
          <div className="pt-2 pb-6 flex items-center justify-center">
            <div className="w-36 h-36 sm:w-44 sm:h-44 bg-band border-2 border-ink shadow-sticker flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Film className="w-16 h-16 sm:w-20 sm:h-20 text-poster-red" />
            </div>
          </div>

          {/* Bottom Content & CTA */}
          <div className="space-y-4 pt-4 border-t-2 border-ink">
            <h3 className="text-lg sm:text-xl font-black text-ink uppercase tracking-tight leading-snug">
              Handcrafted by veteran film journalists to deliver timeless depth and unmatched credibility across all film industries.
            </h3>

            <Link
              href="/category/latest"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-poster-red hover:bg-ink text-paper text-xs font-black uppercase tracking-wider border-2 border-ink shadow-sticker transition-all btn-press-interactive"
            >
              <span>Explore Editorial Wire</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Section: 3 Bento Cards (7 cols) */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card 2: Top Left - Industry Trust */}
          <div className="glass-bento rounded-[28px] bg-sheet border-2 border-ink shadow-press p-6 flex flex-col justify-between card-press-interactive group">
            <div className="w-12 h-12 bg-band border-2 border-ink shadow-sticker flex items-center justify-center text-ink mb-6">
              <Users className="w-6 h-6 text-poster-red" />
            </div>

            <div className="space-y-2">
              <h4 className="text-base sm:text-lg font-black text-ink uppercase tracking-tight leading-snug">
                Trusted by 120+ filmmakers, national critics &amp; trade analysts across all Indian cinema.
              </h4>
              <p className="text-xs text-ink-muted flex items-center gap-1.5 pt-2 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-poster-red shrink-0" />
                <span>Verified editorial byline standards</span>
              </p>
            </div>
          </div>

          {/* Card 3: Top Right - 100% Metric Card */}
          <div className="glass-bento rounded-[28px] bg-sheet border-2 border-ink shadow-press p-6 flex flex-col justify-between card-press-interactive group">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-4xl sm:text-5xl font-black text-poster-red font-mono-tabular tracking-tight block">
                  100%
                </span>
                <span className="text-xs font-black text-ink uppercase tracking-wider mt-1 block">
                  Cinephile Guarantee
                </span>
              </div>
              <div className="w-12 h-12 bg-band border-2 border-ink shadow-sticker flex items-center justify-center text-ink shrink-0">
                <Award className="w-6 h-6 text-poster-gold" />
              </div>
            </div>

            <p className="text-xs text-ink-muted font-medium leading-relaxed pt-4 border-t-2 border-ink mt-4">
              Spoiler-free integrity &amp; dual-axis storytelling audits across every major theatrical release.
            </p>
          </div>

          {/* Card 4: Bottom Wide Card */}
          <div className="sm:col-span-2 glass-bento rounded-[28px] bg-sheet border-2 border-ink shadow-press p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 card-press-interactive group">
            <div className="space-y-3 max-w-md">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-ink bg-band px-2.5 py-0.5 border border-ink shadow-sticker">
                <ShieldCheck className="w-3.5 h-3.5 text-poster-red" />
                <span>Zero Clickbait Policy</span>
              </div>
              <h4 className="text-base sm:text-xl font-black text-ink uppercase tracking-tight leading-snug">
                Elevates film discourse and transforms everyday movie viewing into an enriched cinematic journey.
              </h4>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-ink hover:bg-poster-red text-paper font-black text-xs uppercase tracking-wider border-2 border-ink shadow-sticker transition-all btn-press-interactive"
                >
                  <Sparkles className="w-3.5 h-3.5 text-poster-gold" />
                  <span>Interactive Cinema Vibe Match</span>
                </button>
              </div>
            </div>

            <div className="w-full sm:w-48 h-28 sm:h-32 bg-band border-2 border-ink shadow-sticker flex items-center justify-center shrink-0">
              <div className="flex flex-col items-center gap-1">
                <Film className="w-8 h-8 text-poster-red" />
                <span className="text-[11px] uppercase tracking-widest text-ink font-black">
                  All Indian Cinema
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Questionnaire Modal */}
      <CinephileDiscoveryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
