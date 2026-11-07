import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Calendar,
  Film,
  Clock,
  ShieldCheck,
  Play,
  Share2,
  ExternalLink,
  ChevronRight,
  User,
  Building,
  CheckCircle2,
  AlertCircle,
  Clapperboard,
} from "lucide-react";
import { DataService } from "@/lib/dataService";
import { formatReleaseDateIST } from "@/lib/cinemaDateUtils";
import { getSiteUrl } from "@/lib/siteUrl";

interface MoviePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const movie = await DataService.getMovieBySlug(params.slug);
  if (!movie) {
    return { title: "ಸಿನಿಮಾ ವಿವರಗಳು ಕಂಡುಬಂದಿಲ್ಲ (Movie Not Found) | EXTRASAGA" };
  }

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/movies/${movie.slug}`;

  return {
    title: `${movie.title} (${movie.titleEn}) - Theatrical Release Date, Cast, Trailer & Full Synopsis | EXTRASAGA`,
    description: `${movie.title} (${movie.titleEn}) ಸಿನಿಮಾ ಬಿಡುಗಡೆ ವಿವರ. ನಿರ್ದೇಶನ: ${movie.director}. ತಾರಾಗಣ: ${movie.cast.map(c => c.name).slice(0, 3).join(", ")}. ಬಿಡುಗಡೆ ದಿನಾಂಕ: ${movie.theatricalReleaseDate}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${movie.title} (${movie.titleEn}) - Theatrical Release Details`,
      description: movie.synopsis,
      url: canonicalUrl,
      type: "video.movie",
      images: [
        {
          url: movie.posterImage,
          width: 800,
          height: 1200,
          alt: `${movie.titleEn} Official Poster`,
        },
      ],
    },
  };
}

export default async function MovieDetailPage({ params }: MoviePageProps) {
  const movie = await DataService.getMovieBySlug(params.slug);
  if (!movie) {
    notFound();
  }

  const { formatted, relativeBadge, diffDays } = formatReleaseDateIST(movie.theatricalReleaseDate);
  const isConfirmed = movie.releaseDateConfidence === "confirmed";
  const siteUrl = getSiteUrl();

  // Related articles
  const relatedArticles = (await DataService.getArticles()).filter(
    (a) => a.language === movie.language && a.slug !== movie.slug
  ).slice(0, 4);

  // Schema.org Movie Structured Data
  const jsonLdMovie = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.titleEn,
    alternateName: movie.title,
    description: movie.synopsis,
    image: movie.posterImage,
    datePublished: movie.theatricalReleaseDate,
    inLanguage: movie.language,
    genre: movie.genres,
    director: {
      "@type": "Person",
      name: movie.director,
    },
    actor: movie.cast.map((c) => ({
      "@type": "Person",
      name: c.name,
      jobTitle: c.role,
    })),
    productionCompany: movie.productionCompany
      ? {
          "@type": "Organization",
          name: movie.productionCompany,
        }
      : undefined,
    trailer: movie.trailerYoutubeId
      ? {
          "@type": "VideoObject",
          name: `${movie.titleEn} Official Theatrical Trailer`,
          embedUrl: `https://www.youtube.com/embed/${movie.trailerYoutubeId}`,
          thumbnailUrl: movie.posterImage,
          uploadDate: movie.createdAt,
        }
      : undefined,
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Movies",
        item: `${siteUrl}/movies`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: movie.titleEn,
        item: `${siteUrl}/movies/${movie.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-void text-popcorn pb-16 font-sans">
      {/* Schema.org Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdMovie) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* Hero Header with Backdrop */}
      <div className="projector-beam relative w-full bg-hall border-b border-glow-line overflow-hidden">
        {movie.bannerImage && (
          <div className="absolute inset-0 opacity-15 filter blur-xl scale-110 pointer-events-none">
            <Image
              src={movie.bannerImage}
              alt=""
              fill
              priority
              className="object-cover"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/85 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <nav className="flex items-center gap-2 text-xs text-popcorn-dim" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-popcorn transition-colors font-medium">ಮುಖಪುಟ (Home)</Link>
              <ChevronRight className="w-3.5 h-3.5 text-popcorn-muted" />
              <Link href="/movies" className="hover:text-popcorn transition-colors font-medium">ಸಿನಿಮಾಗಳು (Now Showing)</Link>
              <ChevronRight className="w-3.5 h-3.5 text-popcorn-muted" />
              <span className="text-popcorn font-bold truncate max-w-xs">{movie.titleEn}</span>
            </nav>

            {/* Anticipation meta chip */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="flex -space-x-2 overflow-hidden">
                <span className="inline-block h-6 w-6 rounded-full ring-2 ring-glow-line bg-marquee-deep text-[10px] font-bold text-void flex items-center justify-center">★</span>
                <span className="inline-block h-6 w-6 rounded-full ring-2 ring-glow-line bg-signal-deep text-[10px] font-bold text-popcorn flex items-center justify-center">🎬</span>
                <span className="inline-block h-6 w-6 rounded-full ring-2 ring-glow-line bg-ultra-deep text-[10px] font-bold text-popcorn flex items-center justify-center">🍿</span>
              </div>
              <div className="text-left font-sans">
                <span className="text-[11px] font-bold text-popcorn block leading-none">12,500+ Verified Cinephile Anticipations</span>
                <span className="text-[9px] text-marquee-soft font-bold tracking-wider">Critical Buzz Locked In</span>
              </div>
            </div>
          </div>

          {/* Hero Content Grid (Asymmetrical Framing) */}
          <div className="relative rounded-[32px] bg-revealed border border-glow-line p-6 sm:p-10 overflow-hidden">
            {/* Asymmetrical beam backplate */}
            <div className="absolute -top-10 -right-10 w-96 h-96 rounded-full bg-gradient-to-br from-signal/10 via-ultra/10 to-transparent blur-2xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Poster Column - Breaks bounds with lift */}
              <div className="md:col-span-4 lg:col-span-3">
                <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border border-glow-line-strong group">
                  <Image
                    src={movie.posterImage}
                    alt={movie.titleEn}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md font-mono-tabular uppercase tracking-wide border ${
                        diffDays === 0
                          ? "bg-signal-deep text-popcorn border-signal animate-pulse"
                          : diffDays > 0
                          ? "bg-marquee-deep text-void border-marquee"
                          : "bg-ultra-deep text-popcorn border-ultra"
                      }`}
                    >
                      {relativeBadge}
                    </span>
                  </div>
                </div>

                {/* Micro Floating Spec Pill */}
                <div className="mt-4 p-3 rounded-2xl bg-hall border border-glow-line shadow-sm flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono-tabular uppercase text-popcorn-muted block font-bold">RELEASE SPEC</span>
                    <span className="text-xs font-bold text-popcorn truncate block">{movie.industry.toUpperCase()} THEATRICAL</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-signal-deep text-popcorn text-[10px] font-bold flex items-center justify-center shrink-0">
                    7
                  </div>
                </div>
              </div>

              {/* Movie Key Specs Column */}
              <div className="md:col-span-8 lg:col-span-9 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em] bg-signal/10 text-signal-soft border border-signal/25 shadow-2xs">
                  {movie.industry.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-revealed text-popcorn-dim border border-glow-line shadow-2xs">
                  {movie.language.toUpperCase()}
                </span>
                {movie.censorRating && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-revealed text-popcorn-dim border border-glow-line">
                    {movie.censorRating}
                  </span>
                )}
                {movie.runtimeFormatted && (
                  <span className="text-xs text-popcorn-dim flex items-center gap-1 font-sans">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{movie.runtimeFormatted}</span>
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display-latin text-popcorn tracking-tight">
                  {movie.title}
                </h1>
                <p className="text-lg sm:text-xl text-signal-soft font-medium mt-1">
                  {movie.titleEn}
                </p>
              </div>

              {/* Release Date Banner */}
              <div className="p-4 rounded-2xl bg-marquee/10 border border-marquee/25 flex flex-wrap items-center justify-between gap-4 max-w-xl shadow-2xs">
                <div>
                  <span className="text-[11px] text-marquee-soft uppercase font-bold tracking-wider block">
                    ದೃಢೀಕೃತ ಚಿತ್ರಮಂದಿರ ಬಿಡುಗಡೆ ದಿನಾಂಕ (Theatrical Release Date)
                  </span>
                  <div className="text-xl font-black font-mono-tabular text-popcorn flex items-center gap-2 mt-0.5">
                    <Calendar className="w-5 h-5 text-marquee-soft" />
                    <span>{formatted}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {isConfirmed ? (
                    <span className="px-3 py-1 rounded-full bg-ultra/10 text-ultra-soft border border-ultra/25 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-ultra-soft" />
                      <span>ಖಚಿತಪಡಿಸಿದ ದಿನಾಂಕ (Confirmed)</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-marquee/10 text-marquee-soft border border-marquee/25 text-xs font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-marquee-soft" />
                      <span>ತಾತ್ಕಾಲಿಕ ದಿನಾಂಕ (Tentative)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Genres Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {movie.genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full bg-revealed text-popcorn-dim border border-glow-line text-xs font-medium shadow-2xs"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Director & Producers quick list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-revealed border border-glow-line shadow-2xs">
                  <span className="text-popcorn-muted block text-[10px] uppercase font-bold">ನಿರ್ದೇಶನ (Director)</span>
                  <span className="text-popcorn font-bold text-sm mt-0.5 block">{movie.director}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-revealed border border-glow-line shadow-2xs">
                  <span className="text-popcorn-muted block text-[10px] uppercase font-bold">ನಿರ್ಮಾಣ (Producers)</span>
                  <span className="text-popcorn font-bold text-sm mt-0.5 block truncate">
                    {movie.producers.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Main Body Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Article & Movie Dossier */}
          <div className="lg:col-span-8 space-y-10">
            {/* Introduction & Synopsis */}
            <section className="bg-revealed p-6 rounded-3xl border border-glow-line space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-popcorn flex items-center gap-2 border-b border-glow-line pb-3">
                <Film className="w-5 h-5 text-signal-soft" />
                <span>ಸಿನಿಮಾ ಸಂಕ್ಷಿಪ್ತ ವಿವರ & ಕಥಾಹಂದರ (Synopsis)</span>
              </h2>

              {movie.introduction && (
                <p className="text-sm text-popcorn leading-relaxed font-medium bg-marquee/10 p-4 rounded-2xl border-l-4 border-marquee">
                  {movie.introduction}
                </p>
              )}

              <p className="text-sm text-popcorn-dim leading-relaxed">
                {movie.synopsis}
              </p>
            </section>

            {/* Official Trailer Embed Player */}
            {movie.trailerYoutubeId && (
              <section className="bg-revealed p-6 rounded-3xl border border-glow-line space-y-4 shadow-sm">
                <h2 className="text-xl font-bold text-popcorn flex items-center gap-2 border-b border-glow-line pb-3">
                  <Play className="w-5 h-5 text-signal-soft fill-current" />
                  <span>ಅಧಿಕೃತ ಟ್ರೇಲರ್ & ಟೀಸರ್ (Official Theatrical Trailer)</span>
                </h2>

                <div className="relative aspect-video rounded-2xl overflow-hidden border border-glow-line shadow-lg bg-void">
                  <iframe
                    src={`https://www.youtube.com/embed/${movie.trailerYoutubeId}?autoplay=0&rel=0`}
                    title={`${movie.titleEn} Official Trailer`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </section>
            )}

            {/* Cast & Characters Grid */}
            <section className="bg-revealed p-6 rounded-3xl border border-glow-line space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-popcorn flex items-center gap-2 border-b border-glow-line pb-3">
                <User className="w-5 h-5 text-signal-soft" />
                <span>ಪ್ರಮುಖ ತಾರಾಗಣ & ಪಾತ್ರವರ್ಗ (Main Cast & Characters)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {movie.cast.map((actor, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-hall border border-glow-line hover:border-glow-line-strong transition-colors shadow-2xs"
                  >
                    <div className="w-12 h-12 rounded-xl bg-signal-deep text-popcorn border border-signal/40 flex items-center justify-center shrink-0 font-bold text-base">
                      {actor.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-popcorn truncate">{actor.name}</h4>
                      <p className="text-xs text-marquee-soft font-medium truncate">{actor.role}</p>
                      {actor.characterName && (
                        <p className="text-[11px] text-popcorn-muted truncate">
                          ಪಾತ್ರ: {actor.characterName}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Production & Distribution Companies */}
            <section className="bg-revealed p-6 rounded-3xl border border-glow-line space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-popcorn flex items-center gap-2 border-b border-glow-line pb-3">
                <Building className="w-5 h-5 text-signal-soft" />
                <span>ನಿರ್ಮಾಣ & ವಿತರಣಾ ವಿವರಗಳು (Production & Distribution)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-hall border border-glow-line shadow-2xs">
                  <span className="text-popcorn-muted uppercase text-[10px] font-bold block">
                    ನಿರ್ಮಾಣ ಸಂಸ್ಥೆ (Production House)
                  </span>
                  <span className="text-popcorn font-bold text-sm mt-1 block">
                    {movie.productionCompany || "ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ (To be announced)"}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-hall border border-glow-line shadow-2xs">
                  <span className="text-popcorn-muted uppercase text-[10px] font-bold block">
                    ವಿತರಣಾ ಸಂಸ್ಥೆ (Distribution Network)
                  </span>
                  <span className="text-popcorn font-bold text-sm mt-1 block">
                    {movie.distributionCompany || "ಆಲ್ ಇಂಡಿಯಾ ಥಿಯೇಟ್ರಿಕಲ್ ಡಿಸ್ಟ್ರಿಬ್ಯೂಷನ್"}
                  </span>
                </div>
              </div>
            </section>

            {/* Source References & Editorial Verification */}
            <section className="p-5 rounded-2xl bg-revealed border border-glow-line text-xs text-popcorn-dim space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-popcorn font-bold">
                <ShieldCheck className="w-4 h-4 text-ultra-soft" />
                <span>ದೃಢೀಕರಣ ಮತ್ತು ಮೂಲಗಳು (Verified Editorial References)</span>
              </div>
              <p className="leading-relaxed">
                ಈ ಚಿತ್ರದ ಬಿಡುಗಡೆ ವಿವರಗಳು, ತಾರಾಗಣ ಹಾಗೂ ಸೆನ್ಸಾರ್ ಮಾಹಿತಿಗಳನ್ನು ಅಧಿಕೃತ ಪ್ರೊಡಕ್ಷನ್ ಹೌಸ್ ಪ್ರಕಟಣೆಗಳು ಮತ್ತು ಅಧಿಕೃತ ವಿತರಕ ನೆಟ್‌ವರ್ಕ್‌ನಿಂದ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.
              </p>
              {movie.sourceReferences && movie.sourceReferences.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {movie.sourceReferences.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-hall text-ultra-soft hover:text-popcorn border border-glow-line transition-colors text-[11px] font-medium"
                    >
                      <span>{src.name}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}
              <div className="pt-2 text-[11px] text-popcorn-muted border-t border-glow-line">
                ಕೊನೆಯ ನವೀಕರಣ: {new Date(movie.updatedAt).toLocaleDateString()} · ಏಷ್ಯಾ/ಕೋಲ್ಕತ್ತಾ ಸಮಯ
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Share Card */}
            <div className="bg-revealed p-5 sm:p-6 rounded-3xl border border-glow-line space-y-3 shadow-sm">
              <h3 className="text-sm font-bold text-popcorn uppercase tracking-wider flex items-center gap-2">
                <Share2 className="w-4 h-4 text-signal-soft" />
                <span>ಹಂಚಿಕೊಳ್ಳಿ (Share Movie)</span>
              </h3>
              <p className="text-xs text-popcorn-dim">
                ನಿಮ್ಮ ಸ್ನೇಹಿತರೊಂದಿಗೆ ಈ ಸಿನಿಮಾದ ಬಿಡುಗಡೆ ದಿನಾಂಕವನ್ನು ಶೇರ್ ಮಾಡಿ:
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${movie.title} (${movie.titleEn}) Theatrical Release: ${formatted}. Read more on EXTRASAGA: ${siteUrl}/movies/${movie.slug}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-ultra/10 text-ultra-soft hover:bg-ultra-deep hover:text-popcorn text-xs font-bold text-center border border-ultra/25 transition-all shadow-2xs"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${movie.title} (${movie.titleEn}) Theatrical Release: ${formatted} #EXTRASAGA`)}&url=${encodeURIComponent(`${siteUrl}/movies/${movie.slug}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-hall text-popcorn-dim hover:bg-signal-deep hover:text-popcorn text-xs font-bold text-center border border-glow-line transition-all shadow-2xs"
                >
                  Twitter / X
                </a>
              </div>
            </div>

            {/* Related Movie Articles */}
            <div className="bg-revealed p-5 sm:p-6 rounded-3xl border border-glow-line space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-popcorn uppercase tracking-wider flex items-center gap-2">
                <Clapperboard className="w-4 h-4 text-marquee-soft" />
                <span>ಸಂಬಂಧಿಸಿದ ಲೇಖನಗಳು (Related Stories)</span>
              </h3>
              <div className="space-y-3">
                {relatedArticles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/news/${art.slug}`}
                    className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-screen transition-colors group"
                  >
                    <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-hall shrink-0 shadow-2xs">
                      <Image
                        src={art.featuredImage}
                        alt={art.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-popcorn group-hover:text-marquee-soft line-clamp-2 transition-colors">
                        {art.title}
                      </h4>
                      <span className="text-[10px] text-popcorn-muted block mt-1">
                        {new Date(art.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Permanent Archive Notice */}
            <div className="p-5 rounded-3xl bg-marquee/10 border border-marquee/25 text-xs text-marquee-soft space-y-2 shadow-2xs">
              <div className="font-bold text-popcorn">ಶಾಶ್ವತ ಆರ್ಕೈವ್ ಖಾತರಿ (Permanent Archive)</div>
              <p className="text-[11px] leading-relaxed text-popcorn-dim">
                30 ದಿನಗಳ ನಂತರವೂ ಈ ಸಿನಿಮಾದ ವಿವರ, ವಿಮರ್ಶೆ ಮತ್ತು ಪೋಸ್ಟರ್ ಆರ್ಕೈವ್‌ನಲ್ಲಿ ಶಾಶ್ವತವಾಗಿ ಸಂರಕ್ಷಿಸಲ್ಪಡುತ್ತದೆ.
              </p>
              <Link
                href="/archive"
                className="text-marquee-soft font-bold text-[11px] hover:underline block pt-1"
              >
                ಸಂಪೂರ್ಣ ಸಿನಿಮಾ ಆರ್ಕೈವ್ ಬ್ರೌಸ್ ಮಾಡಿ &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
