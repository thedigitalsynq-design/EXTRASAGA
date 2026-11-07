"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Film,
  Calendar,
  Clock,
  Sparkles,
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

    loadReleases();
  }, [language, upcomingFilter]);

  const displayedMovies = activeTab === "in_theatres" ? latestMovies : upcomingMovies;

  return (
    <section className="bg-[#F8FAF9] p-6 sm:p-10 rounded-[32px] border border-[#E5EBE7] shadow-sm relative overflow-hidden text-[#0F3529]">
      {/* Subtle geometric jade grid texture (Reference Image 5) */}
      <div className="absolute inset-0 jade-grid-bg opacity-50 pointer-events-none"></div>

      {/* Header bar (Reference Images 1 & 2) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5EBE7] relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F8EB] text-[#1A5140] border border-[#B7E5BA] text-xs font-bold uppercase tracking-wider">
              <Clapperboard className="w-3.5 h-3.5 text-[#288760]" />
              <span>{config.industryName} Cinema Radar</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F3529] font-sans flex flex-wrap items-center gap-2.5 tracking-tight">
            <span>ಸಿನಿಮಾ ಬಿಡುಗಡೆ ಹಬ್ (Cinema Releases)</span>
            <span className="text-xs px-3 py-1 rounded-full bg-[#E8F8EB] text-[#1A5140] border border-[#B7E5BA] font-sans font-bold flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#28D070] animate-pulse"></span>
              Dynamic Asia/Kolkata
            </span>
            {windowStats && (
              <span className="text-[11px] px-3 py-1 rounded-full bg-white text-gray-700 border border-[#E5EBE7] font-sans font-semibold shadow-2xs">
                30-ದಿನಗಳ ವಿಂಡೋ: {windowStats.start} &rarr; {windowStats.end}
              </span>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1.5 font-sans leading-relaxed max-w-2xl">
            ಕಳೆದ 30 ದಿನಗಳಲ್ಲಿ ಬಿಡುಗಡೆಯಾದ ಹೊಸ ಸಿನಿಮಾಗಳು ಮತ್ತು ಮುಂಬರುವ 30 ದಿನಗಳ ಬಹುಮೂಲ ದೃಢೀಕೃತ ಬಿಡುಗಡೆಗಳ ಲೈವ್ ಅಪ್ಡೇಟ್.
          </p>
        </div>

        {/* Primary Tab Switcher (Reference Image 3 Floating Pill) */}
        <div className="flex items-center gap-1 bg-white p-1.5 rounded-full border border-[#E5EBE7] self-start md:self-auto shadow-sm">
          <button
            onClick={() => setActiveTab("in_theatres")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === "in_theatres"
              ? "bg-[#288760] text-white shadow-xs"
              : "text-[#1A5140] hover:bg-[#E8F8EB]"
              }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>ಚಿತ್ರಮಂದಿರಗಳಲ್ಲಿ (In Theatres)</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
              {latestMovies.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === "upcoming"
              ? "bg-[#288760] text-white shadow-xs"
              : "text-[#1A5140] hover:bg-[#E8F8EB]"
              }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>ಮುಂಬರುವ ಚಿತ್ರಗಳು (Upcoming)</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
              {upcomingMovies.length}
            </span>
          </button>
        </div>
      </div>

      {/* Sub-Filters for Upcoming Releases */}
      {activeTab === "upcoming" && (
        <div className="flex items-center gap-2 py-3.5 overflow-x-auto no-scrollbar border-b border-[#E5EBE7] text-xs relative z-10">
          <span className="text-[11px] text-[#1A5140] font-bold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#288760]" />
            <span>ವಿಂಡೋ:</span>
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
                ? "bg-[#288760] text-white font-bold shadow-xs"
                : "bg-white text-gray-700 hover:bg-[#E8F8EB] hover:text-[#1A5140] border border-[#E5EBE7]"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Releases Cards Grid (Reference Image 3 Grid Style) */}
      <div className="mt-8 relative z-10">
        {displayedMovies.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm font-sans bg-white rounded-[24px] border border-dashed border-[#E5EBE7]">
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
                  className="rounded-[24px] bg-white border border-[#E5EBE7] hover:border-[#288760] shadow-sm hover:shadow-xl transition-all duration-300 ease-out gpu-layer flex flex-col group overflow-hidden"
                >
                  <div className="overflow-hidden bg-white flex flex-col h-full">
                    {/* Poster image container */}
                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-100">
                      <Image
                        src={movie.posterImage}
                        alt={movie.titleEn}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                      {/* Reference Image 2 Style: Vertical pill badge on left */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                        <span
                          className={`text-[10px] font-sans font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider ${diffDays === 0
                            ? "bg-red-600 text-white animate-pulse"
                            : diffDays > 0
                              ? "bg-[#288760] text-white"
                              : "bg-[#1A5140] text-white"
                            }`}
                        >
                          {relativeBadge}
                        </span>
                        {isConfirmed ? (
                          <span className="text-[9px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#1A5140] border border-[#B7E5BA] flex items-center gap-1 shadow-xs">
                            <ShieldCheck className="w-2.5 h-2.5 text-[#288760]" />
                            <span>ದೃಢೀಕೃತ ದಿನಾಂಕ</span>
                          </span>
                        ) : (
                          <span className="text-[9px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-amber-800 border border-amber-300 shadow-xs">
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
                          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#288760] text-white hover:bg-[#1A5140] active:scale-95 transition-all duration-300 flex items-center justify-center shadow-lg shadow-emerald-950/30"
                          title="Watch Official Trailer"
                          aria-label={`Watch ${movie.titleEn} trailer`}
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </Link>
                      )}

                      {/* Genres in subtle pill capsules */}
                      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1 max-w-[70%]">
                        {movie.genres.slice(0, 2).map((g) => (
                          <span
                            key={g}
                            className="text-[9px] font-sans font-semibold px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-white border border-white/10"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-500 font-sans mb-1.5">
                          <span className="uppercase font-bold text-[#288760] tracking-wider text-[11px]">
                            {movie.industry} · {movie.language.toUpperCase()}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500 text-xs">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>{formatted}</span>
                          </span>
                        </div>

                        <h3 className="font-bold text-[#0F3529] text-base group-hover:text-[#288760] transition-colors duration-200 line-clamp-1">
                          <Link href={localizeUrl(`/movies/${movie.slug}`)}>
                            {movie.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-gray-500 font-sans line-clamp-1 font-medium">
                          {movie.titleEn}
                        </p>

                        <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed">
                          {movie.synopsis}
                        </p>
                      </div>

                      <div className="pt-3.5 border-t border-gray-100 space-y-2">
                        <div className="text-xs text-gray-600 flex items-center justify-between">
                          <span className="line-clamp-1">
                            <span className="text-[#0F3529] font-semibold">ನಿರ್ದೇಶನ:</span> {movie.director}
                          </span>
                        </div>

                        <div className="text-xs text-gray-500 flex items-center gap-1.5 line-clamp-1">
                          <Users className="w-3.5 h-3.5 text-[#288760] shrink-0" />
                          <span className="truncate text-gray-600">
                            {movie.cast.map((c) => c.name).slice(0, 2).join(", ")}
                          </span>
                        </div>

                        {/* Reference Image 3 CTA: Rounded Pill Button */}
                        <Link
                          href={localizeUrl(`/movies/${movie.slug}`)}
                          className="w-full py-2.5 rounded-full bg-[#F3F7F5] hover:bg-[#288760] text-[#1A5140] hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 border border-[#E5EBE7] hover:border-[#288760] group/btn shadow-2xs"
                        >
                          <span>ಸಂಪೂರ್ಣ ಮಾಹಿತಿ (View Profile)</span>
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

      {/* Footer navigation link */}
      <div className="mt-8 pt-5 border-t border-[#E5EBE7] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-sans text-gray-500 relative z-10">
        <span className="flex items-center gap-1.5 text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-[#28D070]"></span>
          ದಿನನಿತ್ಯ ಏಷ್ಯಾ/ಕೋಲ್ಕತ್ತಾ (Asia/Kolkata) ಸಮಯ ವಲಯದಲ್ಲಿ ಆಟೋ-ಅಪ್ಡೇಟ್ ಆಗುತ್ತದೆ
        </span>
        <Link
          href={localizeUrl("/movies")}
          className="text-brand-crimson hover:underline font-bold flex items-center gap-1"
        >
          <span>ಎಲ್ಲಾ ಸಿನಿಮಾ ಬಿಡುಗಡೆಗಳ ಪಟ್ಟಿ ವೀಕ್ಷಿಸಿ (View All Releases)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}

