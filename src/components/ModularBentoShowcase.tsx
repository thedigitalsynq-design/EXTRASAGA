"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Film, Video, Award, Sparkles, TrendingUp } from "lucide-react";
import DotGrid from "@/components/DotGrid";

export default function ModularBentoShowcase() {
  return (
    <section aria-label="Bespoke Editorial Bento Grid" className="w-full py-8 relative">
      {/* Editorial Header with Handwritten Note */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b-2 border-ink">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-handwritten text-lg text-ink font-semibold flex items-center gap-1 select-none">
              Curated by the Editorial Bureau
              <span className="text-press font-bold">⤹</span>
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-poster uppercase text-ink tracking-tight">
            Stories That Define The Screen
          </h2>
          <p className="text-sm text-ink-dim font-grotesk font-medium mt-1 max-w-2xl">
            Modular dispatches spanning historical milestones, box office telemetry, and fearless artistic critiques across all six Indian filmmaking traditions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-ink bg-paper px-3 py-1.5 border-2 border-ink shadow-sticker self-start md:self-end">
          <span className="w-2 h-2 rounded-full bg-press animate-pulse" />
          <span>Audited Theatrical Ledgers</span>
        </div>
      </div>

      {/* Modular Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Card 1: Coral Pink Large Card (7 cols) */}
        <div className="md:col-span-7 bg-[#FFAAA6] rounded-[28px] border-2 border-ink shadow-press p-6 sm:p-8 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:shadow-press-lg">
          <DotGrid className="absolute top-4 right-4 opacity-30" rows={3} cols={3} />

          {/* Top Metadata: Bold Date + Tag */}
          <div className="flex items-center justify-between gap-3 relative z-10 mb-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-ink text-paper text-[11px] font-poster uppercase tracking-wider font-bold">
                MAY 12, 2026
              </span>
              <span className="text-xs font-handwritten text-ink font-bold flex items-center gap-1">
                Magnum Opus Spotlight 👑
              </span>
            </div>
            <span className="w-8 h-8 rounded-full bg-ink/10 flex items-center justify-center border border-ink/20">
              <Film className="w-4 h-4 text-ink" />
            </span>
          </div>

          {/* Center Graphic & Headline */}
          <div className="space-y-4 my-auto relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-paper border-2 border-ink shadow-sticker flex items-center justify-center text-ink group-hover:scale-105 transition-transform">
              <Video className="w-7 h-7 text-press" />
            </div>

            <h3 className="text-2xl sm:text-4xl font-poster uppercase text-ink tracking-tight leading-snug">
              The Everlasting{" "}
              <span className="font-serif-accent italic font-normal text-ink underline decoration-press/50 decoration-wavy">
                Magic
              </span>{" "}
              of Indian Cinema
            </h3>

            <p className="text-sm text-ink/90 font-grotesk font-medium leading-relaxed max-w-xl">
              From silent mythological scrolls to worldwide box office storms, the Indian storytelling engine continues to captivate humanity with unrivaled grandeur and deeply human soul.
            </p>
          </div>

          {/* Bottom Action */}
          <div className="pt-6 border-t-2 border-ink/20 flex items-center justify-between relative z-10 mt-6">
            <Link
              href="/category/latest"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-paper text-xs font-poster uppercase tracking-wider font-bold hover:bg-press transition-colors shadow-sticker"
            >
              <span>Read Deep Dive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[11px] font-mono font-bold text-ink/70 uppercase">
              12 Min Editorial Analysis
            </span>
          </div>
        </div>

        {/* Card 2: Stark White Card (5 cols) */}
        <div className="md:col-span-5 bg-sheet rounded-[28px] border-2 border-ink shadow-press p-6 sm:p-7 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:shadow-press-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-[#E2F952] text-ink border border-ink text-[11px] font-poster uppercase tracking-wider font-bold">
                MAY 11, 2026
              </span>
              <span className="text-[11px] font-mono text-ink-dim font-bold">
                Tollywood Wire
              </span>
            </div>

            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border-2 border-ink shadow-sticker mb-4">
              <Image
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"
                alt="SS Rajamouli Production"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-3 text-[10px] font-mono text-paper font-bold uppercase tracking-wider">
                Production Floor Exclusive
              </span>
            </div>

            <h4 className="text-xl font-poster uppercase text-ink tracking-tight leading-snug">
              SS Rajamouli Hints at Next Mythological Spectacle
            </h4>
            <p className="text-xs text-ink-dim font-grotesk font-medium mt-2 leading-relaxed">
              Early pre-production sketches confirm an expansive multi-part narrative uniting top technicians from Hyderabad and Mumbai.
            </p>
          </div>

          <div className="pt-4 border-t border-ink/15 flex items-center justify-between mt-4">
            <Link
              href="/news/ss-rajamouli-hints-at-next-project"
              className="text-xs font-poster uppercase font-bold text-press hover:text-ink flex items-center gap-1"
            >
              <span>Dispatch Report</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <span className="text-[10px] font-mono text-ink-mute">Verified Source</span>
          </div>
        </div>

        {/* Card 3: Warm Apricot Orange Card (4 cols) */}
        <div className="md:col-span-4 bg-[#F79D65] rounded-[28px] border-2 border-ink shadow-press p-6 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:shadow-press-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-ink text-paper text-[11px] font-poster uppercase tracking-wider font-bold">
                MAY 10, 2026
              </span>
              <TrendingUp className="w-4 h-4 text-ink" />
            </div>

            <div className="p-3 rounded-2xl bg-paper/90 border border-ink/20 shadow-xs mb-4">
              <span className="text-[10px] font-mono text-ink-dim uppercase block">Consolidated Ledger</span>
              <span className="text-2xl font-poster text-ink font-bold block">₹12,450 Cr+</span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold block">▲ +18.4% Year-over-Year</span>
            </div>

            <h4 className="text-xl font-poster uppercase text-ink tracking-tight leading-snug">
              Indian Cinema&apos;s Global Rise
            </h4>
            <p className="text-xs text-ink/90 font-grotesk font-medium mt-2 leading-relaxed">
              Unified release strategies across North America, the Gulf, and East Asia establish Indian epics as permanent global theatrical forces.
            </p>
          </div>

          <div className="pt-4 border-t border-ink/20 flex items-center justify-between mt-4">
            <Link
              href="/box-office"
              className="text-xs font-poster uppercase font-bold text-ink hover:text-paper flex items-center gap-1"
            >
              <span>Explore Telemetry</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <span className="text-[10px] font-mono text-ink/70">Trade Ledger</span>
          </div>
        </div>

        {/* Card 4: Stark White Card with Golden Laurel Emblem (4 cols) */}
        <div className="md:col-span-4 bg-sheet rounded-[28px] border-2 border-ink shadow-press p-6 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:shadow-press-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-band text-ink border border-ink text-[11px] font-poster uppercase tracking-wider font-bold">
                MAY 09, 2026
              </span>
              <Award className="w-5 h-5 text-press" />
            </div>

            <div className="w-12 h-12 rounded-2xl bg-[#FFE082] border-2 border-ink shadow-sticker flex items-center justify-center text-ink mb-4">
              <Award className="w-6 h-6 text-ink" />
            </div>

            <h4 className="text-xl font-poster uppercase text-ink tracking-tight leading-snug">
              National Honors &amp; Global Festivals
            </h4>
            <p className="text-xs text-ink-dim font-grotesk font-medium mt-2 leading-relaxed">
              From Malayalam cinema&apos;s literary poignancy to Kannada filmmaking&apos;s visual audacity, regional triumphs receive the highest critical acclaim.
            </p>
          </div>

          <div className="pt-4 border-t border-ink/15 flex items-center justify-between mt-4">
            <Link
              href="/category/awards"
              className="text-xs font-poster uppercase font-bold text-press hover:text-ink flex items-center gap-1"
            >
              <span>Festival Roster</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <span className="text-[10px] font-mono text-ink-mute">Curated Jury</span>
          </div>
        </div>

        {/* Card 5: Soft Lavender Card (4 cols) */}
        <div className="md:col-span-4 bg-[#CBB2FE] rounded-[28px] border-2 border-ink shadow-press p-6 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:shadow-press-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-ink text-paper text-[11px] font-poster uppercase tracking-wider font-bold">
                MAY 08, 2026
              </span>
              <Sparkles className="w-4 h-4 text-ink" />
            </div>

            <div className="flex -space-x-2 items-center mb-4">
              <div className="relative w-10 h-10 rounded-full border-2 border-ink overflow-hidden shadow-xs">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                  alt="Deepika Padukone"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-10 h-10 rounded-full border-2 border-ink overflow-hidden shadow-xs">
                <Image
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face"
                  alt="Sai Pallavi"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <h4 className="text-xl font-poster uppercase text-ink tracking-tight leading-snug">
              Women Redefining The Cinema Canvas
            </h4>
            <p className="text-xs text-ink/90 font-grotesk font-medium mt-2 leading-relaxed">
              Visionary women directors, cinematographers, and lead performers who dismantled traditional formulas to write modern cinema history.
            </p>
          </div>

          <div className="pt-4 border-t border-ink/20 flex items-center justify-between mt-4">
            <Link
              href="/category/features"
              className="text-xs font-poster uppercase font-bold text-ink hover:text-paper flex items-center gap-1"
            >
              <span>Read The Spotlight</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <span className="text-[10px] font-mono text-ink/70">Retrospective</span>
          </div>
        </div>
      </div>
    </section>
  );
}
