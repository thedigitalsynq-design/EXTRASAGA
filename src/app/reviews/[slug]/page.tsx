import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  Star,
  CheckCircle2,
  XCircle,
  Play,
  Crown,
} from "lucide-react";
import { DataService } from "@/lib/dataService";
import { formatEditorialDate } from "@/lib/utils";
import { getSiteUrl } from "@/lib/siteUrl";
import SocialShare from "@/components/SocialShare";
import CommentSection from "@/components/CommentSection";
import TrendingSidebar from "@/components/TrendingSidebar";
import AdBanner from "@/components/AdBanner";
import { RAMAYANA_REVIEWS_BY_LANGUAGE } from "@/data/ramayanaReviewData";
import DualAxisReviewScore from "@/components/DualAxisReviewScore";
import DualLuminousDiscs from "@/components/DualLuminousDiscs";

interface ReviewPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const reviews = await DataService.getReviews();
  return reviews.map((review) => ({
    slug: review.slug,
  }));
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const review = await DataService.getReviewBySlug(params.slug, "en");
  if (!review) return { title: "Review Not Found" };

  const siteUrl = getSiteUrl();

  return {
    title: `${review.movieTitle} | EXTRASAGA`,
    description: review.summary,
    openGraph: {
      title: `${review.movieTitle} Review`,
      description: review.summary,
      url: `${siteUrl}/reviews/${review.slug}`,
      images: [{ url: review.posterImage }],
    },
  };
}

