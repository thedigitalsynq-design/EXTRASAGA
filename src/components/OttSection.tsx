"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tv, ExternalLink, Calendar, ChevronRight, Filter, Sparkles } from "lucide-react";
import { OttRelease } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface OttSectionProps {
  releases: OttRelease[];
  limit?: number;
  isDedicatedPage?: boolean;
}

export default function OttSection({
  releases,
  limit,
  isDedicatedPage = false,
}: OttSectionProps) {
  const { config, t, localizeUrl } = useLanguage();
  const [platformFilter, setPlatformFilter] = useState<string>("all");

  const platforms = [
    { id: "all", label: "All Platforms" },
    { id: "netflix", label: "Netflix" },
    { id: "prime", label: "Prime Video" },
    { id: "hotstar", label: "Disney+ Hotstar" },
    { id: "zee5", label: "ZEE5" },
    { id: "sonyliv", label: "SonyLIV" },
  ];

  const filteredReleases = platformFilter === "all"
    ? releases
    : releases.filter((r) => {
        const plat = (r.platform || "").toLowerCase();
        if (platformFilter === "netflix" && plat.includes("netflix")) return true;
        if (platformFilter === "prime" && (plat.includes("prime") || plat.includes("amazon"))) return true;
        if (platformFilter === "hotstar" && (plat.includes("hotstar") || plat.includes("disney"))) return true;
        if (platformFilter === "zee5" && plat.includes("zee")) return true;
        if (platformFilter === "sonyliv" && plat.includes("sony")) return true;
        return false;
      });

  const displayedReleases = limit ? filteredReleases.slice(0, limit) : filteredReleases;

  return (
    <section className="bg-sheet border border-line rounded-lg shadow-md p-6 sm:p-8 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-line gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet text-paper border border-line rounded shadow-sm flex items-center justify-center shrink-0">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="sticker bg-band text-ink border border-line px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded">
                DIGITAL STREAMING WIRE
              </span>
              <span className="text-[10px] font-mono uppercase text-ink-dim tracking-wider font-bold">
                WEEKEND WATCHLIST
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-poster uppercase tracking-tight text-ink">
              NOW STREAM<span className="text-violet">ING</span>
            </h2>
            <p className="text-xs text-ink-dim font-medium">
              Curated digital premieres across Netflix, Prime Video, Hotstar, and ZEE5 — straight to your living room screen.
            </p>
          </div>
        </div>

        {!isDedicatedPage && (
          <Link
            href={localizeUrl("/ott")}
            className="self-start sm:self-auto px-4 py-2 bg-surface text-ink hover:bg-violet hover:text-white border border-line rounded shadow-sm text-xs font-poster uppercase tracking-wider flex items-center gap-2 transition-all"
          >
            <span>{t("btn_all_ott")}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Platform Filter Buttons */}
      {isDedicatedPage && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-6 border-b border-line">
          <span className="text-xs font-mono font-bold text-ink-dim uppercase flex items-center gap-1.5 shrink-0 mr-2">
            <Filter className="w-3.5 h-3.5 text-press" />
            <span>Platform:</span>
          </span>
          {platforms.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatformFilter(p.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-poster uppercase tracking-wider font-bold border transition-all shrink-0 ${
                platformFilter === p.id
                  ? "bg-violet text-paper border-violet shadow-sm"
                  : "bg-surface text-ink border-line hover:border-line-2 hover:bg-band"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {displayedReleases.length === 0 ? (
        <div className="p-8 text-center bg-surface border border-dashed border-line rounded my-4">
          <p className="text-xs font-poster uppercase tracking-wider text-ink-dim">
            No active digital releases found for this platform.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {displayedReleases.map((item) => (
            <div
              key={item.id}
              className="group bg-surface border border-line rounded-lg shadow-sm hover:border-line-2 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line bg-band">
                  <Image
                    src={item.posterImage}
                    alt={item.movieTitle}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent"></div>

                  {/* Platform sticker */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-violet text-paper border border-line rounded shadow-sm">
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
      )}

      {/* When on Homepage with a limit, show a prominent gateway to the dedicated OTT Hub */}
      {limit && (
        <div className="mt-8 pt-5 border-t-2 border-ink flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-poster font-bold uppercase tracking-wider">
          <span className="text-ink-mute font-medium font-sans">
            Tracking 20+ digital streaming releases across all leading OTT networks.
          </span>
          <Link
            href={localizeUrl("/ott")}
            className="px-4 py-2 bg-marquee text-ink hover:bg-press hover:text-paper border-2 border-ink shadow-sticker flex items-center gap-1.5 transition-colors"
          >
            <span>Explore Complete Digital Streaming Radar</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
