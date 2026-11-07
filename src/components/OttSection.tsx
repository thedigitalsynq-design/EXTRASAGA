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
  const { config, t, localizeUrl } = useLanguage();
  const activeReleases = releases;

  return (
    <section className="bg-sheet border-2 border-ink shadow-press p-6 sm:p-8 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b-2 border-ink gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet text-paper border-2 border-ink shadow-sticker flex items-center justify-center shrink-0">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="sticker bg-marquee text-ink border-2 border-ink px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase">
                DIGITAL STREAMING WIRE
              </span>
              <span className="text-[10px] font-mono uppercase text-ink-dim tracking-wider font-bold">
                WEEKEND WATCHLIST
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-poster uppercase tracking-tight text-ink">
              NOW STREAM<span className="text-violet">ING</span>
            </h2>
            <p className="text-xs text-ink-dim font-grotesk font-medium">
              Curated digital premieres across Netflix, Prime Video, Hotstar, and ZEE5 — straight to your living room screen.
            </p>
          </div>
        </div>

        <Link
          href={localizeUrl("/ott")}
          className="self-start sm:self-auto px-4 py-2 bg-ink text-paper hover:bg-violet border-2 border-ink shadow-sticker text-xs font-poster uppercase tracking-wider flex items-center gap-2 transition-all"
        >
          <span>{t("btn_all_ott")}</span>
          <ChevronRight className="w-3.5 h-3.5 text-paper" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {activeReleases.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="group bg-paper border-2 border-ink shadow-press hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] w-full overflow-hidden border-b-2 border-ink bg-band">
                <Image
                  src={item.posterImage}
                  alt={item.movieTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent"></div>

                {/* Platform sticker */}
                <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[10px] font-bold font-grotesk uppercase tracking-wider bg-violet text-paper border-2 border-ink shadow-sticker">
                  {item.platform}
                </span>

                <div className="absolute bottom-2.5 left-3.5 flex items-center gap-1.5 text-[11px] text-paper font-bold font-mono">
                  <Calendar className="w-3.5 h-3.5 text-marquee" />
                  <span>{item.releaseDate}</span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-base font-poster uppercase text-ink group-hover:text-violet transition-colors line-clamp-1">
                  {item.movieTitle}
                </h3>
                <p className="mt-1.5 text-xs text-ink-dim line-clamp-2 leading-relaxed font-sans">
                  {item.description}
                </p>

                <div className="mt-3.5 flex items-center gap-1.5 flex-wrap">
                  {item.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-2 py-0.5 bg-band text-ink text-[10px] font-bold border border-ink uppercase font-grotesk"
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
                className="w-full py-2.5 px-4 bg-ink hover:bg-press text-paper font-poster uppercase text-xs flex items-center justify-center gap-2 transition-all border-2 border-ink shadow-sticker"
              >
                <span>Stream on {item.platform}</span>
                <ExternalLink className="w-3.5 h-3.5 text-paper" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
