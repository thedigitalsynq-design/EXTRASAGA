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
    te: `${config.industryName} తాజా సినిమా రివ్యూలు:`,
    ta: `${config.industryName} சமீபத்திய திரைப்பட விமர்சனங்கள்:`,
    ml: `${config.industryName} പുതിയ സിനിമ റിവ്യൂകൾ:`,
    hi: `${config.industryName} ताज़ा फिल्म समीक्षाएं:`,
    en: `${config.industryName} Latest Critical Movie Reviews:`,
  };

  return (
    <section className="bg-white p-6 sm:p-8 rounded-[32px] border border-[#E5EBE7] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#E5EBE7]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F8EB] text-[#288760] border border-[#B7E5BA] flex items-center justify-center shadow-2xs">
            <Star className="w-5 h-5 fill-[#288760] text-[#288760]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F3529] font-sans tracking-tight">
              {config.reviewsSectionTitle}
            </h2>
            <p className="text-xs text-[#4B6358] font-sans font-medium">
              {config.industryName} {t("sec_reviews")} • ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಸಿನಿ ರೇಟಿಂಗ್
            </p>
          </div>
        </div>

        <Link
          href={localizeUrl("/category/reviews")}
          className="px-4 py-1.5 rounded-full bg-[#F8FAF9] hover:bg-[#E8F8EB] text-xs font-bold text-[#1A5140] border border-[#E5EBE7] hover:border-[#5CA87C] flex items-center gap-1.5 transition-all font-sans shadow-2xs"
        >
          <span>{t("btn_all_reviews")}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#288760]" />
        </Link>
      </div>

      {/* Hero Magnum Opus Review: Ramayana Part 1 in respective language with Picture */}
      <RamayanaSpotlightReview />

      {/* Other Industry Reviews */}
      <div className="mt-8">
        <div className="text-xs font-bold uppercase tracking-wider text-[#1A5140] mb-4 font-sans flex items-center gap-2">
          <Award className="w-4 h-4 text-[#288760]" />
          <span>{latestReviewsTitle[language] || latestReviewsTitle.en}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {activeReviews.slice(0, 3).map((review) => (
          <div
            key={review.id}
            className="group flex flex-col bg-white rounded-[24px] overflow-hidden border border-[#E5EBE7] hover:border-[#5CA87C] hover:shadow-[0_16px_36px_-8px_rgba(40,135,96,0.14)] transition-all duration-300 shadow-sm"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F0F4F2]">
              <Image
                src={review.posterImage}
                alt={review.movieTitle}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B251D]/75 via-transparent to-transparent"></div>

              {/* Star Rating Badge */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-[#E5EBE7] flex items-center gap-1.5 shadow-sm">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-sm font-black text-[#0F3529] font-sans">
                  {review.rating.toFixed(1)}
                </span>
                <span className="text-[10px] text-[#4B6358] font-sans">/ 5</span>
              </div>

              {/* Verdict Pill */}
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block px-3 py-1 rounded-full bg-[#288760] text-white text-[11px] font-bold font-kannada truncate max-w-full shadow-sm">
                  {review.verdict}
                </span>
              </div>
            </div>

            <div className="p-5 flex flex-col justify-between flex-1 bg-white">
              <div>
                <Link href={`/reviews/${review.slug}`}>
                  <h3 className="text-base font-bold text-[#0F3529] group-hover:text-[#288760] transition-colors line-clamp-1">
                    {review.movieTitle}
                  </h3>
                </Link>
                <p className="mt-1.5 text-xs text-[#4B6358] line-clamp-2 leading-relaxed">
                  {review.summary}
                </p>

                <div className="mt-3.5 space-y-1 text-xs text-[#4B6358]">
                  <div>
                    <span className="text-[#6B7280]">ನಿರ್ದೇಶನ:</span>{" "}
                    <span className="text-[#0F3529] font-semibold">{review.director}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280]">ಸಂಗೀತ:</span>{" "}
                    <span className="text-[#0F3529] font-semibold">{review.musicDirector}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-[#E5EBE7] flex items-center justify-between">
                <span className="text-[11px] text-[#6B7280] font-sans">
                  {formatKannadaDate(review.releaseDate)}
                </span>
                <Link
                  href={`/reviews/${review.slug}`}
                  className="text-xs font-bold text-[#288760] hover:text-[#1A5140] flex items-center gap-1 transition-colors"
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

