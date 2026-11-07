"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Clock, Calendar } from "lucide-react";
import { Article } from "@/types";
import { formatKannadaDate, formatKannadaNumber, formatKannadaTimeAgo } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface ArticleCardProps {
  article: Article;
  variant?: "grid" | "horizontal" | "compact" | "minimal";
}

export default function ArticleCard({ article, variant = "grid" }: ArticleCardProps) {
  const { localizeUrl } = useLanguage();

  if (variant === "horizontal") {
    return (
      <article className="group rounded-2xl bg-revealed border border-glow-line hover:border-glow-line-strong hover:-translate-y-0.5 transition-all duration-300 ease-out gpu-layer">
        <div className="flex flex-col sm:flex-row gap-4 p-3.5 sm:p-4">
          <Link
            href={localizeUrl(`/news/${article.slug}`)}
            className="relative aspect-[16/10] sm:w-48 sm:h-32 shrink-0 rounded-xl overflow-hidden block bg-hall"
          >
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-[1.025] transition-transform duration-250 ease-out"
              sizes="(max-width: 640px) 100vw, 200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-transparent"></div>
            <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-void/80 backdrop-blur-md text-[10px] font-bold text-popcorn-dim border border-glow-line">
              {article.categoryName}
            </span>
          </Link>

          <div className="flex flex-col justify-between flex-1 py-1">
            <div>
              <Link href={localizeUrl(`/news/${article.slug}`)}>
                <h3 className="text-sm sm:text-base font-bold text-popcorn group-hover:text-signal-soft leading-snug line-clamp-2 transition-colors duration-150">
                  {article.title}
                </h3>
              </Link>
              <p className="mt-1.5 text-xs text-popcorn-dim line-clamp-2 leading-relaxed">
                {article.summary}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-3 text-[11px] text-popcorn-muted font-sans">
              <span className="text-popcorn-dim font-medium">{article.author.name}</span>
              <span>•</span>
              <span>{formatKannadaTimeAgo(article.publishedAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                <Eye className="w-3 h-3 text-signal" />
                {formatKannadaNumber(article.views)}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group flex gap-3 py-2.5 border-b border-glow-line last:border-none">
        <Link
          href={localizeUrl(`/news/${article.slug}`)}
          className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden block bg-hall"
        >
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-250 ease-out"
            sizes="80px"
          />
        </Link>
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <Link href={localizeUrl(`/news/${article.slug}`)}>
            <h4 className="text-xs sm:text-sm font-bold text-popcorn group-hover:text-signal-soft leading-tight line-clamp-2 transition-colors duration-150">
              {article.title}
            </h4>
          </Link>
          <div className="flex items-center gap-2 text-[10px] text-popcorn-muted mt-1 font-sans">
            <span className="text-signal font-bold">{article.categoryName}</span>
            <span>•</span>
            <span>{formatKannadaTimeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </article>
    );
  }

  // Default Grid Card — canonical dark theatre card
  return (
    <article className="group rounded-2xl bg-revealed border border-glow-line hover:border-glow-line-strong hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(255,46,80,0.12)] transition-all duration-300 ease-out gpu-layer flex flex-col overflow-hidden">
      <div className="overflow-hidden flex flex-col h-full">
        <Link href={localizeUrl(`/news/${article.slug}`)} className="relative aspect-[16/10] w-full block overflow-hidden bg-hall">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-[1.025] transition-transform duration-250 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent"></div>
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-signal-deep text-popcorn text-[11px] font-bold tracking-wide shadow-[0_0_14px_rgba(255,46,80,0.25)]">
              {article.categoryName}
            </span>
          </div>
        </Link>

        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <Link href={localizeUrl(`/news/${article.slug}`)}>
              <h3 className="text-sm sm:text-base font-bold text-popcorn group-hover:text-signal-soft leading-snug line-clamp-2 transition-colors duration-150">
                {article.title}
              </h3>
            </Link>
            <p className="mt-2 text-xs text-popcorn-dim line-clamp-2 leading-relaxed">
              {article.summary}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-glow-line flex items-center justify-between text-[11px] text-popcorn-muted font-sans">
            <span className="text-popcorn-dim font-medium truncate max-w-[120px]">
              {article.author.name}
            </span>
            <div className="flex items-center gap-2 font-medium">
              <span>{formatKannadaTimeAgo(article.publishedAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-signal" />
                {formatKannadaNumber(article.views)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
