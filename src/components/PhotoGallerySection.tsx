"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Camera, ChevronRight, X, ChevronLeft } from "lucide-react";
import { GalleryItem } from "@/types";

interface PhotoGallerySectionProps {
  galleries: GalleryItem[];
}

export default function PhotoGallerySection({
  galleries,
}: PhotoGallerySectionProps) {
  const [activeGallery, setActiveGallery] = useState<GalleryItem | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

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

  return (
    <section className="my-10 bg-brand-dark rounded-2xl border border-brand-border/80 p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-brand-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-kannada">
              ಫೋಟೋ ಗ್ಯಾಲರಿ (Celebrity Photo Gallery)
            </h2>
            <p className="text-xs text-brand-muted font-kannada">
              ಕನ್ನಡ ತಾರೆಯರ ಗ್ಲಾಮರಸ್ ಫೋಟೋಗಳು ಮತ್ತು ಸಿನಿಮಾ ಸಂಭ್ರಮದ ಕ್ಷಣಗಳು
            </p>
          </div>
        </div>

        <Link
          href="/category/gallery"
          className="text-xs sm:text-sm font-semibold text-pink-400 hover:text-white flex items-center gap-1 font-kannada transition-colors"
        >
          <span>ಎಲ್ಲಾ ಫೋಟೋಗಳು</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {galleries.map((item) => (
          <div
            key={item.id}
            onClick={() => openLightbox(item)}
            className="group cursor-pointer bg-brand-card rounded-xl overflow-hidden border border-brand-border hover:border-pink-500/50 transition-all duration-300"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
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
                <span>{item.photoCount} ಫೋಟೋಗಳು</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block px-2 py-0.5 rounded bg-brand-dark/90 text-[10px] font-semibold text-pink-300 font-kannada mb-1 border border-brand-border">
                  {item.celebrityName}
                </span>
                <h3 className="text-sm font-bold text-white group-hover:text-pink-300 font-kannada leading-snug line-clamp-2 transition-colors">
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
            <div className="flex items-center justify-between p-4 bg-brand-dark/80 rounded-xl border border-brand-border">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white font-kannada">
                  {activeGallery.title}
                </h3>
                <span className="text-xs text-brand-muted font-sans">
                  {activePhotoIndex + 1} of {activeGallery.photos.length}
                </span>
              </div>
              <button
                onClick={() => setActiveGallery(null)}
                className="p-2 rounded-lg bg-brand-card hover:bg-brand-red text-white transition-colors"
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
                className="absolute left-2 p-2.5 rounded-full bg-brand-black/70 hover:bg-brand-red text-white transition-colors border border-brand-border"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-2 p-2.5 rounded-full bg-brand-black/70 hover:bg-brand-red text-white transition-colors border border-brand-border"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Caption */}
            <div className="p-3 bg-brand-dark/90 rounded-xl border border-brand-border text-center">
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

