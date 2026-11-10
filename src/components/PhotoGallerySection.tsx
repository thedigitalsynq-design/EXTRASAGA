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
  const { localizeUrl } = useLanguage();
  const [activeGallery, setActiveGallery] = useState<GalleryItem | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const displayGalleries = galleries;

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
    <section className="bg-sheet border border-line rounded-lg shadow-md p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-line gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-violet text-paper border border-line rounded shadow-sm flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="sticker bg-band text-ink border border-line px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded">
                LENS &amp; LIGHT
              </span>
              <span className="text-[10px] font-mono uppercase text-ink-dim tracking-wider font-bold">
                RED CARPET &amp; PORTRAITS
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-poster uppercase tracking-tight text-ink truncate">
              CELEBRITY <span className="text-violet">GALLERIES</span>
            </h2>
            <p className="text-xs text-ink-dim font-medium">
              Capturing the grace, glamour, and candid moments of India&apos;s most beloved screen icons.
            </p>
          </div>
        </div>

        <Link
          href={localizeUrl("/category/gallery")}
          className="self-start sm:self-auto px-4 py-2 bg-surface text-ink hover:bg-violet hover:text-white border border-line rounded shadow-sm text-xs font-poster uppercase tracking-wider flex items-center gap-2 transition-all shrink-0"
        >
          <span>View All Galleries</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayGalleries.map((item) => (
          <div
            key={item.id}
            onClick={() => openLightbox(item)}
            className="group cursor-pointer bg-surface border border-line rounded-lg shadow-sm hover:border-line-2 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-line bg-band">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"></div>

                {/* Photo Count Tag */}
                <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm px-2.5 py-1 border border-line rounded shadow-sm text-ink text-xs font-mono font-bold flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-press" />
                  <span>{item.photoCount} Photos</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-block px-2 py-0.5 sticker bg-band text-ink border border-line text-[9px] font-bold uppercase mb-1 rounded">
                    {item.celebrityName}
                  </span>
                  <h3 className="text-sm font-poster uppercase text-paper leading-snug line-clamp-2 drop-shadow-sm">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/85 animate-fadeIn">
          <div className="relative w-full max-w-5xl h-[85vh] bg-sheet border border-line rounded-xl shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 bg-band border-b border-line">
              <div>
                <h3 className="text-sm sm:text-base font-poster uppercase text-ink">
                  {activeGallery.title}
                </h3>
                <span className="text-xs text-ink-dim font-mono font-bold">
                  {activePhotoIndex + 1} of {activeGallery.photos.length} Photos
                </span>
              </div>
              <button
                onClick={() => setActiveGallery(null)}
                className="p-1.5 bg-surface hover:bg-press text-ink hover:text-white border border-line rounded transition-colors"
                aria-label="Close Gallery"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo View */}
            <div className="relative flex-1 my-3 flex items-center justify-center bg-surface p-4">
              {activeGallery.photos[activePhotoIndex] && (
                <div className="relative w-full h-full max-h-[60vh]">
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
                className="absolute left-4 p-3 bg-surface/90 hover:bg-press text-ink hover:text-white border border-line rounded-full shadow-md transition-colors"
                aria-label="Previous Photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 p-3 bg-surface/90 hover:bg-press text-ink hover:text-white border border-line rounded-full shadow-md transition-colors"
                aria-label="Next Photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Caption */}
            <div className="p-3.5 bg-band border-t border-line text-center">
              <p className="text-xs sm:text-sm text-ink font-medium">
                {activeGallery.photos[activePhotoIndex]?.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
