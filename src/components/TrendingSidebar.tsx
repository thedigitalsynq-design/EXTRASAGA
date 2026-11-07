"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Eye } from "lucide-react";
import { Article } from "@/types";
import { formatKannadaNumber, formatKannadaTimeAgo } from "@/lib/utils";
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
  const { language, config, t, localizeUrl } = useLanguage();
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
  const displayTitle =
    title ||
    (language === "kn"
      ? "ಟ್ರೆಂಡಿಂಗ್ ಸುದ್ದಿ (Trending)"
      : `${t("sec_trending")} (${config.industryName})`);

  return (
    <aside className="rounded-[28px] bg-revealed border border-glow-line shadow-sm p-5 sm:p-6">
      <div>
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-glow-line">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-signal-faint text-signal-soft border border-signal/25">
              <Flame className="w-4 h-4 fill-signal/40 text-signal-soft" />
            </div>
            <h3 className="text-sm sm:text-base font-black text-popcorn tracking-tight">{displayTitle}</h3>
          </div>
          <span className="text-[10px] text-signal-soft px-2.5 py-0.5 rounded-full bg-signal-faint border border-signal/25 uppercase font-display-latin font-black tracking-widest">
            #TRENDING TOP 5
          </span>
        </div>

        <div className="space-y-4">
          {trendingList.map((item, index) => {
            const rank = index + 1;
            const rankStyles = [
              "bg-signal-deep text-popcorn shadow-[0_0_16px_rgba(255,46,80,0.35)]",
              "bg-signal/25 text-signal-soft",
              "bg-signal-faint text-signal-soft",
              "bg-hall text-popcorn-muted border border-glow-line",
              "bg-hall text-popcorn-muted border border-glow-line",
            ];

            return (
              <div key={item.id} className="group flex gap-3 items-start pb-3.5 border-b border-glow-line last:border-none last:pb-0 hover:bg-screen/50 rounded-lg transition-colors">
                <span
                  className={`w-7 h-7 shrink-0 rounded-xl flex items-center justify-center text-xs font-black font-display-latin ${rankStyles[index] || rankStyles[3]
                    }`}
                >
                  0{rank}
                </span>
                <div className="flex-1 min-w-0">
                  <Link href={localizeUrl(`/news/${item.slug}`)}>
                    <h4 className="text-xs sm:text-sm font-bold text-popcorn group-hover:text-signal leading-snug line-clamp-2 transition-colors duration-200">
                      {item.title}
                    </h4>
                  </Link>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] text-popcorn-muted">
                    <span className="text-signal-soft font-bold">
                      {item.categoryName}
                    </span>
                    <span>•</span>
                    <span className="font-mono-tabular">{formatKannadaTimeAgo(item.publishedAt)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium font-mono-tabular">
                      <Eye className="w-3 h-3 text-signal-soft" />
                      {formatKannadaNumber(item.views)}
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
