"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Play, ShieldCheck, Film } from "lucide-react";
import DotGrid from "@/components/DotGrid";

interface BespokeEditorialHeroProps {
  onSelectIndustry?: (industry: string) => void;
}

export default function BespokeEditorialHero({
  onSelectIndustry,
}: BespokeEditorialHeroProps) {
  const [activeStarIndex, setActiveStarIndex] = useState<number>(0);

  const cinemaSuperstars = [
    {
      name: "Shah Rukh Khan",
      title: "King Khan · Global Bollywood Icon",
      film: "Jawan & King",
      tradition: "Bollywood",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=750&fit=crop&crop=face",
      color: "bg-[#FFAAA6]",
      traditionBg: "bg-press text-paper",
    },
    {
      name: "Allu Arjun",
      title: "National Award Winner · Telugu Icon",
      film: "Pushpa 2: The Rule",
      tradition: "Tollywood",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=750&fit=crop&crop=face",
      color: "bg-[#F79D65]",
      traditionBg: "bg-[#F79D65] text-ink",
    },
    {
      name: "Thalapathy Vijay",
      title: "Box Office Titan · Tamil Cinema",
      film: "GOAT & Leo",
      tradition: "Kollywood",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=750&fit=crop&crop=face",
      color: "bg-[#CBB2FE]",
      traditionBg: "bg-[#CBB2FE] text-ink",
    },
    {
      name: "Yash",
      title: "Pan-India Phenomenon · Kannada Cinema",
      film: "Toxic & KGF 2",
      tradition: "Sandalwood",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop&crop=face",
      color: "bg-[#FFE082]",
      traditionBg: "bg-marquee text-ink",
    },
    {
      name: "Mohanlal",
      title: "The Complete Actor · Malayalam Legend",
      film: "L2: Empuraan",
      tradition: "Mollywood",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=600&h=750&fit=crop&crop=face",
      color: "bg-[#D4EDDA]",
      traditionBg: "bg-[#D4EDDA] text-ink",
    },
  ];

  const currentStar = cinemaSuperstars[activeStarIndex];

  return (
    <section
      aria-label="EXTRASAGA Unified Cinema Showcase"
      className="relative w-full rounded-[32px] bg-sheet border-2 border-ink shadow-press p-6 sm:p-10 lg:p-12 overflow-hidden"
    >
      {/* Background Dot Grid and Subtle Texture */}
      <DotGrid className="absolute top-6 right-6 opacity-40 pointer-events-none" rows={4} cols={4} />
      <div aria-hidden="true" className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#FFE57F]/30 blur-2xl pointer-events-none" />

      {/* SVG Narrative Winding Line connecting UI elements across the canvas */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 120,40 Q 240,15 360,70 T 520,65 Q 680,85 780,240 T 960,320 Q 1100,420 1200,380"
          stroke="#17140F"
          strokeWidth="1.75"
          strokeDasharray="4 4"
          className="opacity-20"
        />
        <path
          d="M 280,180 C 380,260 220,380 340,430 C 440,470 540,420 620,470"
          stroke="#17140F"
          strokeWidth="1.5"
          className="opacity-25"
        />
        <circle cx="340" cy="430" r="4" fill="#17140F" className="opacity-40" />
      </svg>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
        {/* Left Column: Bold Typography & Expressive Narrative */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sparse Handwritten Annotation with Crown Doodle */}
          <div className="inline-flex items-center gap-2">
            <span className="font-handwritten text-xl sm:text-2xl text-ink font-semibold tracking-wide flex items-center gap-1.5 transform -rotate-1 select-none">
              One Industry. A Thousand Stories.
              <span className="inline-block text-press text-lg">👑</span>
            </span>
          </div>

          {/* High-Contrast Headline: Big Bold Sans with Elegant Serif Accent */}
          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-poster uppercase tracking-[0.25em] text-ink-dim font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-press rotate-45 shrink-0" />
              <span>THE UNIFIED INDIAN CINEMA DESK</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-poster text-ink tracking-tight uppercase leading-[0.98]">
              EXTRASAGA
              <span className="block text-3xl sm:text-5xl lg:text-6xl font-normal lowercase tracking-normal mt-2">
                <span className="font-poster uppercase font-bold text-ink">India&apos;s Cinema. </span>
                <span className="font-serif-accent italic font-normal text-ink">Together.</span>
              </span>
            </h1>
          </div>

          {/* Emotional Subtitle with Natural Sentence Flow */}
          <p className="text-base sm:text-lg text-ink-dim font-grotesk font-medium max-w-xl leading-relaxed">
            Different languages. Different cultures. Different filmmaking traditions. One unified stage. One press run. House full, every single day.
          </p>

          {/* Primary Action Buttons & Social Proof */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="#the-wire"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-ink text-paper text-sm font-poster uppercase tracking-wider font-bold shadow-press hover:bg-press transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Frontpage</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/box-office"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-paper hover:bg-band text-ink border-2 border-ink text-sm font-poster uppercase tracking-wider font-bold shadow-sticker transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShieldCheck className="w-4 h-4 text-press" />
              <span>Audited Box Office</span>
            </Link>
          </div>

          {/* Social Proof Counter with Overlapping Avatars */}
          <div className="pt-4 flex flex-wrap items-center gap-4 border-t-2 border-ink/15">
            <div className="flex -space-x-3 items-center">
              <div className="relative w-10 h-10 rounded-full border-2 border-ink overflow-hidden shadow-xs">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                  alt="Cinephile Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-10 h-10 rounded-full border-2 border-ink overflow-hidden shadow-xs">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="Critic Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-10 h-10 rounded-full border-2 border-ink overflow-hidden shadow-xs">
                <Image
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face"
                  alt="Director Avatar"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-poster uppercase tracking-wider text-ink font-bold">
                2M+ Cinema Lovers &amp; Counting
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-ink-dim">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Unified Daily Press Run · Receipts Backed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High-Fidelity Layered Superstar Collage with Pastel Spotlights */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
          {/* Sparse Handwritten Note above collage */}
          <div className="self-end mb-2 mr-4">
            <span className="font-handwritten text-lg sm:text-xl text-ink font-semibold flex items-center gap-1 transform rotate-2 select-none">
              Indian Cinema Unplugged
              <span className="text-press font-bold">⤹</span>
            </span>
          </div>

          {/* Central Collage Card */}
          <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-[28px] border-2 border-ink shadow-press overflow-hidden group bg-paper">
            {/* Warm spotlight disc backdrop */}
            <div
              className={`absolute -top-12 -right-12 w-48 h-48 rounded-full ${currentStar.color} transition-colors duration-500 opacity-80`}
            />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#FFE57F]/60 blur-xs" />

            {/* Dynamic Star Image */}
            <Image
              src={currentStar.image}
              alt={currentStar.name}
              fill
              priority
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div aria-hidden="true" className="absolute inset-0 halftone-faint opacity-20 pointer-events-none" />

            {/* Gradient wash for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

            {/* Floating Top Pill Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-poster uppercase tracking-wider font-bold border border-ink shadow-xs ${currentStar.traditionBg}`}
              >
                {currentStar.tradition}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-paper/90 backdrop-blur-xs text-ink text-[10px] font-mono font-bold border border-ink/20">
                Spotlight #{activeStarIndex + 1}
              </span>
            </div>

            {/* Bottom Content Overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-10 text-paper space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-widest text-marquee font-bold">
                {currentStar.title}
              </p>
              <h3 className="text-2xl sm:text-3xl font-poster uppercase tracking-tight text-paper font-bold leading-none">
                {currentStar.name}
              </h3>
              <p className="text-xs text-paper/80 font-grotesk font-medium pt-1 flex items-center justify-between">
                <span>Headline Project: {currentStar.film}</span>
                <span className="text-[10px] font-mono text-paper/60">6 TRADITIONS</span>
              </p>
            </div>
          </div>

          {/* Interactive Star Thumbnails Strip */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            {cinemaSuperstars.map((star, idx) => (
              <button
                key={star.name}
                type="button"
                onClick={() => {
                  setActiveStarIndex(idx);
                  if (onSelectIndustry) onSelectIndustry(star.tradition.toLowerCase());
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-poster uppercase tracking-wide border-2 transition-all ${
                  activeStarIndex === idx
                    ? "bg-ink text-paper border-ink shadow-press scale-105"
                    : "bg-paper text-ink border-ink/30 hover:border-ink hover:bg-sheet"
                }`}
                aria-label={`View ${star.name}`}
              >
                <span className="relative w-4 h-4 rounded-full overflow-hidden shrink-0 border border-ink/40">
                  <Image src={star.image} alt={star.name} fill className="object-cover" />
                </span>
                <span className="font-bold">{star.tradition}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

