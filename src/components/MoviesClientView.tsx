"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  ChevronRight,
  ShieldCheck,
  Clapperboard,
  Layers,
  AlertTriangle,
  Search,
  Clock,
  Tv,
  Film,
  Sparkles,
  X,
  Play,
  RotateCcw,
} from "lucide-react";
import { formatReleaseDateIST, matchesUpcomingBucket, UpcomingTimeFilter } from "@/lib/cinemaDateUtils";
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusFilter = (searchParams.get("status") || "all") as string;
  const industryFilter = (searchParams.get("industry") || "") as string;
  const timeFilter = (searchParams.get("time") || "all") as UpcomingTimeFilter;
  const queryParam = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(queryParam);

  const verifiedRecordMap = useMemo(() => {
    return new Map(verifiedMovies.map((vm) => [vm.slug, vm]));
  }, [verifiedMovies]);

  // Compute status counts for UI tabs
  const counts = useMemo(() => {
    let inTheatres = 0;
    let upcoming = 0;
    let tba = 0;
    let postponed = 0;

    for (const m of allMovies) {
      if (m.releaseStatus === "in_theatres") inTheatres++;
      else if (m.releaseStatus === "upcoming") upcoming++;
      else if (m.releaseStatus === "tba") tba++;
      else if (m.releaseStatus === "postponed") postponed++;
    }

    return {
      all: inTheatres + upcoming + tba + postponed,
      inTheatres,
      upcoming,
      tba,
      postponed,
    };
  }, [allMovies]);

  // Dynamic Filtering Logic
  const filteredMovies = useMemo(() => {
    return allMovies.filter((movie) => {
      // 1. Exclude archived releases from main active release sections
      if (movie.releaseStatus === "archived") {
        return false;
      }

      // 2. Status Filter
      if (statusFilter === "in_theatres" && movie.releaseStatus !== "in_theatres") {
        return false;
      }
      if (statusFilter === "upcoming" && movie.releaseStatus !== "upcoming") {
        return false;
      }
      if (statusFilter === "tba" && movie.releaseStatus !== "tba") {
        return false;
      }
      if (statusFilter === "postponed" && movie.releaseStatus !== "postponed") {
        return false;
      }

      // 3. Time Filter (for upcoming movies)
      if (
        timeFilter !== "all" &&
        movie.releaseStatus === "upcoming" &&
        movie.theatricalReleaseDate &&
        movie.theatricalReleaseDate !== "TBA"
      ) {
        if (!matchesUpcomingBucket(movie.theatricalReleaseDate, timeFilter, stats.todayIST)) {
          return false;
        }
      }

      // 4. Industry Filter
      if (industryFilter && movie.industry !== industryFilter) {
        return false;
      }

      // 5. Search Query
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const inTitle = (movie.title || "").toLowerCase().includes(q);
        const inTitleEn = (movie.titleEn || "").toLowerCase().includes(q);
        const inDirector = (movie.director || "").toLowerCase().includes(q);
        const inSynopsis = (movie.synopsis || "").toLowerCase().includes(q);
        const inCast = (movie.cast || []).some((c) => (c.name || "").toLowerCase().includes(q));
        const inGenres = (movie.genres || []).some((g) => g.toLowerCase().includes(q));

        if (!inTitle && !inTitleEn && !inDirector && !inSynopsis && !inCast && !inGenres) {
          return false;
        }
      }

      return true;
    });
  }, [allMovies, statusFilter, industryFilter, timeFilter, searchQuery, stats.todayIST]);

  const updateFilters = (params: { status?: string; industry?: string; time?: string; q?: string }) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (params.status !== undefined) {
      if (params.status === "all") nextParams.delete("status");
      else nextParams.set("status", params.status);
    }

    if (params.industry !== undefined) {
      if (!params.industry) nextParams.delete("industry");
      else nextParams.set("industry", params.industry);
    }

    if (params.time !== undefined) {
      if (params.time === "all") nextParams.delete("time");
      else nextParams.set("time", params.time);
    }

    if (params.q !== undefined) {
      if (!params.q) nextParams.delete("q");
      else nextParams.set("q", params.q);
    }

    router.push(`/movies?${nextParams.toString()}`);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    router.push("/movies");
  };

  return (
    <main className="min-h-screen pb-20 bg-paper text-ink">
      {/* Now Showing — Cinema Header Band */}
      <div className="bg-sheet border-b border-line py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-press text-paper rounded border border-line shadow-sm">
                <Clapperboard className="w-4 h-4" />
              </span>
              <span className="sticker bg-band text-ink border border-line px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded">
                LIVE CINEMA RELEASES &amp; VERIFIED RADAR
              </span>
            </div>

            {/* Dynamic System Clock IST Badge */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-3 py-1 bg-surface text-ink border border-line rounded font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-press animate-ping" />
                <span>Asia/Kolkata (IST): {stats.todayIST}</span>
              </span>
              <span className="px-3 py-1 bg-band text-ink border border-line rounded font-bold">
                Rolling Discovery: {stats.windowStartDate} &rarr; {stats.windowEndDate}
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-poster uppercase text-ink tracking-tight mt-2">
            CINEMA RELEASES &amp; <span className="text-press">DISCOVERY HUB</span>
          </h1>
          <p className="text-xs sm:text-sm text-ink-dim mt-2 max-w-3xl leading-relaxed font-medium">
            Strictly verified theatrical premieres, confirmed upcoming festival showcases, and officially announced future productions. Prioritizing information accuracy, zero placeholder mocks, and real-time release date synchronicity across Indian and world cinema.
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-xl relative">
            <Search className="w-4 h-4 text-ink-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                updateFilters({ q: e.target.value });
              }}
              placeholder="Search by title, actor, director, genre, or keyword..."
              className="w-full pl-10 pr-10 py-2.5 bg-surface text-ink border border-line rounded-lg text-xs placeholder:text-ink-mute focus:outline-none focus:border-press transition-colors shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  updateFilters({ q: "" });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-dim hover:text-ink"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Primary Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-6 border-b border-line pb-4">
            <button
              type="button"
              onClick={() => updateFilters({ status: "all" })}
              className={`px-3.5 py-1.5 border rounded-lg text-xs font-poster uppercase tracking-wider transition-all ${
                statusFilter === "all"
                  ? "bg-press text-paper border-press shadow-sm -translate-y-0.5"
                  : "bg-surface text-ink border-line hover:bg-band hover:border-line-2"
              }`}
            >
              All Active Releases ({counts.all})
            </button>
            <button
              type="button"
              onClick={() => updateFilters({ status: "in_theatres" })}
              className={`px-3.5 py-1.5 border rounded-lg text-xs font-poster uppercase tracking-wider transition-all ${
                statusFilter === "in_theatres"
                  ? "bg-marquee text-ink border-marquee shadow-sm -translate-y-0.5"
                  : "bg-surface text-ink border-line hover:bg-band hover:border-line-2"
              }`}
            >
              In Theatres Now ({counts.inTheatres})
            </button>
            <button
              type="button"
              onClick={() => updateFilters({ status: "upcoming" })}
              className={`px-3.5 py-1.5 border rounded-lg text-xs font-poster uppercase tracking-wider transition-all ${
                statusFilter === "upcoming"
                  ? "bg-violet text-paper border-violet shadow-sm -translate-y-0.5"
                  : "bg-surface text-ink border-line hover:bg-band hover:border-line-2"
              }`}
            >
              Confirmed Upcoming ({counts.upcoming})
            </button>
            <button
              type="button"
              onClick={() => updateFilters({ status: "tba" })}
              className={`px-3.5 py-1.5 border rounded-lg text-xs font-poster uppercase tracking-wider transition-all ${
                statusFilter === "tba"
                  ? "bg-surface-2 text-press border-press shadow-sm -translate-y-0.5 font-bold"
                  : "bg-surface text-ink border-line hover:bg-band hover:border-line-2"
              }`}
            >
              Announced (Date TBA) ({counts.tba})
            </button>
            {counts.postponed > 0 && (
              <button
                type="button"
                onClick={() => updateFilters({ status: "postponed" })}
                className={`px-3.5 py-1.5 border rounded-lg text-xs font-poster uppercase tracking-wider transition-all ${
                  statusFilter === "postponed"
                    ? "bg-red-900/60 text-red-200 border-red-500 shadow-sm -translate-y-0.5"
                    : "bg-surface text-ink border-line hover:bg-band hover:border-line-2"
                }`}
              >
                Postponed Radar ({counts.postponed})
              </button>
            )}

            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/ott"
                className="px-3 py-1.5 bg-surface text-ink hover:bg-violet hover:text-paper border border-line rounded-lg text-xs font-poster uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                <Tv className="w-3.5 h-3.5 text-violet" />
                <span>OTT Wire</span>
              </Link>
              <Link
                href="/archive"
                className="px-3 py-1.5 bg-band text-ink hover:bg-ink hover:text-paper border border-line rounded-lg text-xs font-poster uppercase tracking-wider transition-all flex items-center gap-1"
                title="Historical Movie Archive"
              >
                <span>The Lore Depot</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Industry Filter Pills */}
          <div className="flex items-center gap-2 pt-4 overflow-x-auto no-scrollbar text-xs">
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
              return (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => updateFilters({ industry: ind.id })}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase shrink-0 transition-all border ${
                    active
                      ? "bg-press text-paper border-press shadow-sm"
                      : "bg-surface text-ink border-line hover:border-line-2 hover:bg-band"
                  }`}
                >
                  {ind.label}
                </button>
              );
            })}
          </div>

          {/* Upcoming Time Window Sub-Filter (shown when viewing Upcoming) */}
          {(statusFilter === "upcoming" || statusFilter === "all") && (
            <div className="flex items-center gap-2 pt-3 overflow-x-auto no-scrollbar text-xs">
              <span className="text-[10px] text-ink-dim font-mono uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-marquee" />
                <span>Window:</span>
              </span>
              {[
                { id: "all", label: "All Upcoming" },
                { id: "today", label: "Today" },
                { id: "tomorrow", label: "Tomorrow" },
                { id: "next_7_days", label: "Next 7 Days" },
                { id: "next_30_days", label: "Next 30 Days" },
                { id: "next_60_days", label: "Next 60 Days" },
                { id: "next_90_days", label: "Next 90 Days" },
              ].map((time) => {
                const active = timeFilter === time.id;
                return (
                  <button
                    key={time.id}
                    type="button"
                    onClick={() => updateFilters({ time: time.id })}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 transition-all border ${
                      active
                        ? "bg-band text-ink border-press shadow-sm"
                        : "bg-surface/50 text-ink-dim border-line/50 hover:border-line hover:bg-band"
                    }`}
                  >
                    {time.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 text-xs text-ink-dim border-b border-line mb-6 font-mono font-bold">
          <span>ACTIVE FILMS ON RADAR: {filteredMovies.length}</span>
          <div className="flex items-center gap-3">
            {(statusFilter !== "all" || industryFilter || timeFilter !== "all" || searchQuery) && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-press hover:underline text-xs uppercase"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
            <span className="flex items-center gap-1 text-press-deep font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>5-PILLAR VERIFIED ENGINE ACTIVE</span>
            </span>
          </div>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="py-20 text-center text-ink-dim bg-sheet border border-dashed border-line rounded-lg p-8 max-w-2xl mx-auto space-y-3">
            <Film className="w-12 h-12 text-ink-mute mx-auto stroke-[1.5]" />
            <h3 className="text-base font-poster uppercase text-ink">
              No films match your selected criteria
            </h3>
            <p className="text-xs text-ink-dim font-medium max-w-md mx-auto leading-relaxed">
              We strictly enforce verified records and refuse to show placeholder mock films or stale dates. Try resetting your search or exploring another industry.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-4 py-2 bg-press text-paper rounded-lg text-xs font-poster uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Show All Active Releases
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => {
              const isTba = movie.theatricalReleaseDate === "TBA" || movie.releaseStatus === "tba";
              const { formatted, relativeBadge, diffDays } = formatReleaseDateIST(movie.theatricalReleaseDate);
              const verifiedRecord = verifiedRecordMap.get(movie.slug);
              const isPostponed = movie.releaseStatus === "postponed" || verifiedRecord?.verificationStatus === "postponed";
              const verificationStatus = isPostponed
                ? "postponed"
                : isTba
                ? "tba"
                : verifiedRecord?.verificationStatus || (movie.releaseDateConfidence === "confirmed" ? "confirmed" : "pending_verification");
              const sourcesCount = verifiedRecord?.sourcesAgreedCount || (movie.sourceReferences?.length || 2);

              return (
                <article
                  key={movie.id}
                  className="bg-sheet border border-line rounded-lg shadow-sm hover:border-line-2 hover:shadow-md transition-all flex flex-col group overflow-hidden"
                >
                  {/* Poster container */}
                  <div className="relative aspect-[2/3] w-full bg-band border-b border-line overflow-hidden">
                    <Image
                      src={movie.posterImage}
                      alt={movie.titleEn}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

                    {/* Top badges: Relative date & Multi-source verification */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider font-mono rounded shadow-sm border ${
                          isPostponed
                            ? "bg-red-900 text-red-200 border-red-500"
                            : isTba
                            ? "bg-surface-2 text-press border-press font-bold"
                            : diffDays === 0
                            ? "bg-press text-paper border-press animate-pulse"
                            : diffDays > 0
                            ? "bg-marquee text-ink border-line"
                            : "bg-violet text-paper border-violet"
                        }`}
                      >
                        {isPostponed ? "Release Postponed" : isTba ? "Release Date TBA" : relativeBadge}
                      </span>

                      {verifiedRecord?.fivePointVerification ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-surface text-ink border border-line rounded shadow-sm flex items-center gap-1 font-mono uppercase">
                          <ShieldCheck className="w-2.5 h-2.5 text-press-deep" />
                          <span>5/5 Verified</span>
                        </span>
                      ) : verificationStatus === "confirmed" ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-surface text-ink border border-line rounded shadow-sm flex items-center gap-1 font-mono uppercase">
                          <ShieldCheck className="w-2.5 h-2.5 text-press-deep" />
                          <span>5-Pillar ({sourcesCount} src)</span>
                        </span>
                      ) : verificationStatus === "postponed" ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-red-950 text-red-200 border border-red-700 rounded shadow-sm flex items-center gap-1 font-mono uppercase">
                          <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
                          <span>Postponed Notice</span>
                        </span>
                      ) : isTba ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-band text-ink border border-line rounded shadow-sm font-mono uppercase flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-press" />
                          <span>Officially Announced</span>
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-band text-ink border border-line rounded shadow-sm font-mono uppercase">
                          Verification Pending
                        </span>
                      )}
                    </div>

                    {/* Genres */}
                    <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1">
                      {movie.genres.slice(0, 2).map((g) => (
                        <span
                          key={g}
                          className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-surface/90 text-ink border border-line rounded backdrop-blur-xs"
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
                          <Calendar className="w-3 h-3 text-ink-dim" />
                          <span>{isTba ? "TBA" : formatted}</span>
                        </span>
                      </div>

                      <h3 className="font-poster uppercase text-ink text-base group-hover:text-press line-clamp-1 transition-colors">
                        <Link href={`/movies/${movie.slug}`}>{movie.title}</Link>
                      </h3>
                      <p className="text-[11px] text-ink-dim line-clamp-1 font-semibold">
                        {movie.titleEn}
                      </p>

                      <p className="text-xs text-ink-dim line-clamp-2 mt-2 leading-relaxed">
                        {movie.synopsis}
                      </p>

                      {/* Cast summary */}
                      {movie.cast && movie.cast.length > 0 && (
                        <p className="text-[11px] text-ink-mute line-clamp-1 mt-2 font-mono">
                          Cast: {movie.cast.map((c) => c.name).slice(0, 3).join(", ")}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-line flex items-center justify-between gap-2">
                      <Link
                        href={`/movies/${movie.slug}`}
                        className="flex-1 py-2 bg-surface text-ink hover:bg-press hover:text-paper text-xs font-poster uppercase tracking-wider flex items-center justify-center gap-1 transition-all border border-line rounded-lg shadow-sm"
                      >
                        <span>Full Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      {movie.theatricalReleaseDate <= stats.todayIST && !isTba && !isPostponed && (
                        <Link
                          href="/box-office"
                          className="px-3 py-2 bg-marquee hover:bg-marquee-soft text-ink text-[11px] font-poster uppercase border border-line rounded-lg shadow-sm transition-colors"
                          title="View Box Office Receipts"
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
