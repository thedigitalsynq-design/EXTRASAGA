import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  Star,
  Film,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Play,
  Award,
  DollarSign,
} from "lucide-react";
import { DataService } from "@/lib/dataService";
import { formatKannadaDate } from "@/lib/utils";
import SocialShare from "@/components/SocialShare";
import CommentSection from "@/components/CommentSection";
import TrendingSidebar from "@/components/TrendingSidebar";
import AdBanner from "@/components/AdBanner";

interface ReviewPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const review = await DataService.getReviewBySlug(params.slug);
  if (!review) return { title: "ವಿಮರ್ಶೆ ಕಂಡುಬಂದಿಲ್ಲ" };

  return {
    title: `${review.movieTitle} ಸಿನಿಮಾ ವಿಮರ್ಶೆ & ರೇಟಿಂಗ್ | ಸಿನಿ ಕನ್ನಡ`,
    description: review.summary,
    openGraph: {
      title: `${review.movieTitle} Movie Review`,
      description: review.summary,
      images: [{ url: review.posterImage }],
    },
  };
}

export default async function MovieReviewPage({ params }: ReviewPageProps) {
  const review = await DataService.getReviewBySlug(params.slug);

  if (!review) {
    notFound();
  }

  const trendingArticles = await DataService.getTrendingArticles(5);

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="bg-brand-dark/40 border-b border-brand-border py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-brand-muted font-kannada">
          <Link href="/" className="hover:text-white transition-colors">
            ಮುಖಪುಟ
          </Link>
          <span>/</span>
          <Link
            href="/category/reviews"
            className="hover:text-brand-yellow text-gray-300 font-medium transition-colors"
          >
            ಸಿನಿಮಾ ವಿಮರ್ಶೆ
          </Link>
          <span>/</span>
          <span className="text-gray-400">{review.movieTitle}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Review Column (Col 8) */}
          <main className="lg:col-span-8 space-y-8">
            <article className="bg-brand-dark rounded-2xl border border-brand-border/80 p-5 sm:p-8 shadow-2xl">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="px-3 py-1 rounded bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/40 text-xs font-bold font-kannada">
                  ವಿಶೇಷ ಸಿನಿಮಾ ವಿಮರ್ಶೆ
                </span>
                <div className="flex items-center gap-3 text-xs text-brand-muted font-sans">
                  <span>📅 {formatKannadaDate(review.releaseDate)}</span>
                  <span>•</span>
                  <span>⏱️ {review.runtime}</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-brand-card text-white font-bold">
                    {review.censorRating}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-kannada leading-tight">
                {review.movieTitle} ಸಿನಿಮಾ ವಿಮರ್ಶೆ
              </h1>
              <p className="text-sm text-brand-muted font-sans font-medium mt-1">
                {review.movieTitleEn} Detailed Review & Analysis
              </p>

              {/* Hero Movie Card: Poster + Star Rating + Quick Specs */}
              <div className="my-6 p-5 rounded-2xl bg-brand-card/90 border border-brand-border flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="relative w-48 h-64 shrink-0 rounded-xl overflow-hidden shadow-2xl border border-brand-border">
                  <Image
                    src={review.posterImage}
                    alt={review.movieTitle}
                    fill
                    priority
                    className="object-cover"
                    sizes="200px"
                  />
                </div>

                <div className="flex-1 space-y-4 text-center md:text-left">
                  {/* Rating Showcase */}
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <div className="flex items-center gap-1.5 bg-brand-black px-4 py-2 rounded-xl border border-brand-yellow/50 shadow-lg">
                      <Star className="w-6 h-6 text-brand-yellow fill-brand-yellow animate-pulse" />
                      <span className="text-2xl font-black text-white font-sans">
                        {review.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-brand-muted font-sans">/ 5.0</span>
                    </div>

                    <div className="px-3 py-2 rounded-xl bg-brand-red/20 text-brand-red font-bold text-xs font-kannada border border-brand-red/40">
                      {review.verdict}
                    </div>
                  </div>

                  {/* Cast & Crew Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-kannada text-gray-300 pt-2 border-t border-brand-border/60">
                    <div>
                      <span className="text-brand-muted">ನಿರ್ದೇಶನ:</span>{" "}
                      <strong className="text-white">{review.director}</strong>
                    </div>
                    <div>
                      <span className="text-brand-muted">ಸಂಗೀತ:</span>{" "}
                      <strong className="text-white">{review.musicDirector}</strong>
                    </div>
                    <div>
                      <span className="text-brand-muted">ಛಾಯಾಗ್ರಹಣ:</span>{" "}
                      <strong className="text-white">{review.cinematography || "ವಿಶೇಷ ತಂತ್ರಜ್ಞರು"}</strong>
                    </div>
                    <div>
                      <span className="text-brand-muted">ನಿರ್ಮಾಣ:</span>{" "}
                      <strong className="text-white">{review.producers.join(", ")}</strong>
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="flex items-center gap-1.5 flex-wrap justify-center md:justify-start pt-1">
                    {review.genres.map((g) => (
                      <span
                        key={g}
                        className="px-2.5 py-1 rounded-md bg-brand-dark text-xs font-kannada text-gray-300 border border-brand-border/80"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Share */}
              <SocialShare title={`${review.movieTitle} ಸಿನಿಮಾ ವಿಮರ್ಶೆ`} />

              {/* Summary */}
              <div className="my-6 p-4 rounded-xl bg-brand-card/40 border-l-4 border-brand-yellow">
                <h3 className="text-base font-bold text-brand-yellow font-kannada mb-1">
                  ಒಂದು ನೋಟದಲ್ಲಿ ಕಥಾಸಾರಾಂಶ
                </h3>
                <p className="text-sm sm:text-base text-gray-200 font-kannada leading-relaxed">
                  {review.summary}
                </p>
              </div>

              {/* In-depth Breakdowns */}
              <div className="space-y-6 text-sm sm:text-base text-gray-200 font-kannada leading-relaxed">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-5 bg-brand-red rounded"></span>
                    ಕಥೆ ಮತ್ತು ಚಿತ್ರಕಥೆ (Story & Screenplay)
                  </h3>
                  <p>{review.storyAnalysis}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-5 bg-brand-yellow rounded"></span>
                    ಕಲಾವಿದರ ಅಭಿನಯ (Performances)
                  </h3>
                  <p>{review.performanceAnalysis}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-5 bg-emerald-500 rounded"></span>
                    ನಿರ್ದೇಶನ ಮತ್ತು ತಾಂತ್ರಿಕತೆ (Direction & Technicalities)
                  </h3>
                  <p>{review.directionAnalysis}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-5 bg-sky-500 rounded"></span>
                    ಸಂಗೀತ ಮತ್ತು ಹಿನ್ನೆಲೆ ಧ್ವನಿ (Music & BGM)
                  </h3>
                  <p>{review.musicAnalysis}</p>
                </div>
              </div>

              {/* Pros and Cons Matrix */}
              <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Pros */}
                <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <h4 className="text-sm font-bold text-emerald-400 font-kannada flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4" />
                    ಮೆಚ್ಚುಗೆಯ ಅಂಶಗಳು (Pros)
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-300 font-kannada">
                    {review.pros.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="p-5 rounded-xl bg-red-950/20 border border-red-500/30">
                  <h4 className="text-sm font-bold text-red-400 font-kannada flex items-center gap-2 mb-3">
                    <XCircle className="w-4 h-4" />
                    ಹಿನ್ನಡೆಯ ಅಂಶಗಳು (Cons)
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-300 font-kannada">
                    {review.cons.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-400 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Final Verdict Card */}
              <div className="my-8 p-6 rounded-2xl bg-gradient-to-r from-brand-red/20 via-brand-card to-brand-red/20 border border-brand-red/40 text-center">
                <span className="text-xs uppercase tracking-wider text-brand-yellow font-bold block mb-1">
                  ಅಂತಿಮ ತೀರ್ಪು (FINAL VERDICT)
                </span>
                <p className="text-lg sm:text-xl font-extrabold text-white font-kannada">
                  &ldquo;{review.verdict}&rdquo;
                </p>
                {review.boxOfficeSummary && (
                  <p className="mt-2 text-xs text-gray-300 font-kannada">
                    💰 ಬಾಕ್ಸ್ ಆಫೀಸ್: {review.boxOfficeSummary}
                  </p>
                )}
              </div>

              {/* Embedded Trailer if available */}
              {review.trailerYoutubeId && (
                <div className="my-8">
                  <h3 className="text-lg font-bold text-white font-kannada mb-3 flex items-center gap-2">
                    <Play className="w-4 h-4 text-brand-red" />
                    ಅಫಿಷಿಯಲ್ ಟ್ರೇಲರ್ (Trailer)
                  </h3>
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-brand-border shadow-xl">
                    <iframe
                      src={`https://www.youtube.com/embed/${review.trailerYoutubeId}`}
                      title={`${review.movieTitle} Trailer`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-none"
                    ></iframe>
                  </div>
                </div>
              )}

              {/* In-Article Ad */}
              <AdBanner placement="in_article" />

              {/* Comments Section */}
              <CommentSection articleId={review.id} />
            </article>
          </main>

          {/* Sidebar (Col 4) */}
          <aside className="lg:col-span-4 space-y-6">
            <TrendingSidebar articles={trendingArticles} />
            <AdBanner placement="sidebar_rectangle" />
          </aside>
        </div>
      </div>
    </div>
  );
}

