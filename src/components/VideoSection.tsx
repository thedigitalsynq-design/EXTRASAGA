"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, X, Film, Eye, ChevronRight } from "lucide-react";
import { VideoItem } from "@/types";

interface VideoSectionProps {
  videos: VideoItem[];
}

export default function VideoSection({ videos }: VideoSectionProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <section className="my-10 bg-brand-dark rounded-2xl border border-brand-border/80 p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-brand-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-red-600/20 text-brand-red flex items-center justify-center">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-kannada">
              ವಿಡಿಯೋಗಳು (Videos & Trailers)
            </h2>
            <p className="text-xs text-brand-muted font-kannada">
              ಹೊಸ ಕನ್ನಡ ಚಿತ್ರಗಳ ಟ್ರೇಲರ್, ಟೀಸರ್, ಹಾಡುಗಳು ಮತ್ತು ವಿಶೇಷ ಸಂದರ್ಶನಗಳು
            </p>
          </div>
        </div>

        <Link
          href="/category/videos"
          className="text-xs sm:text-sm font-semibold text-brand-red hover:text-white flex items-center gap-1 font-kannada transition-colors"
        >
          <span>ಎಲ್ಲಾ ವಿಡಿಯೋಗಳು</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveVideoId(item.youtubeId)}
            className="group cursor-pointer bg-brand-card rounded-xl overflow-hidden border border-brand-border hover:border-brand-red/50 transition-all duration-300"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={item.thumbnailUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-brand-red/90 group-hover:bg-brand-red text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>

              {/* Tag & Duration */}
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded bg-brand-black/90 text-white text-[10px] font-bold font-kannada border border-brand-border">
                  {item.category}
                </span>
              </div>
              <div className="absolute bottom-2.5 right-2.5 bg-black/80 px-2 py-0.5 rounded text-[11px] font-sans font-medium text-white">
                {item.duration}
              </div>
            </div>

            <div className="p-3.5">
              <h3 className="text-xs sm:text-sm font-bold text-gray-200 group-hover:text-brand-red font-kannada leading-snug line-clamp-2 transition-colors">
                {item.title}
              </h3>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-brand-muted font-sans">
                <Eye className="w-3 h-3 text-brand-red" />
                <span>{item.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-brand-dark rounded-2xl overflow-hidden border border-brand-border shadow-2xl">
            <div className="flex items-center justify-between p-3.5 bg-brand-black border-b border-brand-border">
              <span className="text-sm font-bold text-white font-kannada flex items-center gap-2">
                <Film className="w-4 h-4 text-brand-red" />
                ವಿಡಿಯೋ ಪ್ಲೇಯರ್
              </span>
              <button
                onClick={() => setActiveVideoId(null)}
                className="p-1.5 rounded-lg bg-brand-card hover:bg-brand-red text-gray-300 hover:text-white transition-colors"
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

