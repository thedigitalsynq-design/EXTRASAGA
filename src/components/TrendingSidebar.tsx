"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Eye } from "lucide-react";
import { Article } from "@/types";
import { formatCineNumber, formatEditorialTimeAgo } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { DataService } from "@/lib/dataService";

interface TrendingSidebarProps {
  articles: Article[];
  title?: string;
}

export default function TrendingSidebar({
  articles,
  title,
}: TrendingSidebarProps) {
  const { language, localizeUrl } = useLanguage();
  const [displayArticles, setDisplayArticles] = useState<Article[]>(articles);
  const isInitialRef = React.useRef(true);

  useEffect(() => {
    if (isInitialRef.current) {
      isInitialRef.current = false;
      return;
    }
    let isMounted = true;
    DataService.getTrendingArticles(5, language).then((res) => {
      if (isMounted && res && res.length > 0) {
        setDisplayArticles(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [language]);

  const trendingList = displayArticles.slice(0, 5);
  const displayTitle = title || "Trending Across Indian Cinema";

  return (
    <aside className="bg-sheet border-2 border-ink shadow-press p-5 sm:p-6">
      <div>
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b-2 border-ink">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-press text-paper border-2 border-ink shadow-sticker flex items-center justify-center">
              <Flame className="w-4 h-4 fill-paper text-paper" />
            </div>
            <h3 className="text-sm sm:text-base font-poster uppercase tracking-tight text-ink">
              {displayTitle}
            </h3>
          </div>
          <span className="sticker bg-marquee text-ink border-2 border-ink px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase">
            #TOP 5
          </span>
        </div>

        <div className="space-y-4">
          {trendingList.map((item, index) => {
            const rank = index + 1;
            const rankStyles = [
              "bg-press text-paper shadow-sticker",
              "bg-violet text-paper shadow-sticker",
              "bg-marquee text-ink shadow-sticker",
              "bg-band text-ink",
              "bg-band text-ink",
            ];

            return (
              <div
                key={item.id}
                className="group flex gap-3 items-start pb-3.5 border-b border-line last:border-none last:pb-0 hover:bg-band/40 p-1.5 transition-colors"
              >
                <span
                  className={`w-7 h-7 shrink-0 border-2 border-ink flex items-center justify-center text-xs font-poster uppercase ${
                    rankStyles[index] || rankStyles[3]
                  }`}
                >
                  0{rank}
                </span>
                <div className="flex-1 min-w-0">
                  <Link href={localizeUrl(`/news/${item.slug}`)}>
                    <h4 className="text-xs sm:text-sm font-grotesk font-bold text-ink group-hover:text-press leading-snug line-clamp-2 transition-colors">
                      {item.title}
                    </h4>
                  </Link>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] text-ink-mute font-mono">
                    <span className="text-press-deep font-bold uppercase">
                      {item.categoryName}
                    </span>
                    <span>•</span>
                    <span>{formatEditorialTimeAgo(item.publishedAt)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Eye className="w-3 h-3 text-ink-dim" />
                      {formatCineNumber(item.views)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
