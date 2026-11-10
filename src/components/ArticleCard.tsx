"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";
import { Article } from "@/types";
import { formatCineNumber, formatEditorialTimeAgo } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface ArticleCardProps {
  article: Article;
  variant?: "grid" | "horizontal" | "compact" | "minimal";
}

export default function ArticleCard({ article, variant = "grid" }: ArticleCardProps) {
  const { localizeUrl } = useLanguage();

  if (variant === "horizontal") {
    return (
      <article className="group bg-sheet border border-line rounded-xl shadow-lg hover:border-press/40 hover:shadow-2xl transition-all duration-300">
        <div className="flex flex-col sm:flex-row gap-4 p-3.5 sm:p-4">
          <Link
            href={localizeUrl(`/news/${article.slug}`)}
            className="relative aspect-[16/10] sm:w-48 sm:h-32 shrink-0 border border-line rounded-lg overflow-hidden block bg-band shadow-sm"
          >
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
              sizes="(max-width: 640px) 100vw, 200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"></div>
            <span className="absolute top-2 left-2 sticker bg-press text-paper border border-line rounded shadow-sm text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">
              {article.categoryName}
            </span>
          </Link>

          <div className="flex flex-col justify-between flex-1 py-1">
            <div>
              <Link href={localizeUrl(`/news/${article.slug}`)}>
                <h3 className="text-sm sm:text-base font-poster uppercase text-ink group-hover:text-press leading-snug line-clamp-2 transition-colors">
                  {article.title}
                </h3>
              </Link>
              <p className="mt-1.5 text-xs text-ink-dim line-clamp-2 leading-relaxed font-medium">
                {article.summary}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-3 text-[11px] text-ink-mute font-mono">
              <span className="text-ink font-bold truncate max-w-[120px]">{article.author.name}</span>
              <span>•</span>
              <span>{formatEditorialTimeAgo(article.publishedAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                <Eye className="w-3 h-3 text-press" />
                {formatCineNumber(article.views)}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group flex gap-3 py-2.5 border-b border-line last:border-none hover:bg-surface/50 rounded-lg p-1.5 transition-colors">
        <Link
          href={localizeUrl(`/news/${article.slug}`)}
          className="relative w-20 h-16 shrink-0 border border-line rounded-md overflow-hidden block bg-band shadow-sm"
        >
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-[1.05] transition-transform duration-500 ease-out"
            sizes="80px"
          />
        </Link>
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <Link href={localizeUrl(`/news/${article.slug}`)}>
            <h4 className="text-xs sm:text-sm font-poster uppercase text-ink group-hover:text-press leading-tight line-clamp-2 transition-colors">
              {article.title}
            </h4>
          </Link>
          <div className="flex items-center gap-2 text-[10px] text-ink-mute mt-1 font-mono">
            <span className="text-press font-bold uppercase">{article.categoryName}</span>
            <span>•</span>
            <span>{formatEditorialTimeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </article>
    );
  }

  // Default Grid Card — Cinema Auditorium card
  return (
    <article className="group bg-sheet border border-line rounded-xl shadow-lg hover:border-press/40 hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden">
      <div className="overflow-hidden flex flex-col h-full">
        <Link
          href={localizeUrl(`/news/${article.slug}`)}
          className="relative aspect-[16/10] w-full block overflow-hidden bg-band border-b border-line"
        >
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"></div>
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="sticker bg-press text-paper border border-line rounded shadow-sm text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5">
              {article.categoryName}
            </span>
          </div>
        </Link>

        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <Link href={localizeUrl(`/news/${article.slug}`)}>
              <h3 className="text-sm sm:text-base font-poster uppercase text-ink group-hover:text-press leading-snug line-clamp-2 transition-colors">
                {article.title}
              </h3>
            </Link>
            <p className="mt-2 text-xs text-ink-dim line-clamp-2 leading-relaxed font-medium">
              {article.summary}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-[11px] text-ink-mute font-mono">
            <span className="text-ink font-bold truncate max-w-[120px]">
              {article.author.name}
            </span>
            <div className="flex items-center gap-2 font-medium">
              <span>{formatEditorialTimeAgo(article.publishedAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-press" />
                {formatCineNumber(article.views)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
