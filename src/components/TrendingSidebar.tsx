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
    <aside className="rounded-[28px] bg-white border border-[#E5EBE7] shadow-sm p-5 sm:p-6">
      <div>
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E5EBE7]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[#E8F8EB] text-[#288760] border border-[#B7E5BA]">
              <Flame className="w-4 h-4 fill-[#288760] text-[#288760]" />
            </div>
            <h3 className="text-sm sm:text-base font-black text-[#0F3529] tracking-tight">{displayTitle}</h3>
          </div>
          <span className="text-[10px] text-[#1A5140] px-2.5 py-0.5 rounded-full bg-[#E8F8EB] border border-[#B7E5BA] uppercase font-black tracking-wider">
            TOP 5
          </span>
        </div>

        <div className="space-y-4">
          {trendingList.map((item, index) => {
            const rank = index + 1;
            const rankStyles = [
              "bg-[#288760] text-white shadow-2xs",
              "bg-[#5CA87C] text-white shadow-2xs",
              "bg-[#B7E5BA] text-[#0F3529] font-black shadow-2xs",
              "bg-[#F8FAF9] text-[#1A5140] border border-[#E5EBE7]",
              "bg-[#F8FAF9] text-[#1A5140] border border-[#E5EBE7]",
            ];

            return (
              <div key={item.id} className="group flex gap-3 items-start pb-3.5 border-b border-[#E5EBE7] last:border-none last:pb-0">
                <span
                  className={`w-7 h-7 shrink-0 rounded-xl flex items-center justify-center text-xs font-black font-sans ${rankStyles[index] || rankStyles[3]
                    }`}
                >
                  0{rank}
                </span>
                <div className="flex-1 min-w-0">
                  <Link href={localizeUrl(`/news/${item.slug}`)}>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0F3529] group-hover:text-[#288760] leading-snug line-clamp-2 transition-colors duration-200">
                      {item.title}
                    </h4>
                  </Link>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] text-[#4B6358] font-sans">
                    <span className="text-[#288760] font-bold">
                      {item.categoryName}
                    </span>
                    <span>•</span>
                    <span>{formatKannadaTimeAgo(item.publishedAt)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Eye className="w-3 h-3 text-[#288760]" />
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


