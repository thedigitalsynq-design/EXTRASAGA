"use client";

import React from "react";
import Link from "next/link";
import { Award, ShieldCheck, Clapperboard, Tv, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function EditorialPillarsGrid() {
  const { localizeUrl } = useLanguage();

  const pillars = [
    {
      id: "reviews",
      num: "01",
      title: "The Verdict Desk",
      tagline: "Dual-Axis Critical Reviews",
      description: "Fearless film verdicts evaluating emotional narrative soul and technical visual craft separately. 100% spoiler-free.",
      icon: Award,
      href: "/reviews",
      badge: "VERIFIED VERDICTS",
      badgeColor: "bg-press text-paper",
      accentBg: "hover:bg-[#FFAAA6]/20",
      cta: "Explore Reviews",
    },
    {
      id: "box-office",
      num: "02",
      title: "The Receipts",
      tagline: "Audited Box Office Telemetry",
      description: "Multi-source reconciled theatrical grosses, distributor shares, and live theater occupancy. Zero fake fan-club numbers.",
      icon: ShieldCheck,
      href: "/box-office",
      badge: "AUDITED TELEMETRY",
      badgeColor: "bg-[#F79D65] text-ink",
      accentBg: "hover:bg-[#F79D65]/20",
      cta: "View Ledger",
    },
    {
      id: "movies",
      num: "03",
      title: "Now Showing",
      tagline: "Theatrical Release Calendar",
      description: "Independently verified in-theatres showtimes and upcoming release buckets calculated strictly in Asia/Kolkata (IST).",
      icon: Clapperboard,
      href: "/movies",
      badge: "THEATRICAL WIRE",
      badgeColor: "bg-[#E2F952] text-ink",
      accentBg: "hover:bg-[#E2F952]/20",
      cta: "Browse Movies",
    },
    {
      id: "ott",
      num: "04",
      title: "Digital Radar",
      tagline: "OTT & Streaming Wire",
      description: "Confirmed digital premiere dates and 4K streaming homes across Netflix, Prime Video, Hotstar, ZEE5, and SonyLIV.",
      icon: Tv,
      href: "/ott",
      badge: "STREAMING WIRE",
      badgeColor: "bg-[#CBB2FE] text-ink",
      accentBg: "hover:bg-[#CBB2FE]/20",
      cta: "Stream Now",
    },
  ];

  return (
    <section aria-label="Editorial Pillars and Page Segregation" className="w-full py-6">
      {/* Header bar inspired by BackerNews & EdU */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-ink">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-press animate-pulse" />
            <span className="text-xs font-poster uppercase tracking-wider text-ink font-bold">
              THE FOUR CORNERSTONES OF EXTRASAGA
            </span>
            <span className="text-ink/40 hidden sm:inline">·</span>
            <span className="font-handwritten text-sm text-ink-dim hidden sm:inline select-none">
              explore each dedicated desk ⤹
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-poster uppercase text-ink tracking-tight">
            Specialized Cinema Desks
          </h2>
        </div>

        <span className="text-[11px] font-mono text-ink-dim uppercase">
          Zero clutter · Dedicated deep-dives for every cinephile
        </span>
      </div>

      {/* 4-Column Feature Grid inspired by Image 2 (BackerNews) & Image 3 (SAMART playbill) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;

          return (
            <Link
              key={pillar.id}
              href={localizeUrl(pillar.href)}
              className={`group bg-sheet rounded-[24px] border-2 border-ink shadow-press p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-press-lg hover:-translate-y-1 relative overflow-hidden ${pillar.accentBg}`}
            >
              {/* Red/Pastel spotlight circle accent inspired by Image 3 */}
              <div
                aria-hidden="true"
                className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-press/10 group-hover:scale-150 transition-transform duration-500 pointer-events-none"
              />

              <div>
                {/* Numbered node + Badge */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-band text-ink border border-ink/40">
                    DESK {pillar.num}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-poster uppercase font-bold tracking-wider border border-ink shadow-2xs ${pillar.badgeColor}`}
                  >
                    {pillar.badge}
                  </span>
                </div>

                {/* Icon in circular stamp */}
                <div className="w-12 h-12 rounded-2xl bg-paper border-2 border-ink shadow-sticker flex items-center justify-center text-ink mb-4 group-hover:scale-110 group-hover:bg-press group-hover:text-paper transition-all">
                  <Icon className="w-6 h-6 transition-colors" />
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl font-poster uppercase text-ink tracking-tight leading-snug group-hover:text-press transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs font-mono font-bold text-press-deep mt-0.5 mb-2">
                  {pillar.tagline}
                </p>

                {/* Description */}
                <p className="text-xs text-ink-dim font-grotesk font-medium leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Bottom Action Button */}
              <div className="pt-4 mt-4 border-t border-ink/15 flex items-center justify-between relative z-10">
                <span className="text-xs font-poster uppercase font-bold text-ink group-hover:text-press flex items-center gap-1.5 transition-colors">
                  <span>{pillar.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="w-2 h-2 rounded-full bg-ink/20 group-hover:bg-press transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

