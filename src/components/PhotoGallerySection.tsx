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
    <section className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-pink-50 text-pink-700 border border-pink-200 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950">
              {t("sec_gallery")}{" "}
              <span className="text-sm font-sans font-bold text-pink-700">
                ({config.industryName} Gallery)
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {gallerySubtitles[language] || gallerySubtitles.kn}
            </p>
          </div>
        </div>

        <Link
          href={localizeUrl("/category/gallery")}
          className="text-xs sm:text-sm font-semibold text-pink-700 hover:underline flex items-center gap-1 transition-colors"
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
            className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-200/90 hover:border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
              <Image
                src={item.coverImage}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent"></div>

              {/* Photo Count Tag */}
              <div className="absolute top-3 right-3 bg-brand-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-brand-border text-white text-xs font-sans font-bold flex items-center gap-1.5 shadow-md">
                <Camera className="w-3.5 h-3.5 text-pink-400" />
                <span>
                  {item.photoCount} {photoCountWord[language] || photoCountWord.kn}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-[10px] font-bold text-pink-200 mb-1 border border-white/20 shadow-xs">
                  {item.celebrityName}
                </span>
                <h3 className="text-sm font-bold text-white group-hover:text-pink-300 leading-snug line-clamp-2 transition-colors drop-shadow-sm">
                  {item.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="relative w-full max-w-5xl h-[85vh] flex flex-col justify-between">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 bg-gray-900/90 rounded-2xl border border-white/10 shadow-lg">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white font-kannada">
                  {activeGallery.title}
                </h3>
                <span className="text-xs text-gray-400 font-sans">
                  {activePhotoIndex + 1} of {activeGallery.photos.length}
                </span>
              </div>
              <button
                onClick={() => setActiveGallery(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-brand-crimson text-white transition-colors"
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
                className="absolute left-2 p-2.5 rounded-full bg-black/70 hover:bg-brand-crimson text-white transition-colors border border-white/10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-2 p-2.5 rounded-full bg-black/70 hover:bg-brand-crimson text-white transition-colors border border-white/10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Caption */}
            <div className="p-3.5 bg-gray-900/90 rounded-2xl border border-white/10 text-center shadow-lg">
              <p className="text-xs sm:text-sm text-gray-200 font-kannada">
                {activeGallery.photos[activePhotoIndex]?.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

