import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { DollarSign, Award, TrendingUp, Calendar } from "lucide-react";
import { DataService } from "@/lib/dataService";
import BoxOfficeTable from "@/components/BoxOfficeTable";
import TrendingSidebar from "@/components/TrendingSidebar";
import AdBanner from "@/components/AdBanner";

export const metadata: Metadata = {
  title: "ಕನ್ನಡ ಸಿನಿಮಾ ಬಾಕ್ಸ್ ಆಫೀಸ್ ಗಳಿಕೆ & ಕಲೆಕ್ಷನ್ ರಿಪೋರ್ಟ್ಸ್ | ಸಿನಿ ಕನ್ನಡ",
  description: "ಸ್ಯಾಂಡಲ್ವುಡ್ ಇತಿಹಾಸದ ಸಾರ್ವಕಾಲಿಕ ಅತಿ ಹೆಚ್ಚು ಗಳಿಕೆ ಕಂಡ ಸಿನಿಮಾಗಳ ಬಾಕ್ಸ್ ಆಫೀಸ್ ರಿಪೋರ್ಟ್, ಮೊದಲ ದಿನದ ಗಳಿಕೆ ಮತ್ತು ವೀಕೆಂಡ್ ಕಲೆಕ್ಷನ್ ವಿವರಗಳು.",
};

export default async function BoxOfficePage() {
  const [boxOffice, trendingArticles] = await Promise.all([
    DataService.getBoxOffice(),
    DataService.getTrendingArticles(5),
  ]);

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-emerald-950/40 via-brand-card to-brand-dark border-b border-brand-border py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-brand-muted font-kannada mb-2">
            <Link href="/" className="hover:text-white">ಮುಖಪುಟ</Link>
            <span>/</span>
            <span className="text-emerald-400 font-medium">ಬಾಕ್ಸ್ ಆಫೀಸ್</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-kannada">
            ಸ್ಯಾಂಡಲ್ವುಡ್ ಬಾಕ್ಸ್ ಆಫೀಸ್ ದಾಖಲೆಗಳು (Box Office)
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-300 font-kannada max-w-2xl">
            ಕನ್ನಡ ಚಿತ್ರರಂಗದ ₹100 ಕೋಟಿ, ₹400 ಕೋಟಿ ಮತ್ತು ₹1000 ಕೋಟಿ ಕ್ಲಬ್ ಸೇರಿದ ಐತಿಹಾಸಿಕ ಚಿತ್ರಗಳ ಅಧಿಕೃತ ಕಲೆಕ್ಷನ್ ವಿವರ.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-8 space-y-8">
            <BoxOfficeTable entries={boxOffice} showAllLink={false} />

            {/* In-depth Territory Breakdown Section */}
            <div className="bg-brand-dark rounded-2xl border border-brand-border p-6">
              <h2 className="text-lg font-bold text-white font-kannada mb-4 border-l-4 border-emerald-500 pl-3">
                ಕೆಜಿಎಫ್ 2 ಮತ್ತು ಕಾಂತಾರ ರಾಜ್ಯವಾರು ಕಲೆಕ್ಷನ್ ವಿವರ
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 font-kannada leading-relaxed mb-4">
                ಕನ್ನಡ ಚಿತ್ರರಂಗವು ಕೇವಲ ಕರ್ನಾಟಕಕ್ಕೆ ಸೀಮಿತವಾಗಿರದೆ ಇಡೀ ವಿಶ್ವದಾದ್ಯಂತ ಬಾಕ್ಸ್ ಆಫೀಸ್ ಧೂಳೆಬ್ಬಿಸಿದೆ. ವಿಶೇಷವಾಗಿ ಹಿಂದಿ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಕೆಜಿಎಫ್ 2 ₹500 ಕೋಟಿಗೂ ಅಧಿಕ ಗಳಿಕೆ ಕಂಡು ಬಾಲಿವುಡ್‌ನ ಹಲವು ಘಟಾನುಘಟಿ ನಾಯಕರ ಸಿನಿಮಾಗಳ ದಾಖಲೆ ಪುಡಿಗಟ್ಟಿದೆ.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-brand-card border border-brand-border/60">
                  <h3 className="font-bold text-white text-sm font-kannada mb-2 text-brand-yellow">
                    ಕೆಜಿಎಫ್ 2 ಪ್ರಮುಖ ದಾಖಲೆಗಳು
                  </h3>
                  <ul className="text-xs text-gray-300 font-kannada space-y-1.5">
                    <li>• ಮೊದಲ ದಿನ ಭಾರತದಲ್ಲೇ ₹134 ಕೋಟಿ ಒಟ್ಟು ಗಳಿಕೆ</li>
                    <li>• ಹಿಂದಿ ಆವೃತ್ತಿಯ ಮೊದಲ ದಿನದ ಗಳಿಕೆ ₹54 ಕೋಟಿ</li>
                    <li>• ವಿಶ್ವದಾದ್ಯಂತ ಸಾರ್ವಕಾಲಿಕ ಗಳಿಕೆ: ₹1,250 ಕೋಟಿ+</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-brand-card border border-brand-border/60">
                  <h3 className="font-bold text-white text-sm font-kannada mb-2 text-brand-red">
                    ಕಾಂತಾರ ದಾಖಲೆಯ ಲಾಭ
                  </h3>
                  <ul className="text-xs text-gray-300 font-kannada space-y-1.5">
                    <li>• ಬಜೆಟ್: ಕೇವಲ ₹16 ಕೋಟಿ</li>
                    <li>• ಗಳಿಕೆ: ₹450 ಕೋಟಿ+ (28 ಪಟ್ಟು ಹೆಚ್ಚು ಲಾಭ)</li>
                    <li>• ಕರ್ನಾಟಕದಲ್ಲೇ ₹175 ಕೋಟಿಗೂ ಅಧಿಕ ಕಲೆಕ್ಷನ್</li>
                  </ul>
                </div>
              </div>
            </div>
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
