"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DollarSign, ChevronRight, TrendingUp } from "lucide-react";
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
      <aside className="bg-sheet border-2 border-ink shadow-press p-5">
        <div>
          <div className="flex items-center justify-between pb-3 mb-3.5 border-b-2 border-ink">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-marquee border border-ink rotate-45 shrink-0" />
              <h3 className="text-xs sm:text-sm font-poster font-bold text-ink uppercase tracking-wide">
                THE RECEIPTS · TOP 5
              </h3>
            </div>
            <Link
              href={localizeUrl("/box-office")}
              className="text-[10px] font-poster font-bold text-press hover:underline uppercase flex items-center gap-0.5 tracking-wider"
            >
              <span>FULL DESK</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {displayEntries.slice(0, 5).map((entry, idx) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between gap-2 p-2.5 border-2 border-ink transition-all ${
                  idx === 0
                    ? "bg-marquee/30 shadow-sticker font-bold"
                    : "bg-paper hover:bg-band shadow-2xs"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-5 h-5 flex items-center justify-center font-poster font-bold text-[10px] shrink-0 border border-ink ${
                      idx === 0
                        ? "bg-marquee text-ink shadow-2xs"
                        : "bg-band text-ink font-mono-tabular"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-poster font-bold text-xs text-ink truncate uppercase">
                    {entry.movieTitle}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`font-poster font-bold text-xs font-mono-tabular block ${
                      idx === 0 ? "text-press font-black" : "text-ink"
                    }`}
                  >
                    {entry.worldwideCollection}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-ink-mute uppercase tracking-wide">
                    {entry.verdict}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <section className="my-10 bg-sheet border-2 border-ink shadow-press p-6 sm:p-8 relative overflow-hidden">
      {/* Halftone watermark */}
      <div aria-hidden="true" className="absolute inset-0 halftone-faint opacity-15 pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b-2 border-ink relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-marquee border-2 border-ink shadow-sticker flex items-center justify-center shrink-0 -rotate-2">
            <DollarSign className="w-5 h-5 text-ink" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-poster font-bold text-ink uppercase tracking-tight truncate">
                THE RECEIPTS — CONSOLIDATED INDIAN BOX OFFICE
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-poster font-bold uppercase tracking-wider bg-press text-paper border-2 border-ink shadow-sticker">
                <span className="w-1.5 h-1.5 rounded-full bg-paper animate-pulse"></span>
                RECEIPTS ATTACHED
              </span>
            </div>
            <p className="text-xs text-ink-dim font-medium mt-1 font-sans">
              Consolidated theatrical figures verified against booking networks, distributor slips, and multiplex telemetry
            </p>
          </div>
        </div>

        {showAllLink && (
          <Link
            href={localizeUrl("/box-office")}
            className="px-4 py-2 bg-paper text-ink hover:bg-press hover:text-paper border-2 border-ink shadow-sticker text-xs font-poster font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span>FULL AUDITED REPORT</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-left border-collapse border-2 border-ink bg-paper">
          <thead>
            <tr className="border-b-2 border-ink text-xs text-ink font-poster font-bold uppercase tracking-wider bg-band">
              <th className="py-3 px-4 border-r-2 border-ink">RANK</th>
              <th className="py-3 px-4 border-r-2 border-ink">MOVIE / TITLE</th>
              <th className="py-3 px-4 border-r-2 border-ink">OPENING DAY</th>
              <th className="py-3 px-4 border-r-2 border-ink">WEEKEND</th>
              <th className="py-3 px-4 border-r-2 border-ink bg-marquee/20 text-ink">WORLDWIDE GROSS</th>
              <th className="py-3 px-4">TRADE VERDICT</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-ink text-sm font-mono-tabular">
            {displayEntries.map((item) => (
              <tr
                key={item.id}
                className={`transition-colors group hover:bg-band/50 ${
                  item.rank === 1 ? "bg-marquee/15 font-bold" : "bg-paper"
                }`}
              >
                <td className="py-3.5 px-4 border-r-2 border-ink text-center">
                  <span
                    className={`inline-flex w-7 h-7 border-2 border-ink font-poster font-bold text-xs items-center justify-center shadow-sticker ${
                      item.rank === 1
                        ? "bg-marquee text-ink font-black -rotate-2"
                        : "bg-band text-ink"
                    }`}
                  >
                    {item.rank}
                  </span>
                </td>
                <td className="py-3.5 px-4 border-r-2 border-ink font-bold text-ink">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-12 border-2 border-ink shrink-0 hidden sm:block bg-band overflow-hidden">
                      <Image
                        src={item.posterImage}
                        alt={item.movieTitle}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </div>
                    <div>
                      <div className="text-ink font-poster uppercase font-bold text-sm group-hover:text-press transition-colors">
                        {item.movieTitle}
                      </div>
                      <div className="text-[11px] text-ink-mute font-mono font-medium">
                        {item.movieTitleEn} ({item.releaseYear})
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 border-r-2 border-ink text-ink-dim font-bold">{item.day1Collection}</td>
                <td className="py-3.5 px-4 border-r-2 border-ink text-ink-dim font-bold">{item.weekendCollection}</td>
                <td
                  className={`py-3.5 px-4 border-r-2 border-ink font-black text-base ${
                    item.rank === 1 ? "text-press font-poster" : "text-ink font-poster"
                  }`}
                >
                  {item.worldwideCollection}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className="inline-block px-2.5 py-0.5 text-xs font-poster font-bold uppercase bg-band text-ink border-2 border-ink shadow-2xs"
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
