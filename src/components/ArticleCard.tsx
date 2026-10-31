import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Clock, Calendar } from "lucide-react";
import { Article } from "@/types";
import { formatKannadaDate, formatKannadaNumber, formatKannadaTimeAgo } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  variant?: "grid" | "horizontal" | "compact" | "minimal";
}

export default function ArticleCard({ article, variant = "grid" }: ArticleCardProps) {
  if (variant === "horizontal") {
    return (
      <article className="group flex flex-col sm:flex-row gap-4 bg-brand-dark hover:bg-brand-card p-3 rounded-xl border border-brand-border/60 hover:border-brand-red/50 transition-all duration-300">
        <Link
          href={`/news/${article.slug}`}
          className="relative aspect-[16/10] sm:w-48 sm:h-32 shrink-0 rounded-lg overflow-hidden block"
        >
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, 200px"
          />
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-brand-black/80 text-[10px] font-semibold text-white font-kannada">
            {article.categoryName}
          </span>
        </Link>

        <div className="flex flex-col justify-between flex-1 py-1">
          <div>
            <Link href={`/news/${article.slug}`}>
              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-red font-kannada leading-snug line-clamp-2 transition-colors">
                {article.title}
              </h3>
            </Link>
            <p className="mt-1.5 text-xs text-gray-400 font-kannada line-clamp-2">
              {article.summary}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-3 text-[11px] text-brand-muted">
            <span className="font-kannada text-gray-300">{article.author.name}</span>
            <span>•</span>
            <span>{formatKannadaTimeAgo(article.publishedAt)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-brand-red" />
              {formatKannadaNumber(article.views)}
            </span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group flex gap-3 py-2.5 border-b border-brand-border/40 last:border-none">
        <Link
          href={`/news/${article.slug}`}
          className="relative w-20 h-16 shrink-0 rounded-md overflow-hidden block"
        >
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="80px"
          />
        </Link>
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <Link href={`/news/${article.slug}`}>
            <h4 className="text-xs sm:text-sm font-semibold text-gray-200 group-hover:text-brand-red font-kannada leading-tight line-clamp-2 transition-colors">
              {article.title}
            </h4>
          </Link>
          <div className="flex items-center gap-2 text-[10px] text-brand-muted mt-1">
            <span className="text-brand-red font-kannada font-medium">{article.categoryName}</span>
            <span>•</span>
            <span>{formatKannadaTimeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </article>
    );
  }

  // Default Grid Card
  return (
    <article className="group flex flex-col bg-brand-dark rounded-xl overflow-hidden border border-brand-border/80 hover:border-brand-red/50 hover:shadow-xl hover:shadow-brand-red/10 transition-all duration-300">
      <Link href={`/news/${article.slug}`} className="relative aspect-[16/10] w-full block overflow-hidden">
        <Image
          src={article.featuredImage}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-brand-red text-white text-[11px] font-bold font-kannada tracking-wide shadow-md">
            {article.categoryName}
          </span>
        </div>
      </Link>

      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <Link href={`/news/${article.slug}`}>
            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-red font-kannada leading-snug line-clamp-2 transition-colors">
              {article.title}
            </h3>
          </Link>
          <p className="mt-2 text-xs text-gray-400 font-kannada line-clamp-2">
            {article.summary}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-brand-border/40 flex items-center justify-between text-[11px] text-brand-muted">
          <span className="font-kannada text-gray-300 truncate max-w-[120px]">
            {article.author.name}
          </span>
          <div className="flex items-center gap-2">
            <span>{formatKannadaTimeAgo(article.publishedAt)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-brand-red" />
              {formatKannadaNumber(article.views)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

