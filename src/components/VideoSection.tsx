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
  const { config, t, localizeUrl } = useLanguage();
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const activeVideos = videos;
  const sprocketStyle: React.CSSProperties = {
    backgroundImage:
      "repeating-linear-gradient(90deg, transparent 0 10px, #17140F 10px 18px)",
  };

  return (
    <section className="bg-sheet border border-line rounded-lg shadow-md p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-line gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-press text-paper border border-line rounded shadow-sm flex items-center justify-center shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="sticker bg-band text-ink border border-line px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded">
                FIRST GLIMPSE
              </span>
              <span className="text-[10px] font-mono uppercase text-ink-dim tracking-wider font-bold">
                TEASERS &amp; TRAILERS
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-poster uppercase tracking-tight text-ink truncate">
              CINEMATIC <span className="text-press">PREVIEWS</span>
            </h2>
            <p className="text-xs text-ink-dim font-medium">
              The earliest sparks of tomorrow&apos;s blockbusters — teaser drops, official trailers, and exclusive first cuts.
            </p>
          </div>
        </div>

        <Link
          href={localizeUrl("/category/videos")}
          className="self-start sm:self-auto px-4 py-2 bg-surface text-ink hover:bg-press hover:text-white border border-line rounded shadow-sm text-xs font-poster uppercase tracking-wider flex items-center gap-2 transition-all shrink-0"
        >
          <span>{t("btn_all_videos")}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeVideos.slice(0, 6).map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveVideoId(item.youtubeId)}
            className="group cursor-pointer bg-surface border border-line rounded-lg shadow-sm hover:border-line-2 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-line bg-band">
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 bg-press text-paper border border-line rounded-full shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-paper ml-0.5" />
                  </div>
                </div>

                {/* Tag & Duration */}
                <div className="absolute top-3.5 left-2.5">
                  <span className="sticker bg-band text-ink border border-line rounded px-2 py-0.5 text-[9px] font-bold uppercase shadow-sm">
                    {item.category}
                  </span>
                </div>
                <div className="absolute bottom-3.5 right-2.5 bg-surface/90 text-ink px-2 py-0.5 border border-line rounded text-[10px] font-mono font-bold">
                  {item.duration}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-xs sm:text-sm font-poster uppercase text-ink group-hover:text-press leading-snug line-clamp-2 transition-colors">
                  {item.title}
                </h3>
                <div className="mt-2.5 flex items-center gap-2 text-[10px] text-ink-mute font-mono">
                  <Eye className="w-3 h-3 text-press-soft" />
                  <span>{item.views} views</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-sheet border border-line rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-band border-b border-line">
              <span className="text-sm font-poster uppercase text-ink flex items-center gap-2">
                <Film className="w-4 h-4 text-press" />
                <span>OFFICIAL DROP PLAYER</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveVideoId(null)}
                className="p-1.5 bg-surface hover:bg-press text-ink hover:text-white border border-line rounded transition-colors"
                aria-label="Close video player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-[16/9] w-full bg-ink">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
