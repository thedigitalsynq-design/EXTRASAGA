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

  return (
    <section className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-red-50 text-brand-crimson border border-red-200 flex items-center justify-center">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 font-sans">
              {config.trailersSectionTitle}
            </h2>
            <p className="text-xs text-gray-500 font-sans">
              {config.industryName} {t("sec_trailers")}
            </p>
          </div>
        </div>

        <Link
          href={localizeUrl("/category/videos")}
          className="text-xs sm:text-sm font-semibold text-brand-crimson hover:underline flex items-center gap-1 transition-colors"
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
            className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-200/90 hover:border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
              <Image
                src={item.thumbnailUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-brand-crimson text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>

              {/* Tag & Duration */}
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-bold font-kannada border border-white/20">
                  {item.category}
                </span>
              </div>
              <div className="absolute bottom-2.5 right-2.5 bg-black/75 px-2 py-0.5 rounded text-[11px] font-sans font-medium text-white">
                {item.duration}
              </div>
            </div>

            <div className="p-3.5 bg-white">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-brand-crimson font-kannada leading-snug line-clamp-2 transition-colors">
                {item.title}
              </h3>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500 font-sans">
                <Eye className="w-3 h-3 text-brand-crimson" />
                <span>{item.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-gray-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-black/80 border-b border-white/10">
              <span className="text-sm font-bold text-white font-kannada flex items-center gap-2">
                <Film className="w-4 h-4 text-brand-crimson" />
                ವಿಡಿಯೋ ಪ್ಲೇಯರ್
              </span>
              <button
                onClick={() => setActiveVideoId(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-brand-crimson text-white transition-colors"
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

