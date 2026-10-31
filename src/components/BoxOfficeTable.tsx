import React from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Award, DollarSign, ChevronRight } from "lucide-react";
import { BoxOfficeEntry } from "@/types";

interface BoxOfficeTableProps {
  entries: BoxOfficeEntry[];
  showAllLink?: boolean;
}

export default function BoxOfficeTable({
  entries,
  showAllLink = true,
}: BoxOfficeTableProps) {
  return (
    <section className="my-10 bg-brand-dark rounded-2xl border border-brand-border/80 p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-brand-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-kannada">
              ಬಾಕ್ಸ್ ಆಫೀಸ್ ಗಳಿಕೆ (Box Office)
            </h2>
            <p className="text-xs text-brand-muted font-kannada">
              ಕನ್ನಡ ಚಿತ್ರರಂಗದ ಸಾರ್ವಕಾಲಿಕ ಗಲ್ಲಾಪೆಟ್ಟಿಗೆ ದಾಖಲೆಗಳು
            </p>
          </div>
        </div>

        {showAllLink && (
          <Link
            href="/box-office"
            className="text-xs sm:text-sm font-semibold text-emerald-400 hover:text-white flex items-center gap-1 font-kannada transition-colors"
          >
            <span>ಸಂಪೂರ್ಣ ವರದಿ</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border text-xs text-brand-muted font-kannada uppercase tracking-wider bg-brand-black/40">
              <th className="py-3 px-4">ರ್ಯಾಂಕ್</th>
              <th className="py-3 px-4">ಸಿನಿಮಾ ಹೆಸರು</th>
              <th className="py-3 px-4">ಮೊದಲ ದಿನ (Day 1)</th>
              <th className="py-3 px-4">ವೀಕೆಂಡ್ ಗಳಿಕೆ</th>
              <th className="py-3 px-4 text-emerald-400 font-bold">ಒಟ್ಟು ವಿಶ್ವ ಗಳಿಕೆ</th>
              <th className="py-3 px-4">ವರ್ಡಿಕ್ಟ್</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/40 text-sm font-kannada">
            {entries.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-brand-card/70 transition-colors group"
              >
                <td className="py-3.5 px-4">
                  <span className="w-7 h-7 rounded-full bg-brand-card border border-brand-border text-gray-300 font-bold text-xs flex items-center justify-center font-sans group-hover:border-emerald-500">
                    {item.rank}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold text-white group-hover:text-emerald-400 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-14 rounded overflow-hidden shrink-0 hidden sm:block">
                      <Image
                        src={item.posterImage}
                        alt={item.movieTitle}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div>
                      <div className="text-white group-hover:text-emerald-300">{item.movieTitle}</div>
                      <div className="text-[11px] text-brand-muted font-sans font-normal">
                        {item.movieTitleEn} ({item.releaseYear})
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-gray-300 font-sans">{item.day1Collection}</td>
                <td className="py-3.5 px-4 text-gray-300 font-sans">{item.weekendCollection}</td>
                <td className="py-3.5 px-4 font-black text-emerald-400 font-sans text-base">
                  {item.worldwideCollection}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${item.verdictBadgeColor}`}
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

