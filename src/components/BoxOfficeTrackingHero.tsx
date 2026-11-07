"use client";

import React from "react";
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  Building2,
  DollarSign,
  Info,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface BoxOfficeTrackingHeroProps {
  viewMode: "gross" | "net" | "share";
  onViewModeChange: (mode: "gross" | "net" | "share") => void;
  currency: "INR" | "USD";
  onCurrencyChange: (curr: "INR" | "USD") => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  lastUpdated: string;
  totalTrackedMovies: number;
}

export default function BoxOfficeTrackingHero({
  viewMode,
  onViewModeChange,
  currency,
  onCurrencyChange,
  isRefreshing,
  onRefresh,
  lastUpdated,
  totalTrackedMovies,
}: BoxOfficeTrackingHeroProps) {
  const { language, config, t } = useLanguage();

  const labels = {
    kn: {
      pill: "ಸ್ವಯಂಚಾಲಿತ ಬಾಕ್ಸ್ ಆಫೀಸ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಸಿಸ್ಟಮ್",
      title: "ಬಹುಮೂಲಗಳ ಕ್ರೋಢೀಕೃತ ಬಾಕ್ಸ್ ಆಫೀಸ್ ಅನಾಲಿಟಿಕ್ಸ್",
      subtitle:
        "ಚಿತ್ರಮಂದಿರಗಳ ಟೆಲಿಮೆಟ್ರಿ, ಟಿಕೆಟ್ ಬುಕಿಂಗ್ ವೇಗ ಮತ್ತು ಅಧಿಕೃತ ವಿತರಕರ ವರದಿಗಳಿಂದ ನೇರವಾಗಿ ಲೆಕ್ಕಾಚಾರ ಮಾಡಲಾದ ಏಕೀಕೃತ, ನಿಷ್ಪಕ್ಷಪಾತ ಸಿನಿಮಾ ಗಳಿಕೆ ವರದಿ.",
      viewGross: "ಸಮಗ್ರ ಒಟ್ಟು (Gross)",
      viewNet: "ನಿವ್ವಳ ಗಳಿಕೆ (Net - GST ರಹಿತ)",
      viewShare: "ವಿತರಕರ ಪಾಲು (Distributor Share)",
      syncBtn: "ತಾಜಾ ಟೆಲಿಮೆಟ್ರಿ ಸಿಂಕ್",
      syncing: "ಲೆಕ್ಕಾಚಾರ ನಡೆಯುತ್ತಿದೆ...",
      privacyBadge: "ಏಕೀಕೃತ ನಿಷ್ಪಕ್ಷಪಾತ ವಿಶ್ಲೇಷಣೆ",
      privacySub: "ಸ್ವತಂತ್ರ 5 ಸಿನಿಮಾ ನೆಟ್‌ವರ್ಕ್‌ಗಳಿಂದ ಸಮನ್ವಯಗೊಂಡ ಅಂಕಿಅಂಶಗಳು",
      confidence: "98% ವಿಶ್ವಾಸಾರ್ಹತೆ",
      verified: "ದೃಢೀಕೃತ ಲೆಕ್ಕಾಚಾರ",
      lastUpdatedText: "ಕೊನೆಯ ನವೀಕರಣ:",
    },
    en: {
      pill: "AUTOMATED MULTI-SOURCE BOX OFFICE RADAR",
      title: "Consolidated Cinema Box Office Analytics",
      subtitle:
        "Statistically cleansed, outlier-free theatrical figures reconciled continuously from exhibitor telemetry, booking velocity, and audited statements.",
      viewGross: "Worldwide Gross",
      viewNet: "Domestic Net (Ex-GST)",
      viewShare: "Distributor Share",
      syncBtn: "Sync Telemetry",
      syncing: "Recalculating...",
      privacyBadge: "Consolidated Consensus",
      privacySub: "Multi-provider telemetry synthesized into a single authoritative figure",
      confidence: "98% Confidence",
      verified: "Reconciled Audit",
      lastUpdatedText: "Last Updated:",
    },
  }[language === "kn" ? "kn" : "en"];

  const formatLastUpdatedTime = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return "Just now";
    }
  };

  return (
    <section className="w-full bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-200/80">
        {/* Left Headline & Pill */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{labels.pill}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight font-sans">
            {labels.title}
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
            {labels.subtitle}
          </p>
        </div>

        {/* Right Action Controls: Sync & Currency */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          {/* Currency Toggle */}
          <div className="inline-flex p-1 rounded-2xl bg-gray-100 border border-gray-200 text-xs font-bold font-sans">
            <button
              type="button"
              onClick={() => onCurrencyChange("INR")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                currency === "INR"
                  ? "bg-white text-gray-950 shadow-2xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              ₹ INR (Cr)
            </button>
            <button
              type="button"
              onClick={() => onCurrencyChange("USD")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                currency === "USD"
                  ? "bg-white text-gray-950 shadow-2xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              $ USD (M)
            </button>
          </div>

          {/* Sync Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#A92732] hover:bg-[#8e1d27] text-white text-xs font-bold shadow-md shadow-[#A92732]/20 transition-all active:scale-95 disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? labels.syncing : labels.syncBtn}</span>
          </button>
        </div>
      </div>

      {/* Metric Breakdown & Filter Switches */}
      <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Financial Metric Segregation Switch (7 cols) */}
        <div className="md:col-span-7 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-500 font-mono uppercase tracking-wider block sm:inline mr-1">
            ಲೆಕ್ಕಾಚಾರ (Metric):
          </span>
          <div className="inline-flex p-1 rounded-2xl bg-gray-100/90 border border-gray-200 text-xs font-bold font-sans w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onViewModeChange("gross")}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl transition-all ${
                viewMode === "gross"
                  ? "bg-white text-gray-950 shadow-2xs"
                  : "text-gray-600 hover:text-gray-950"
              }`}
            >
              {labels.viewGross}
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("net")}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl transition-all ${
                viewMode === "net"
                  ? "bg-white text-gray-950 shadow-2xs"
                  : "text-gray-600 hover:text-gray-950"
              }`}
            >
              {labels.viewNet}
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("share")}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl transition-all ${
                viewMode === "share"
                  ? "bg-white text-gray-950 shadow-2xs"
                  : "text-gray-600 hover:text-gray-950"
              }`}
            >
              {labels.viewShare}
            </button>
          </div>
        </div>

        {/* Status Indicators & Reconciled Timestamp (5 cols) */}
        <div className="md:col-span-5 flex items-center md:justify-end gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-emerald-900 leading-none">
                {labels.confidence}
              </div>
              <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                {labels.lastUpdatedText} {formatLastUpdatedTime(lastUpdated)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

