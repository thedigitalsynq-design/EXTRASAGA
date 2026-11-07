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
          fetch(`/api/movies?status=in_theatres&lang=${language}`),
          fetch(`/api/movies?status=upcoming&lang=${language}${upcomingFilter !== "all" ? `&timeFilter=${upcomingFilter}` : ""}`),
          fetch(`/api/movie-intelligence?status=all&lang=${language}`),
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
  const displayedMovies = movies.slice(0, 8);

  return (
    <section className="w-full rounded-[32px] border border-glow-line bg-hall relative overflow-hidden p-4 sm:p-6 md:p-8">
      {/* Registration grid texture */}
      <div className="absolute inset-0 cinema-grid-bg opacity-30 pointer-events-none"></div>

      {/* Header bar — the marquee board */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-glow-line relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ultra/10 text-ultra border border-ultra/25 text-xs font-bold uppercase tracking-wider">
              <Clapperboard className="w-3.5 h-3.5 text-ultra" />
              <span>{config.industryName} Radar</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-signal/10 text-signal border border-signal/25 text-[10px] font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse"></span>
              <span>Daily Auto-Run</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-popcorn font-sans flex flex-wrap items-center gap-2.5 leading-tight tracking-tight">
            <span className="font-display-latin">
              NOW&nbsp;SHOW
              <span className="text-signal glow-signal-text">ING</span>
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-revealed border border-glow-line text-popcorn-dim font-sans font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-marquee animate-pulse inline-block"></span>
              <span className="font-mono-tabular">Dynamic Asia/Kolkata</span>
            </span>
            {windowStats && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-revealed text-popcorn-dim border border-glow-line font-semibold font-mono-tabular">
                30-Day Window: {windowStats.start} &rarr; {windowStats.end}
              </span>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-popcorn-dim mt-1.5 leading-relaxed max-w-2xl">
            Every run in theatres from the last 30 days and every verified drop in the next 30 — recalculated daily by the Asia/Kolkata engine. Fresh ink, zero stale listings.
          </p>
        </div>

        {/* Tab Switcher — ultra projection chips */}
        <div className="flex items-center gap-1 p-1.5 rounded-full bg-revealed border border-glow-line self-start md:self-auto">
          <button
            onClick={() => setActiveTab("in_theatres")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "in_theatres"
              ? "bg-ultra-deep text-popcorn shadow-[0_0_20px_rgba(155,109,255,0.3)]"
              : "text-popcorn-dim hover:bg-screen hover:text-popcorn"
              }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>In Theatres</span>
            <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-mono-tabular ${activeTab === "in_theatres" ? "bg-void/25 text-popcorn" : "bg-screen text-popcorn-muted"}`}>
              {latestMovies.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "upcoming"
              ? "bg-ultra-deep text-popcorn shadow-[0_0_20px_rgba(155,109,255,0.3)]"
              : "text-popcorn-dim hover:bg-screen hover:text-popcorn"
              }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Releasing</span>
            <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-mono-tabular ${activeTab === "upcoming" ? "bg-void/25 text-popcorn" : "bg-screen text-popcorn-muted"}`}>
              {upcomingMovies.length}
            </span>
          </button>
        </div>
      </div>

      {/* Sub-Filters for Upcoming Releases — perforated ticket strip */}
      {activeTab === "upcoming" && (
        <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar border-b border-glow-line text-xs relative z-10">
          <span className="text-[11px] text-popcorn-dim font-bold uppercase tracking-widest shrink-0 mr-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-ultra" />
            <span>Window:</span>
          </span>
          {[
            { id: "all", label: "ಎಲ್ಲವೂ (All Upcoming)" },
            { id: "today", label: "ಇಂದೇ ಬಿಡುಗಡೆ (Today)" },
            { id: "tomorrow", label: "ನಾಳೆ (Tomorrow)" },
            { id: "next_7_days", label: "ಮುಂದಿನ 7 ದಿನಗಳು" },
            { id: "next_30_days", label: "ಮುಂದಿನ 30 ದಿನಗಳು" },
            { id: "next_60_days", label: "ಮುಂದಿನ 60 ದಿನಗಳು" },
            { id: "next_90_days", label: "ಮುಂದಿನ 90 ದಿನಗಳು" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setUpcomingFilter(f.id as UpcomingTimeFilter)}
              className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-all text-xs ${upcomingFilter === f.id
                ? "bg-ultra-deep text-popcorn font-bold"
                : "bg-revealed text-popcorn-dim hover:bg-screen hover:text-popcorn border border-glow-line"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Releases Grid — one poster per title */}
      <div className="mt-8 relative z-10">
        {displayedMovies.length === 0 ? (
          <div className="py-16 text-center text-popcorn-dim text-sm bg-revealed/60 rounded-[24px] border border-dashed border-glow-line">
            <p>ಆಯ್ಕೆಮಾಡಿದ ವಿಂಡೋದಲ್ಲಿ ಯಾವುದೇ ಸಿನಿಮಾಗಳು ಕಂಡುಬಂದಿಲ್ಲ.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {displayedMovies.map((movie) => {
              const { formatted, relativeBadge, diffDays } = formatReleaseDateIST(movie.theatricalReleaseDate);
              const isConfirmed = movie.releaseDateConfidence === "confirmed";

              return (
                <article
                  key={movie.id}
                  className="rounded-2xl bg-revealed border border-glow-line hover:border-glow-line-strong hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(155,109,255,0.16)] transition-all duration-300 ease-out gpu-layer flex flex-col group overflow-hidden"
                >
                  <div className="overflow-hidden bg-revealed flex flex-col h-full">
                    {/* Poster image container */}
                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-hall">
                      <Image
                        src={movie.posterImage}
                        alt={movie.titleEn}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-void/85 via-transparent to-void/20"></div>

                      {/* Filmstrip sprocket rails */}
                      <div aria-hidden="true" className="absolute top-0 inset-x-0 h-2 z-10 [background-image:repeating-linear-gradient(90deg,#0D0D16_0_9px,transparent_9px_18px)]"></div>
                      <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-2 z-10 [background-image:repeating-linear-gradient(90deg,#0D0D16_0_9px,transparent_9px_18px)]"></div>

                      {/* Status stamps */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${diffDays === 0
                            ? "bg-signal-deep text-popcorn animate-pulse shadow-[0_0_16px_rgba(255,46,80,0.35)]"
                            : diffDays > 0
                              ? "bg-marquee text-void"
                              : "bg-void/85 text-popcorn-dim border border-glow-line"
                            }`}
                        >
                          {relativeBadge}
                        </span>
                        {isConfirmed ? (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-void/85 backdrop-blur-md text-popcorn border border-glow-line flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5 text-marquee" />
                            <span>ದೃಢೀಕೃತ ದಿನಾಂಕ</span>
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-void/85 backdrop-blur-md text-popcorn-dim border border-glow-line">
                            ತಾತ್ಕಾಲಿಕ (Tentative)
                          </span>
                        )}
                        {diffDays >= 0 && (
                          <ReleaseCountdown releaseDate={movie.theatricalReleaseDate} compact={true} />
                        )}
                      </div>

                      {/* Trailer Button Overlay */}
                      {movie.trailerYoutubeId && (
                        <Link
                          href={`https://www.youtube.com/watch?v=${movie.trailerYoutubeId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute bottom-3 right-3 z-10 w-10 h-10 rounded-full bg-signal-deep text-popcorn hover:bg-signal active:scale-95 transition-all duration-300 flex items-center justify-center shadow-[0_0_20px_rgba(255,46,80,0.3)]"
                          title="Watch Official Trailer"
                          aria-label={`Watch ${movie.titleEn} trailer`}
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </Link>
                      )}

                      {/* Genre tags */}
                      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1 max-w-[70%]">
                        {movie.genres.slice(0, 2).map((g) => (
                          <span
                            key={g}
                            className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-void/75 backdrop-blur-md text-popcorn-dim border border-glow-line"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-revealed">
                      <div>
                        <div className="flex items-center justify-between text-xs text-popcorn-muted mb-1.5 font-mono-tabular">
                          <span className="uppercase font-bold text-ultra tracking-wider text-[11px]">
                            {movie.industry} · {movie.language.toUpperCase()}
                          </span>
                          <span className="flex items-center gap-1 text-popcorn-muted text-xs">
                            <Calendar className="w-3.5 h-3.5 text-popcorn-muted" />
                            <span>{formatted}</span>
                          </span>
                        </div>

                        <h3 className="font-bold text-popcorn text-base group-hover:text-ultra transition-colors duration-200 line-clamp-1">
                          <Link href={localizeUrl(`/movies/${movie.slug}`)}>
                            {movie.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-popcorn-dim line-clamp-1 font-medium">
                          {movie.titleEn}
                        </p>

                        <p className="text-xs text-popcorn-dim line-clamp-2 mt-2 leading-relaxed">
                          {movie.synopsis}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-glow-line space-y-2">
                        <div className="text-xs text-popcorn-dim flex items-center justify-between">
                          <span className="line-clamp-1">
                            <span className="text-popcorn font-bold">ನಿರ್ದೇಶನ:</span> {movie.director}
                          </span>
                        </div>

                        <div className="text-xs text-popcorn-dim flex items-center gap-1.5 line-clamp-1">
                          <Users className="w-3.5 h-3.5 text-ultra shrink-0" />
                          <span className="truncate">
                            {movie.cast.map((c) => c.name).slice(0, 2).join(", ")}
                          </span>
                        </div>

                        {/* Profile CTA */}
                        <Link
                          href={localizeUrl(`/movies/${movie.slug}`)}
                          className="w-full py-2.5 rounded-full bg-screen hover:bg-ultra-deep text-popcorn text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 border border-glow-line hover:border-ultra-deep group/btn"
                        >
                          <span>Full Dossier (View Profile)</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer navigation strip */}
      <div className="mt-8 pt-4 border-t border-glow-line flex flex-col sm:flex-row items-center justify-between gap-2 text-xs relative z-10">
        <span className="flex items-center gap-1.5 text-popcorn-dim">
          <span className="w-1.5 h-1.5 rounded-full bg-signal inline-block animate-pulse"></span>
          ದಿನನಿತ್ಯ ಏಷ್ಯಾ/ಕೋಲ್ಕತ್ತಾ (Asia/Kolkata) ಸಮಯ ವಲಯದಲ್ಲಿ ಆಟೋ-ಅಪ್ಡೇಟ್ ಆಗುತ್ತದೆ
        </span>
        <Link
          href={localizeUrl("/movies")}
          className="text-signal hover:text-signal-soft hover:underline font-bold uppercase tracking-wider flex items-center gap-1"
        >
          <span>Full Release Archive</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
