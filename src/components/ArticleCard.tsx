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
      <article className="group rounded-2xl bg-white border border-gray-200/90 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 ease-out gpu-layer">
        <div className="flex flex-col sm:flex-row gap-4 p-3.5 sm:p-4 rounded-2xl bg-white">
          <Link
            href={localizeUrl(`/news/${article.slug}`)}
            className="relative aspect-[16/10] sm:w-48 sm:h-32 shrink-0 rounded-xl overflow-hidden block bg-gray-100"
          >
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-[1.025] transition-transform duration-250 ease-out"
              sizes="(max-width: 640px) 100vw, 200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-gray-900 border border-gray-200 shadow-xs">
              {article.categoryName}
            </span>
          </Link>

          <div className="flex flex-col justify-between flex-1 py-1">
            <div>
              <Link href={localizeUrl(`/news/${article.slug}`)}>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-brand-crimson leading-snug line-clamp-2 transition-colors duration-150">
                  {article.title}
                </h3>
              </Link>
              <p className="mt-1.5 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {article.summary}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-500 font-sans">
              <span className="text-gray-700 font-medium">{article.author.name}</span>
              <span>•</span>
              <span>{formatKannadaTimeAgo(article.publishedAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                <Eye className="w-3 h-3 text-brand-crimson" />
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
      <article className="group flex gap-3 py-2.5 border-b border-gray-100 last:border-none">
        <Link
          href={localizeUrl(`/news/${article.slug}`)}
          className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden block bg-gray-100"
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
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-brand-crimson leading-tight line-clamp-2 transition-colors duration-150">
              {article.title}
            </h4>
          </Link>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1 font-sans">
            <span className="text-brand-crimson font-bold">{article.categoryName}</span>
            <span>•</span>
            <span>{formatKannadaTimeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </article>
    );
  }

  // Default Grid Card
  return (
    <article className="group rounded-2xl bg-white border border-gray-200/90 hover:border-gray-300 shadow-sm hover:shadow-lg transition-all duration-200 ease-out gpu-layer flex flex-col overflow-hidden">
      <div className="overflow-hidden bg-white flex flex-col h-full">
        <Link href={localizeUrl(`/news/${article.slug}`)} className="relative aspect-[16/10] w-full block overflow-hidden bg-gray-100">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-[1.025] transition-transform duration-250 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-crimson text-white text-[11px] font-bold tracking-wide shadow-sm">
              {article.categoryName}
            </span>
          </div>
        </Link>

        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <Link href={localizeUrl(`/news/${article.slug}`)}>
              <h3 className="text-sm sm:text-base font-bold text-gray-950 group-hover:text-brand-crimson leading-snug line-clamp-2 transition-colors duration-150">
                {article.title}
              </h3>
            </Link>
            <p className="mt-2 text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {article.summary}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-sans">
            <span className="text-gray-700 font-medium truncate max-w-[120px]">
              {article.author.name}
            </span>
            <div className="flex items-center gap-2 font-medium">
              <span>{formatKannadaTimeAgo(article.publishedAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-brand-crimson" />
                {formatKannadaNumber(article.views)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

