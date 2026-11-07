import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Archive,
  Calendar,
  Search,
  ChevronRight,
  ShieldCheck,
  FileText,
  Clock,
} from "lucide-react";
import { DataService } from "@/lib/dataService";
import { formatReleaseDateIST } from "@/lib/cinemaDateUtils";

export const metadata: Metadata = {
  title: "ಶಾಶ್ವತ ಸಿನಿಮಾ & ಲೇಖನಗಳ ಆರ್ಕೈವ್ (Permanent Archive) | FILMY GARAGE",
  description:
    "FILMY GARAGE ಶಾಶ್ವತ ಸಿನಿಮಾ ಲೇಖನಗಳು, ಹಿಂದಿನ ಬಿಡುಗಡೆಗಳು ಮತ್ತು ಐತಿಹಾಸಿಕ ಬಾಕ್ಸ್ ಆಫೀಸ್ ದಾಖಲೆಗಳ ಸಮಗ್ರ ಡಿಜಿಟಲ್ ಆರ್ಕೈವ್.",
};

export default async function PermanentArchivePage() {
  const [archivedMovies, allArticles] = await Promise.all([
    DataService.getArchivedReleases(),
    DataService.getArticles(),
  ]);

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-gray-900 pb-20 font-sans">
      {/* Archive Header Banner */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/90 py-10 px-4 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
              <Archive className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              Permanent Preservation Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight">
            ಶಾಶ್ವತ ಸಿನಿಮಾ ಆರ್ಕೈವ್ (Permanent Archive)
          </h1>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl leading-relaxed">
            30 ದಿನಗಳ ಗಡುವು ಮೀರಿದ ಎಲ್ಲಾ ಸಿನಿಮಾ ಲೇಖನಗಳು, ಹಿಂದಿನ ರಿಲೀಸ್‌ಗಳು ಮತ್ತು ವಿಮರ್ಶೆಗಳನ್ನು ಅವುಗಳ ಮೂಲ URL ನಲ್ಲೇ ಶಾಶ್ವತವಾಗಿ ಸಂರಕ್ಷಿಸಲಾಗಿದೆ. ಯಾವುದೇ ಲೇಖನವನ್ನು ಎಂದಿಗೂ ಡಿಲೀಟ್ ಮಾಡಲಾಗುವುದಿಲ್ಲ.
          </p>

          <div className="flex items-center gap-3 pt-6 text-xs text-gray-600">
            <span className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 font-bold">
              ಸಂರಕ್ಷಿತ ಸಿನಿಮಾಗಳು: {archivedMovies.length}
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 font-bold">
              ಶಾಶ್ವತ ಲೇಖನಗಳು: {allArticles.length}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
        {/* Section 1: Archived Cinema Releases */}
        <section>
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
            <h2 className="text-xl font-bold text-gray-950 flex items-center gap-2">
              <Archive className="w-5 h-5 text-cyan-600" />
              <span>ಹಿಂದಿನ ಬಿಡುಗಡೆಗಳು (Past Releases &gt; 30 Days)</span>
            </h2>
            <span className="text-xs text-gray-500 font-sans">
              ಮೂಲ URL ಸಂರಕ್ಷಣೆ ಸಕ್ರಿಯವಾಗಿದೆ
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {archivedMovies.map((movie) => {
              const { formatted } = formatReleaseDateIST(movie.theatricalReleaseDate);
              return (
                <article
                  key={movie.id}
                  className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-lg transition-all flex flex-col group shadow-xs"
                >
                  <div className="relative aspect-[2/3] w-full bg-gray-100">
                    <Image
                      src={movie.posterImage}
                      alt={movie.titleEn}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-cyan-800 border border-cyan-200 uppercase backdrop-blur-sm shadow-xs">
                        Archived
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold">
                        {movie.industry} · {formatted}
                      </span>
                      <h3 className="font-bold text-gray-950 text-base line-clamp-1 group-hover:text-cyan-700 transition-colors mt-0.5">
                        <Link href={`/movies/${movie.slug}`}>{movie.title}</Link>
                      </h3>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{movie.titleEn}</p>
                    </div>
                    <Link
                      href={`/movies/${movie.slug}`}
                      className="w-full py-1.5 rounded-lg bg-gray-50 hover:bg-cyan-600 hover:text-white text-gray-700 text-xs font-bold flex items-center justify-center gap-1 transition-colors border border-gray-200"
                    >
                      <span>ಆರ್ಕೈವ್ ವೀಕ್ಷಿಸಿ</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Section 2: Permanent Published Articles Feed */}
        <section>
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
            <h2 className="text-xl font-bold text-gray-950 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              <span>ಸಂಪೂರ್ಣ ಲೇಖನಗಳ ಆರ್ಕೈವ್ (Permanent Articles Archive)</span>
            </h2>
            <span className="text-xs text-gray-500 font-sans">
              ಶಾಶ್ವತ ಪ್ರಕಟಣಾ ಲಾಗ್‌ಗಳು
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allArticles.slice(0, 15).map((art) => (
              <Link
                key={art.id}
                href={`/news/${art.slug}`}
                className="p-4 rounded-2xl bg-white border border-gray-200/90 hover:border-brand-crimson/60 hover:shadow-md transition-all flex gap-4 group shadow-xs"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={art.featuredImage}
                    alt={art.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-1">
                    <span className="uppercase text-amber-700 font-bold">{art.category}</span>
                    <span>•</span>
                    <span>{new Date(art.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-950 group-hover:text-brand-crimson line-clamp-2 transition-colors">
                    {art.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-1">
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

