"use client";

import React from "react";
import { MessageSquareQuote, Quote, CheckCircle2 } from "lucide-react";
import DotGrid from "@/components/DotGrid";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  initials: string;
  badgeBg: string;
  accentBorder: string;
}

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "t1",
    quote:
      "EXTRASAGA changed how I follow Indian cinema. Their dual-axis reviews treat film as both a technical craft and an emotional voyage, and the box office numbers are grounded in audited trade receipts.",
    author: "Praveen Kumar",
    role: "Independent Filmmaker & Screenwriter",
    location: "Bengaluru, Sandalwood",
    initials: "PK",
    badgeBg: "bg-press text-paper",
    accentBorder: "border-t-4 border-t-press",
  },
  {
    id: "t2",
    quote:
      "At last, an Indian publication that honors the silver screen as living art. Their deep retrospective essays and technical audits are a breath of fresh air in a sea of shallow internet noise.",
    author: "Ananya Iyer",
    role: "Film Festival Programmer & Critic",
    location: "Chennai / Bengaluru",
    initials: "AI",
    badgeBg: "bg-violet text-paper",
    accentBorder: "border-t-4 border-t-violet",
  },
  {
    id: "t3",
    quote:
      "The territory-by-territory box office breakdown and verified multi-industry countdowns are unmatched. It has become the first page I open with my morning espresso.",
    author: "Vikramaditya Rao",
    role: "Cinema Trade Analyst",
    location: "Hyderabad, Tollywood",
    initials: "VR",
    badgeBg: "bg-marquee text-ink",
    accentBorder: "border-t-4 border-t-marquee",
  },
  {
    id: "t4",
    quote:
      "World-class editorial design matched with fearless, honest journalism. No fabricated gossip, no clickbait headlines — just pure, passionate reverence for the movies.",
    author: "Siddharth Malhotra",
    role: "Cultural Journalist & Cinephile",
    location: "Mumbai, Bollywood",
    initials: "SM",
    badgeBg: "bg-paper text-ink",
    accentBorder: "border-t-4 border-t-ink",
  },
];

export default function EditorialTestimonials() {
  return (
    <section aria-label="Editorial Testimonials" className="w-full py-12 relative">
      {/* Broadsheet Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b-2 border-ink">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-band text-ink font-bold text-xs uppercase tracking-widest border-2 border-ink shadow-sticker mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5 text-press-deep" />
            <span>Critic Acclaim</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-poster uppercase text-ink tracking-tight">
            Voices from the Creative Frontline
          </h2>
          <p className="text-sm text-ink-dim font-grotesk font-medium mt-1 max-w-2xl">
            From directors behind the viewfinder to trade specialists in the front row — here is why cinema voices trust our coverage.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-ink bg-paper px-3 py-1.5 border-2 border-ink shadow-sticker self-start md:self-end">
          <CheckCircle2 className="w-3.5 h-3.5 text-press-deep" />
          <span>Verified Reader Accreditations</span>
        </div>
      </div>

      {/* 4 Cards with Pull-Quote Styling inspired by Reference Image 4 & 5 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TESTIMONIALS_DATA.map((item) => (
          <div
            key={item.id}
            className={`bg-sheet border-2 border-ink shadow-press p-6 flex flex-col justify-between card-press-interactive group relative overflow-hidden ${item.accentBorder}`}
          >
            {/* Subtle Dot Grid Accent */}
            <DotGrid className="absolute top-3 right-3" rows={2} cols={3} />

            {/* Top Quote Block */}
            <div className="space-y-3 relative z-10">
              <div className="w-8 h-8 rounded-full bg-paper border-2 border-ink flex items-center justify-center shadow-sticker text-ink">
                <Quote className="w-3.5 h-3.5 fill-current text-press" />
              </div>
              <p className="text-xs sm:text-sm text-ink font-grotesk font-medium leading-relaxed italic">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            {/* Bottom Author Info with Circular Avatar inspired by Reference Image 5 */}
            <div className="pt-4 border-t-2 border-ink/20 mt-6 flex items-center gap-3 relative z-10">
              <div
                className={`w-10 h-10 rounded-full border-2 border-ink flex items-center justify-center font-mono font-bold text-xs shadow-sticker shrink-0 ${item.badgeBg}`}
              >
                {item.initials}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs sm:text-sm font-poster uppercase text-ink tracking-tight truncate">
                  {item.author}
                </h4>
                <p className="text-[10px] text-ink-dim font-grotesk font-medium truncate">
                  {item.role}
                </p>
                <p className="text-[9px] text-ink-mute font-mono uppercase tracking-wider truncate">
                  {item.location}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
