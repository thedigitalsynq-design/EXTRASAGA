"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, X, Film, Eye, ChevronRight } from "lucide-react";
import { VideoItem } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface VideoSectionProps {
  videos: VideoItem[];
}

export default function VideoSection({ videos }: VideoSectionProps) {
  const { language, config, t, localizeUrl } = useLanguage();
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const langFiltered = videos.filter(
    (v) => v.language === language || (!v.language && language === "kn")
  );
  const activeVideos = langFiltered.length > 0 ? langFiltered : videos;
  const sprocketStyle: React.CSSProperties = {
    backgroundImage:
      "repeating-linear-gradient(90deg, transparent 0 10px, #0D0D16 10px 18px)",
  };

  return (
    <section className="bg-revealed rounded-2xl border border-glow-line p-6">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-glow-line">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-signal-faint text-signal-soft border border-signal/25 flex items-center justify-center shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-extrabold text-popcorn font-display-latin uppercase tracking-wide truncate">
              {config.trailersSectionTitle}
            </h2>
            <p className="text-xs text-popcorn-muted">
              {config.industryName} {t("sec_trailers")}
            </p>
          </div>
        </div>
        {/* Theatre rule running through the header */}
        <div className="hidden md:flex-1 md:mx-4 h-px bg-glow-line" />

        <Link
          href={localizeUrl("/category/videos")}
          className="text-xs sm:text-sm font-semibold text-signal-soft hover:text-signal flex items-center gap-1 transition-colors shrink-0"
        >
          <span>{t("btn_all_videos")}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeVideos.slice(0, 6).map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveVideoId(item.youtubeId)}
            className="group cursor-pointer bg-revealed rounded-xl overflow-hidden border border-glow-line hover:border-glow-line-strong hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-hall">
              <Image
                src={item.thumbnailUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Filmstrip sprocket hint (top + bottom) */}
              <div className="absolute top-0 left-0 right-0 h-2 opacity-90" style={sprocketStyle} />
              <div className="absolute bottom-0 left-0 right-0 h-2 opacity-90" style={sprocketStyle} />
              <div className="absolute inset-0 bg-void/40 group-hover:bg-void/20 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-ultra-deep text-void flex items-center justify-center shadow-[0_0_24px_rgba(155,109,255,0.35)] group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-void ml-0.5" />
                </div>
              </div>

              {/* Tag & Duration */}
              <div className="absolute top-3.5 left-2.5">
                <span className="px-2 py-0.5 rounded bg-void/80 text-popcorn text-[10px] font-bold font-kannada border border-glow-line">
                  {item.category}
                </span>
              </div>
              <div className="absolute bottom-3.5 right-2.5 bg-void/80 px-2 py-0.5 rounded text-[11px] font-mono-tabular font-medium text-popcorn-dim border border-glow-line">
                {item.duration}
              </div>
            </div>

            <div className="p-3.5 bg-revealed">
              <h3 className="text-xs sm:text-sm font-bold text-popcorn group-hover:text-signal-soft font-kannada leading-snug line-clamp-2 transition-colors">
                {item.title}
              </h3>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-popcorn-muted font-mono-tabular">
                <Eye className="w-3 h-3 text-signal-soft" />
                <span>{item.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-hall rounded-3xl overflow-hidden border border-glow-line-strong shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-void/80 border-b border-glow-line">
              <span className="text-sm font-bold text-popcorn font-kannada flex items-center gap-2">
                <Film className="w-4 h-4 text-signal-soft" />
                ವಿಡಿಯೋ ಪ್ಲೇಯರ್
              </span>
              <button
                onClick={() => setActiveVideoId(null)}
                className="p-1.5 rounded-full bg-screen hover:bg-signal-deep text-popcorn transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-none"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
