import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Film,
  Calendar,
  Clock,
  ChevronRight,
  ShieldCheck,
  Search,
  Filter,
  Clapperboard,
  Sparkles,
  Layers,
  AlertTriangle,
} from "lucide-react";
import { DataService } from "@/lib/dataService";
import { MovieIntelligenceService } from "@/lib/movieIntelligence/movieIntelligenceService";
import { formatReleaseDateIST } from "@/lib/cinemaDateUtils";
import { FilmIndustry, LanguageCode, MovieReleaseStatus } from "@/types";

export const metadata: Metadata = {
  title: "ಸಿನಿಮಾ ಬಿಡುಗಡೆಗಳು (Cinema Releases Intelligence) | FILMY GARAGE",
  description:
    "ಚಿತ್ರಮಂದಿರಗಳಲ್ಲಿ ಪ್ರದರ್ಶನ ಕಾಣುತ್ತಿರುವ ಮತ್ತು ಮುಂಬರುವ ಹೊಸ ಕನ್ನಡ, ತೆಲುಗು, ತಮಿಳು, ಮಲಯಾಳಂ, ಹಿಂದಿ ಮತ್ತು ಹಾಲಿವುಡ್ ಸಿನಿಮಾಗಳ ಬಹುಮೂಲ ದೃಢೀಕೃತ ಬಿಡುಗಡೆ ಪಟ್ಟಿ.",
};

interface MoviesPageProps {
  searchParams: {
    status?: MovieReleaseStatus;
    industry?: FilmIndustry;
    lang?: LanguageCode;
    q?: string;
  };
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const statusFilter = searchParams.status || undefined;
  const industryFilter = searchParams.industry || undefined;
  const langFilter = searchParams.lang || undefined;
  const searchQuery = searchParams.q || undefined;

  const [movies, stats, verifiedResult] = await Promise.all([
    DataService.getMovies({
      status: statusFilter,
      language: langFilter,
      search: searchQuery,
    }),
    MovieIntelligenceService.getStats(),
    MovieIntelligenceService.getEngineResult(),
  ]);

  // Industry-filtered list
  const filteredMovies = industryFilter
    ? movies.filter((m) => m.industry === industryFilter)
    : movies;

  const verifiedRecordMap = new Map(
    verifiedResult.verifiedMovies.map((vm) => [vm.slug, vm])
  );

