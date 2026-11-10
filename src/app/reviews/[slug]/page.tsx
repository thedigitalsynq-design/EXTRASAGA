import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  Star,
  CheckCircle2,
  XCircle,
  Crown,
} from "lucide-react";
import { DataService } from "@/lib/dataService";
import { formatEditorialDate } from "@/lib/utils";
import { getSiteUrl } from "@/lib/siteUrl";
import SocialShare from "@/components/SocialShare";
import CommentSection from "@/components/CommentSection";
import { RAMAYANA_REVIEWS_BY_LANGUAGE } from "@/data/ramayanaReviewData";
import DualAxisReviewScore from "@/components/DualAxisReviewScore";

interface ReviewPageProps {
  params: {
    slug: string;
  } | Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const reviews = await DataService.getReviews();
  return reviews.map((review) => ({
    slug: review.slug,
  }));
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const review = await DataService.getReviewBySlug(resolvedParams.slug, "en");
  if (!review) return { title: "Review Not Found — EXTRA-SAAGA" };

  const siteUrl = getSiteUrl();

  return {
    title: `${review.movieTitle} Review — EXTRA-SAAGA`,
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
  const resolvedParams = await Promise.resolve(params);
  const review = await DataService.getReviewBySlug(resolvedParams.slug, "en");

  if (!review) {
    notFound();
  }

  const isRamayana = review.slug.startsWith("ramayana-part-1") || resolvedParams.slug.startsWith("ramayana");
  const ramayanaData = isRamayana ? RAMAYANA_REVIEWS_BY_LANGUAGE.en || RAMAYANA_REVIEWS_BY_LANGUAGE.kn : null;

  const allReviews = await DataService.getReviews();
  const otherReviews = allReviews.filter((r) => r.slug !== review.slug).slice(0, 5);

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
      name: "EXTRA-SAAGA",
    },
    publisher: {
      "@type": "Organization",
      name: "EXTRA-SAAGA",
      url: getSiteUrl(),
    },
  };

  return (
    <div className="wrap">
      {/* Schema.org Review & Movie structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
      />

      <div className="art-layout">
        {/* Main Review Body */}
        <article className="art">
          <header className="art-head is-page">
            <p className="kicker">
              <Link href="/reviews">
                FILM REVIEW · {review.language ? review.language.toUpperCase() : "CINEMA"}
              </Link>
            </p>

            <h1 className="art-title">
              {review.movieTitle} Review: {isRamayana ? "A Magnum Opus Celebration of Indian Cinema" : review.summary}
            </h1>

            <p className="art-dek">
              Directed by {review.director} · Music by {review.musicDirector} · {review.runtime} · {review.censorRating}
            </p>

            <p className="art-by">
              By <span className="author-name">Cinema Desk</span> · Released {formatEditorialDate(review.releaseDate)} · 5 min read
            </p>

            <div className="art-share art-share-top" data-title={`${review.movieTitle} Review`}>
              <SocialShare title={`${review.movieTitle} Review`} />
            </div>
          </header>

          {/* Hero Movie Review Card: Poster & Verdict Specs */}
          <div className="my-6 p-5 border border-line rounded-lg bg-[var(--surface-2)] flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="relative w-44 h-60 shrink-0 rounded overflow-hidden border border-line">
              <Image
                src={review.posterImage}
                alt={review.movieTitle}
                fill
                priority
                className="object-cover"
                sizes="180px"
              />
            </div>

            <div className="flex-1 space-y-3 text-center sm:text-left">
              {isRamayana ? (
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[var(--acc)] text-black font-bold text-xs uppercase tracking-wider">
                    <Crown className="w-4 h-4" />
                    <span>Special Feature • Landmark Event</span>
                  </div>
                  <p className="text-xs text-muted pt-1">
                    {ramayanaData?.reviewScoreNote || "Ramayana stands beyond standard metrics — a monumental cultural milestone."}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--surface)] border border-line">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-xl font-bold font-title">
                      {review.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted">/ 5.0</span>
                  </div>

                  <span className="verdict is-hit text-xs">
                    {review.verdict}
                  </span>
                </div>
              )}

              {/* Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-3 border-t border-line text-muted">
                <div>
                  <span className="text-text font-medium">Director:</span> {review.director}
                </div>
                <div>
                  <span className="text-text font-medium">Music:</span> {review.musicDirector}
                </div>
                <div>
                  <span className="text-text font-medium">Cinematography:</span> {review.cinematography || "Tech Crew"}
                </div>
                <div>
                  <span className="text-text font-medium">Producers:</span> {review.producers.join(", ")}
                </div>
              </div>

              {/* Genres */}
              <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start pt-1">
                {review.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2 py-0.5 text-[11px] rounded bg-[var(--surface)] border border-line text-muted uppercase font-medium"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Dual Axis Review Matrix */}
          <div className="my-6">
            <DualAxisReviewScore review={review} />
          </div>

          {/* Review Body */}
          <div className="art-body">
            <h3>Editorial Assessment</h3>
            <p className="text-base leading-relaxed text-text">
              {review.summary}
            </p>

            {isRamayana && ramayanaData?.fullReviewText ? (
              <div
                className="whitespace-pre-line mt-4"
                dangerouslySetInnerHTML={{
                  __html: ramayanaData.fullReviewText
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/### (.*?)\n/g, "<h3>$1</h3>")
                    .replace(/> (.*?)\n/g, "<blockquote>$1</blockquote>"),
                }}
              />
            ) : (
              <div className="space-y-4 mt-6">
                {review.storyAnalysis && (
                  <div>
                    <h4 className="font-title text-base font-bold text-ink mb-1">Story & Screenplay</h4>
                    <p className="text-sm text-text leading-relaxed">{review.storyAnalysis}</p>
                  </div>
                )}
                {review.performanceAnalysis && (
                  <div>
                    <h4 className="font-title text-base font-bold text-ink mb-1">Performances</h4>
                    <p className="text-sm text-text leading-relaxed">{review.performanceAnalysis}</p>
                  </div>
                )}
                {review.directionAnalysis && (
                  <div>
                    <h4 className="font-title text-base font-bold text-ink mb-1">Direction & Vision</h4>
                    <p className="text-sm text-text leading-relaxed">{review.directionAnalysis}</p>
                  </div>
                )}
                {review.musicAnalysis && (
                  <div>
                    <h4 className="font-title text-base font-bold text-ink mb-1">Music & Technical Craft</h4>
                    <p className="text-sm text-text leading-relaxed">{review.musicAnalysis}</p>
                  </div>
                )}
              </div>
            )}

            {/* Pros and Cons */}
            {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                {review.pros && review.pros.length > 0 && (
                  <div className="p-4 rounded border border-line bg-[var(--surface-2)]">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      What Works
                    </h4>
                    <ul className="space-y-1.5 text-xs text-text">
                      {review.pros.map((p, idx) => (
                        <li key={idx}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {review.cons && review.cons.length > 0 && (
                  <div className="p-4 rounded border border-line bg-[var(--surface-2)]">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" />
                      What Could Be Better
                    </h4>
                    <ul className="space-y-1.5 text-xs text-text">
                      {review.cons.map((n, idx) => (
                        <li key={idx}>• {n}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="mt-8 pt-8 border-t border-line">
            <CommentSection articleId={review.id} />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="art-side" aria-label="More reviews">
          <div className="h3-head flex items-baseline justify-between pb-2 mb-3 border-b border-line">
            <h2 className="text-base font-bold uppercase tracking-wider">Other Reviews</h2>
            <Link href="/reviews" className="text-xs text-muted hover:text-text">All</Link>
          </div>

          <ul className="side-list">
            {otherReviews.map((rel) => (
              <li key={rel.id}>
                <Link href={`/reviews/${rel.slug}`}>
                  <span className="side-img">
                    <Image
                      src={rel.posterImage}
                      alt=""
                      width={160}
                      height={120}
                      className="object-cover"
                    />
                  </span>
                  <span>
                    <small className="block text-xs text-muted">
                      ★ {rel.rating.toFixed(1)}/5 · {rel.verdict}
                    </small>
                    <b className="line-clamp-2 text-sm leading-snug">{rel.movieTitle}</b>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
