import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  Calendar,
  Clock,
  Eye,
  User,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Bookmark,
  Share2,
} from "lucide-react";
import { DataService } from "@/lib/dataService";
import { formatKannadaDate, formatKannadaNumber, formatKannadaTimeAgo } from "@/lib/utils";
import SocialShare from "@/components/SocialShare";
import CommentSection from "@/components/CommentSection";
import TrendingSidebar from "@/components/TrendingSidebar";
import ArticleCard from "@/components/ArticleCard";
import AdBanner from "@/components/AdBanner";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await DataService.getArticleBySlug(params.slug);
  if (!article) {
    return {
      title: "ಲೇಖನ ಕಂಡುಬಂದಿಲ್ಲ",
    };
  }

  return {
    title: `${article.title} | ಸಿನಿ ಕನ್ನಡ`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      url: `https://sinikannada.com/news/${article.slug}`,
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
    DataService.getArticles(),
    DataService.getTrendingArticles(5),
  ]);

  // Find previous and next articles
  const currentIndex = allArticles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex >= 0 && currentIndex < allArticles.length - 1
      ? allArticles[currentIndex + 1]
      : null;

  // Related articles from same category
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
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
      name: "ಸಿನಿ ಕನ್ನಡ",
      logo: {
        "@type": "ImageObject",
        url: "https://sinikannada.com/logo.png",
      },
    },
  };

  return (
    <div className="w-full">
      {/* Schema.org Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-brand-dark/40 border-b border-brand-border py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-brand-muted font-kannada">
          <Link href="/" className="hover:text-white transition-colors">
            ಮುಖಪುಟ
          </Link>
          <span>/</span>
          <Link
            href={`/category/${article.category}`}
            className="hover:text-brand-red text-gray-300 font-medium transition-colors"
          >
            {article.categoryName}
          </Link>
          <span>/</span>
          <span className="text-gray-400 truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content (Col 8) */}
          <main className="lg:col-span-8">
            <article className="bg-brand-dark rounded-2xl border border-brand-border/80 p-5 sm:p-8 shadow-xl">
              {/* Category & Read time */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <Link
                  href={`/category/${article.category}`}
                  className="px-3 py-1 rounded bg-brand-red text-white text-xs font-bold font-kannada tracking-wide"
                >
                  {article.categoryName}
                </Link>
                <div className="flex items-center gap-2 text-xs text-brand-muted">
                  <Clock className="w-3.5 h-3.5 text-brand-red" />
                  <span>{article.readTimeMinutes} ನಿಮಿಷ ಓದು</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-sans">
                    <Eye className="w-3.5 h-3.5" />
                    {formatKannadaNumber(article.views)}
                  </span>
                </div>
              </div>

              {/* Kannada Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-kannada leading-tight tracking-tight">
                {article.title}
              </h1>

              {/* Short summary / Sub-headline */}
              <p className="mt-4 text-base sm:text-lg text-gray-300 font-kannada leading-relaxed font-normal border-l-4 border-brand-red pl-4 italic">
                {article.summary}
              </p>

              {/* Author & Published Info */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 py-3.5 border-y border-brand-border/60 text-xs text-gray-400 font-kannada">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-brand-red font-bold font-sans">
                    {article.author.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-200">{article.author.name}</div>
                    <div className="text-[11px] text-brand-muted">{article.author.role || "ಸಿನಿಮಾ ಡೆಸ್ಕ್"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-brand-muted font-sans text-[11px]">
                  <span>📅 ಪ್ರಕಟ: {formatKannadaDate(article.publishedAt)}</span>
                  {article.updatedAt && (
                    <>
                      <span>•</span>
                      <span>ಅಪ್ಡೇಟ್: {formatKannadaTimeAgo(article.updatedAt)}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Social Share Buttons */}
              <SocialShare title={article.title} />

              {/* Featured Image */}
              <div className="my-6">
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden shadow-2xl">
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
                  <p className="mt-2 text-center text-xs text-brand-muted font-kannada italic">
                    📷 {article.imageCaption}
                  </p>
                )}
              </div>

              {/* Article Rich Kannada Body Content */}
              <div className="prose prose-invert max-w-none text-gray-200 font-kannada leading-relaxed space-y-4 text-sm sm:text-base">
                <div
                  className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: article.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong class='text-white font-extrabold'>$1</strong>")
                      .replace(/### (.*?)\n/g, "<h3 class='text-xl sm:text-2xl font-bold text-brand-red mt-6 mb-3 font-kannada'>$1</h3>")
                      .replace(/> (.*?)\n/g, "<blockquote class='border-l-4 border-brand-yellow pl-4 py-2 my-4 bg-brand-card/50 rounded-r text-brand-yellow font-medium italic'>$1</blockquote>"),
                  }}
                />
              </div>

              {/* In-Article Advertisement */}
              <AdBanner placement="in_article" />

              {/* Article Tags */}
              <div className="mt-8 pt-6 border-t border-brand-border flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-300 font-kannada">ಟ್ಯಾಗ್‌ಗಳು:</span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-full bg-brand-card hover:bg-brand-red text-gray-300 hover:text-white text-xs font-kannada border border-brand-border transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* Bottom Social Share */}
              <SocialShare title={article.title} />

              {/* Previous & Next Article Navigation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 pt-6 border-t border-brand-border">
                {prevArticle ? (
                  <Link
                    href={`/news/${prevArticle.slug}`}
                    className="group p-4 rounded-xl bg-brand-card hover:bg-brand-card/80 border border-brand-border hover:border-brand-red/50 transition-colors flex flex-col justify-between"
                  >
                    <span className="text-[11px] text-brand-muted font-kannada flex items-center gap-1 mb-1">
                      <ChevronLeft className="w-3.5 h-3.5" />
                      ಹಿಂದಿನ ಸುದ್ದಿ
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-200 group-hover:text-brand-red font-kannada line-clamp-2">
                      {prevArticle.title}
                    </h4>
                  </Link>
                ) : (
                  <div></div>
                )}

                {nextArticle && (
                  <Link
                    href={`/news/${nextArticle.slug}`}
                    className="group p-4 rounded-xl bg-brand-card hover:bg-brand-card/80 border border-brand-border hover:border-brand-red/50 transition-colors flex flex-col justify-between text-right"
                  >
                    <span className="text-[11px] text-brand-muted font-kannada flex items-center justify-end gap-1 mb-1">
                      ಮುಂದಿನ ಸುದ್ದಿ
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-200 group-hover:text-brand-red font-kannada line-clamp-2">
                      {nextArticle.title}
                    </h4>
                  </Link>
                )}
              </div>

              {/* Interactive Comment Section */}
              <CommentSection articleId={article.id} />
            </article>

            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
              <div className="my-10">
                <h3 className="text-lg sm:text-xl font-extrabold text-white font-kannada mb-5 border-l-4 border-brand-red pl-3">
                  ಸಂಬಂಧಿತ ಇತರ ಸುದ್ದಿಗಳು (Related News)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedArticles.map((rel) => (
                    <ArticleCard key={rel.id} article={rel} variant="grid" />
                  ))}
                </div>
              </div>
            )}
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
