import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { DataService } from "@/lib/dataService";
import { formatEditorialDate, formatCineNumber, formatEditorialTimeAgo } from "@/lib/utils";
import { getSiteUrl } from "@/lib/siteUrl";
import SocialShare from "@/components/SocialShare";
import CommentSection from "@/components/CommentSection";
import TrendingSidebar from "@/components/TrendingSidebar";
import ArticleCard from "@/components/ArticleCard";
import AdBanner from "@/components/AdBanner";
import { getLocalizedCategoryName } from "@/lib/translations";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await DataService.getArticleBySlug(params.slug);
  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const siteUrl = getSiteUrl();

  return {
    title: `${article.title} | EXTRASAGA`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      url: `${siteUrl}/news/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: [
        {
          url: article.featuredImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: [article.featuredImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await DataService.getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const [allArticles, trendingArticles] = await Promise.all([
    DataService.getArticles(undefined, "en"),
    DataService.getTrendingArticles(5, "en"),
  ]);

  // Find previous and next articles
  const currentIndex = allArticles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex >= 0 && currentIndex < allArticles.length - 1
      ? allArticles[currentIndex + 1]
      : null;

  // Related articles from same industry / category
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && (a.category === article.category || a.industry === article.industry))
    .slice(0, 3);

  // Structured Data (Schema.org NewsArticle)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    image: [article.featuredImage],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: [
      {
        "@type": "Person",
        name: article.author.name,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "EXTRASAGA",
      url: getSiteUrl(),
      logo: {
        "@type": "ImageObject",
        url: `${getSiteUrl()}/logo.png`,
      },
    },
  };

  const localizedCatName = getLocalizedCategoryName(article.category, "en");

  return (
    <div className="w-full bg-paper min-h-screen text-ink">
      {/* Schema.org Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-sheet border-b-2 border-ink py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-mono text-ink-dim">
          <Link href="/" className="hover:text-press font-bold transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/category/${article.category}`}
            className="hover:text-press font-bold transition-colors"
          >
            {localizedCatName}
          </Link>
          <span>/</span>
          <span className="text-ink-mute truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content (Col 8) */}
          <main className="lg:col-span-8">
            <article className="bg-sheet border-2 border-ink shadow-press p-5 sm:p-8">
              {/* Category & Read time */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/category/${article.category}`}
                    className="sticker bg-press text-paper border-2 border-ink px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-sticker"
                  >
                    {localizedCatName}
                  </Link>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-marquee text-ink border-2 border-ink shadow-sticker">
                    {article.industry ? article.industry.toUpperCase() : "INDIAN CINEMA"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-ink-dim font-bold">
                  <Clock className="w-3.5 h-3.5 text-press" />
                  <span>{article.readTimeMinutes} min read</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {formatCineNumber(article.views)}
                  </span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-4xl font-poster uppercase text-ink leading-tight tracking-tight">
                {article.title}
              </h1>

              {/* Short summary / Sub-headline */}
              <p className="mt-4 text-base sm:text-lg text-ink-dim leading-relaxed font-grotesk font-medium border-l-4 border-press pl-4 italic bg-paper border-2 border-ink shadow-sticker py-3">
                {article.summary}
              </p>

              {/* Author & Published Info */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 py-3.5 border-y-2 border-ink text-xs font-mono text-ink-dim">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-ink text-paper border-2 border-ink flex items-center justify-center font-poster uppercase">
                    {article.author.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-poster uppercase text-ink">{article.author.name}</div>
                    <div className="text-[11px] text-ink-mute font-grotesk">{article.author.role || "Cinema Desk"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-ink-mute font-mono text-[11px]">
                  <span>📅 {formatEditorialDate(article.publishedAt)}</span>
                  {article.updatedAt && (
                    <>
                      <span>•</span>
                      <span>{formatEditorialTimeAgo(article.updatedAt)}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="my-4">
                <SocialShare title={article.title} />
              </div>

              {/* Featured Image */}
              <div className="my-6">
                <div className="relative aspect-[16/10] w-full border-2 border-ink shadow-press overflow-hidden bg-band">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 800px"
                  />
                </div>
                {article.imageCaption && (
                  <p className="mt-2 text-center text-xs text-ink-mute font-mono italic">
                    📷 {article.imageCaption}
                  </p>
                )}
              </div>

              {/* Article Rich Body Content */}
              <div className="prose max-w-none text-ink leading-relaxed space-y-4 text-sm sm:text-base font-normal font-sans">
                <div
                  className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: (article.content ?? "")
                      .replace(/\*\*(.*?)\*\*/g, "<strong class='text-ink font-extrabold'>$1</strong>")
                      .replace(/### (.*?)\n/g, "<h3 class='text-xl sm:text-2xl font-poster uppercase text-ink mt-6 mb-3'>$1</h3>")
                      .replace(/> (.*?)\n/g, "<blockquote class='border-l-4 border-press pl-4 py-2 my-4 bg-paper border border-ink text-ink-dim font-medium italic'>$1</blockquote>"),
                  }}
                />
              </div>

              {/* Authentic Source Attribution Block */}
              {article.source?.url && (
                <div className="my-6 p-4 bg-paper border-2 border-ink shadow-sticker flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-band text-ink border border-ink shrink-0">
                      <ShieldCheck className="w-4 h-4 text-press-deep" />
                    </div>
                    <div>
                      <div className="text-xs font-poster uppercase text-ink flex items-center gap-1.5 flex-wrap">
                        <span className="text-ink-mute">Verified Source:</span>
                        <span className="text-press-deep">{article.source.name}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-band text-ink border border-ink uppercase">
                          Official Syndication
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-dim mt-0.5 font-mono">
                        Published at {new Date(article.publishedAt).toLocaleString()} · Full copyright belongs to original publisher
                      </p>
                    </div>
                  </div>
                  <a
                    href={article.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-ink hover:bg-press text-xs font-poster uppercase text-paper transition-all shrink-0 border-2 border-ink shadow-sticker"
                  >
                    <span>Read Original on {article.source.name}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* In-Article Advertisement */}
              <AdBanner placement="in_article" />

              {/* Article Tags */}
              <div className="mt-8 pt-6 border-t-2 border-ink flex items-center gap-2 flex-wrap">
                <span className="text-xs font-poster uppercase text-ink">
                  Tags:
                </span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-paper hover:bg-press hover:text-paper text-ink text-xs border-2 border-ink shadow-sticker font-grotesk font-bold uppercase transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* Bottom Social Share */}
              <div className="my-4">
                <SocialShare title={article.title} />
              </div>

              {/* Prev / Next Article Navigation */}
              <div className="my-8 pt-6 border-t-2 border-ink grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevArticle ? (
                  <Link
                    href={`/news/${prevArticle.slug}`}
                    className="group p-4 bg-paper hover:bg-band border-2 border-ink shadow-sticker transition-all flex items-center gap-3"
                  >
                    <ChevronLeft className="w-5 h-5 text-press shrink-0 group-hover:-translate-x-1 transition-transform" />
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-ink-mute block font-mono font-bold">
                        Previous Story
                      </span>
                      <h4 className="text-xs sm:text-sm font-poster uppercase text-ink group-hover:text-press truncate transition-colors">
                        {prevArticle.title}
                      </h4>
                    </div>
                  </Link>
                ) : (
                  <div></div>
                )}

                {nextArticle && (
                  <Link
                    href={`/news/${nextArticle.slug}`}
                    className="group p-4 bg-paper hover:bg-band border-2 border-ink shadow-sticker transition-all flex items-center justify-between gap-3 text-right"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase tracking-wider text-ink-mute block font-mono font-bold">
                        Next Story
                      </span>
                      <h4 className="text-xs sm:text-sm font-poster uppercase text-ink group-hover:text-press truncate transition-colors">
                        {nextArticle.title}
                      </h4>
                    </div>
                    <ChevronRight className="w-5 h-5 text-press shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>

              {/* Comments Section */}
              <CommentSection articleId={article.id} />
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-poster uppercase text-ink mb-4 border-l-4 border-press pl-3">
                  Related Stories
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedArticles.map((rel) => (
                    <ArticleCard key={rel.id} article={rel} variant="grid" />
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <TrendingSidebar articles={trendingArticles} />
            <AdBanner placement="sidebar_rectangle" />
          </aside>
        </div>
      </div>
    </div>
  );
}
