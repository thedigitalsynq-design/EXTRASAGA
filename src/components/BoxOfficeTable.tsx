"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DollarSign, ChevronRight, Sparkles } from "lucide-react";
import { BoxOfficeEntry } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { DataService } from "@/lib/dataService";

interface BoxOfficeTableProps {
  entries: BoxOfficeEntry[];
  showAllLink?: boolean;
  compact?: boolean;
}

export default function BoxOfficeTable({
  entries,
  showAllLink = true,
  compact = false,
}: BoxOfficeTableProps) {
  const { language, config, t, localizeUrl } = useLanguage();
  const [displayEntries, setDisplayEntries] = useState<BoxOfficeEntry[]>(entries);
  const isInitialRef = React.useRef(true);

  useEffect(() => {
    if (isInitialRef.current) {
      isInitialRef.current = false;
      return;
    }
    let isMounted = true;
    DataService.getBoxOffice(language).then((res) => {
      if (isMounted && res && res.length > 0) {
        setDisplayEntries(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [language]);

  if (compact) {
    return (
      <aside className="rounded-[28px] bg-revealed border border-glow-line shadow-sm p-5 sm:p-6">
        <div>
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-glow-line">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-marquee-faint text-marquee-soft border border-marquee/25">
                <DollarSign className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-black text-popcorn tracking-tight">
                {config.boxOfficeTitle}
              </h3>
            </div>
            <Link
              href={localizeUrl("/box-office")}
              className="text-[11px] font-bold text-signal-soft hover:text-signal flex items-center gap-0.5 transition-colors group/link shrink-0"
            >
              <span>{t("btn_full_report")}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {displayEntries.slice(0, 5).map((entry, idx) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between gap-2 p-3 rounded-2xl border transition-all text-xs ${
                  idx === 0
                    ? "bg-marquee-faint border-marquee/40 hover:border-marquee/70"
                    : "bg-hall border-glow-line hover:bg-screen hover:border-glow-line-strong"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] font-display-latin shrink-0 border ${
                      idx === 0
                        ? "bg-marquee-deep text-void border-marquee/60 font-mono-tabular"
                        : "bg-revealed text-popcorn-dim border-glow-line font-mono-tabular"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-bold text-popcorn truncate">{entry.movieTitle}</span>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`font-black block text-xs font-mono-tabular ${
                      idx === 0 ? "text-marquee-soft" : "text-popcorn"
                    }`}
                  >
                    {entry.worldwideCollection}
                  </span>
                  <span className="text-[10px] text-popcorn-muted font-bold">{entry.verdict}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <section className="my-10 bg-revealed rounded-[32px] border border-glow-line p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-glow-line">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-marquee-faint text-marquee-soft border border-marquee/25 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-popcorn tracking-tight truncate">
                {config.boxOfficeTitle}
              </h2>
              <span
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-display-latin font-bold uppercase tracking-widest bg-marquee-faint text-marquee-soft border border-marquee/25 shrink-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-marquee animate-pulse"></span>
                {config.industryName}
              </span>
            </div>
            <p className="text-xs text-popcorn-muted font-medium mt-0.5">
              {config.industryName} {t("sec_boxoffice")} • ಅಧಿಕೃತ ಗಲ್ಲಾಪೆಟ್ಟಿಗೆ ಲೆಕ್ಕಾಚಾರ
            </p>
          </div>
        </div>
        {/* Theatre rule continues through the title zone */}
        <div className="hidden sm:flex-1 sm:mx-4 h-px bg-glow-line" />

        {showAllLink && (
          <Link
            href={localizeUrl("/box-office")}
            className="px-4 py-1.5 rounded-full bg-hall hover:bg-screen text-xs font-bold text-popcorn-dim hover:text-marquee-soft border border-glow-line hover:border-glow-line-strong flex items-center gap-1.5 transition-all self-start sm:self-auto shrink-0"
          >
            <span>{t("btn_full_report")}</span>
            <ChevronRight className="w-3.5 h-3.5 text-marquee-soft" />
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-glow-line text-xs text-popcorn-dim font-display-latin font-bold uppercase tracking-widest bg-hall rounded-xl">
              <th className="py-3.5 px-4 rounded-l-xl">{t("bo_rank")}</th>
              <th className="py-3.5 px-4">{t("bo_movie")}</th>
              <th className="py-3.5 px-4">{t("bo_day1")}</th>
              <th className="py-3.5 px-4">{t("bo_weekend")}</th>
              <th className="py-3.5 px-4 text-marquee-soft font-black">{t("bo_worldwide")}</th>
              <th className="py-3.5 px-4 rounded-r-xl">{t("bo_verdict")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glow-line text-sm font-mono-tabular">
            {displayEntries.map((item) => (
              <tr
                key={item.id}
                className={`transition-colors group ${
                  item.rank === 1
                    ? "bg-marquee-faint hover:bg-marquee/10"
                    : "hover:bg-screen"
                }`}
              >
                <td className="py-4 px-4">
                  <span
                    className={`w-7 h-7 rounded-full border font-black text-xs font-display-latin flex items-center justify-center group-hover:scale-105 transition-transform ${
                      item.rank === 1
                        ? "bg-marquee-deep text-void border-marquee/60 shadow-[0_0_18px_rgba(255,176,32,0.3)]"
                        : "bg-hall border-glow-line text-popcorn-dim"
                    }`}
                  >
                    {item.rank}
                  </span>
                </td>
                <td className="py-4 px-4 font-bold text-popcorn group-hover:text-marquee-soft transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-14 rounded-xl overflow-hidden shrink-0 hidden sm:block bg-hall border border-glow-line">
                      <Image
                        src={item.posterImage}
                        alt={item.movieTitle}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div>
                      <div className="text-popcorn font-bold group-hover:text-marquee-soft">{item.movieTitle}</div>
                      <div className="text-[11px] text-popcorn-muted font-mono-tabular font-normal">
                        {item.movieTitleEn} ({item.releaseYear})
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-popcorn-muted font-medium">{item.day1Collection}</td>
                <td className="py-4 px-4 text-popcorn-muted font-medium">{item.weekendCollection}</td>
                <td
                  className={`py-4 px-4 font-black text-base ${
                    item.rank === 1 ? "text-marquee-soft font-display-latin" : "text-popcorn"
                  }`}
                >
                  {item.worldwideCollection}
                </td>
                <td className="py-4 px-4">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-hall text-popcorn-dim border border-glow-line"
                  >
                    {item.verdict}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
