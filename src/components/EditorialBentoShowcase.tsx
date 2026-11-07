"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Award, Film, Users, CheckCircle2 } from "lucide-react";
import CinephileDiscoveryModal from "@/components/CinephileDiscoveryModal";
import DotGrid from "@/components/DotGrid";

export default function EditorialBentoShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section aria-label="Editorial Innovation" className="w-full py-12 relative">
      {/* Header with broadsheet styling */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b-2 border-ink">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-band text-ink font-bold text-xs uppercase tracking-widest border-2 border-ink shadow-sticker mb-3">
            <Sparkles className="w-3.5 h-3.5 text-press-deep" />
            <span>Innovation &amp; Cinema Craft</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-poster uppercase text-ink tracking-tight">
            Why True Cinephiles Trust EXTRASAGA
          </h2>
          <p className="text-sm text-ink-dim font-grotesk font-medium mt-1 max-w-2xl">
            Cinema is more than commerce — it is our collective dream. We bring you fearless journalism, audited box office truth, and verdicts that honor both technical mastery and storytelling soul.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-ink bg-paper px-3 py-1.5 border-2 border-ink shadow-sticker self-start md:self-end">
          <CheckCircle2 className="w-3.5 h-3.5 text-press-deep" />
          <span>Unbiased Film Criticism</span>
        </div>
      </div>

      {/* Bento Grid Layout (Broadsheet Brutalist) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Card 1: Left Tall Showcase Card (5 cols) */}
        <div className="md:col-span-5 glass-bento rounded-[28px] bg-sheet border-2 border-ink shadow-press p-6 sm:p-8 flex flex-col justify-between card-press-interactive group relative overflow-hidden">
          <DotGrid className="absolute top-4 right-4" rows={3} cols={3} />

          {/* Top Visual */}
          <div className="pt-2 pb-6 flex items-center justify-center relative z-10">
            <div className="w-36 h-36 sm:w-44 sm:h-44 bg-band border-2 border-ink shadow-sticker flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Film className="w-16 h-16 sm:w-20 sm:h-20 text-press-deep" />
            </div>
          </div>

          {/* Bottom Content & CTA */}
          <div className="space-y-4 pt-4 border-t-2 border-ink relative z-10">
            <h3 className="text-lg sm:text-xl font-poster uppercase text-ink tracking-tight leading-snug">
              Written by seasoned film writers who cherish the craft — giving every story the depth, dignity, and insight it deserves.
            </h3>

            <Link
              href="/category/latest"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-press hover:bg-ink text-paper text-xs font-poster uppercase tracking-wider border-2 border-ink shadow-sticker transition-all btn-press-interactive"
            >
              <span>Explore The Wire</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Section: 3 Bento Cards (7 cols) */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card 2: Top Left - Industry Trust */}
          <div className="glass-bento rounded-[28px] bg-sheet border-2 border-ink shadow-press p-6 flex flex-col justify-between card-press-interactive group relative overflow-hidden">
            <DotGrid className="absolute top-3 right-3" rows={2} cols={3} />

            <div className="w-12 h-12 bg-band border-2 border-ink shadow-sticker flex items-center justify-center text-ink mb-6 relative z-10">
              <Users className="w-6 h-6 text-press-deep" />
            </div>

            <div className="space-y-2 relative z-10">
              <h4 className="text-base sm:text-lg font-poster uppercase text-ink tracking-tight leading-snug">
                Trusted by 120+ filmmakers, national critics, and cinema analysts across India.
              </h4>
              <p className="text-xs text-ink-dim flex items-center gap-1.5 pt-2 font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-press-deep shrink-0" />
                <span>Verified bylines · Real voices only</span>
              </p>
            </div>
          </div>

          {/* Card 3: Top Right - 100% Metric Card */}
          <div className="glass-bento rounded-[28px] bg-sheet border-2 border-ink shadow-press p-6 flex flex-col justify-between card-press-interactive group relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
              <div>
                <span className="text-4xl sm:text-5xl font-poster uppercase text-press tracking-tight block leading-none">
                  100%
                </span>
                <span className="text-xs font-poster uppercase text-ink tracking-wider mt-1.5 block">
                  Cinephile Guarantee
                </span>
              </div>
              <div className="w-12 h-12 bg-marquee border-2 border-ink shadow-sticker flex items-center justify-center text-ink shrink-0">
                <Award className="w-6 h-6 text-ink" />
              </div>
            </div>

            <p className="text-xs text-ink-dim font-grotesk font-medium leading-relaxed pt-4 border-t-2 border-ink mt-4 relative z-10">
              Completely spoiler-free audits. We never give away the magic before you take your seat in the theater dark.
            </p>
          </div>

          {/* Card 4: Bottom Wide Card */}
          <div className="sm:col-span-2 glass-bento rounded-[28px] bg-sheet border-2 border-ink shadow-press p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 card-press-interactive group relative overflow-hidden">
            <DotGrid className="absolute top-4 right-4" rows={2} cols={6} />

            <div className="space-y-3 max-w-md relative z-10">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-ink bg-band px-2.5 py-0.5 border border-ink shadow-sticker">
                <ShieldCheck className="w-3.5 h-3.5 text-press-deep" />
                <span>Zero Clickbait Guarantee</span>
              </div>
              <h4 className="text-base sm:text-xl font-poster uppercase text-ink tracking-tight leading-snug">
                Turning everyday movie watching into a rich, memorable journey through the art of cinema.
              </h4>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-ink hover:bg-press text-paper font-poster text-xs uppercase tracking-wider border-2 border-ink shadow-sticker transition-all btn-press-interactive"
                >
                  <Sparkles className="w-3.5 h-3.5 text-marquee" />
                  <span>Find Your Perfect Film Match</span>
                </button>
              </div>
            </div>

            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-band border-2 border-ink shadow-sticker flex items-center justify-center shrink-0 group-hover:rotate-3 transition-transform relative z-10">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-press-deep" />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Discovery Quiz Modal */}
      <CinephileDiscoveryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
