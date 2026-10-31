import React from "react";
import Link from "next/link";
import { TrendingUp, Flame, Eye } from "lucide-react";
import { Article } from "@/types";
import { formatKannadaNumber, formatKannadaTimeAgo } from "@/lib/utils";

interface TrendingSidebarProps {
  articles: Article[];
  title?: string;
}

export default function TrendingSidebar({
  articles,
  title = "ಟ್ರೆಂಡಿಂಗ್ ಸುದ್ದಿ (Trending)",
}: TrendingSidebarProps) {
  const trendingList = articles.slice(0, 5);

  return (
    <aside className="bg-brand-dark rounded-2xl border border-brand-border/80 p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-red/20 text-brand-red">
            <Flame className="w-4 h-4 fill-brand-red" />
          </div>
          <h3 className="text-base font-extrabold text-white font-kannada">{title}</h3>
        </div>
        <span className="text-[11px] text-brand-muted uppercase font-semibold">
          TOP 5
        </span>
      </div>

      <div className="space-y-4">
        {trendingList.map((item, index) => {
          const rank = index + 1;
          const rankColors = [
            "bg-brand-red text-white",
            "bg-orange-500 text-white",
            "bg-amber-500 text-black",
            "bg-brand-card text-gray-300 border border-brand-border",
            "bg-brand-card text-gray-300 border border-brand-border",
          ];

          return (
            <div key={item.id} className="group flex gap-3 items-start pb-3 border-b border-brand-border/40 last:border-none last:pb-0">
              <span
                className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-black font-sans shadow-md ${
                  rankColors[index] || rankColors[3]
                }`}
              >
                0{rank}
              </span>
              <div className="flex-1 min-w-0">
                <Link href={`/news/${item.slug}`}>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-200 group-hover:text-brand-red font-kannada leading-snug line-clamp-2 transition-colors">
                    {item.title}
                  </h4>
                </Link>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-brand-muted">
                  <span className="text-brand-red font-kannada font-medium">
                    {item.categoryName}
                  </span>
                  <span>•</span>
                  <span>{formatKannadaTimeAgo(item.publishedAt)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatKannadaNumber(item.views)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
