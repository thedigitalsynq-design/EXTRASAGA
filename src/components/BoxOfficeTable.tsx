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
      <aside className="rounded-[28px] bg-white border border-[#E5EBE7] shadow-sm p-5 sm:p-6">
        <div>
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E5EBE7]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-[#E8F8EB] text-[#288760] border border-[#B7E5BA]">
                <DollarSign className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-black text-[#0F3529] tracking-tight">
                {config.boxOfficeTitle}
              </h3>
            </div>
            <Link
              href={localizeUrl("/box-office")}
              className="text-[11px] font-bold text-[#288760] hover:text-[#1A5140] flex items-center gap-0.5 transition-colors font-sans group/link"
            >
              <span>{t("btn_full_report")}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {displayEntries.slice(0, 5).map((entry, idx) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-[#F8FAF9] hover:bg-[#E8F8EB] border border-[#E5EBE7] hover:border-[#5CA87C] transition-all text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold text-[11px] text-[#1A5140] border border-[#B7E5BA] shrink-0 shadow-2xs">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-[#0F3529] truncate">{entry.movieTitle}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-black text-[#288760] block text-xs">
                    {entry.worldwideCollection}
                  </span>
                  <span className="text-[10px] text-[#4B6358] font-bold">{entry.verdict}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <section className="my-10 bg-white rounded-[32px] border border-[#E5EBE7] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E5EBE7]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F8EB] text-[#288760] border border-[#B7E5BA] flex items-center justify-center shrink-0 shadow-2xs">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-[#0F3529] tracking-tight">
                {config.boxOfficeTitle}
              </h2>
              <span
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#E8F8EB] text-[#1A5140] border border-[#B7E5BA] shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#288760] animate-pulse"></span>
                {config.industryName}
              </span>
            </div>
            <p className="text-xs text-[#4B6358] font-medium mt-0.5">
              {config.industryName} {t("sec_boxoffice")} • ಅಧಿಕೃತ ಗಲ್ಲಾಪೆಟ್ಟಿಗೆ ಲೆಕ್ಕಾಚಾರ
            </p>
          </div>
        </div>

        {showAllLink && (
          <Link
            href={localizeUrl("/box-office")}
            className="px-4 py-1.5 rounded-full bg-[#F8FAF9] hover:bg-[#E8F8EB] text-xs font-bold text-[#1A5140] border border-[#E5EBE7] hover:border-[#5CA87C] flex items-center gap-1.5 transition-all font-sans shadow-2xs self-start sm:self-auto"
          >
            <span>{t("btn_full_report")}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#288760]" />
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5EBE7] text-xs text-[#1A5140] font-bold uppercase tracking-wider bg-[#F8FAF9] rounded-xl">
              <th className="py-3.5 px-4 rounded-l-xl">{t("bo_rank")}</th>
              <th className="py-3.5 px-4">{t("bo_movie")}</th>
              <th className="py-3.5 px-4">{t("bo_day1")}</th>
              <th className="py-3.5 px-4">{t("bo_weekend")}</th>
              <th className="py-3.5 px-4 text-[#288760] font-black">{t("bo_worldwide")}</th>
              <th className="py-3.5 px-4 rounded-r-xl">{t("bo_verdict")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5EBE7] text-sm font-sans">
            {displayEntries.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-[#F8FAF9]/80 transition-colors group"
              >
                <td className="py-4 px-4">
                  <span className="w-7 h-7 rounded-full bg-[#E8F8EB] border border-[#B7E5BA] text-[#1A5140] font-black text-xs flex items-center justify-center font-sans group-hover:scale-105 transition-transform">
                    {item.rank}
                  </span>
                </td>
                <td className="py-4 px-4 font-bold text-[#0F3529] group-hover:text-[#288760] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-14 rounded-xl overflow-hidden shrink-0 hidden sm:block bg-[#F0F4F2] border border-[#E5EBE7]">
                      <Image
                        src={item.posterImage}
                        alt={item.movieTitle}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div>
                      <div className="text-[#0F3529] font-bold group-hover:text-[#288760]">{item.movieTitle}</div>
                      <div className="text-[11px] text-[#4B6358] font-sans font-normal">
                        {item.movieTitleEn} ({item.releaseYear})
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-[#4B6358] font-sans font-medium">{item.day1Collection}</td>
                <td className="py-4 px-4 text-[#4B6358] font-sans font-medium">{item.weekendCollection}</td>
                <td className="py-4 px-4 font-black text-[#288760] font-sans text-base">
                  {item.worldwideCollection}
                </td>
                <td className="py-4 px-4">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#E8F8EB] text-[#1A5140] border border-[#B7E5BA]"
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

