"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Award, ChevronRight, Layers } from "lucide-react";
import { MovieReview } from "@/types";
import { formatEditorialDate } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import RamayanaSpotlightReview from "@/components/RamayanaSpotlightReview";

interface ReviewsSectionProps {
  reviews: MovieReview[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const { config, t, localizeUrl } = useLanguage();
  const [industryFilter, setIndustryFilter] = useState<string>("all");

  const filteredReviews = industryFilter === "all"
    ? reviews
    : reviews.filter((r) => {
        if (r.industry === industryFilter) return true;
        if (industryFilter === "bollywood" && (r.language === "hi" || r.movieTitle.includes("Ranbir") || r.movieTitle.includes("War"))) return true;
        if (industryFilter === "tollywood" && (r.language === "te" || r.movieTitle.includes("Pushpa") || r.movieTitle.includes("Devara"))) return true;
        if (industryFilter === "sandalwood" && (r.language === "kn" || r.movieTitle.includes("Kantara") || r.movieTitle.includes("Toxic") || r.movieTitle.includes("UI") || r.movieTitle.includes("Bagheera") || r.movieTitle.includes("Martin"))) return true;
        if (industryFilter === "kollywood" && (r.language === "ta" || r.movieTitle.includes("Coolie") || r.movieTitle.includes("Vettaiyan") || r.movieTitle.includes("GOAT"))) return true;
        if (industryFilter === "mollywood" && (r.language === "ml" || r.movieTitle.includes("Empuraan") || r.movieTitle.includes("Manjummel"))) return true;
        return false;
      });

  return (
    <section className="bg-sheet border-2 border-ink shadow-press p-5 sm:p-8 relative overflow-hidden">
      {/* Halftone plate */}
      <div aria-hidden="true" className="absolute inset-0 halftone-faint opacity-20 pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b-2 border-ink gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet border-2 border-ink shadow-sticker flex items-center justify-center -rotate-2 text-paper shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-poster font-bold text-ink uppercase tracking-tight">
              THE VERDICT DESK · FILM REVIEWS
            </h2>
            <p className="text-xs text-ink-dim font-medium font-sans">
              All Indian Cinema · Dual-Axis Story & Technical Audits · Zero Star Games
            </p>
          </div>
        </div>

        <Link
          href={localizeUrl("/category/reviews")}
          className="px-4 py-2 bg-paper text-ink hover:bg-press hover:text-paper border-2 border-ink shadow-sticker text-xs font-poster font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
        >
          <span>ALL REVIEWS ARCHIVE</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Hero Magnum Opus Review: Ramayana Part 1 in English */}
      <div className="relative z-10 mb-8">
        <RamayanaSpotlightReview />
      </div>

      {/* Other Industry Reviews */}
      <div className="mt-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-5 border-b-2 border-dashed border-ink/30">
          <div className="text-xs font-poster font-bold uppercase tracking-wider text-ink flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-press border border-ink rotate-45" />
            <span>CRITICAL REVIEWS ACROSS ALL INDUSTRIES:</span>
          </div>

          {/* Industry Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[10px] text-ink font-poster font-bold uppercase tracking-widest shrink-0 flex items-center gap-1">
              <Layers className="w-3 h-3 text-press" />
              <span>FILTER:</span>
            </span>
            {[
              { id: "all", label: "All" },
              { id: "bollywood", label: "Bollywood" },
              { id: "tollywood", label: "Tollywood" },
              { id: "sandalwood", label: "Sandalwood" },
              { id: "kollywood", label: "Kollywood" },
              { id: "mollywood", label: "Mollywood" },
            ].map((ind) => (
              <button
                key={ind.id}
                type="button"
                onClick={() => setIndustryFilter(ind.id)}
                className={`px-3 py-0.5 text-[11px] font-poster font-bold uppercase tracking-wider shrink-0 transition-all border-2 border-ink ${
                  industryFilter === ind.id
                    ? "bg-violet text-paper shadow-sticker -rotate-1"
                    : "bg-paper text-ink hover:bg-marquee shadow-2xs"
                }`}
              >
                {ind.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredReviews.slice(0, 6).map((review) => (
            <article
              key={review.id}
              className="group flex flex-col bg-paper border-2 border-ink shadow-press hover:shadow-press-lg transition-all duration-200 overflow-hidden justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-band border-b-2 border-ink">
                  <Image
                    src={review.posterImage}
                    alt={review.movieTitle}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div aria-hidden="true" className="absolute inset-0 halftone-faint opacity-25 pointer-events-none" />

                  {/* Rating Stamp */}
                  <div className="absolute top-3 right-3 bg-marquee text-ink border-2 border-ink px-2.5 py-0.5 shadow-sticker flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-ink text-ink" />
                    <span className="text-xs font-poster font-bold font-mono-tabular">
                      {review.rating.toFixed(1)}
                    </span>
                    <span className="text-[9px] font-bold text-ink/70">/ 5</span>
                  </div>

                  {/* Verdict Sticker */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-block px-2.5 py-0.5 bg-press text-paper border-2 border-ink text-[10px] font-poster font-bold uppercase shadow-sticker truncate max-w-full">
                      {review.verdict}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-sheet">
                  <Link href={`/reviews/${review.slug}`}>
                    <h3 className="text-sm sm:text-base font-poster font-bold text-ink group-hover:text-press transition-colors line-clamp-1 uppercase">
                      {review.movieTitle}
                    </h3>
                  </Link>
                  <p className="mt-1.5 text-xs text-ink-dim line-clamp-2 leading-relaxed font-sans font-medium">
                    {review.summary}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-ink/20 space-y-1 text-[11px] text-ink-dim font-sans">
                    <div>
                      <span className="font-bold text-ink font-poster uppercase">Director:</span>{" "}
                      <span>{review.director}</span>
                    </div>
                    <div>
                      <span className="font-bold text-ink font-poster uppercase">Music:</span>{" "}
                      <span>{review.musicDirector}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 bg-sheet">
                <div className="pt-3 border-t-2 border-dashed border-ink/20 flex items-center justify-between font-mono-tabular text-[11px]">
                  <span className="text-ink-mute">
                    {formatEditorialDate(review.releaseDate)}
                  </span>
                  <Link
                    href={`/reviews/${review.slug}`}
                    className="text-xs font-poster font-bold text-press hover:text-ink flex items-center gap-1 uppercase transition-colors"
                  >
                    <span>Read Verdict</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
