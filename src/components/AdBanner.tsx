import React from "react";
import Image from "next/image";
import { AdSpot } from "@/types";

interface AdBannerProps {
  placement: AdSpot["placement"];
  ad?: AdSpot | null;
  className?: string;
}

export default function AdBanner({ placement, ad, className = "" }: AdBannerProps) {
  const isLeaderboard = placement === "header_leaderboard" || placement === "footer_banner";
  const isSidebar = placement === "sidebar_rectangle";

  // Case 1: Image Banner
  if (ad && ad.imageUrl && ad.isActive) {
    const bannerContent = (
      <div
        className={`relative overflow-hidden rounded-xl border border-glow-line group ${
          isLeaderboard ? "h-24 sm:h-28 max-w-4xl" : isSidebar ? "h-64 max-w-sm" : "h-32"
        } w-full mx-auto my-6`}
      >
        <Image
          src={ad.imageUrl}
          alt={ad.altText || ad.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 800px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/40 to-transparent flex flex-col justify-end p-3">
          <span className="text-[9px] uppercase tracking-widest text-marquee-soft font-display-latin font-bold mb-0.5">
            SPONSORED
          </span>
          <p className="text-xs sm:text-sm font-bold text-popcorn font-kannada drop-shadow">
            {ad.title}
          </p>
        </div>
      </div>
    );

    if (ad.targetUrl && ad.targetUrl !== "#") {
      return (
        <a
          href={ad.targetUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={`block w-full text-center ${className}`}
        >
          {bannerContent}
        </a>
      );
    }

    return <div className={`w-full text-center ${className}`}>{bannerContent}</div>;
  }

  // Case 2: Custom HTML/Script Ad (sanitized sandbox)
  if (ad && ad.adCode && ad.isActive) {
    return (
      <div className={`w-full my-4 text-center ${className}`}>
        <span className="text-[10px] uppercase tracking-widest text-popcorn-muted font-display-latin block mb-1">
          Advertisement
        </span>
        <iframe
          srcDoc={`<!DOCTYPE html><html><head><style>body{margin:0;display:flex;justify-content:center;align-items:center;background:transparent;}</style></head><body>${ad.adCode}</body></html>`}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
          className="w-full border-0 mx-auto"
          style={{ height: isLeaderboard ? "90px" : isSidebar ? "250px" : "100px" }}
          title={ad.title || "Advertisement"}
        />
      </div>
    );
  }

  // Case 3: If no active ad is scheduled, render nothing to keep the layout clean and uncluttered
  return null;
}
