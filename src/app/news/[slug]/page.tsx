import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { DataService } from "@/lib/dataService";
import { formatEditorialDate, formatCineNumber } from "@/lib/utils";
import { getSiteUrl } from "@/lib/siteUrl";
import SocialShare from "@/components/SocialShare";
import CommentSection from "@/components/CommentSection";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const articles = await DataService.getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
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
    title: `${article.title} — Films Discourse`,
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

  const allArticles = await DataService.getArticles(undefined, "en");
  const trendingArticles = allArticles.filter((a) => a.id !== article.id).slice(0, 5);

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
      name: "Films Discourse",
      url: getSiteUrl(),
      logo: {
        "@type": "ImageObject",
        url: `${getSiteUrl()}/logo.png`,
      },
    },
  };

  return (
    <div className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="art-layout">
        {/* Main Article Body */}
        <article className="art">
          <header className="art-head is-page">
            <p className="kicker">
              <Link href={`/category/${article.category}`}>
                {article.category.toUpperCase()} · {article.industry ? article.industry.toUpperCase() : "INDIAN CINEMA"}
              </Link>
            </p>

            <h1 className="art-title">{article.title}</h1>
            <p className="art-dek">{article.summary}</p>

            <p className="art-by">
              By <span className="author-name">{article.author.name}</span>, {article.author.role || "Cinema Desk"} · {formatEditorialDate(article.publishedAt)} · {article.readTimeMinutes} min read · {formatCineNumber(article.views)} views
            </p>

            <div className="art-share art-share-top" data-title={article.title}>
              <SocialShare title={article.title} />
            </div>
          </header>

          {/* Featured Image */}
          <figure className="art-cover">
            <Image
              src={article.featuredImage}
              alt={article.title}
              width={1280}
              height={720}
              priority
              className="object-cover"
            />
            {article.imageCaption && (
              <figcaption>📷 {article.imageCaption}</figcaption>
            )}
          </figure>

          {/* Article Rich Content */}
          <div className="art-body">
            <div
              className="whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: (article.content ?? "")
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/### (.*?)\n/g, "<h3>$1</h3>")
                  .replace(/> (.*?)\n/g, "<blockquote>$1</blockquote>"),
              }}
            />
          </div>

          {/* Authentic Source Attribution Block */}
          {article.source?.url && (
            <div className="art-source p-4 my-6 border border-line rounded">
              <small className="block uppercase text-muted text-xs">Verified Source</small>
              <a
                href={article.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline text-velvet"
              >
                Read original report on {article.source.name} &rarr;
              </a>
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-8 pt-8 border-t border-line">
            <CommentSection articleId={article.id} />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="art-side" aria-label="More articles">
          <div className="h3-head flex items-baseline justify-between pb-2 mb-3 border-b border-line">
            <h2 className="text-base font-bold uppercase tracking-wider">Latest stories</h2>
            <Link href="/category/latest" className="text-xs text-muted hover:text-text">All</Link>
          </div>

          <ul className="side-list">
            {trendingArticles.map((rel) => (
              <li key={rel.id}>
                <Link href={`/news/${rel.slug}`}>
                  <span className="side-img">
                    <Image
                      src={rel.featuredImage}
                      alt=""
                      width={160}
                      height={120}
                      className="object-cover"
                    />
                  </span>
                  <span>
                    <small className="block text-xs text-muted">
                      {rel.category.toUpperCase()} · 9 Nov
                    </small>
                    <b className="line-clamp-2 text-sm leading-snug">{rel.title}</b>
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
