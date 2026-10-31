import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Tv, Sparkles } from "lucide-react";
import { DataService } from "@/lib/dataService";
import OttSection from "@/components/OttSection";
import TrendingSidebar from "@/components/TrendingSidebar";
import AdBanner from "@/components/AdBanner";

export const metadata: Metadata = {
  title: "ಕನ್ನಡ OTT ರಿಲೀಸ್ ಅಪ್ಡೇಟ್ಸ್ & ಬಿಡುಗಡೆ ದಿನಾಂಕಗಳು | ಸಿನಿ ಕನ್ನಡ",
  description: "ನೆಟ್‌ಫ್ಲಿಕ್ಸ್, ಅಮೆಜಾನ್ ಪ್ರೈಮ್, ಜೀ5, ಜಿಯೋ ಸಿನಿಮಾ ನಲ್ಲಿ ಬಿಡುಗಡೆಯಾಗುವ ಕನ್ನಡ ಸಿನಿಮಾಗಳ ಸಂಪೂರ್ಣ ಪಟ್ಟಿ ಮತ್ತು OTT ಸ್ಟ್ರೀಮಿಂಗ್ ಅಪ್ಡೇಟ್ಸ್.",
};

export default async function OttPage() {
  const [ottReleases, trendingArticles] = await Promise.all([
    DataService.getOttReleases(),
    DataService.getTrendingArticles(5),
  ]);

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-sky-950/40 via-brand-card to-brand-dark border-b border-brand-border py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-brand-muted font-kannada mb-2">
            <Link href="/" className="hover:text-white">ಮುಖಪುಟ</Link>
            <span>/</span>
            <span className="text-sky-400 font-medium">OTT ಅಪ್ಡೇಟ್</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-kannada">
            ಕನ್ನಡ OTT ಬಿಡುಗಡೆ ಹಬ್ (Kannada OTT Hub)
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-300 font-kannada max-w-2xl">
            ನಿಮ್ಮ ನೆಚ್ಚಿನ ಕನ್ನಡ ಸಿನಿಮಾಗಳು ಯಾವ ಒಟಿಟಿ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ನಲ್ಲಿ ಯಾವಾಗ ಸ್ಟ್ರೀಮ್ ಆಗಲಿವೆ ಎಂಬುದರ ಅಧಿಕೃತ ದಿನಾಂಕಗಳು.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-8 space-y-8">
            <OttSection releases={ottReleases} />
          </main>

          <aside className="lg:col-span-4 space-y-6">
            <TrendingSidebar articles={trendingArticles} />
            <AdBanner placement="sidebar_rectangle" />
          </aside>
        </div>
      </div>
    </div>
  );
}
