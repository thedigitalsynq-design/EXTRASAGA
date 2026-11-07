"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Camera, ChevronRight, X, ChevronLeft } from "lucide-react";
import { GalleryItem } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface PhotoGallerySectionProps {
  galleries: GalleryItem[];
}

export default function PhotoGallerySection({
  galleries,
}: PhotoGallerySectionProps) {
  const { language, config, t, localizeUrl } = useLanguage();
  const [activeGallery, setActiveGallery] = useState<GalleryItem | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const filteredGalleries = galleries.filter(
    (g) => g.language === language || (!g.language && language === "kn")
  );
  const displayGalleries = filteredGalleries.length > 0 ? filteredGalleries : galleries;

  const openLightbox = (gallery: GalleryItem) => {
    setActiveGallery(gallery);
    setActivePhotoIndex(0);
  };

  const nextPhoto = () => {
    if (!activeGallery) return;
    setActivePhotoIndex((prev) => (prev + 1) % activeGallery.photos.length);
  };

  const prevPhoto = () => {
    if (!activeGallery) return;
    setActivePhotoIndex((prev) =>
      prev === 0 ? activeGallery.photos.length - 1 : prev - 1
    );
  };

  const gallerySubtitles: Record<string, string> = {
    kn: "ಕನ್ನಡ ತಾರೆಯರ ಗ್ಲಾಮರಸ್ ಫೋಟೋಗಳು ಮತ್ತು ಸಿನಿಮಾ ಸಂಭ್ರಮದ ಕ್ಷಣಗಳು",
    te: "టాలీవుడ్ ప్రముఖుల గ్లామరస్ ఫోటోలు మరియు సినిమా ఈవెంట్స్",
    ta: "கோலிவுட் நட்சத்திரங்களின் பிரத்யேக புகைப்படங்கள் மற்றும் திரைப்பட நிகழ்வுகள்",
    ml: "മോളിവുഡ് താരങ്ങളുടെ ഗ്ലാമറസ് ഫോട്ടോകളും സിനിമാ വിശേഷങ്ങളും",
    hi: "बॉलीवुड सितारों के ग्लैमरस फोटोशूट और सिनेमाई पलों की खास तस्वीरें",
    en: "Glamorous celebrity photoshoots, movie launches and red carpet moments",
  };

  const photoCountWord: Record<string, string> = {
    kn: "ಫೋಟೋಗಳು",
    te: "ఫోటోలు",
    ta: "படங்கள்",
    ml: "ഫോട്ടോകൾ",
    hi: "तस्वीरें",
    en: "Photos",
  };

  return (
    <section className="bg-revealed rounded-2xl border border-glow-line p-6">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-glow-line">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-ultra-faint text-ultra-soft border border-ultra/25 flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-extrabold text-popcorn">
              {t("sec_gallery")}{" "}
              <span className="text-sm font-display-latin font-bold text-ultra-soft uppercase tracking-widest">
                ({config.industryName} Gallery)
              </span>
            </h2>
            <p className="text-xs text-popcorn-muted mt-0.5">
              {gallerySubtitles[language] || gallerySubtitles.kn}
            </p>
          </div>
        </div>
        {/* Theatre rule running through the header */}
        <div className="hidden md:flex-1 md:mx-4 h-px bg-glow-line" />

        <Link
          href={localizeUrl("/category/gallery")}
          className="text-xs sm:text-sm font-semibold text-ultra-soft hover:text-ultra flex items-center gap-1 transition-colors shrink-0"
        >
          <span>{t("btn_view_all")}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayGalleries.map((item) => (
          <div
            key={item.id}
            onClick={() => openLightbox(item)}
            className="group cursor-pointer bg-hall rounded-xl overflow-hidden border border-glow-line hover:border-glow-line-strong hover:shadow-[0_0_24px_rgba(155,109,255,0.15)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-void">
              <Image
                src={item.coverImage}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent"></div>

              {/* Photo Count Tag */}
              <div className="absolute top-3 right-3 bg-void/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-glow-line text-popcorn text-xs font-mono-tabular font-bold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-ultra-soft" />
                <span>
                  {item.photoCount} {photoCountWord[language] || photoCountWord.kn}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-signal-faint backdrop-blur-sm text-[10px] font-bold text-signal-soft mb-1 border border-signal/25">
                  {item.celebrityName}
                </span>
                <h3 className="text-sm font-bold text-popcorn group-hover:text-ultra-soft leading-snug line-clamp-2 transition-colors drop-shadow-sm">
                  {item.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/95 backdrop-blur-md">
          <div className="relative w-full max-w-5xl h-[85vh] flex flex-col justify-between">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 bg-hall/90 rounded-2xl border border-glow-line shadow-lg">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-popcorn font-kannada">
                  {activeGallery.title}
                </h3>
                <span className="text-xs text-popcorn-muted font-mono-tabular">
                  {activePhotoIndex + 1} of {activeGallery.photos.length}
                </span>
              </div>
              <button
                onClick={() => setActiveGallery(null)}
                className="p-2 rounded-full bg-screen hover:bg-signal-deep text-popcorn transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo View */}
            <div className="relative flex-1 my-3 flex items-center justify-center">
              {activeGallery.photos[activePhotoIndex] && (
                <div className="relative w-full h-full max-h-[65vh]">
                  <Image
                    src={activeGallery.photos[activePhotoIndex].url}
                    alt={activeGallery.photos[activePhotoIndex].caption}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              )}

              {/* Prev / Next controls */}
              <button
                onClick={prevPhoto}
                className="absolute left-2 p-2.5 rounded-full bg-void/80 hover:bg-ultra-deep text-popcorn transition-colors border border-glow-line"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-2 p-2.5 rounded-full bg-void/80 hover:bg-ultra-deep text-popcorn transition-colors border border-glow-line"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Caption */}
            <div className="p-3.5 bg-hall/90 rounded-2xl border border-glow-line text-center shadow-lg">
              <p className="text-xs sm:text-sm text-popcorn-dim font-kannada">
                {activeGallery.photos[activePhotoIndex]?.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
