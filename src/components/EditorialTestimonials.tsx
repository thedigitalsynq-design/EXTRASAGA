"use client";

import React from "react";
import { MessageSquareQuote, CheckCircle2 } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  initials: string;
}

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "t1",
    quote:
      "CINIJAATRE changed how I follow Indian cinema. Their dual-axis reviews treat film as both a technical craft and an emotional voyage, and the box office numbers are grounded in real trade receipts.",
    author: "Praveen Kumar",
    role: "Independent Filmmaker & Screenwriter",
    location: "Bengaluru, Sandalwood",
    initials: "PK",
  },
  {
    id: "t2",
    quote:
      "At last, a publication that honors the silver screen as a living art form. Their deep retrospective essays are a breath of fresh air in a sea of shallow internet noise.",
    author: "Ananya Iyer",
    role: "Film Festival Programmer & Critic",
    location: "Chennai / Bengaluru",
    initials: "AI",
  },
  {
    id: "t3",
    quote:
      "The territory-by-territory box office breakdown and multi-industry countdowns are unmatched. It has become the first page I open with my morning coffee.",
    author: "Vikramaditya Rao",
    role: "Cinema Trade Analyst",
    location: "Hyderabad, Tollywood",
    initials: "VR",
  },
  {
    id: "t4",
    quote:
      "World-class visual design matched with fearless, honest journalism. No fabricated gossip, no clickbait headlines — just pure, passionate love for the movies.",
    author: "Siddharth Malhotra",
    role: "Cultural Journalist & Cinephile",
    location: "Mumbai, Bollywood",
    initials: "SM",
  },
];

export default function EditorialTestimonials() {
  return (
    <section aria-label="Editorial Testimonials" className="w-full py-12">
      {/* Broadsheet Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b-2 border-ink">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-band text-ink font-black text-xs uppercase tracking-widest border border-ink shadow-sticker mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5 text-poster-red" />
            <span>Critic Acclaim</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-ink uppercase tracking-tight">
            What Cinema Leaders &amp; Audiences Say
          </h2>
          <p className="text-base text-ink-muted font-medium mt-1">
            Voices from the creators behind the camera and the audiences in the front row who make our publication their daily cinema ritual.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono-tabular font-bold text-ink bg-paper px-3 py-1.5 border border-ink shadow-sticker self-start md:self-end">
          <span>Verified Reader Accreditations</span>
        </div>
      </div>

      {/* 4 Broadsheet Testimonial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {TESTIMONIALS_DATA.map((item) => (
          <div
            key={item.id}
            className="bg-sheet border-2 border-ink shadow-press p-6 flex flex-col justify-between card-press-interactive group"
          >
            {/* Top Quote */}
            <div className="space-y-3">
              <span className="text-3xl font-black text-poster-red leading-none select-none block">
                &ldquo;
              </span>
              <p className="text-sm text-ink font-medium leading-relaxed italic -mt-2">
                {item.quote}
              </p>
            </div>

            {/* Bottom Author Info */}
            <div className="pt-4 border-t-2 border-ink/20 mt-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-paper border-2 border-ink flex items-center justify-center font-mono-tabular font-black text-xs text-ink shadow-sticker shrink-0">
                {item.initials}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-black text-ink uppercase tracking-tight truncate">
                    {item.author}
                  </h4>
                  <CheckCircle2 className="w-3 h-3 text-poster-red shrink-0" />
                </div>
                <p className="text-[11px] text-ink-muted truncate font-medium">
                  {item.role}
                </p>
                <p className="text-[10px] text-ink-muted/80 truncate font-mono-tabular font-bold uppercase">
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
