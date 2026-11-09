"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Calendar,
  Users,
  Flame,
  ArrowRight,
} from "lucide-react";
import { HypoFilmItem } from "@/types/boxOffice";
import { HypoMeterService } from "@/lib/hypoMeterService";

export default function CinematicHeroCarousel() {
  const films = HypoMeterService.getTopHyped(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % films.length);
  }, [films.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + films.length) % films.length);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying, nextSlide]);

  if (!films || films.length === 0) return null;

  const currentFilm = films[currentIndex];

  return (
    <div
      className="relative w-full bg-paper border-2 border-ink shadow-press overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label="Upcoming Theatrical Features"
    >
      {/* Background Cinematic Still with Atmospheric Shading */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-band overflow-hidden">
        <Image
          src={currentFilm.backdropImage}
          alt={currentFilm.titleEn}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover transition-opacity duration-700"
        />

        {/* Cinematic Vignette Overlay using Design System Tokens */}
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/80 to-transparent w-full md:w-3/4" />

        {/* Top Feature Pill */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="sticker bg-press text-paper border-2 border-ink px-2.5 py-1 text-[10px] font-mono-tabular font-black uppercase tracking-wider shadow-sticker flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>CINEMATIC SPOTLIGHT</span>
          </span>
          <span className="px-2.5 py-1 text-[10px] font-mono-tabular font-bold uppercase bg-paper text-ink border-2 border-ink shadow-sticker">
            HYPOMETER #{currentIndex + 1}
          </span>
        </div>

        {/* Slide Controls (Top Right) */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-paper p-1 border-2 border-ink shadow-sticker">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Feature"
            className="p-1 hover:bg-band text-ink border border-transparent hover:border-ink transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause Slideshow" : "Resume Slideshow"}
            className="p-1 hover:bg-band text-ink border border-transparent hover:border-ink transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Feature"
            className="p-1 hover:bg-band text-ink border border-transparent hover:border-ink transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Content Standee Grid */}
        <div className="absolute inset-0 flex items-end p-5 sm:p-8 z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 max-w-4xl">
            {/* Standee Poster */}
            <div className="relative aspect-[2/3] w-28 sm:w-36 border-2 border-ink shadow-press overflow-hidden bg-band shrink-0 group">
              <Image
                src={currentFilm.posterImage}
                alt={currentFilm.titleEn}
                fill
                sizes="150px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2 left-2 right-2 text-center">
                <span className="px-1.5 py-0.5 text-[9px] font-mono-tabular font-black uppercase bg-marquee text-ink border border-ink shadow-sticker block">
                  {currentFilm.daysToRelease} DAYS TO GO
                </span>
              </div>
            </div>

            {/* Typography & Actions */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono-tabular font-black uppercase bg-band text-ink border border-ink shadow-sticker">
                  {currentFilm.language}
                </span>
                <span className="text-xs font-mono-tabular font-bold text-ink-dim flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-press" />
                  <span>Theatrical Release: {currentFilm.releaseDateFormatted}</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-5xl font-poster uppercase text-ink tracking-tight leading-tight">
                {currentFilm.title}
              </h2>

              <p className="text-xs sm:text-sm text-ink-dim font-grotesk font-medium line-clamp-2 max-w-xl">
                Directed by <strong>{currentFilm.director}</strong>. Starring {currentFilm.starring}.
              </p>

              {/* Fan Interest & Action Button */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="px-3 py-1.5 bg-paper border-2 border-ink shadow-sticker flex items-center gap-2 text-xs font-mono-tabular font-bold">
                  <Users className="w-4 h-4 text-press" />
                  <span className="text-ink">{currentFilm.interestedCountFormatted} interested</span>
                  <span className="text-[10px] text-press font-black">+{currentFilm.dailyDelta.toLocaleString("en-IN")} today</span>
                </div>

                <Link
                  href="/hypometer"
                  className="px-4 py-1.5 bg-press text-paper hover:bg-press-deep text-xs font-poster uppercase tracking-wider border-2 border-ink shadow-sticker transition-all btn-press-interactive flex items-center gap-1.5"
                >
                  <span>Vote in HypoMeter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicator Bar */}
      <div className="bg-sheet border-t-2 border-ink p-2 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {films.map((f, idx) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 transition-all border border-ink ${
                currentIndex === idx ? "w-8 bg-press" : "w-2 bg-paper hover:bg-band"
              }`}
            />
          ))}
        </div>

        <Link
          href="/hypometer"
          className="text-xs font-mono-tabular font-bold uppercase text-ink hover:text-press transition-colors flex items-center gap-1"
        >
          <span>View All HypoMeter Rankings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

