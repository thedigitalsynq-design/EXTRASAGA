"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Tv, ExternalLink, Calendar, ChevronRight } from "lucide-react";
import { OttRelease } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface OttSectionProps {
  releases: OttRelease[];
}

export default function OttSection({ releases }: OttSectionProps) {
  const { language, config, t, localizeUrl } = useLanguage();

  const langFiltered = releases.filter(
    (o) => o.language === language || (!o.language && language === "kn")
  );
  const activeReleases = langFiltered.length > 0 ? langFiltered : releases;

  return (
    <section className="bg-white rounded-[32px] border border-[#E5EBE7] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#E5EBE7]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F8EB] text-[#288760] border border-[#B7E5BA] flex items-center justify-center shadow-2xs">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F3529] font-sans tracking-tight">
              {config.ottTitle}
            </h2>
            <p className="text-xs text-[#4B6358] font-sans font-medium">
              {config.industryName} {t("sec_ott")} • ಅಧಿಕೃತ ಡಿಜಿಟಲ್ ಸ್ಟ್ರೀಮಿಂಗ್
            </p>
          </div>
        </div>

        <Link
          href={localizeUrl("/ott")}
          className="px-4 py-1.5 rounded-full bg-[#F8FAF9] hover:bg-[#E8F8EB] text-xs font-bold text-[#1A5140] border border-[#E5EBE7] hover:border-[#5CA87C] flex items-center gap-1.5 transition-all font-sans shadow-2xs"
        >
          <span>{t("btn_all_ott")}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#288760]" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {activeReleases.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-[24px] overflow-hidden border border-[#E5EBE7] hover:border-[#5CA87C] shadow-sm hover:shadow-[0_16px_36px_-8px_rgba(40,135,96,0.14)] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F0F4F2]">
                <Image
                  src={item.posterImage}
                  alt={item.movieTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B251D]/70 via-transparent to-transparent"></div>

                {/* Platform Badge */}
                <span
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold font-sans shadow-sm bg-white/95 text-[#0F3529] border border-[#E5EBE7] backdrop-blur-md"
                >
                  {item.platform}
                </span>

                <div className="absolute bottom-2.5 left-3.5 flex items-center gap-1.5 text-[11px] text-white font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#B7E5BA]" />
                  <span>{item.releaseDate}</span>
                </div>
              </div>

              <div className="p-5 bg-white">
                <h3 className="text-base font-bold text-[#0F3529] group-hover:text-[#288760] transition-colors line-clamp-1">
                  {item.movieTitle}
                </h3>
                <p className="mt-1.5 text-xs text-[#4B6358] line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-3.5 flex items-center gap-1.5 flex-wrap">
                  {item.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-2.5 py-0.5 rounded-full bg-[#E8F8EB] text-[#1A5140] text-[10px] font-semibold border border-[#B7E5BA]/60"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <a
                href={item.watchUrl || "https://www.netflix.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-full bg-[#F8FAF9] hover:bg-[#288760] text-[#1A5140] hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-[#E5EBE7] hover:border-[#288760] shadow-2xs group-hover:shadow-md"
              >
                <span>ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ</span>
                <ExternalLink className="w-3.5 h-3.5 text-current" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

