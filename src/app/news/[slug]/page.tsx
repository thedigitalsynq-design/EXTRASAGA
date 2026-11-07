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
import { formatKannadaDate, formatKannadaNumber, formatKannadaTimeAgo } from "@/lib/utils";
import { getSiteUrl } from "@/lib/siteUrl";
import SocialShare from "@/components/SocialShare";
import CommentSection from "@/components/CommentSection";
import TrendingSidebar from "@/components/TrendingSidebar";
import ArticleCard from "@/components/ArticleCard";
import AdBanner from "@/components/AdBanner";
import { getLanguageConfig } from "@/lib/languages";
import { getTranslation, getLocalizedCategoryName } from "@/lib/translations";
import { LanguageCode } from "@/types";

interface ArticlePageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    lang?: string;
  };
}

export async function generateMetadata({ params, searchParams }: ArticlePageProps): Promise<Metadata> {
  const article = await DataService.getArticleBySlug(params.slug);
  if (!article) {
    return {
      title: "ಲೇಖನ ಕಂಡುಬಂದಿಲ್ಲ",
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

export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
  const article = await DataService.getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const activeLang = (article.language || searchParams?.lang || "kn") as LanguageCode;
  const config = getLanguageConfig(activeLang);

  const [allArticles, trendingArticles] = await Promise.all([
    DataService.getArticles(undefined, activeLang),
    DataService.getTrendingArticles(5, activeLang),
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

  const localizedCatName = getLocalizedCategoryName(article.category, activeLang);

  const readTimeLabel: Record<string, string> = {
    kn: "ನಿಮಿಷ ಓದು",
    te: "నిమిషాల పఠనం",
    ta: "நிமிட வாசிப்பு",
    ml: "മിനിറ്റ് വായന",
    hi: "मिनट पढ़ें",
    en: "min read",
  };

  const tagsLabel: Record<string, string> = {
    kn: "ಟ್ಯಾಗ್‌ಗಳು:",
    te: "ట్యాగ్‌లు:",
    ta: "குறிச்சொற்கள்:",
    ml: "ടാഗുകൾ:",
    hi: "टैग्स:",
    en: "Tags:",
  };

  const relatedLabel: Record<string, string> = {
    kn: "ಸಂಬಂಧಿತ ಮತ್ತಷ್ಟು ಸುದ್ದಿಗಳು",
    te: "మరిన్ని సంబంధిత వార్తలు",
    ta: "தொடர்புடைய முக்கிய செய்திகள்",
    ml: "മറ്റു പ്രധാന വാർത്തകൾ",
    hi: "संबंधित अन्य ख़बरें",
    en: "Related Stories",
  };

  return (
    <div className="w-full">
      {/* Schema.org Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-hall border-b border-glow-line py-3 px-4 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-popcorn-dim">
          <Link href={`/?lang=${activeLang}`} className="hover:text-popcorn font-medium transition-colors">
            {getTranslation(activeLang, "nav_home")}
          </Link>
          <span>/</span>
          <Link
            href={`/category/${article.category}?lang=${activeLang}`}
            className="hover:text-signal-soft text-popcorn-dim font-medium transition-colors"
          >
            {localizedCatName}
          </Link>
          <span>/</span>
          <span className="text-popcorn-muted truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content (Col 8) */}
          <main className="lg:col-span-8">
            <article className="bg-revealed rounded-3xl border border-glow-line p-5 sm:p-8 shadow-sm">
              {/* Category & Read time */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/category/${article.category}?lang=${activeLang}`}
                    className="px-3 py-1 rounded-full bg-signal-deep text-popcorn text-xs font-bold tracking-wide shadow-xs"
                  >
                    {localizedCatName}
                  </Link>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-display-latin font-black uppercase tracking-[0.2em] ${config.badgeColor} border border-glow-line`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                    {config.industryName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-popcorn-dim">
                  <Clock className="w-3.5 h-3.5 text-signal-soft" />
                  <span>
                    {article.readTimeMinutes} {readTimeLabel[activeLang] || readTimeLabel.kn}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-sans">
                    <Eye className="w-3.5 h-3.5" />
                    {formatKannadaNumber(article.views)}
                  </span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display-latin text-popcorn leading-tight tracking-tight">
                {article.title}
              </h1>

              {/* Short summary / Sub-headline */}
              <p className="mt-4 text-base sm:text-lg text-popcorn-dim leading-relaxed font-normal border-l-4 border-signal pl-4 italic bg-hall/80 py-3 rounded-r-xl">
                {article.summary}
              </p>

              {/* Author & Published Info */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 py-3.5 border-y border-glow-line text-xs text-popcorn-dim">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-signal-deep border border-signal/40 flex items-center justify-center text-popcorn font-bold font-sans">
                    {article.author.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-popcorn">{article.author.name}</div>
                    <div className="text-[11px] text-popcorn-muted">{article.author.role || `${config.industryName} Desk`}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-popcorn-muted font-sans text-[11px]">
                  <span>📅 {formatKannadaDate(article.publishedAt)}</span>
                  {article.updatedAt && (
                    <>
                      <span>•</span>
                      <span>{formatKannadaTimeAgo(article.updatedAt)}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Social Share Buttons */}
              <SocialShare title={article.title} />

              {/* Featured Image */}
              <div className="my-6">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-md">
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
                  <p className="mt-2 text-center text-xs text-popcorn-muted italic">
                    📷 {article.imageCaption}
                  </p>
                )}
              </div>

              {/* Article Rich Body Content */}
              <div className="prose max-w-none text-popcorn leading-relaxed space-y-4 text-sm sm:text-base font-normal">
                <div
                  className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: (article.content ?? "")
                      .replace(/\*\*(.*?)\*\*/g, "<strong class='text-popcorn font-extrabold'>$1</strong>")
                      .replace(/### (.*?)\n/g, "<h3 class='text-xl sm:text-2xl font-bold font-display-latin text-popcorn mt-6 mb-3'>$1</h3>")
                      .replace(/> (.*?)\n/g, "<blockquote class='border-l-4 border-marquee pl-4 py-2 my-4 bg-marquee/10 rounded-r text-popcorn-dim font-medium italic'>$1</blockquote>"),
                  }}
                />
              </div>

              {/* Authentic Source Attribution Block (Requirement 6) */}
              {article.source?.url && (
                <div className="my-6 p-4 rounded-2xl bg-ultra/10 border border-ultra/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-ultra/15 text-ultra-soft border border-ultra/30 shrink-0">
                      <ShieldCheck className="w-4 h-4 text-ultra-soft" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-popcorn flex items-center gap-1.5 flex-wrap">
                        <span className="text-popcorn-muted font-sans">Verified Source:</span>
                        <span className="text-ultra-soft font-bold font-sans">{article.source.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-ultra/20 text-ultra-soft border border-ultra/30 uppercase font-sans font-bold">
                          Official Syndication
                        </span>
                      </div>
                      <p className="text-[11px] text-popcorn-dim mt-0.5 font-sans">
                        Published at {new Date(article.publishedAt).toLocaleString()} · Full copyright belongs to original publisher
                      </p>
                    </div>
                  </div>
                  <a
                    href={article.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-void hover:bg-signal-deep text-xs font-bold text-popcorn transition-all shrink-0 font-sans shadow-xs border border-glow-line"
                  >
                    <span>Read Original on {article.source.name}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* In-Article Advertisement */}
              <AdBanner placement="in_article" />

              {/* Article Tags */}
              <div className="mt-8 pt-6 border-t border-glow-line flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-popcorn-dim">
                  {tagsLabel[activeLang] || tagsLabel.kn}
                </span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}&lang=${activeLang}`}
                    className="px-3 py-1 rounded-full bg-hall hover:bg-signal-deep text-popcorn-dim hover:text-popcorn text-xs border border-glow-line font-medium transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* Bottom Social Share */}
              <SocialShare title={article.title} />

              {/* Prev / Next Article Navigation */}
              <div className="my-8 pt-6 border-t border-glow-line grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevArticle ? (
                  <Link
                    href={`/news/${prevArticle.slug}?lang=${activeLang}`}
                    className="group p-4 rounded-2xl bg-hall hover:bg-screen border border-glow-line transition-all flex items-center gap-3 shadow-2xs"
                  >
                    <ChevronLeft className="w-5 h-5 text-signal-soft shrink-0 group-hover:-translate-x-1 transition-transform" />
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-popcorn-muted block font-sans font-bold">
                        {activeLang === "en" ? "Previous" : "ಹಿಂದಿನ ಲೇಖನ"}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-popcorn group-hover:text-signal-soft truncate transition-colors">
                        {prevArticle.title}
                      </h4>
                    </div>
                  </Link>
                ) : (
                  <div></div>
                )}

                {nextArticle && (
                  <Link
                    href={`/news/${nextArticle.slug}?lang=${activeLang}`}
                    className="group p-4 rounded-2xl bg-hall hover:bg-screen border border-glow-line transition-all flex items-center justify-between gap-3 text-right shadow-2xs"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase tracking-wider text-popcorn-muted block font-sans font-bold">
                        {activeLang === "en" ? "Next" : "ಮುಂದಿನ ಲೇಖನ"}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-popcorn group-hover:text-signal-soft truncate transition-colors">
                        {nextArticle.title}
                      </h4>
                    </div>
                    <ChevronRight className="w-5 h-5 text-signal-soft shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>

              {/* Comments Section */}
              <CommentSection articleId={article.id} />
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-popcorn mb-4 border-l-4 border-signal pl-3 font-sans">
                  {relatedLabel[activeLang] || relatedLabel.kn}
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
