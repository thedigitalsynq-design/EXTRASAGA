import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Archive,
  Calendar,
  ChevronRight,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";
import { DataService } from "@/lib/dataService";
import { formatReleaseDateIST } from "@/lib/cinemaDateUtils";

export const metadata: Metadata = {
  title: "Permanent Cinema & Articles Archive | CINIJAATRE",
  description:
    "CINIJAATRE's comprehensive digital archive of permanent cinema articles, historical releases and authenticated box office records.",
};

export default async function PermanentArchivePage() {
  const [archivedMovies, allArticles] = await Promise.all([
    DataService.getArchivedReleases(),
    DataService.getArticles(),
  ]);

  return (
    <main className="min-h-screen pb-20 font-sans bg-paper text-ink">
      {/* Archive Header Broadsheet Band */}
      <div className="bg-sheet border-b-2 border-ink py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 bg-band text-ink border-2 border-ink shadow-sticker">
              <Archive className="w-5 h-5 text-poster-red" />
            </span>
            <span className="uppercase text-xs font-black tracking-widest text-ink border border-ink bg-paper px-3 py-1 shadow-sticker">
              The Lore Depot · Permanent Preservation Vault
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-ink tracking-tight uppercase max-w-4xl">
            Permanent Celluloid Archive
          </h1>
          <p className="text-base text-ink-muted mt-3 max-w-2xl leading-relaxed font-medium">
            Every cinema article, release dossier, and review that has aged beyond its active theatrical window is preserved permanently at its canonical URL. No cultural record is ever purged.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-6 text-xs text-ink font-bold">
            <span className="px-3.5 py-1.5 bg-paper border-2 border-ink shadow-sticker font-mono-tabular">
              Archived Releases: <span className="text-poster-red font-black">{archivedMovies.length}</span>
            </span>
            <span className="px-3.5 py-1.5 bg-paper border-2 border-ink shadow-sticker font-mono-tabular">
              Permanent Dispatches: <span className="text-poster-violet font-black">{allArticles.length}</span>
            </span>
            <span className="px-3.5 py-1.5 bg-band border-2 border-ink shadow-sticker font-mono-tabular">
              Permanent URL Preservation: <span className="font-black text-poster-red">Active 100%</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
        {/* Section 1: Archived Cinema Releases */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b-2 border-ink mb-6 gap-2">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono-tabular font-black text-poster-red uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Historic Film Catalog</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-ink uppercase tracking-tight flex items-center gap-2">
                <Archive className="w-6 h-6 text-poster-red" />
                <span>Theatrical Catalog ({archivedMovies.length})</span>
              </h2>
            </div>
            <span className="text-xs font-mono-tabular font-bold text-ink-muted uppercase">
              Canonical preservation guaranteed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {archivedMovies.map((movie) => {
              const { formatted } = formatReleaseDateIST(movie.theatricalReleaseDate);
              return (
                <article
                  key={movie.id}
                  className="bg-sheet border-2 border-ink shadow-press overflow-hidden flex flex-col card-press-interactive group"
                >
                  <div className="relative aspect-[2/3] w-full bg-band border-b-2 border-ink">
                    <Image
                      src={movie.posterImage}
                      alt={movie.titleEn}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 text-[10px] font-mono-tabular font-black bg-paper text-ink border border-ink uppercase shadow-sticker">
                        Archived
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] text-ink-muted font-mono-tabular uppercase font-bold block mb-1">
                        {movie.industry} · {formatted}
                      </span>
                      <h3 className="font-black text-ink text-base uppercase line-clamp-1 group-hover:text-poster-red transition-colors">
                        <Link href={`/movies/${movie.slug}`}>{movie.titleEn || movie.title}</Link>
                      </h3>
                      <p className="text-xs text-ink-muted font-medium line-clamp-1 mt-0.5">
                        {movie.genres?.join(", ") || "Action Drama"}
                      </p>
                    </div>
                    <Link
                      href={`/movies/${movie.slug}`}
                      className="w-full py-2 bg-paper hover:bg-band text-ink text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all border-2 border-ink shadow-sticker btn-press-interactive"
                    >
                      <span>View Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5 text-poster-red" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Section 2: Permanent Published Articles Feed */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b-2 border-ink mb-6 gap-2">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono-tabular font-black text-poster-violet uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Editorial Wire Records</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-ink uppercase tracking-tight flex items-center gap-2">
                <FileText className="w-6 h-6 text-poster-violet" />
                <span>Permanent Articles Archive</span>
              </h2>
            </div>
            <span className="text-xs font-mono-tabular font-bold text-ink-muted uppercase">
              Permanent publication log
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allArticles.slice(0, 15).map((art) => (
              <Link
                key={art.id}
                href={`/news/${art.slug}`}
                className="p-4 bg-sheet border-2 border-ink shadow-press hover:bg-paper transition-all flex gap-4 card-press-interactive group"
              >
                <div className="relative w-20 h-20 border border-ink overflow-hidden bg-band shrink-0 shadow-sticker">
                  <Image
                    src={art.featuredImage}
                    alt={art.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[10px] text-ink-muted mb-1 font-mono-tabular font-bold">
                    <span className="uppercase text-poster-red">{art.category}</span>
                    <span>•</span>
                    <span>{new Date(art.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-ink group-hover:text-poster-red line-clamp-2 transition-colors uppercase leading-snug">
                    {art.title}
                  </h4>
                  <p className="text-[11px] text-ink-muted font-medium line-clamp-1 mt-1">
                    {art.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