  return (
    <main className="min-h-screen pb-20 font-sans bg-[#FBFBFB]">
      {/* Editorial Header Banner with Luminous Beam Accent */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/90 py-8 sm:py-12 px-4 sm:px-6 shadow-xs relative overflow-hidden">
        {/* Soft atmospheric gradient */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-crimson/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-brand-crimson/10 text-brand-crimson border border-brand-crimson/20">
                <Clapperboard className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
                Real-Time Multi-Source Movie Intelligence
              </span>
            </div>

            {/* Dynamic System Clock IST Badge */}
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>ಏಷ್ಯಾ/ಕೋಲ್ಕತ್ತಾ (IST): {stats.todayIST}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-medium">
                30-ದಿನಗಳ ವಿಂಡೋ: {stats.windowStartDate} &rarr; {stats.windowEndDate}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-gray-950 mt-1">
            ಸಿನಿಮಾ ಬಿಡುಗಡೆ ಹಬ್ (Cinema Releases & Discovery Hub)
          </h1>
          <p className="text-sm text-gray-600 mt-2 max-w-3xl leading-relaxed">
            ಕಳೆದ 30 ದಿನಗಳಲ್ಲಿ ಬಿಡುಗಡೆಯಾದ ಹೊಸ ಸಿನಿಮಾಗಳು ಮತ್ತು ಮುಂಬರುವ 30 ದಿನಗಳ ಸಾರ್ವಕಾಲಿಕ ವಿಶ್ವಾಸಾರ್ಹ ಬಿಡುಗಡೆಗಳು. ನಿರ್ಮಾಣ ಸಂಸ್ಥೆಗಳ ಅಧಿಕೃತ ಘೋಷಣೆಗಳು ಮತ್ತು ಮಲ್ಟಿಪ್ಲೆಕ್ಸ್ ಬುಕಿಂಗ್ ಜಾಲದಿಂದ ಸ್ವತಂತ್ರವಾಗಿ ದೃಢೀಕರಿಸಲಾಗಿದೆ.
          </p>

          {/* Primary Status Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-6">
            <Link
              href="/movies"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                !statusFilter
                  ? "bg-brand-crimson text-white shadow-md"
                  : "bg-white text-gray-700 hover:text-gray-950 border border-gray-200 shadow-2xs"
              }`}
            >
              ಎಲ್ಲಾ ಚಿತ್ರಗಳು (All · {stats.totalDiscovered})
            </Link>
            <Link
              href="/movies?status=in_theatres"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === "in_theatres"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:text-gray-950 border border-gray-200 shadow-2xs"
              }`}
            >
              ಚಿತ್ರಮಂದಿರಗಳಲ್ಲಿ (In Theatres · {stats.nowShowingCount})
            </Link>
            <Link
              href="/movies?status=upcoming"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === "upcoming"
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:text-gray-950 border border-gray-200 shadow-2xs"
              }`}
            >
              ಮುಂಬರುವ 30 ದಿನಗಳು (Upcoming · {stats.upcoming30DaysCount})
            </Link>
            <Link
              href="/archive"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-cyan-700 hover:text-cyan-900 border border-gray-200 shadow-2xs transition-all ml-auto"
            >
              ಶಾಶ್ವತ ಆರ್ಕೈವ್ (Permanent Archive) &rarr;
            </Link>
          </div>

          {/* Industry Filter Pills */}
          <div className="flex items-center gap-1.5 pt-4 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-brand-crimson" />
              <span>ಚಿತ್ರರಂಗ:</span>
            </span>
            {[
              { id: "", label: "ಎಲ್ಲಾ ಚಿತ್ರರಂಗಗಳು" },
              { id: "sandalwood", label: "ಸ್ಯಾಂಡಲ್‌ವುಡ್ (ಕನ್ನಡ)" },
              { id: "tollywood", label: "ಟಾಲಿವುಡ್ (ತೆಲುಗು)" },
              { id: "kollywood", label: "ಕಾಲಿವುಡ್ (ತಮಿಳು)" },
              { id: "mollywood", label: "ಮಾಲಿವುಡ್ (ಮಲಯಾಳಂ)" },
              { id: "bollywood", label: "ಬಾಲಿವುಡ್ (ಹಿಂದಿ)" },
              { id: "hollywood", label: "ಹಾಲಿವುಡ್ (English)" },
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
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-all ${
                    active
                      ? "bg-gray-900 text-white shadow-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
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
        <div className="flex items-center justify-between pb-4 text-xs text-gray-500 border-b border-gray-200 mb-6">
          <span>ಪ್ರದರ್ಶಿಸಲಾದ ಸಿನಿಮಾಗಳು: {filteredMovies.length}</span>
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ಮಲ್ಟಿ-ಸೋರ್ಸ್ ವೆರಿಫೈಡ್ ಡೇಟಾ ಎಂಜಿನ್ ಸಕ್ರಿಯವಾಗಿದೆ</span>
          </span>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="py-20 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-sm">ಆಯ್ಕೆಮಾಡಿದ ಫಿಲ್ಟರ್‌ಗಳಲ್ಲಿ ಯಾವುದೇ ಸಿನಿಮಾಗಳು ಕಂಡುಬಂದಿಲ್ಲ.</p>
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
                  className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-xs hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex flex-col group"
                >
                  {/* Poster container */}
                  <div className="relative aspect-[2/3] w-full bg-gray-100">
                    <Image
                      src={movie.posterImage}
                      alt={movie.titleEn}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Top badges: Relative date & Multi-source verification */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md backdrop-blur-md uppercase tracking-wide border ${
                          diffDays === 0
                            ? "bg-red-600 text-white border-red-500 animate-pulse"
                            : diffDays > 0
                            ? "bg-amber-600 text-white border-amber-500"
                            : "bg-emerald-600 text-white border-emerald-500"
                        }`}
                      >
                        {relativeBadge}
                      </span>

                      {verificationStatus === "confirmed" ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-xs">
                          <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                          <span>ದೃಢೀಕೃತ ({sourcesCount} ಮೂಲಗಳಿಂದ)</span>
                        </span>
                      ) : verificationStatus === "postponed" ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-800 border border-red-200 flex items-center gap-1 shadow-xs">
                          <AlertTriangle className="w-2.5 h-2.5 text-red-600" />
                          <span>ಮುಂದೂಡಲಾಗಿದೆ (Postponed)</span>
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-amber-800 border border-amber-300 shadow-xs">
                          ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ (Pending Verification)
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1">
                      {movie.genres.slice(0, 2).map((g) => (
                        <span
                          key={g}
                          className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-black/80 text-white border border-white/10"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                        <span className="uppercase font-bold text-amber-700">
                          {movie.industry} · {movie.language.toUpperCase()}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{formatted}</span>
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-950 text-base group-hover:text-brand-crimson line-clamp-1 transition-colors">
                        <Link href={`/movies/${movie.slug}`}>{movie.title}</Link>
                      </h3>
                      <p className="text-[11px] text-gray-500 line-clamp-1 font-sans">
                        {movie.titleEn}
                      </p>

                      <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed">
                        {movie.synopsis}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <Link
                        href={`/movies/${movie.slug}`}
                        className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-brand-crimson text-gray-800 hover:text-white text-xs font-bold flex items-center justify-center gap-1 transition-all border border-gray-200 hover:border-brand-crimson shadow-2xs"
                      >
                        <span>ಸಂಪೂರ್ಣ ಮಾಹಿತಿ</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      {movie.theatricalReleaseDate <= stats.todayIST && (
                        <Link
                          href="/box-office"
                          className="px-2.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200 transition-colors"
                          title="View Box Office Analytics"
                        >
                          ಬಾಕ್ಸ್ ಆಫೀಸ್
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
