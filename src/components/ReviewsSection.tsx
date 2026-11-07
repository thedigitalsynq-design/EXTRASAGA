"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Award, ChevronRight } from "lucide-react";
import { MovieReview } from "@/types";
import { formatKannadaDate } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import RamayanaSpotlightReview from "@/components/RamayanaSpotlightReview";

interface ReviewsSectionProps {
  reviews: MovieReview[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const { language, config, t, localizeUrl } = useLanguage();

  const langFiltered = reviews.filter(
    (r) => r.language === language || (!r.language && language === "kn")
  );
  const activeReviews = langFiltered.length > 0 ? langFiltered : reviews;

  const latestReviewsTitle: Record<string, string> = {
    kn: `${config.industryName} ಇತ್ತೀಚಿನ ಸಿನಿಮಾ ವಿಮರ್ಶೆಗಳು:`,
    te: `${config.industryName} తాజా సినిమా రివ్యूలు:`,
    ta: `${config.industryName} சமீபத்திய திரைப்பட விமர்சனங்கள்:`,
    ml: `${config.industryName} പുതിയ സിനിമ റിവ്യൂകൾ:`,
    hi: `${config.industryName} ताज़ा फिल्म समीक्षाएं:`,
    en: `${config.industryName} Latest Critical Movie Reviews:`,
  };

  return (
    <section className="bg-hall p-6 sm:p-8 rounded-[32px] border border-glow-line">
      <div className="flex items-center justify-between pb-5 mb-5 border-b border-glow-line">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-ultra/10 text-ultra border border-ultra/25 flex items-center justify-center">
            <Star className="w-5 h-5 fill-ultra text-ultra" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-popcorn font-sans tracking-tight">
              {config.reviewsSectionTitle}
            </h2>
            <p className="text-xs text-popcorn-dim font-sans font-medium">
              {config.industryName} {t("sec_reviews")} • ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಸಿನಿ ರೇಟಿಂಗ್
            </p>
          </div>
        </div>

        <Link
          href={localizeUrl("/category/reviews")}
          className="px-4 py-1.5 rounded-full bg-revealed hover:bg-screen text-xs font-bold text-popcorn-dim hover:text-popcorn border border-glow-line hover:border-glow-line-strong flex items-center gap-1.5 transition-all font-sans"
        >
          <span>{t("btn_all_reviews")}</span>
          <ChevronRight className="w-3.5 h-3.5 text-ultra" />
        </Link>
      </div>

      {/* Hero Magnum Opus Review: Ramayana Part 1 in respective language with Picture */}
      <RamayanaSpotlightReview />

      {/* Other Industry Reviews */}
      <div className="mt-8">
        <div className="text-xs font-bold uppercase tracking-widest text-popcorn-dim mb-4 font-sans flex items-center gap-2">
          <Award className="w-4 h-4 text-ultra" />
          <span>{latestReviewsTitle[language] || latestReviewsTitle.en}</span>
          <span className="flex-1 h-px bg-glow-line" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {activeReviews.slice(0, 3).map((review) => (
          <div
            key={review.id}
            className="group flex flex-col bg-revealed rounded-[24px] overflow-hidden border border-glow-line hover:border-glow-line-strong hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(155,109,255,0.16)] transition-all duration-300"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-hall">
              <Image
                src={review.posterImage}
                alt={review.movieTitle}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void/85 via-void/25 to-transparent"></div>

              {/* Star Rating Badge */}
              <div className="absolute top-3 right-3 bg-void/85 backdrop-blur-md px-3 py-1 rounded-full border border-glow-line flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-marquee fill-marquee" />
                <span className="text-sm font-black text-popcorn font-mono-tabular">
                  {review.rating.toFixed(1)}
                </span>
                <span className="text-[10px] text-popcorn-dim font-sans">/ 5</span>
              </div>

              {/* Verdict Pill */}
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block px-3 py-1 rounded-full bg-ultra-deep text-popcorn text-[11px] font-bold font-kannada truncate max-w-full shadow-[0_0_16px_rgba(155,109,255,0.25)]">
                  {review.verdict}
                </span>
              </div>
            </div>

            <div className="p-5 flex flex-col justify-between flex-1 bg-revealed">
              <div>
                <Link href={`/reviews/${review.slug}`}>
                  <h3 className="text-base font-bold text-popcorn group-hover:text-ultra transition-colors line-clamp-1">
                    {review.movieTitle}
                  </h3>
                </Link>
                <p className="mt-1.5 text-xs text-popcorn-dim line-clamp-2 leading-relaxed">
                  {review.summary}
                </p>

                <div className="mt-3.5 space-y-1 text-xs text-popcorn-dim">
                  <div>
                    <span className="text-popcorn-muted">ನಿರ್ದೇಶನ:</span>{" "}
                    <span className="text-popcorn font-semibold">{review.director}</span>
                  </div>
                  <div>
                    <span className="text-popcorn-muted">ಸಂಗೀತ:</span>{" "}
                    <span className="text-popcorn font-semibold">{review.musicDirector}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-glow-line flex items-center justify-between">
                <span className="text-[11px] text-popcorn-muted font-sans font-mono-tabular">
                  {formatKannadaDate(review.releaseDate)}
                </span>
                <Link
                  href={`/reviews/${review.slug}`}
                  className="text-xs font-bold text-ultra hover:text-ultra-soft flex items-center gap-1 transition-colors"
                >
                  <span>ಪೂರ್ಣ ವಿಮರ್ಶೆ ಓದಿ</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
}
