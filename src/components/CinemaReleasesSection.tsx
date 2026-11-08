"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Film,
  Calendar,
  Clock,
  Play,
  ChevronRight,
  ShieldCheck,
  Clapperboard,
  Users,
  Layers,
  Sparkles,
} from "lucide-react";
import { Movie } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import {
  UpcomingTimeFilter,
  formatReleaseDateIST,
} from "@/lib/cinemaDateUtils";
import ReleaseCountdown from "@/components/ReleaseCountdown";

interface CinemaReleasesSectionProps {
  initialLatest?: Movie[];
  initialUpcoming?: Movie[];
}

export default function CinemaReleasesSection({
  initialLatest = [],
  initialUpcoming = [],
}: CinemaReleasesSectionProps) {
  const { language, config, localizeUrl } = useLanguage();
  const [activeTab, setActiveTab] = useState<"in_theatres" | "upcoming">("in_theatres");
  const [upcomingFilter, setUpcomingFilter] = useState<UpcomingTimeFilter>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [latestMovies, setLatestMovies] = useState<Movie[]>(initialLatest);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>(initialUpcoming);
  const [windowStats, setWindowStats] = useState<{ start: string; end: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialRef = React.useRef(true);

  useEffect(() => {
    async function loadReleases() {
      setIsLoading(true);
      try {
        const [resLatest, resUpcoming, resIntel] = await Promise.all([
          fetch("/api/movies?status=in_theatres"),
          fetch(`/api/movies?status=upcoming${upcomingFilter !== "all" ? `&timeFilter=${upcomingFilter}` : ""}`),
          fetch("/api/movie-intelligence?status=all"),
        ]);

        if (resLatest.ok) {
          const data = await resLatest.json();
          if (data.movies && data.movies.length > 0) {
            setLatestMovies(data.movies);
          }
        }
        if (resUpcoming.ok) {
          const data = await resUpcoming.json();
          if (data.movies && data.movies.length > 0) {
            setUpcomingMovies(data.movies);
          }
        }
        if (resIntel.ok) {
          const intelData = await resIntel.json();
          if (intelData.stats) {
            setWindowStats({
              start: intelData.stats.windowStartDate,
              end: intelData.stats.windowEndDate,
            });
          }
        }
      } catch (e) {
        console.error("Failed to load cinema releases:", e);
      } finally {
        setIsLoading(false);
      }
    }

    if (isInitialRef.current) {
      isInitialRef.current = false;
    }
    loadReleases();
  }, [language, upcomingFilter]);

  const movies = activeTab === "in_theatres" ? latestMovies : upcomingMovies;
  const filteredMovies = industryFilter === "all"
    ? movies
    : movies.filter((m) => {
        if (m.industry === industryFilter) return true;
        if (industryFilter === "bollywood" && m.language === "hi") return true;
        if (industryFilter === "tollywood" && m.language === "te") return true;
        if (industryFilter === "sandalwood" && m.language === "kn") return true;
        if (industryFilter === "kollywood" && m.language === "ta") return true;
        if (industryFilter === "mollywood" && m.language === "ml") return true;
        if (industryFilter === "hollywood" && m.language === "en") return true;
        return false;
      });
  const displayedMovies = filteredMovies.slice(0, 8);

  const getIndustryBadgeClass = (ind?: string) => {
    switch (ind) {
      case "bollywood":
        return "bg-press text-paper";
      case "tollywood":
        return "bg-marquee text-ink";
      case "kollywood":
        return "bg-violet text-paper";
      case "sandalwood":
        return "bg-marquee text-ink";
      case "mollywood":
        return "bg-sheet text-ink border-ink";
      default:
        return "bg-band text-ink";
    }
  };

  return (
    <section className="w-full bg-sheet border-2 border-ink shadow-press p-5 sm:p-8 relative overflow-hidden">
      {/* Registration dot texture */}
      <div aria-hidden="true" className="absolute inset-0 halftone-faint opacity-20 pointer-events-none" />

      {/* Header bar — the poster board */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b-2 border-ink relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-violet text-paper border-2 border-ink shadow-sticker text-[10px] font-poster font-bold uppercase tracking-widest -rotate-1 select-none">
              <Clapperboard className="w-3.5 h-3.5" />
              <span>All Indian Cinema Radar</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-paper text-ink border border-ink text-[10px] font-mono font-bold uppercase tracking-wider select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-press animate-pulse"></span>
              <span>Asia/Kolkata Engine</span>
            </span>
            {windowStats && (
              <span className="text-[10px] px-2.5 py-0.5 bg-band text-ink border border-ink/40 font-mono-tabular font-semibold">
                Window: {windowStats.start} &rarr; {windowStats.end}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-4xl font-poster font-bold text-ink uppercase tracking-tight flex items-center gap-2 leading-none">
            <span>NOW SHOW</span>
            <span className="text-press">ING</span>
          </h2>

          <p className="text-xs sm:text-sm text-ink-dim mt-2 leading-relaxed max-w-2xl font-medium font-sans">
            Verified release intelligence across Bollywood, Tollywood, Sandalwood, Kollywood, Mollywood, and global cinema — recalculating daily with zero stale listings.
          </p>
        </div>

        {/* Ticket-Stub Tab Switcher */}
        <div className="flex items-center border-2 border-ink shadow-sticker self-start md:self-auto bg-band p-1 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("in_theatres")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-poster font-bold uppercase tracking-wider transition-all border-2 ${
              activeTab === "in_theatres"
                ? "bg-press text-paper border-ink shadow-sticker -rotate-1"
                : "bg-sheet text-ink border-transparent hover:border-ink"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>In Theatres</span>
            <span className={`ml-1 text-[10px] px-1.5 py-0.2 border border-current font-mono-tabular ${activeTab === "in_theatres" ? "bg-paper text-ink" : "bg-band text-ink"}`}>
              {latestMovies.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-poster font-bold uppercase tracking-wider transition-all border-2 ${
              activeTab === "upcoming"
                ? "bg-violet text-paper border-ink shadow-sticker rotate-1"
                : "bg-sheet text-ink border-transparent hover:border-ink"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Releasing</span>
            <span className={`ml-1 text-[10px] px-1.5 py-0.2 border border-current font-mono-tabular ${activeTab === "upcoming" ? "bg-paper text-ink" : "bg-band text-ink"}`}>
              {upcomingMovies.length}
            </span>
          </button>
        </div>
      </div>

      {/* Sub-Filters for Upcoming Releases (Window Scrubber) */}
      {activeTab === "upcoming" && (
        <div className="flex items-center gap-2 py-3.5 overflow-x-auto no-scrollbar border-b-2 border-dashed border-ink/30 text-xs relative z-10">
          <span className="text-[10px] text-ink-dim font-poster font-bold uppercase tracking-widest shrink-0 mr-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-press" />
            <span>WINDOW:</span>
          </span>
          {[
            { id: "all", label: "All Upcoming" },
            { id: "today", label: "Today" },
            { id: "tomorrow", label: "Tomorrow" },
            { id: "next_7_days", label: "Next 7 Days" },
            { id: "next_30_days", label: "Next 30 Days" },
            { id: "next_60_days", label: "Next 60 Days" },
            { id: "next_90_days", label: "Next 90 Days" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setUpcomingFilter(f.id as UpcomingTimeFilter)}
              className={`px-3 py-1 font-poster text-[11px] font-bold uppercase tracking-wide shrink-0 transition-all border-2 border-ink ${
                upcomingFilter === f.id
                  ? "bg-ink text-paper shadow-sticker"
                  : "bg-paper text-ink hover:bg-band shadow-2xs"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Industry Filter Pills — Unified Platform Filter */}
      <div className="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar border-b-2 border-ink text-xs relative z-10">
        <span className="text-[10px] text-ink font-poster font-bold uppercase tracking-widest shrink-0 mr-1.5 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-press" />
          <span>INDUSTRY:</span>
        </span>
        {[
          { id: "all", label: "All Cinema" },
          { id: "bollywood", label: "Bollywood (Hindi)" },
          { id: "tollywood", label: "Tollywood (Telugu)" },
          { id: "sandalwood", label: "Sandalwood (Kannada)" },
          { id: "kollywood", label: "Kollywood (Tamil)" },
          { id: "mollywood", label: "Mollywood (Malayalam)" },
          { id: "hollywood", label: "Hollywood / Global" },
        ].map((ind) => {
          const active = industryFilter === ind.id;
          return (
            <button
              key={ind.id}
              type="button"
              onClick={() => setIndustryFilter(ind.id)}
              className={`px-3 py-1 text-[11px] font-poster font-bold uppercase tracking-wide shrink-0 transition-all border-2 border-ink select-none ${
                active
                  ? "bg-press text-paper shadow-sticker -rotate-1"
                  : "bg-paper text-ink hover:bg-marquee hover:border-ink shadow-2xs"
              }`}
            >
              {ind.label}
            </button>
          );
        })}
      </div>

      {/* Releases Grid — Press Poster Cards */}
      <div className="mt-8 relative z-10">
        {displayedMovies.length === 0 ? (
          <div className="py-14 text-center text-ink-dim text-sm bg-paper border-2 border-dashed border-ink p-6">
            <p className="font-poster uppercase tracking-wider font-bold">No verified titles found in this selection.</p>
            <p className="text-xs text-ink-mute mt-1">Try selecting &ldquo;All Cinema&rdquo; or expanding the upcoming window.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedMovies.map((movie) => {
              const { formatted, relativeBadge, diffDays } = formatReleaseDateIST(movie.theatricalReleaseDate);
              const isConfirmed = movie.releaseDateConfidence === "confirmed";

              return (
                <article
                  key={movie.id}
                  className="bg-paper border-2 border-ink shadow-press hover:shadow-press-lg transition-all duration-200 group flex flex-col justify-between overflow-hidden"
                >
                  <div className="flex flex-col h-full justify-between">
                    {/* Poster container */}
                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-band border-b-2 border-ink">
                      <Image
                        src={movie.posterImage}
                        alt={movie.titleEn}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div aria-hidden="true" className="absolute inset-0 halftone-faint opacity-25 pointer-events-none" />

                      {/* Status stamps */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
                        <span
                          className={`text-[9px] font-poster font-bold px-2 py-0.5 uppercase tracking-wider border-2 border-ink shadow-sticker ${
                            diffDays === 0
                              ? "bg-press text-paper animate-pulse"
                              : diffDays > 0
                              ? "bg-marquee text-ink"
                              : "bg-paper text-ink"
                          }`}
                        >
                          {relativeBadge}
                        </span>

                        {movie.fivePointVerification ? (
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-950 border-2 border-ink shadow-sticker flex items-center gap-1 uppercase tracking-tight">
                            <ShieldCheck className="w-3 h-3 text-emerald-700 shrink-0" />
                            <span>{movie.fivePointVerification.accuracyGrade || "5/5 Verified"}</span>
                          </span>
                        ) : isConfirmed ? (
                          <span className="text-[9px] font-poster font-bold px-2 py-0.5 bg-paper text-ink border-2 border-ink shadow-sticker flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-press shrink-0" />
                            <span>5/5 Corroborated</span>
                          </span>
                        ) : (
                          <span className="text-[9px] font-poster font-bold px-2 py-0.5 bg-band text-ink-dim border-2 border-ink shadow-sticker">
                            Tentative
                          </span>
                        )}

                        {diffDays >= 0 && (
                          <ReleaseCountdown releaseDate={movie.theatricalReleaseDate} compact={true} />
                        )}
                      </div>

                      {/* Trailer Action Button */}
                      {movie.trailerYoutubeId && (
                        <Link
                          href={`https://www.youtube.com/watch?v=${movie.trailerYoutubeId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute bottom-3 right-3 z-10 w-9 h-9 bg-press text-paper hover:bg-marquee hover:text-ink border-2 border-ink shadow-sticker transition-transform duration-150 flex items-center justify-center active:scale-95"
                          title="Watch Official Trailer"
                          aria-label={`Watch ${movie.titleEn} trailer`}
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </Link>
                      )}

                      {/* Genre Sticker Chips */}
                      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1 max-w-[70%] z-10">
                        {movie.genres.slice(0, 2).map((g) => (
                          <span
                            key={g}
                            className="text-[9px] font-poster font-bold px-1.5 py-0.5 bg-sheet text-ink border border-ink shadow-2xs uppercase"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Movie Information Plate */}
                    <div className="p-4 bg-sheet flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs text-ink-dim mb-1 font-mono-tabular">
                          <span
                            className={`px-2 py-0.2 border border-ink text-[9px] font-poster uppercase font-bold tracking-wider ${getIndustryBadgeClass(
                              movie.industry
                            )}`}
                          >
                            {movie.industry} · {movie.language.toUpperCase()}
                          </span>
                          <span className="text-[11px] font-semibold text-ink-mute flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-ink" />
                            <span>{formatted}</span>
                          </span>
                        </div>

                        <h3 className="font-poster font-bold text-ink text-base group-hover:text-press transition-colors line-clamp-1 uppercase mt-1">
                          <Link href={localizeUrl(`/movies/${movie.slug}`)}>
                            {movie.title}
                          </Link>
                        </h3>

                        <p className="text-xs text-ink-mute font-medium line-clamp-1 mt-0.5">
                          {movie.titleEn}
                        </p>

                        <p className="text-xs text-ink-dim line-clamp-2 mt-2 leading-relaxed font-sans font-medium">
                          {movie.synopsis}
                        </p>
                      </div>

                      <div className="pt-3 border-t-2 border-dashed border-ink/20 space-y-1.5 font-sans">
                        <div className="text-[11px] text-ink-dim truncate">
                          <span className="font-bold text-ink font-poster uppercase">Director:</span> {movie.director}
                        </div>

                        <div className="text-[11px] text-ink-dim flex items-center gap-1.5 truncate">
                          <Users className="w-3 h-3 text-press shrink-0" />
                          <span className="truncate">
                            {movie.cast.map((c) => c.name).slice(0, 2).join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Link to Full Releases Intelligence Hub */}
      <div className="mt-8 pt-5 border-t-2 border-ink flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-poster font-bold uppercase tracking-wider">
        <span className="text-ink-mute font-medium font-sans">
          Independently verified against studio call-sheets, CBFC filings, and multiplex bookers.
        </span>
        <Link
          href={localizeUrl("/movies")}
          className="px-4 py-2 bg-marquee text-ink hover:bg-press hover:text-paper border-2 border-ink shadow-sticker flex items-center gap-1.5 transition-colors"
        >
          <span>Open Full Cinema Releases Desk</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
