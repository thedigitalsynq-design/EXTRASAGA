"use client";

import React, { useState } from "react";
import { MessageSquareQuote, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  initials: string;
  accent: string;
}

const TESTIMONIALS_DATA: Record<string, Testimonial[]> = {
  kn: [
    {
      id: "t1",
      quote:
        "EXTRASAGA completely transformed my cinema experience! The dual-axis technical vs emotional review is razor-accurate, and the box-office numbers are ones you can actually bank on.",
      author: "Praveen Kumar",
      role: "Independent Director & Screenwriter",
      location: "Bengaluru, Sandalwood",
      initials: "PK",
      accent: "ultra",
    },
    {
      id: "t2",
      quote:
        "Finally, a digital publication that truly respects film as an art form. The long-form analysis and spoiler-free audits save time and deliver top-notch insight.",
      author: "Ananya Iyer",
      role: "Film Festival Curator",
      location: "Chennai / Bengaluru",
      initials: "AI",
      accent: "ultra",
    },
    {
      id: "t3",
      quote:
        "The regional box-office territory reporting is superb. Every upcoming film's countdown and trade update is thoroughly fact-checked before publication.",
      author: "Vikramaditya Rao",
      role: "Cinema Trade Analyst",
      location: "Hyderabad",
      initials: "VR",
      accent: "signal",
    },
    {
      id: "t4",
      quote:
        "World-class design and refreshingly crisp typography. Zero irritating ads, clickbait-free headlines. A portal tailor-made for true cinephiles.",
      author: "Siddharth Malhotra",
      role: "Cultural Journalist",
      location: "Mumbai",
      initials: "SM",
      accent: "marquee",
    },
  ],
  en: [
    {
      id: "t1",
      quote:
        "EXTRASAGA completely transformed how I track Indian cinema! The dual-axis technical vs story score is spot-on, and the real-time box office analytics are the most accurate in the industry.",
      author: "Praveen Kumar",
      role: "Independent Filmmaker & Screenwriter",
      location: "Bengaluru, Sandalwood",
      initials: "PK",
      accent: "ultra",
    },
    {
      id: "t2",
      quote:
        "Finally, a digital publication that truly respects film as an art form. The long-form retrospectives save me hours and always deliver nuanced, intelligent cinema perspectives.",
      author: "Ananya Iyer",
      role: "Film Festival Programmer & Critic",
      location: "Chennai / Bengaluru",
      initials: "AI",
      accent: "ultra",
    },
    {
      id: "t3",
      quote:
        "The depth of box-office territory reporting and multi-industry release countdowns is incredible. Every release metric has become a staple in my morning routine.",
      author: "Vikramaditya Rao",
      role: "Cinema Trade Analyst",
      location: "Hyderabad, Tollywood",
      initials: "VR",
      accent: "signal",
    },
    {
      id: "t4",
      quote:
        "EXTRASAGA understands world-class visual design. Zero sensational clickbait, clean typography in regional scripts, and blazing fast performance. Simply gold standard.",
      author: "Siddharth Malhotra",
      role: "Cultural Journalist & Cinephile",
      location: "Mumbai, Bollywood",
      initials: "SM",
      accent: "marquee",
    },
  ],
};

export default function EditorialTestimonials() {
  const { language } = useLanguage();
  const [pageIndex, setPageIndex] = useState(0);

  const testimonials = TESTIMONIALS_DATA[language] || TESTIMONIALS_DATA.en;

  const headerMap: Record<string, { pill: string; title: string; subtitle: string }> = {
    kn: {
      pill: "Critic Acclaim",
      title: "What Filmmakers & Audiences Say",
      subtitle: "Voices from filmmakers, reviewers and cinephiles who've made EXTRASAGA their daily cinema-intel source.",
    },
    te: {
      pill: "Praise & Trust",
      title: "What Critics and Audiences Say",
      subtitle: "Experiences of film personalities and cinephiles with our unbiased cinema journalism.",
    },
    ta: {
      pill: "Critic Applause",
      title: "Voices of Film Lovers and Experts",
      subtitle: "Voices of artists who chose EXTRASAGA as their daily cinema-insight hub.",
    },
    ml: {
      pill: "Audience Applause",
      title: "What Film Folks and Audiences Say",
      subtitle: "Reactions to EXTRASAGA's authentic, in-depth film analysis.",
    },
    hi: {
      pill: "Critics' Verdict",
      title: "What Filmmakers and Cinephiles Say",
      subtitle: "Views of directors and viewers who made EXTRASAGA part of their daily cinema routine.",
    },
    en: {
      pill: "SIGNAL BOOST",
      title: "What cinema leaders & audiences say",
      subtitle: "Hear from filmmakers, national critics, and passionate cinephiles who make EXTRASAGA their daily morning cinema intelligence ritual.",
    },
  };

  const headerText = headerMap[language] || headerMap.en;

  return (
    <section aria-label="Editorial Testimonials" className="w-full py-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase font-display-latin bg-ultra-faint border border-ultra/30 text-ultra-soft select-none">
          <MessageSquareQuote className="w-3.5 h-3.5" />
          <span>{headerText.pill}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-popcorn tracking-tight font-display-latin">
          {headerText.title}
        </h2>
        <p className="text-sm sm:text-base text-popcorn-dim leading-relaxed font-normal">
          {headerText.subtitle}
        </p>
      </div>

      {/* 4 Clean Vertical Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="rounded-[28px] glass-bento bg-revealed/70 backdrop-blur-2xl border border-glow-line p-6 flex flex-col justify-between hover:border-ultra/40 hover:shadow-[0_0_28px_rgba(155,109,255,0.15)] transition-cinema gpu-layer group relative"
          >
            {/* Top Quote */}
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-popcorn-dim leading-relaxed font-normal italic">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            {/* Bottom Author Info */}
            <div className="pt-6 border-t border-glow-line mt-6 flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full glass-panel bg-screen border border-glow-line-strong flex items-center justify-center font-bold text-xs tracking-wider shrink-0 select-none text-popcorn`}
              >
                {item.initials}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-popcorn truncate">
                    {item.author}
                  </h4>
                  <CheckCircle2 className="w-3 h-3 text-ultra-soft shrink-0" />
                </div>
                <p className="text-[11px] text-popcorn-muted truncate mt-0.5">
                  {item.role}
                </p>
                <p className="text-[10px] text-popcorn-muted truncate opacity-80">
                  {item.location}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Micro-Controls */}
      <div className="flex items-center gap-2 mt-6 justify-start">
        <button
          type="button"
          onClick={() => setPageIndex((p) => (p === 0 ? 1 : 0))}
          className="w-8 h-8 rounded-full border border-glow-line bg-revealed hover:bg-screen hover:border-ultra/40 text-popcorn-dim hover:text-ultra-soft flex items-center justify-center transition-spring text-xs"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setPageIndex((p) => (p === 0 ? 1 : 0))}
          className="w-8 h-8 rounded-full border border-glow-line bg-revealed hover:bg-screen hover:border-ultra/40 text-popcorn-dim hover:text-ultra-soft flex items-center justify-center transition-spring text-xs"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