export default async function MovieReviewPage({ params }: ReviewPageProps) {
  const review = await DataService.getReviewBySlug(params.slug, "en");

  if (!review) {
    notFound();
  }

  const isRamayana = review.slug.startsWith("ramayana-part-1") || params.slug.startsWith("ramayana");
  const ramayanaData = isRamayana ? RAMAYANA_REVIEWS_BY_LANGUAGE.en || RAMAYANA_REVIEWS_BY_LANGUAGE.kn : null;

  const trendingArticles = await DataService.getTrendingArticles(5, "en");

  const reviewJsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    name: `${review.movieTitle} Review`,
    reviewBody: review.summary,
    itemReviewed: {
      "@type": "Movie",
      name: review.movieTitleEn,
      image: review.posterImage,
      director: {
        "@type": "Person",
        name: review.director,
      },
      dateCreated: review.releaseDate,
    },
    reviewRating: isRamayana
      ? undefined
      : {
          "@type": "Rating",
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1,
        },
    author: {
      "@type": "Organization",
      name: "EXTRASAGA",
    },
    publisher: {
      "@type": "Organization",
      name: "EXTRASAGA",
      url: getSiteUrl(),
    },
  };

  return (
    <div className="w-full bg-paper min-h-screen text-ink">
      {/* Schema.org Review & Movie structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
      />
      {/* Breadcrumb */}
      <div className="bg-sheet border-b-2 border-ink py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-mono text-ink-dim">
          <Link href="/" className="hover:text-press font-bold transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/reviews"
            className="hover:text-press font-bold transition-colors"
          >
            Reviews
          </Link>
          <span>/</span>
          <span className="text-ink-mute truncate max-w-xs sm:max-w-md">{review.movieTitle}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Review Column (Col 8) */}
          <main className="lg:col-span-8 space-y-8">
            <article className="bg-sheet border-2 border-ink shadow-press p-5 sm:p-8">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  {isRamayana ? (
                    <span className="sticker bg-marquee text-ink border-2 border-ink px-3 py-1 text-xs font-poster uppercase shadow-sticker flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5" />
                      <span>MAGNUM OPUS SPECIAL REVIEW</span>
                    </span>
                  ) : (
                    <span className="sticker bg-violet text-paper border-2 border-ink px-3 py-1 text-xs font-bold uppercase shadow-sticker">
                      CRITICAL VERDICT
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-band text-ink border-2 border-ink shadow-sticker">
                    {review.language ? review.language.toUpperCase() : "CINEMA"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-ink-dim font-bold">
                  <span>📅 {formatEditorialDate(review.releaseDate)}</span>
                  <span>•</span>
                  <span>⏱️ {review.runtime}</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 bg-paper border border-ink text-ink font-bold">
                    {review.censorRating}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-poster uppercase text-ink leading-tight tracking-tight">
                {review.movieTitle} {isRamayana ? "– NOT JUST A MOVIE, IT'S OUR PRIDE!" : "MOVIE REVIEW"}
              </h1>
              <p className="text-xs sm:text-sm text-press-deep font-grotesk font-bold mt-1 uppercase tracking-wider">
                {isRamayana ? "A MAGNUM OPUS CELEBRATION OF INDIAN CINEMA" : `${review.movieTitleEn} Detailed Review & Analysis`}
              </p>

              {/* Hero Movie Card: Poster + Star Rating + Quick Specs */}
              <div className={`my-6 p-5 sm:p-6 border-2 border-ink shadow-sticker flex flex-col md:flex-row gap-6 items-center md:items-start ${
                isRamayana ? "bg-marquee" : "bg-paper"
              }`}>
                <div className="relative w-48 h-64 shrink-0 border-2 border-ink shadow-press overflow-hidden bg-band">
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
                  {isRamayana ? (
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 bg-ink text-paper px-4 py-2 border-2 border-ink shadow-sticker">
                        <Crown className="w-5 h-5 text-marquee" />
                        <span className="text-base sm:text-lg font-poster uppercase tracking-wider text-paper">
                          NO RATINGS • ONLY RESPECT!
                        </span>
                      </div>
                      <p className="text-xs text-ink font-grotesk font-bold">
                        {ramayanaData?.reviewScoreNote || "Ramayana needs no star rating. It is our pride. Our heritage."}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <div className="flex items-center gap-1.5 bg-paper px-4 py-2 border-2 border-ink shadow-sticker">
                        <Star className="w-5 h-5 text-marquee fill-marquee" />
                        <span className="text-2xl font-poster uppercase text-ink">
                          {review.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-ink-mute font-mono">/ 5.0</span>
                      </div>

                      <div className="px-3.5 py-2 bg-press text-paper font-poster uppercase text-xs border-2 border-ink shadow-sticker">
                        {review.verdict}
                      </div>
                    </div>
                  )}

                  {/* Cast & Crew Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink-dim pt-3 border-t-2 border-ink font-grotesk">
                    <div>
                      <span className="font-bold text-ink">Director:</span>{" "}
                      <strong className="text-ink font-poster uppercase">{review.director}</strong>
                    </div>
                    <div>
                      <span className="font-bold text-ink">Music:</span>{" "}
                      <strong className="text-ink font-poster uppercase">{review.musicDirector}</strong>
                    </div>
                    <div>
                      <span className="font-bold text-ink">Cinematography:</span>{" "}
                      <strong className="text-ink font-poster uppercase">{review.cinematography || "Tech Crew"}</strong>
                    </div>
                    <div>
                      <span className="font-bold text-ink">Producers:</span>{" "}
                      <strong className="text-ink font-poster uppercase">{review.producers.join(", ")}</strong>
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="flex items-center gap-1.5 flex-wrap justify-center md:justify-start pt-1">
                    {review.genres.map((g) => (
                      <span
                        key={g}
                        className="px-2.5 py-1 bg-band text-xs text-ink border border-ink shadow-sticker font-grotesk font-bold uppercase"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Share */}
              <div className="my-4">
                <SocialShare title={`${review.movieTitle} Review`} />
              </div>

              {/* Summary */}
              <div className="my-6 p-4 bg-paper border-2 border-ink shadow-sticker">
                <h3 className="text-base font-poster uppercase text-ink mb-1">
                  SYNOPSIS
                </h3>
                <p className="text-sm sm:text-base text-ink leading-relaxed font-grotesk font-medium">
                  {review.summary}
                </p>
              </div>

              {/* In-depth Breakdowns */}
              {isRamayana && ramayanaData ? (
                <div className="space-y-6">
                  {/* Star Cast Spotlight */}
                  <div className="p-5 sm:p-6 bg-paper border-2 border-ink shadow-sticker">
                    <h3 className="text-base font-poster uppercase tracking-wider text-ink mb-4 flex items-center gap-2">
                      <Crown className="w-4 h-4 text-press" />
                      <span>STAR CAST &amp; CHARACTERS</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ramayanaData.characterHighlights.map((char, idx) => (
                        <div key={idx} className="p-3.5 bg-sheet border-2 border-ink shadow-sticker">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-sm font-poster uppercase text-ink">{char.actor}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-marquee text-ink font-bold border border-ink font-mono uppercase">
                              {char.character}
                            </span>
                          </div>
                          <p className="text-xs text-ink-dim leading-relaxed font-grotesk">{char.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reverence Full Review Text */}
                  <div className="prose max-w-none text-sm sm:text-base text-ink leading-relaxed space-y-4 whitespace-pre-line p-5 sm:p-6 bg-sheet border-2 border-ink shadow-press font-grotesk">
                    {ramayanaData.fullReviewText.trim()}
                  </div>

                  {/* Reverence Declaration Banner */}
                  <div className="p-6 bg-marquee text-ink border-2 border-ink shadow-press text-center">
                    <div className="text-xs uppercase tracking-widest font-poster mb-2">
                      🚩 OUR FAITH • OUR CULTURE • OUR PRIDE
                    </div>
                    <div className="text-xl sm:text-2xl font-poster uppercase text-ink">
                      {ramayanaData.closingLine}
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-ink-dim font-grotesk font-bold max-w-xl mx-auto">
                      {ramayanaData.reviewScoreNote}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-sm sm:text-base text-ink leading-relaxed font-grotesk">
                  <div className="p-4 bg-paper border-2 border-ink shadow-sticker">
                    <h3 className="text-lg font-poster uppercase text-ink mb-2 flex items-center gap-2">
                      <span className="w-2 h-5 bg-press"></span>
                      Story &amp; Screenplay
                    </h3>
                    <p className="text-ink-dim">{review.storyAnalysis}</p>
                  </div>

                  <div className="p-4 bg-paper border-2 border-ink shadow-sticker">
                    <h3 className="text-lg font-poster uppercase text-ink mb-2 flex items-center gap-2">
                      <span className="w-2 h-5 bg-marquee"></span>
                      Performances
                    </h3>
                    <p className="text-ink-dim">{review.performanceAnalysis}</p>
                  </div>

                  <div className="p-4 bg-paper border-2 border-ink shadow-sticker">
                    <h3 className="text-lg font-poster uppercase text-ink mb-2 flex items-center gap-2">
                      <span className="w-2 h-5 bg-violet"></span>
                      Direction &amp; Craft
                    </h3>
                    <p className="text-ink-dim">{review.directionAnalysis}</p>
                  </div>

                  <div className="p-4 bg-paper border-2 border-ink shadow-sticker">
                    <h3 className="text-lg font-poster uppercase text-ink mb-2 flex items-center gap-2">
                      <span className="w-2 h-5 bg-ink"></span>
                      Music &amp; Background Score
                    </h3>
                    <p className="text-ink-dim">{review.musicAnalysis}</p>
                  </div>
                </div>
              )}

              {/* Dual-Axis Critical Review Matrix & Interactive Spoiler Shield */}
              <DualAxisReviewScore review={review} />

              {/* Overlapping Dual Luminous Discs */}
              <DualLuminousDiscs
                sectionIndex="01"
                totalSections="06"
                categoryLabel={`${review.movieTitle} Evaluation`}
                heading={`${review.movieTitle} — Narrative Conflict Met With Technical Mastery`}
                problemTitle={review.cons[0] ? `Critical Friction: ${review.cons[0]}` : "Artistic Challenge"}
                problemDesc={review.storyAnalysis?.slice(0, 160) || "Navigating complex narrative pacing across multi-character arcs while maintaining viewer emotional investment."}
                solutionTitle={review.pros[0] ? `Triumph: ${review.pros[0]}` : "Craft Breakthrough"}
                solutionDesc={review.directionAnalysis?.slice(0, 160) || "Directional command and technical precision coalesce to deliver an unforgettable theatrical payoff."}
              />

              {/* Pros and Cons Matrix */}
              <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Pros */}
                <div className="p-5 bg-paper border-2 border-ink shadow-sticker">
                  <h4 className="text-sm font-poster uppercase text-ink flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-press-deep" />
                    <span>POSITIVES &amp; HIGHLIGHTS</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-ink-dim font-grotesk">
                    {review.pros.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-press-deep font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="p-5 bg-paper border-2 border-ink shadow-sticker">
                  <h4 className="text-sm font-poster uppercase text-ink flex items-center gap-2 mb-3">
                    <XCircle className="w-4 h-4 text-press" />
                    <span>DOWNSIDES &amp; FRICTION</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-ink-dim font-grotesk">
                    {review.cons.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-press font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Final Verdict Card */}
              <div className="my-8 p-6 bg-paper border-2 border-ink shadow-press text-center">
                <span className="text-xs uppercase tracking-wider font-poster text-press-deep block mb-1">
                  FINAL CRITICAL VERDICT
                </span>
                <p className="text-lg sm:text-2xl font-poster uppercase text-ink">
                  &ldquo;{review.verdict}&rdquo;
                </p>
                {review.boxOfficeSummary && (
                  <p className="mt-2 text-xs text-ink-dim font-mono font-bold">
                    💰 {review.boxOfficeSummary}
                  </p>
                )}
              </div>

              {/* Embedded Trailer if available */}
              {review.trailerYoutubeId && (
                <div className="my-8">
                  <h3 className="text-lg font-poster uppercase text-ink mb-3 flex items-center gap-2">
                    <Play className="w-4 h-4 text-press" />
                    <span>Watch Official Trailer</span>
                  </h3>
                  <div className="relative aspect-video w-full border-2 border-ink shadow-press overflow-hidden bg-band">
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
