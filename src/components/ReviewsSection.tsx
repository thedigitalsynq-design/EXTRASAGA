import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Award, ChevronRight } from "lucide-react";
import { MovieReview } from "@/types";
import { formatKannadaDate } from "@/lib/utils";

interface ReviewsSectionProps {
  reviews: MovieReview[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section className="my-10 bg-brand-dark/50 p-6 rounded-2xl border border-brand-border/60">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-brand-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-brand-yellow/20 text-brand-yellow flex items-center justify-center">
            <Star className="w-5 h-5 fill-brand-yellow" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-kannada">
              ಸಿನಿಮಾ ವಿಮರ್ಶೆ (Movie Reviews)
            </h2>
            <p className="text-xs text-brand-muted font-kannada">
              ಕನ್ನಡ ಚಿತ್ರಗಳ ನೈಜ ಮತ್ತು ನಿಷ್ಪಕ್ಷಪಾತ ವಿಮರ್ಶಾ ವರದಿಗಳು
            </p>
          </div>
        </div>

        <Link
          href="/category/reviews"
          className="text-xs sm:text-sm font-semibold text-brand-red hover:text-white flex items-center gap-1 font-kannada transition-colors"
        >
          <span>ಎಲ್ಲಾ ವಿಮರ್ಶೆಗಳು</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((review) => (
          <div
            key={review.id}
            className="group flex flex-col bg-brand-card rounded-xl overflow-hidden border border-brand-border hover:border-brand-yellow/50 hover:shadow-xl hover:shadow-brand-yellow/5 transition-all duration-300"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src={review.posterImage}
                alt={review.movieTitle}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

              {/* Star Rating Badge */}
              <div className="absolute top-3 right-3 bg-brand-black/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-brand-yellow/40 flex items-center gap-1 shadow-lg">
                <Star className="w-4 h-4 text-brand-yellow fill-brand-yellow" />
                <span className="text-sm font-black text-white font-sans">
                  {review.rating.toFixed(1)}
                </span>
                <span className="text-[10px] text-gray-400 font-sans">/ 5</span>
              </div>

              {/* Verdict Pill */}
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block px-2.5 py-1 rounded bg-brand-red/90 text-white text-[11px] font-bold font-kannada truncate max-w-full">
                  {review.verdict}
                </span>
              </div>
            </div>

            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <Link href={`/reviews/${review.slug}`}>
                  <h3 className="text-base font-bold text-white group-hover:text-brand-yellow font-kannada transition-colors line-clamp-1">
                    {review.movieTitle}
                  </h3>
                </Link>
                <p className="mt-1.5 text-xs text-gray-300 font-kannada line-clamp-2">
                  {review.summary}
                </p>

                <div className="mt-3 space-y-1 text-xs text-brand-muted font-kannada">
                  <div>
                    <span className="text-gray-400">ನಿರ್ದೇಶನ:</span>{" "}
                    <span className="text-gray-200 font-medium">{review.director}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">ಸಂಗೀತ:</span>{" "}
                    <span className="text-gray-200 font-medium">{review.musicDirector}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between">
                <span className="text-[11px] text-brand-muted">
                  {formatKannadaDate(review.releaseDate)}
                </span>
                <Link
                  href={`/reviews/${review.slug}`}
                  className="text-xs font-bold text-brand-yellow hover:text-white flex items-center gap-1 font-kannada transition-colors"
                >
                  <span>ಪೂರ್ಣ ವಿಮರ್ಶೆ ಓದಿ</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

