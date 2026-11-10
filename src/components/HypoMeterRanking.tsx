"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Flame,
  ThumbsDown,
  Calendar,
  Users,
  Sparkles,
  TrendingUp,
  Target,
  CheckCircle2,
} from "lucide-react";
import { HypoFilmItem } from "@/types/boxOffice";
import { HypoMeterService } from "@/lib/hypoMeterService";

export default function HypoMeterRanking() {
  const [films, setFilms] = useState<HypoFilmItem[]>(() => HypoMeterService.getFilms());
  const [userVotes, setUserVotes] = useState<Record<string, "hyped" | "not_hyped">>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem("extrasaga_hypometer_votes");
      if (stored) {
        setUserVotes(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not load stored HypoMeter votes", e);
    }
  }, []);

  const handleVote = (slug: string, type: "hyped" | "not_hyped") => {
    if (userVotes[slug]) return; // Already voted

    const updatedVotes = { ...userVotes, [slug]: type };
    setUserVotes(updatedVotes);

    try {
      localStorage.setItem("extrasaga_hypometer_votes", JSON.stringify(updatedVotes));
    } catch (e) {
      console.warn("Could not persist HypoMeter vote", e);
    }

    setFilms((prev) =>
      prev.map((film) => {
        if (film.slug !== slug) return film;
        const newHyped = type === "hyped" ? film.hypedVotes + 1 : film.hypedVotes;
        const newNotHyped = type === "not_hyped" ? film.notHypedVotes + 1 : film.notHypedVotes;
        const total = newHyped + newNotHyped;
        const percent = Math.round((newHyped / total) * 100);

        return {
          ...film,
          hypedVotes: newHyped,
          notHypedVotes: newNotHyped,
          hypedPercent: percent,
          interestedCount: type === "hyped" ? film.interestedCount + 1 : film.interestedCount,
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Elegance Formula Hero Banner */}
      <div className="bg-sheet border border-line rounded-lg shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-line">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="sticker bg-press text-paper border border-line px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded shadow-sm flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>AUDIENCE PULSE ENGINE</span>
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase bg-band text-ink border border-line rounded shadow-sm">
                HYPOMETER RADAR
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-poster uppercase text-ink tracking-tight">
              Most Awaited Theatrical Releases
            </h1>
            <p className="text-xs sm:text-sm text-ink-dim mt-1.5 font-medium max-w-2xl">
              Real-time crowd hype metrics, theatrical interest velocity, and opening day consensus projections for upcoming blockbusters.
            </p>
          </div>

          <div className="p-4 bg-surface border border-line rounded-lg shadow-sm self-start md:self-auto text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-ink-dim block">
              Active Voters
            </span>
            <div className="text-2xl font-poster uppercase text-press mt-0.5">
              1,38,400+
            </div>
            <span className="text-[10px] text-ink-dim block mt-0.5">
              Verified Cinema Cinephiles
            </span>
          </div>
        </div>

        {/* Value Prop Micro-Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 text-xs">
          <div className="p-3 bg-surface border border-line rounded-lg flex items-center gap-2.5 shadow-sm">
            <Users className="w-4 h-4 text-press shrink-0" />
            <span className="text-ink font-bold">1 Vote Per Release Verified</span>
          </div>
          <div className="p-3 bg-surface border border-line rounded-lg flex items-center gap-2.5 shadow-sm">
            <TrendingUp className="w-4 h-4 text-marquee shrink-0" />
            <span className="text-ink font-bold">Daily Velocity Delta Tracked</span>
          </div>
          <div className="p-3 bg-surface border border-line rounded-lg flex items-center gap-2.5 shadow-sm">
            <Target className="w-4 h-4 text-violet shrink-0" />
            <span className="text-ink font-bold">Crowd Opening Day Consensus</span>
          </div>
        </div>
      </div>

      {/* Ranked HypoMeter Cards */}
      <div className="space-y-4">
        {films.map((film, index) => {
          const vote = userVotes[film.slug];
          const hasVoted = Boolean(vote);

          return (
            <article
              key={film.id}
              className="bg-sheet border border-line rounded-lg shadow-sm p-5 sm:p-6 transition-all relative overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Rank & Poster Col */}
                <div className="md:col-span-4 lg:col-span-3 flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <span
                      className={`w-10 h-10 border border-line rounded-lg font-bold text-sm flex items-center justify-center ${index === 0
                          ? "bg-marquee text-ink shadow-sm"
                          : index === 1
                            ? "bg-band text-ink shadow-sm"
                            : index === 2
                              ? "bg-sheet text-ink shadow-sm"
                              : "bg-surface text-ink-dim"
                        }`}
                    >
                      #{index + 1}
                    </span>
                    <span className="text-[9px] text-ink-dim uppercase font-bold mt-1">
                      Rank
                    </span>
                  </div>

                  <div className="relative aspect-[2/3] w-24 sm:w-28 border border-line rounded-lg shadow-sm overflow-hidden bg-band shrink-0 group">
                    <Image
                      src={film.posterImage}
                      alt={film.titleEn}
                      fill
                      sizes="120px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 left-1.5">
                      <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase bg-surface text-ink border border-line rounded shadow-sm">
                        {film.language}
                      </span>
                    </div>
                  </div>

                  <div className="md:hidden flex-1">
                    <h3 className="text-lg font-poster uppercase text-ink line-clamp-1">
                      {film.title}
                    </h3>
                    <p className="text-xs text-ink-dim mt-0.5">
                      Dir. {film.director}
                    </p>
                    <div className="mt-2 text-xs font-bold text-press flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{film.daysToRelease} days to go</span>
                    </div>
                  </div>
                </div>

                {/* Details & Telemetry Col */}
                <div className="md:col-span-5 lg:col-span-6 space-y-3">
                  <div className="hidden md:block">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-2 py-0.5 bg-band text-ink border border-line rounded uppercase font-bold">
                        {film.language}
                      </span>
                      <span className="text-xs text-ink-dim font-bold">
                        {film.releaseDateFormatted}
                      </span>
                    </div>
                    <h3 className="text-2xl font-poster uppercase text-ink tracking-tight">
                      <Link href={`/movies/${film.slug}`} className="hover:text-press transition-colors">
                        {film.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-ink-dim mt-0.5">
                      <strong>Director:</strong> {film.director} • <strong>Starring:</strong> {film.starring}
                    </p>
                  </div>

                  {/* Telemetry Metric Strip */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-surface border border-line rounded-lg shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-ink-dim block flex items-center gap-1">
                        <Users className="w-3 h-3 text-press" />
                        Interested Cinephiles
                      </span>
                      <div className="text-base sm:text-lg font-bold text-ink mt-0.5">
                        {film.interestedCountFormatted}
                      </div>
                      <span className="text-[10px] font-bold text-press block mt-0.5">
                        +{film.dailyDelta.toLocaleString("en-IN")} today
                      </span>
                    </div>

                    <div className="p-3 bg-surface border border-line rounded-lg shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-ink-dim block flex items-center gap-1">
                        <Target className="w-3 h-3 text-marquee" />
                        Day 1 Consensus
                      </span>
                      <div className="text-base sm:text-lg font-bold text-ink mt-0.5">
                        ₹{film.openingDayPredictionMinCr} – {film.openingDayPredictionMaxCr} Cr
                      </div>
                      <span className="text-[10px] text-ink-dim block mt-0.5">
                        Estimated India Net
                      </span>
                    </div>
                  </div>

                  {/* Hype Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-ink flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-press fill-current" />
                        HypoMeter Score
                      </span>
                      <span className="text-press font-bold">{film.hypedPercent}% Hyped</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface border border-line rounded-full overflow-hidden flex">
                      <div
                        className="bg-press transition-all duration-500"
                        style={{ width: `${film.hypedPercent}%` }}
                      />
                      <div
                        className="bg-band transition-all duration-500"
                        style={{ width: `${100 - film.hypedPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Interactive Fan Vote Col */}
                <div className="md:col-span-3 flex flex-col items-stretch gap-2.5 bg-surface p-4 border border-line rounded-lg shadow-sm text-center">
                  <span className="text-[10px] uppercase font-bold text-ink-dim block">
                    Cast Your Pulse
                  </span>

                  {hasVoted ? (
                    <div className="py-3 px-2 bg-band border border-line rounded-lg space-y-1">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-ink">
                        <CheckCircle2 className="w-4 h-4 text-press" />
                        <span>VOTE RECORDED</span>
                      </div>
                      <p className="text-[10px] text-ink-dim">
                        You voted: <strong className="uppercase text-press">{vote === "hyped" ? "Hyped 🔥" : "Not Hyped"}</strong>
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => handleVote(film.slug, "hyped")}
                        className="w-full py-2.5 bg-press text-paper hover:opacity-90 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <Flame className="w-4 h-4 fill-current" />
                        <span>HYPED 🔥</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleVote(film.slug, "not_hyped")}
                        className="w-full py-2 bg-band hover:bg-surface text-ink text-xs font-bold uppercase tracking-wider border border-line rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <ThumbsDown className="w-3.5 h-3.5 text-ink-dim" />
                        <span>NOT HYPED</span>
                      </button>
                    </div>
                  )}

                  <div className="text-[10px] text-ink-dim">
                    {film.hypedVotes.toLocaleString("en-IN")} Cinephiles Hyped
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

