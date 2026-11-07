"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  ChevronRight,
  ShieldCheck,
  Clapperboard,
  Layers,
  AlertTriangle,
} from "lucide-react";
import { formatReleaseDateIST } from "@/lib/cinemaDateUtils";
import { Movie, FilmIndustry, MovieReleaseStatus } from "@/types";
import { VerifiedMovieRecord, MovieIntelligenceStats } from "@/types/movieIntelligence";

interface MoviesClientViewProps {
  allMovies: Movie[];
  stats: MovieIntelligenceStats;
  verifiedMovies: VerifiedMovieRecord[];
}

export default function MoviesClientView({
  allMovies,
  stats,
  verifiedMovies,
}: MoviesClientViewProps) {
  const searchParams = useSearchParams();
  const statusFilter = (searchParams.get("status") || undefined) as MovieReleaseStatus | undefined;
  const industryFilter = (searchParams.get("industry") || undefined) as FilmIndustry | undefined;
  const searchQuery = (searchParams.get("q") || "").trim().toLowerCase();

  const verifiedRecordMap = useMemo(() => {
    return new Map(verifiedMovies.map((vm) => [vm.slug, vm]));
  }, [verifiedMovies]);

  const filteredMovies = useMemo(() => {
    return allMovies.filter((movie) => {
      // 1. Status Filter
      if (statusFilter === "in_theatres" && movie.theatricalReleaseDate > stats.todayIST) {
        return false;
      }
      if (statusFilter === "upcoming" && movie.theatricalReleaseDate <= stats.todayIST) {
        return false;
      }

      // 2. Industry Filter
      if (industryFilter && movie.industry !== industryFilter) {
        return false;
      }

      // 3. Search Query
      if (searchQuery) {
        const inTitle = movie.title.toLowerCase().includes(searchQuery);
        const inTitleEn = movie.titleEn.toLowerCase().includes(searchQuery);
        const inDirector = movie.director.toLowerCase().includes(searchQuery);
        const inSynopsis = movie.synopsis.toLowerCase().includes(searchQuery);
        if (!inTitle && !inTitleEn && !inDirector && !inSynopsis) {
          return false;
        }
      }

      return true;
    });
  }, [allMovies, statusFilter, industryFilter, searchQuery, stats.todayIST]);

  return (
    <main className="min-h-screen pb-20 font-sans bg-paper text-ink">
      {/* Now Showing — Broadsheet Header Band */}
      <div className="bg-sheet border-b-2 border-ink py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-press text-paper border-2 border-ink shadow-sticker">
                <Clapperboard className="w-4 h-4" />
              </span>
              <span className="sticker bg-marquee text-ink border-2 border-ink px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase">
                NOW SHOWING · MULTI-SOURCE RELEASE WIRE
              </span>
            </div>

            {/* Dynamic System Clock IST Badge */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-3 py-1 bg-paper text-ink border-2 border-ink font-bold flex items-center gap-1.5 shadow-sticker">
                <span className="w-2 h-2 bg-press animate-ping"></span>
                <span>Asia/Kolkata (IST): {stats.todayIST}</span>
              </span>
              <span className="px-3 py-1 bg-band text-ink border-2 border-ink font-bold">
                Window: {stats.windowStartDate} &rarr; {stats.windowEndDate}
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-poster uppercase text-ink tracking-tight mt-2">
            CINEMA RELEASES &amp; <span className="text-press">DISCOVERY HUB</span>
          </h1>
          <p className="text-sm text-ink-dim mt-2 max-w-3xl leading-relaxed font-grotesk font-medium">
            From theatrical premieres setting multiplex corridors ablaze to tomorrow&apos;s most awaited festival showcases, explore our independently verified calendar tracing Indian cinema across every language, screen, and horizon.
          </p>

          {/* Primary Status Filter Bar */}
          <div className="flex flex-wrap items-center gap-2.5 pt-6">
            <Link
              href="/movies"
              className={`px-4 py-2 border-2 border-ink text-xs font-poster uppercase tracking-wider transition-all ${
                !statusFilter
                  ? "bg-press text-paper shadow-press -translate-y-0.5"
                  : "bg-paper text-ink hover:bg-band shadow-sticker"
              }`}
            >
              All Films ({stats.totalDiscovered})
            </Link>
            <Link
              href="/movies?status=in_theatres"
              className={`px-4 py-2 border-2 border-ink text-xs font-poster uppercase tracking-wider transition-all ${
                statusFilter === "in_theatres"
                  ? "bg-marquee text-ink shadow-press -translate-y-0.5"
                  : "bg-paper text-ink hover:bg-band shadow-sticker"
              }`}
            >
              In Theatres ({stats.nowShowingCount})
            </Link>
            <Link
              href="/movies?status=upcoming"
              className={`px-4 py-2 border-2 border-ink text-xs font-poster uppercase tracking-wider transition-all ${
                statusFilter === "upcoming"
                  ? "bg-violet text-paper shadow-press -translate-y-0.5"
                  : "bg-paper text-ink hover:bg-band shadow-sticker"
              }`}
            >
              Upcoming 30 Days ({stats.upcoming30DaysCount})
            </Link>
            <Link
              href="/archive"
              className="px-4 py-2 bg-band text-ink hover:bg-ink hover:text-paper border-2 border-ink shadow-sticker text-xs font-poster uppercase tracking-wider transition-all ml-auto"
            >
              The Lore Depot &rarr;
            </Link>
          </div>

          {/* Industry Filter Pills */}
          <div className="flex items-center gap-2 pt-5 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[11px] text-ink font-poster uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-press" />
              <span>Industry:</span>
            </span>
            {[
              { id: "", label: "All Industries" },
              { id: "sandalwood", label: "Sandalwood (Kannada)" },
              { id: "tollywood", label: "Tollywood (Telugu)" },
              { id: "kollywood", label: "Kollywood (Tamil)" },
              { id: "mollywood", label: "Mollywood (Malayalam)" },
              { id: "bollywood", label: "Bollywood (Hindi)" },
              { id: "hollywood", label: "Hollywood (English)" },
            ].map((ind) => {
              const active = (!industryFilter && ind.id === "") || industryFilter === ind.id;
              const href = ind.id
                ? `/movies?${new URLSearchParams({
                    ...(statusFilter ? { status: statusFilter } : {}),
                    industry: ind.id,
                  }).toString()}`
                : `/movies${statusFilter ? `?status=${statusFilter}` : ""}`;

              return (
                <Link
                  key={ind.id}
                  href={href}
                  className={`px-3 py-1.5 text-[11px] font-grotesk font-bold uppercase shrink-0 transition-all border-2 border-ink ${
                    active
                      ? "bg-ink text-paper shadow-press -translate-y-0.5"
                      : "bg-paper text-ink hover:bg-band shadow-sticker"
                  }`}
                >
                  {ind.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex items-center justify-between pb-4 text-xs text-ink-dim border-b-2 border-ink mb-6 font-mono font-bold">
          <span>FILMS PRINTED: {filteredMovies.length}</span>
          <span className="flex items-center gap-1 text-press-deep font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>MULTI-SOURCE VERIFIED DATA ENGINE ACTIVE</span>
          </span>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="py-20 text-center text-ink-dim bg-sheet border-2 border-dashed border-ink p-8">
            <p className="text-sm font-poster uppercase">No films match the selected industry and release filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => {
              const { formatted, relativeBadge, diffDays } = formatReleaseDateIST(movie.theatricalReleaseDate);
              const verifiedRecord = verifiedRecordMap.get(movie.slug);
              const verificationStatus = verifiedRecord?.verificationStatus || (movie.releaseDateConfidence === "confirmed" ? "confirmed" : "pending_verification");
              const sourcesCount = verifiedRecord?.sourcesAgreedCount || 2;

              return (
                <article
                  key={movie.id}
                  className="bg-sheet border-2 border-ink shadow-press hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col group"
                >
                  {/* Poster container */}
                  <div className="relative aspect-[2/3] w-full bg-band border-b-2 border-ink overflow-hidden">
                    <Image
                      src={movie.posterImage}
                      alt={movie.titleEn}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent"></div>

                    {/* Top badges: Relative date & Multi-source verification */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider font-mono border-2 border-ink shadow-sticker ${
                          diffDays === 0
                            ? "bg-press text-paper animate-pulse"
                            : diffDays > 0
                            ? "bg-marquee text-ink"
                            : "bg-violet text-paper"
                        }`}
                      >
                        {relativeBadge}
                      </span>

                      {verificationStatus === "confirmed" ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-paper text-ink border-2 border-ink shadow-sticker flex items-center gap-1 font-mono uppercase">
                          <ShieldCheck className="w-2.5 h-2.5 text-press-deep" />
                          <span>Verified ({sourcesCount} sources)</span>
                        </span>
                      ) : verificationStatus === "postponed" ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-press text-paper border-2 border-ink shadow-sticker flex items-center gap-1 font-mono uppercase">
                          <AlertTriangle className="w-2.5 h-2.5 text-paper" />
                          <span>Postponed</span>
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-band text-ink border-2 border-ink shadow-sticker font-mono uppercase">
                          Pending Verification
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1">
                      {movie.genres.slice(0, 2).map((g) => (
                        <span
                          key={g}
                          className="text-[9px] font-grotesk font-bold uppercase px-1.5 py-0.5 bg-paper text-ink border border-ink"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-ink-dim mb-1 font-mono">
                        <span className="uppercase font-bold text-press-deep">
                          {movie.industry} · {movie.language.toUpperCase()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-ink" />
                          <span>{formatted}</span>
                        </span>
                      </div>

                      <h3 className="font-poster uppercase text-ink text-base group-hover:text-press line-clamp-1 transition-colors">
                        <Link href={`/movies/${movie.slug}`}>{movie.title}</Link>
                      </h3>
                      <p className="text-[11px] text-ink-dim line-clamp-1 font-grotesk font-semibold">
                        {movie.titleEn}
                      </p>

                      <p className="text-xs text-ink-dim line-clamp-2 mt-2 leading-relaxed font-sans">
                        {movie.synopsis}
                      </p>
                    </div>

                    <div className="pt-3 border-t-2 border-ink flex items-center justify-between gap-2">
                      <Link
                        href={`/movies/${movie.slug}`}
                        className="flex-1 py-2 bg-ink hover:bg-press text-paper text-xs font-poster uppercase tracking-wider flex items-center justify-center gap-1 transition-all border-2 border-ink shadow-sticker"
                      >
                        <span>Full Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      {movie.theatricalReleaseDate <= stats.todayIST && (
                        <Link
                          href="/box-office"
                          className="px-2.5 py-2 bg-marquee hover:bg-marquee-soft text-ink text-[11px] font-poster uppercase border-2 border-ink shadow-sticker transition-colors"
                          title="View Box Office Analytics"
                        >
                          Receipts
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
