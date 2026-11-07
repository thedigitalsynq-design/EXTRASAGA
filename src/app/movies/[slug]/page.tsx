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

interface MoviePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const movie = await DataService.getMovieBySlug(params.slug);
  if (!movie) {
    return { title: "Movie Not Found | CINIJAATRE" };
  }

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/movies/${movie.slug}`;

  return {
    title: `${movie.title} (${movie.titleEn}) - Theatrical Release Date, Cast, Trailer & Synopsis | CINIJAATRE`,
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

      {/* Broadsheet Hero Dossier Band */}
      <div className="bg-sheet border-b-2 border-ink py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-ink/20">
            <nav className="flex items-center gap-2 text-xs font-mono-tabular font-bold text-ink-muted uppercase" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-poster-red transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-ink-muted" />
              <Link href="/movies" className="hover:text-poster-red transition-colors">Now Showing</Link>
              <ChevronRight className="w-3.5 h-3.5 text-ink-muted" />
              <span className="text-ink font-black truncate max-w-xs">{movie.titleEn}</span>
            </nav>

            <div className="flex items-center gap-2 text-xs font-mono-tabular font-bold text-ink bg-paper px-3 py-1 border border-ink shadow-sticker">
              <Sparkles className="w-3.5 h-3.5 text-poster-red" />
              <span>Verified Release Dossier</span>
            </div>
          </div>

          {/* Dossier Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Poster Column */}
            <div className="md:col-span-4 lg:col-span-3">
              <div className="relative aspect-[2/3] bg-band border-2 border-ink shadow-press overflow-hidden group">
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
                    className={`text-[10px] font-mono-tabular font-black px-2.5 py-1 border-2 border-ink shadow-sticker uppercase tracking-wide ${
                      diffDays === 0
                        ? "bg-[#4ADE80] text-ink animate-pulse"
                        : diffDays > 0
                        ? "bg-poster-gold text-ink"
                        : "bg-paper text-ink"
                    }`}
                  >
                    {relativeBadge}
                  </span>
                </div>
              </div>

              {/* Release Spec Plate */}
              <div className="mt-4 p-3 bg-paper border-2 border-ink shadow-sticker flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono-tabular uppercase text-ink-muted block font-black">RELEASE SPEC</span>
                  <span className="text-xs font-black text-ink uppercase">{movie.industry} THEATRICAL</span>
                </div>
                <span className="px-2 py-0.5 bg-band text-ink font-mono-tabular text-xs font-black border border-ink">
                  70mm
                </span>
              </div>
            </div>

            {/* Movie Key Specs Column */}
            <div className="md:col-span-8 lg:col-span-9 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-band text-ink font-mono-tabular font-black text-xs uppercase tracking-wider border border-ink shadow-sticker">
                  {movie.industry.toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-paper text-ink font-mono-tabular font-bold text-xs uppercase border border-ink shadow-sticker">
                  {movie.language.toUpperCase()}
                </span>
                {movie.censorRating && (
                  <span className="px-2.5 py-1 bg-paper text-ink font-mono-tabular text-xs font-black border border-ink">
                    CENSOR: {movie.censorRating}
                  </span>
                )}
                {movie.runtimeFormatted && (
                  <span className="text-xs font-mono-tabular font-bold text-ink-muted flex items-center gap-1.5 ml-2">
                    <Clock className="w-3.5 h-3.5 text-poster-red" />
                    <span>{movie.runtimeFormatted}</span>
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-ink tracking-tight uppercase">
                  {movie.title}
                </h1>
                <p className="text-xl sm:text-2xl text-poster-red font-black uppercase mt-1">
                  {movie.titleEn}
                </p>
              </div>

              {/* Release Date Banner */}
              <div className="p-4 bg-paper border-2 border-ink shadow-press flex flex-wrap items-center justify-between gap-4 max-w-xl">
                <div>
                  <span className="text-[10px] text-ink-muted uppercase font-black tracking-wider block font-mono-tabular">
                    Theatrical Release Date (IST)
                  </span>
                  <div className="text-2xl font-black font-mono-tabular text-ink flex items-center gap-2 mt-0.5">
                    <Calendar className="w-5 h-5 text-poster-red" />
                    <span>{formatted}</span>
                  </div>
                </div>

                <div>
                  {isConfirmed ? (
                    <span className="px-3 py-1 bg-[#4ADE80] text-ink border-2 border-ink shadow-sticker text-xs font-black uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-ink" />
                      <span>Confirmed Date</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-poster-gold text-ink border-2 border-ink shadow-sticker text-xs font-black uppercase flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-ink" />
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
                    className="px-3 py-1 bg-paper text-ink border border-ink text-xs font-bold shadow-sticker uppercase"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Director & Producers quick list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3.5 bg-paper border-2 border-ink shadow-sticker">
                  <span className="text-ink-muted block text-[10px] uppercase font-black">Director</span>
                  <span className="text-ink font-black text-sm uppercase mt-0.5 block">{movie.director}</span>
                </div>
                <div className="p-3.5 bg-paper border-2 border-ink shadow-sticker">
                  <span className="text-ink-muted block text-[10px] uppercase font-black">Producers</span>
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
            <section className="bg-sheet p-6 sm:p-8 border-2 border-ink shadow-press space-y-4 card-press-interactive">
              <h2 className="text-xl font-black text-ink uppercase tracking-tight flex items-center gap-2 border-b-2 border-ink pb-3">
                <Film className="w-5 h-5 text-poster-red" />
                <span>Synopsis &amp; Storyline</span>
              </h2>

              {movie.introduction && (
                <p className="text-base text-ink font-bold leading-relaxed bg-band p-4 border-l-4 border-poster-red">
                  {movie.introduction}
                </p>
              )}

              <p className="text-base text-ink-muted leading-relaxed font-medium">
                {movie.synopsis}
              </p>
            </section>

            {/* Official Trailer Embed Player */}
            {movie.trailerYoutubeId && (
              <section className="bg-sheet p-6 sm:p-8 border-2 border-ink shadow-press space-y-4 card-press-interactive">
                <h2 className="text-xl font-black text-ink uppercase tracking-tight flex items-center gap-2 border-b-2 border-ink pb-3">
                  <Play className="w-5 h-5 text-poster-red fill-current" />
                  <span>Official Theatrical Trailer</span>
                </h2>

                <div className="relative aspect-video border-2 border-ink shadow-sticker bg-ink overflow-hidden">
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
            <section className="bg-sheet p-6 sm:p-8 border-2 border-ink shadow-press space-y-4 card-press-interactive">
              <h2 className="text-xl font-black text-ink uppercase tracking-tight flex items-center gap-2 border-b-2 border-ink pb-3">
                <User className="w-5 h-5 text-poster-red" />
                <span>Main Cast &amp; Characters</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {movie.cast.map((actor, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-3.5 bg-paper border-2 border-ink shadow-sticker card-press-interactive"
                  >
                    <div className="w-12 h-12 bg-band text-ink border-2 border-ink flex items-center justify-center shrink-0 font-mono-tabular font-black text-lg">
                      {actor.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-black text-ink uppercase truncate">{actor.name}</h4>
                      <p className="text-xs text-poster-red font-bold uppercase truncate">{actor.role}</p>
                      {actor.characterName && (
                        <p className="text-[11px] text-ink-muted truncate font-medium">
                          Character: {actor.characterName}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Production & Distribution */}
            <section className="bg-sheet p-6 sm:p-8 border-2 border-ink shadow-press space-y-4 card-press-interactive">
              <h2 className="text-xl font-black text-ink uppercase tracking-tight flex items-center gap-2 border-b-2 border-ink pb-3">
                <Building className="w-5 h-5 text-poster-red" />
                <span>Production &amp; Distribution</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-paper border-2 border-ink shadow-sticker">
                  <span className="text-ink-muted uppercase text-[10px] font-black block font-mono-tabular">
                    Production House
                  </span>
                  <span className="text-ink font-black text-sm uppercase mt-1 block">
                    {movie.productionCompany || "To be announced"}
                  </span>
                </div>
                <div className="p-4 bg-paper border-2 border-ink shadow-sticker">
                  <span className="text-ink-muted uppercase text-[10px] font-black block font-mono-tabular">
                    Distribution Network
                  </span>
                  <span className="text-ink font-black text-sm uppercase mt-1 block">
                    {movie.distributionCompany || "All-India Theatrical Distribution"}
                  </span>
                </div>
              </div>
            </section>

            {/* Editorial Verification */}
            <section className="p-5 bg-paper border-2 border-ink shadow-sticker text-xs text-ink-muted space-y-2">
              <div className="flex items-center gap-2 text-ink font-black uppercase text-xs">
                <ShieldCheck className="w-4 h-4 text-poster-red" />
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
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-band text-ink font-bold border border-ink transition-colors text-[11px] hover:bg-sheet shadow-sticker"
                    >
                      <span>{src.name}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}
              <div className="pt-2 text-[11px] text-ink-muted font-mono-tabular font-bold border-t border-ink/20">
                Last updated: {new Date(movie.updatedAt).toLocaleDateString()} · Asia/Kolkata live time
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Share Card */}
            <div className="bg-sheet p-6 border-2 border-ink shadow-press space-y-3">
              <h3 className="text-sm font-black text-ink uppercase tracking-wider flex items-center gap-2">
                <Share2 className="w-4 h-4 text-poster-red" />
                <span>Share Release Dossier</span>
              </h3>
              <p className="text-xs text-ink-muted font-medium">
                Share this film&apos;s release date with fellow cinephiles:
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${movie.title} (${movie.titleEn}) Theatrical Release: ${formatted}. Read more on CINIJAATRE: ${siteUrl}/movies/${movie.slug}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 bg-paper hover:bg-band text-ink text-xs font-black uppercase text-center border-2 border-ink shadow-sticker transition-all btn-press-interactive"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${movie.title} (${movie.titleEn}) Theatrical Release: ${formatted} #CINIJAATRE`)}&url=${encodeURIComponent(`${siteUrl}/movies/${movie.slug}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 bg-paper hover:bg-band text-ink text-xs font-black uppercase text-center border-2 border-ink shadow-sticker transition-all btn-press-interactive"
                >
                  Twitter / X
                </a>
              </div>
            </div>

            {/* Related Movie Articles */}
            <div className="bg-sheet p-6 border-2 border-ink shadow-press space-y-4">
              <h3 className="text-sm font-black text-ink uppercase tracking-wider flex items-center gap-2">
                <Clapperboard className="w-4 h-4 text-poster-violet" />
                <span>Related Dispatches</span>
              </h3>
              <div className="space-y-3">
                {relatedArticles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/news/${art.slug}`}
                    className="flex items-start gap-3 p-2 bg-paper border border-ink shadow-sticker hover:bg-band transition-all card-press-interactive group"
                  >
                    <div className="relative w-16 h-12 border border-ink overflow-hidden bg-band shrink-0">
                      <Image
                        src={art.featuredImage}
                        alt={art.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-black text-ink group-hover:text-poster-red line-clamp-2 transition-colors uppercase">
                        {art.title}
                      </h4>
                      <span className="text-[10px] text-ink-muted font-mono-tabular font-bold block mt-1">
                        {new Date(art.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Permanent Archive Notice */}
            <div className="p-5 bg-band border-2 border-ink shadow-press text-xs space-y-2">
              <div className="font-black text-ink uppercase text-sm">Permanent Lore Vault</div>
              <p className="text-xs leading-relaxed text-ink-muted font-medium">
                Long after the theatrical run closes, this film&apos;s details, reviews, and posters remain permanently cataloged in our archival registry.
              </p>
              <Link
                href="/archive"
                className="text-poster-red font-black text-xs uppercase hover:underline block pt-1"
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
