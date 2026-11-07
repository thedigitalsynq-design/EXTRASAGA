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
    <section className="bg-hall rounded-[32px] border border-glow-line p-6 sm:p-8 relative">
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-glow-line">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-ultra/10 text-ultra border border-ultra/25 flex items-center justify-center">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-popcorn font-sans tracking-tight">
              {config.ottTitle}
            </h2>
            <p className="text-xs text-popcorn-dim font-sans font-medium">
              {config.industryName} {t("sec_ott")} • ಅಧಿಕೃತ ಡಿಜಿಟಲ್ ಸ್ಟ್ರೀಮಿಂಗ್
            </p>
          </div>
        </div>

        <Link
          href={localizeUrl("/ott")}
          className="px-4 py-1.5 rounded-full bg-revealed hover:bg-screen text-xs font-bold text-popcorn-dim hover:text-popcorn border border-glow-line hover:border-glow-line-strong flex items-center gap-1.5 transition-all font-sans"
        >
          <span>{t("btn_all_ott")}</span>
          <ChevronRight className="w-3.5 h-3.5 text-ultra" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {activeReleases.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="group bg-revealed rounded-[24px] overflow-hidden border border-glow-line hover:border-glow-line-strong hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(155,109,255,0.16)] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-hall">
                <Image
                  src={item.posterImage}
                  alt={item.movieTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/85 via-void/25 to-transparent"></div>

                {/* Platform chip */}
                <span
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold font-sans bg-void/85 backdrop-blur-md text-popcorn border border-glow-line"
                >
                  {item.platform}
                </span>

                <div className="absolute bottom-2.5 left-3.5 flex items-center gap-1.5 text-[11px] text-popcorn-dim font-medium font-mono-tabular">
                  <Calendar className="w-3.5 h-3.5 text-marquee" />
                  <span>{item.releaseDate}</span>
                </div>
              </div>

              <div className="p-5 bg-revealed">
                <h3 className="text-base font-bold text-popcorn group-hover:text-ultra transition-colors line-clamp-1">
                  {item.movieTitle}
                </h3>
                <p className="mt-1.5 text-xs text-popcorn-dim line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-3.5 flex items-center gap-1.5 flex-wrap">
                  {item.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-2.5 py-0.5 rounded-full bg-screen text-popcorn-dim text-[10px] font-semibold border border-glow-line"
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
                className="w-full py-2.5 px-4 rounded-full bg-screen hover:bg-ultra-deep text-popcorn font-bold text-xs flex items-center justify-center gap-2 transition-all border border-glow-line hover:border-ultra-deep"
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
