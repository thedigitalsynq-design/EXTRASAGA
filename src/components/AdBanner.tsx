import React from "react";
import Image from "next/image";
import { AdSpot } from "@/types";

interface AdBannerProps {
  placement: AdSpot["placement"];
  ad?: AdSpot | null;
  className?: string;
}

export default function AdBanner({ placement, ad, className = "" }: AdBannerProps) {
  // If custom ad code exists
  if (ad && ad.adCode) {
    return (
      <div className={`w-full my-4 text-center ${className}`}>
        <span className="text-[10px] uppercase tracking-wider text-brand-muted block mb-1">
          ಜಾಹೀರಾತು (Advertisement)
        </span>
        <div dangerouslySetInnerHTML={{ __html: ad.adCode }} />
      </div>
    );
  }

  // Display default styled cinema ad placeholders
  const isLeaderboard = placement === "header_leaderboard" || placement === "footer_banner";
  const isSidebar = placement === "sidebar_rectangle";

  return (
    <div
      className={`my-6 mx-auto w-full rounded-xl bg-gradient-to-r from-brand-dark via-brand-card to-brand-dark border border-dashed border-brand-border/80 p-4 text-center overflow-hidden flex flex-col items-center justify-center ${
        isLeaderboard ? "max-w-4xl py-6" : isSidebar ? "max-w-sm py-8" : "py-5"
      } ${className}`}
    >
      <span className="text-[9px] uppercase tracking-widest text-brand-muted block mb-1.5 font-sans">
        ಪ್ರಾಯೋಜಿತ ಜಾಹೀರಾತು &middot; ADVERTISEMENT
      </span>

      <div className="flex flex-col items-center gap-1.5">
        <h4 className="text-sm font-bold text-gray-200 font-kannada">
          {ad?.title || "ಸಿನಿ ಕನ್ನಡ ವಿಶೇಷ ಜಾಹೀರಾತು ಸ್ಥಾನ"}
        </h4>
        <p className="text-xs text-brand-muted font-kannada max-w-md">
          {ad?.altText || "ನಿಮ್ಮ ಸಿನಿಮಾಗಳು, ಟ್ರೇಲರ್‌ಗಳು ಅಥವಾ ಬ್ರ್ಯಾಂಡ್‌ಗಳನ್ನು ಲಕ್ಷಾಂತರ ಕನ್ನಡ ಸಿನಿಮಾ ಪ್ರೇಮಿಗಳಿಗೆ ತಲುಪಿಸಿ."}
        </p>
        <span className="mt-2 inline-block px-3 py-1 rounded bg-brand-red/20 text-brand-red hover:bg-brand-red hover:text-white text-xs font-semibold font-kannada transition-colors cursor-pointer border border-brand-red/30">
          ಜಾಹೀರಾತಿಗಾಗಿ ಸಂಪರ್ಕಿಸಿ
        </span>
      </div>
    </div>
  );
}

