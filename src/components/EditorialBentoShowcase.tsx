"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Award, Film, Users, CheckCircle2, Compass } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import CinephileDiscoveryModal from "@/components/CinephileDiscoveryModal";

export default function EditorialBentoShowcase() {
  const { config, localizeUrl } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const t = {
    pill: "INNOVATION & CRAFT",
    title: "Why cinephiles choose EXTRASAGA",
    subtitle: "Exceptional film journalism, dual-axis reviews, and real-time box office intelligence covering all Indian film industries under one destination.",
    card1Title: "Handcrafted by veteran film journalists to deliver timeless depth and unmatched credibility across all film industries.",
    card1Cta: "Explore Editorial",
    card2Title: "Trusted by 120+ filmmakers, national critics & trade analysts across all Indian cinema.",
    card3Metric: "100%",
    card3Subtitle: "Spoiler-free integrity & dual-axis storytelling audits.",
    card4Title: "Elevates film discourse and transforms everyday cinema viewing into a deeper cinematic journey.",
  };

  return (
    <section aria-label="Editorial Innovation" className="w-full py-8">
      {/* Header with pill tag */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase glass-pill text-signal-soft border-signal/30 select-none">
          <Sparkles className="w-3.5 h-3.5 text-marquee-soft" />
          <span>{t.pill}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-popcorn tracking-tight font-display-latin">
          {t.title}
        </h2>
        <p className="text-sm sm:text-base text-popcorn-dim leading-relaxed font-normal">
          {t.subtitle}
        </p>
      </div>

      {/* Bento Grid Layout (After-dark glass bento) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* Card 1: Left Tall Showcase Card (5 cols on md/lg) */}
        <div className="md:col-span-5 rounded-[28px] glass-bento bg-revealed/70 backdrop-blur-2xl border border-glow-line p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-glow-line-strong shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)] transition-cinema gpu-layer">
          {/* Ambient Corner Glow */}
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-signal/5 blur-3xl pointer-events-none group-hover:bg-signal/10 transition-cinema" />

          {/* Top Visual: Vintage Film Reel / Golden Camera Vector */}
          <div className="relative z-10 pt-2 pb-8 flex items-center justify-center">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl glass-panel bg-screen/80 border border-glow-line-strong flex items-center justify-center shadow-sm group-hover:scale-[1.03] transition-spring">
              <Film className="w-16 h-16 sm:w-20 sm:h-20 text-marquee-soft drop-shadow-[0_0_16px_rgba(255,176,32,0.3)]" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-glow-line" />
            </div>
          </div>

          {/* Bottom Content & CTA */}
          <div className="relative z-10 space-y-5 pt-4 border-t border-glow-line">
            <h3 className="text-lg sm:text-xl font-bold text-popcorn leading-snug">
              {t.card1Title}
            </h3>

            <Link
              href={localizeUrl("/category/latest")}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-signal-deep text-popcorn hover:bg-signal text-xs sm:text-sm font-bold tracking-tight shadow-[0_0_24px_rgba(255,46,80,0.25)] active:scale-95 transition-spring select-none"
            >
              <span>{t.card1Cta}</span>
              <ArrowRight className="w-3.5 h-3.5 text-popcorn group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Section: 3 Bento Cards (7 cols on md/lg) */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* Card 2: Top Left - Handshake / Insider Trust */}
          <div className="rounded-[28px] glass-bento bg-revealed/70 backdrop-blur-2xl border border-glow-line p-6 flex flex-col justify-between relative overflow-hidden group hover:border-glow-line-strong shadow-[0_12px_36px_-8px_rgba(0,0,0,0.45)] transition-cinema gpu-layer">
            {/* Visual Icon */}
            <div className="w-12 h-12 rounded-2xl bg-ultra-faint border border-ultra/30 flex items-center justify-center text-ultra-soft mb-6 group-hover:scale-105 transition-spring">
              <Users className="w-6 h-6" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h4 className="text-base sm:text-lg font-bold text-popcorn leading-snug">
                {t.card2Title}
              </h4>
              <p className="text-xs text-popcorn-dim flex items-center gap-1.5 pt-2">
                <CheckCircle2 className="w-3.5 h-3.5 change-positive shrink-0" />
                <span>Verified editorial byline standards</span>
              </p>
            </div>
          </div>

          {/* Card 3: Top Right - 100% Metric Card */}
          <div className="rounded-[28px] glass-bento bg-revealed/70 backdrop-blur-2xl border border-glow-line p-6 flex flex-col justify-between relative overflow-hidden group hover:border-glow-line-strong shadow-[0_12px_36px_-8px_rgba(0,0,0,0.45)] transition-cinema gpu-layer">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-4xl sm:text-5xl font-black text-popcorn tracking-tight font-display-latin block">
                  {t.card3Metric}
                </span>
                <span className="text-xs font-bold text-marquee-soft tracking-widest uppercase font-display-latin mt-1 block">
                  Cinephile Guarantee
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-marquee-faint border border-marquee/30 flex items-center justify-center text-marquee-soft shrink-0 group-hover:rotate-12 transition-spring">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <p className="text-xs text-popcorn-dim leading-relaxed pt-4 border-t border-glow-line mt-4">
              {t.card3Subtitle}
            </p>
          </div>

          {/* Card 4: Bottom Wide Card spanning both columns */}
          <div className="sm:col-span-2 rounded-[28px] glass-bento bg-revealed/70 backdrop-blur-2xl border border-glow-line p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:border-glow-line-strong shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)] transition-cinema gpu-layer">
            {/* Left Content */}
            <div className="space-y-3 max-w-md">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest font-display-latin text-signal-soft bg-signal-faint px-2.5 py-0.5 rounded-full border border-signal/25">
                <ShieldCheck className="w-3 h-3 text-signal-soft" />
                <span>Zero Clickbait Policy</span>
              </div>
              <h4 className="text-base sm:text-xl font-bold text-popcorn leading-snug">
                {t.card4Title}
              </h4>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ultra-deep hover:bg-ultra text-void font-bold text-xs tracking-tight shadow-[0_0_24px_rgba(155,109,255,0.3)] transition-spring"
                >
                  <Sparkles className="w-3.5 h-3.5 text-void" />
                  <span>Interactive Cinema Vibe Match</span>
                </button>
              </div>
            </div>

            {/* Right Abstract Visual Graphic */}
            <div className="w-full sm:w-48 h-28 sm:h-32 rounded-2xl glass-panel bg-screen/80 border border-glow-line-strong flex items-center justify-center shrink-0 relative overflow-hidden group-hover:scale-[1.02] transition-spring">
              <div className="flex flex-col items-center gap-1 z-10">
                <Film className="w-8 h-8 text-ultra-soft" />
                <span className="text-[11px] font-display-latin uppercase tracking-widest text-popcorn-dim font-bold">
                  {config.industryName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Questionnaire Modal (Matching Reference) */}
      <CinephileDiscoveryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
