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
  Sparkles,
} from "lucide-react";
import { DataService } from "@/lib/dataService";
import { formatReleaseDateIST } from "@/lib/cinemaDateUtils";
import { getSiteUrl } from "@/lib/siteUrl";
import ReleaseCountdown from "@/components/ReleaseCountdown";

interface MoviePageProps {
  params: {
    slug: string;
  } | Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const movies = await DataService.getMovies();
  return movies.map((movie) => ({
    slug: movie.slug,
  }));
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const movie = await DataService.getMovieBySlug(resolvedParams.slug);
  if (!movie) {
    return { title: "Movie Not Found | EXTRA-SAAGA" };
  }

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/movies/${movie.slug}`;

  return {
    title: `${movie.title} (${movie.titleEn}) - Theatrical Release Date, Cast, Trailer & Synopsis | EXTRA-SAAGA`,
    description: `${movie.title} (${movie.titleEn}) theatrical release dossier. Director: ${movie.director}. Cast: ${movie.cast.map(c => c.name).slice(0, 3).join(", ")}. Release date: ${movie.theatricalReleaseDate}.`,
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
  const resolvedParams = await Promise.resolve(params);
  const movie = await DataService.getMovieBySlug(resolvedParams.slug);
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
    <main className="min-h-screen bg-paper text-ink pb-20 font-sans">
      {/* Schema.org Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdMovie) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* Cinema Hero Dossier Band */}
      <div className="bg-sheet border-b border-line py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-line">
            <nav className="flex items-center gap-2 text-xs font-mono-tabular font-bold text-ink-mute uppercase" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-press transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-ink-mute" />
              <Link href="/movies" className="hover:text-press transition-colors">Now Showing</Link>
              <ChevronRight className="w-3.5 h-3.5 text-ink-mute" />
              <span className="text-ink font-black truncate max-w-xs">{movie.titleEn}</span>
            </nav>

            <div className="flex items-center gap-2 text-xs font-mono-tabular font-bold text-ink bg-surface px-3 py-1 border border-line rounded shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-press" />
              <span>Verified Release Dossier</span>
            </div>
          </div>

          {/* Dossier Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Poster Column */}
            <div className="md:col-span-4 lg:col-span-3 space-y-4">
              <div className="relative aspect-[2/3] bg-band border border-line rounded-xl shadow-xl overflow-hidden group">
                <Image
                  src={movie.posterImage}
                  alt={movie.titleEn}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-[10px] font-mono-tabular font-black px-2.5 py-1 border border-line rounded-lg shadow-sm uppercase tracking-wide backdrop-blur-sm ${
                      diffDays === 0
                        ? "bg-[#4ADE80] text-ink animate-pulse"
                        : diffDays > 0
                        ? "bg-marquee text-ink"
                        : "bg-surface/90 text-ink"
                    }`}
                  >
                    {relativeBadge}
                  </span>
                </div>
              </div>

              {/* Release Countdown if upcoming */}
              {diffDays > 0 && (
                <ReleaseCountdown releaseDate={movie.theatricalReleaseDate} />
              )}

              {/* Release Spec Plate */}
              <div className="p-3 bg-surface border border-line rounded-xl shadow-sm flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono-tabular uppercase text-ink-mute block font-black">RELEASE SPEC</span>
                  <span className="text-xs font-black text-ink uppercase">{movie.industry} THEATRICAL</span>
                </div>
                <span className="px-2.5 py-1 bg-band text-ink font-mono-tabular text-xs font-black border border-line rounded-md">
                  70mm
                </span>
              </div>
            </div>

            {/* Movie Key Specs Column */}
            <div className="md:col-span-8 lg:col-span-9 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-surface text-ink font-mono-tabular font-black text-xs uppercase tracking-wider border border-line rounded-lg shadow-sm">
                  {movie.industry.toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-surface text-ink font-mono-tabular font-bold text-xs uppercase border border-line rounded-lg shadow-sm">
                  {movie.language.toUpperCase()}
                </span>
                {movie.censorRating && (
                  <span className="px-2.5 py-1 bg-surface text-ink font-mono-tabular text-xs font-black border border-line rounded-lg shadow-sm">
                    CENSOR: {movie.censorRating}
                  </span>
                )}
                {movie.runtimeFormatted && (
                  <span className="text-xs font-mono-tabular font-bold text-ink-mute flex items-center gap-1.5 ml-2">
                    <Clock className="w-3.5 h-3.5 text-press" />
                    <span>{movie.runtimeFormatted}</span>
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-ink tracking-tight uppercase">
                  {movie.title}
                </h1>
                <p className="text-xl sm:text-2xl text-press font-black uppercase mt-1">
                  {movie.titleEn}
                </p>
              </div>

              {/* Release Date Banner */}
              <div className="p-5 bg-sheet border border-line rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4 max-w-xl">
                <div>
                  <span className="text-[10px] text-ink-mute uppercase font-black tracking-wider block font-mono-tabular">
                    Theatrical Release Date (IST)
                  </span>
                  <div className="text-2xl font-black font-mono-tabular text-ink flex items-center gap-2.5 mt-0.5">
                    <Calendar className="w-5 h-5 text-press" />
                    <span>{formatted}</span>
                  </div>
                </div>

                <div>
                  {isConfirmed ? (
                    <span className="px-3.5 py-1.5 bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/40 rounded-lg shadow-sm text-xs font-black uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
                      <span>Confirmed Date</span>
                    </span>
                  ) : (
                    <span className="px-3.5 py-1.5 bg-marquee/20 text-ink border border-line rounded-lg shadow-sm text-xs font-black uppercase flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-press" />
                      <span>Tentative Window</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Genres Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {movie.genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 bg-surface text-ink border border-line rounded-lg text-xs font-bold shadow-sm uppercase"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Director & Producers quick list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-4 bg-sheet border border-line rounded-xl shadow-sm">
                  <span className="text-ink-mute block text-[10px] uppercase font-black">Director</span>
                  <span className="text-ink font-black text-sm uppercase mt-0.5 block">{movie.director}</span>
                </div>
                <div className="p-4 bg-sheet border border-line rounded-xl shadow-sm">
                  <span className="text-ink-mute block text-[10px] uppercase font-black">Producers</span>
                  <span className="text-ink font-black text-sm uppercase mt-0.5 block truncate">
                    {movie.producers.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article & Movie Dossier */}
          <div className="lg:col-span-8 space-y-8">
            {/* Synopsis */}
            <section className="bg-sheet p-6 sm:p-8 border border-line rounded-2xl shadow-xl space-y-4">
              <h2 className="text-xl font-black text-ink uppercase tracking-tight flex items-center gap-2 border-b border-line pb-3">
                <Film className="w-5 h-5 text-press" />
                <span>Synopsis &amp; Storyline</span>
              </h2>

              {movie.introduction && (
                <p className="text-base text-ink font-bold leading-relaxed bg-surface p-4 border-l-4 border-press rounded-r-lg">
                  {movie.introduction}
                </p>
              )}

              <p className="text-base text-ink-mute leading-relaxed font-medium">
                {movie.synopsis}
              </p>
            </section>

            {/* Official Trailer Embed Player */}
            {movie.trailerYoutubeId && (
              <section className="bg-sheet p-6 sm:p-8 border border-line rounded-2xl shadow-xl space-y-4">
                <h2 className="text-xl font-black text-ink uppercase tracking-tight flex items-center gap-2 border-b border-line pb-3">
                  <Play className="w-5 h-5 text-press fill-current" />
                  <span>Official Theatrical Trailer</span>
                </h2>

                <div className="relative aspect-video border border-line rounded-xl shadow-lg bg-surface overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${movie.trailerYoutubeId}?autoplay=0&rel=0`}
                    title={`${movie.titleEn} Official Trailer`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </section>
            )}

            {/* Cast & Characters Grid */}
            <section className="bg-sheet p-6 sm:p-8 border border-line rounded-2xl shadow-xl space-y-4">
              <h2 className="text-xl font-black text-ink uppercase tracking-tight flex items-center gap-2 border-b border-line pb-3">
                <User className="w-5 h-5 text-press" />
                <span>Main Cast &amp; Characters</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {movie.cast.map((actor, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-3.5 bg-surface border border-line rounded-xl shadow-sm hover:border-press/40 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-lg bg-band text-ink border border-line flex items-center justify-center shrink-0 font-mono-tabular font-black text-lg">
                      {actor.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-black text-ink uppercase truncate">{actor.name}</h4>
                      <p className="text-xs text-press font-bold uppercase truncate">{actor.role}</p>
                      {actor.characterName && (
                        <p className="text-[11px] text-ink-mute truncate font-medium">
                          Character: {actor.characterName}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Production & Distribution */}
            <section className="bg-sheet p-6 sm:p-8 border border-line rounded-2xl shadow-xl space-y-4">
              <h2 className="text-xl font-black text-ink uppercase tracking-tight flex items-center gap-2 border-b border-line pb-3">
                <Building className="w-5 h-5 text-press" />
                <span>Production &amp; Distribution</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-surface border border-line rounded-xl shadow-sm">
                  <span className="text-ink-mute uppercase text-[10px] font-black block font-mono-tabular">
                    Production House
                  </span>
                  <span className="text-ink font-black text-sm uppercase mt-1 block">
                    {movie.productionCompany || "To be announced"}
                  </span>
                </div>
                <div className="p-4 bg-surface border border-line rounded-xl shadow-sm">
                  <span className="text-ink-mute uppercase text-[10px] font-black block font-mono-tabular">
                    Distribution Network
                  </span>
                  <span className="text-ink font-black text-sm uppercase mt-1 block">
                    {movie.distributionCompany || "All-India Theatrical Distribution"}
                  </span>
                </div>
              </div>
            </section>

            {/* Editorial Verification */}
            <section className="p-5 bg-sheet border border-line rounded-xl shadow-lg text-xs text-ink-mute space-y-2">
              <div className="flex items-center gap-2 text-ink font-black uppercase text-xs">
                <ShieldCheck className="w-4 h-4 text-press" />
                <span>Verified Editorial References</span>
              </div>
              <p className="leading-relaxed font-medium">
                This film&apos;s release details, cast, and censor certificate information have been independently checked against official production house bulletins and authorized trade distributors.
              </p>
              {movie.sourceReferences && movie.sourceReferences.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {movie.sourceReferences.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface text-ink font-bold border border-line rounded-lg transition-colors text-[11px] hover:bg-band hover:border-press/40 shadow-sm"
                    >
                      <span>{src.name}</span>
                      <ExternalLink className="w-3 h-3 text-press" />
                    </a>
                  ))}
                </div>
              )}
              <div className="pt-2 text-[11px] text-ink-mute font-mono-tabular font-bold border-t border-line">
                Last updated: {new Date(movie.updatedAt).toLocaleDateString()} · Asia/Kolkata live time
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Share Card */}
            <div className="bg-sheet p-6 border border-line rounded-xl shadow-lg space-y-3">
              <h3 className="text-sm font-black text-ink uppercase tracking-wider flex items-center gap-2">
                <Share2 className="w-4 h-4 text-press" />
                <span>Share Release Dossier</span>
              </h3>
              <p className="text-xs text-ink-mute font-medium">
                Share this film&apos;s release date with fellow cinephiles:
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${movie.title} (${movie.titleEn}) Theatrical Release: ${formatted}. Read more on EXTRA-SAAGA: ${siteUrl}/movies/${movie.slug}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 bg-surface hover:bg-band text-ink text-xs font-black uppercase text-center border border-line rounded-lg shadow-sm transition-all hover:border-press/40"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${movie.title} (${movie.titleEn}) Theatrical Release: ${formatted} #EXTRA_SAAGA`)}&url=${encodeURIComponent(`${siteUrl}/movies/${movie.slug}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 bg-surface hover:bg-band text-ink text-xs font-black uppercase text-center border border-line rounded-lg shadow-sm transition-all hover:border-press/40"
                >
                  Twitter / X
                </a>
              </div>
            </div>

            {/* Related Movie Articles */}
            <div className="bg-sheet p-6 border border-line rounded-xl shadow-lg space-y-4">
              <h3 className="text-sm font-black text-ink uppercase tracking-wider flex items-center gap-2">
                <Clapperboard className="w-4 h-4 text-violet" />
                <span>Related Dispatches</span>
              </h3>
              <div className="space-y-3">
                {relatedArticles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/news/${art.slug}`}
                    className="flex items-start gap-3 p-2.5 bg-surface border border-line rounded-lg shadow-sm hover:border-press/40 transition-all group"
                  >
                    <div className="relative w-16 h-12 border border-line rounded-md overflow-hidden bg-band shrink-0">
                      <Image
                        src={art.featuredImage}
                        alt={art.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-black text-ink group-hover:text-press line-clamp-2 transition-colors uppercase">
                        {art.title}
                      </h4>
                      <span className="text-[10px] text-ink-mute font-mono-tabular font-bold block mt-1">
                        {new Date(art.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Permanent Archive Notice */}
            <div className="p-5 bg-surface border border-line rounded-xl shadow-lg text-xs space-y-2">
              <div className="font-black text-ink uppercase text-sm">Permanent Lore Vault</div>
              <p className="text-xs leading-relaxed text-ink-mute font-medium">
                Long after the theatrical run closes, this film&apos;s details, reviews, and posters remain permanently cataloged in our archival registry.
              </p>
              <Link
                href="/archive"
                className="text-press font-black text-xs uppercase hover:underline block pt-1"
              >
                Browse the permanent cinema archive &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
