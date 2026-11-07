"use client";

import React, { useState } from "react";
import { Globe2, Layers, TrendingUp, Info } from "lucide-react";
import { ConsolidatedBoxOfficeRecord, TerritoryFinancialBreakdown } from "@/types/boxOffice";
import { useLanguage } from "@/context/LanguageContext";

interface BoxOfficeTerritoryRadarProps {
  movie: ConsolidatedBoxOfficeRecord;
  currency: "INR" | "USD";
  viewMode: "gross" | "net" | "share";
}

export default function BoxOfficeTerritoryRadar({
  movie,
  currency,
  viewMode,
}: BoxOfficeTerritoryRadarProps) {
  const { language } = useLanguage();

  const labels = {
    kn: {
      pill: "ಪ್ರಾದೇಶಿಕ & ಸಾಗರೋತ್ತರ ಹಂಚಿಕೆ",
      title: `${movie.movieTitle} — ಪ್ರಾದೇಶಿಕ ಆದಾಯ ಹಂಚಿಕೆ`,
      subtitle:
        "ರಾಜ್ಯವಾರು ಮತ್ತು ಅಂತಾರಾಷ್ಟ್ರೀಯ ಮಾರುಕಟ್ಟೆಗಳಲ್ಲಿ ಸಂಗ್ರಹವಾದ ಒಟ್ಟು, ನಿವ್ವಳ ಹಾಗೂ ವಿತರಕರ ಗಳಿಕೆಯ ಸಮಗ್ರ ವರ್ಗೀಕರಣ.",
      territory: "ಪ್ರಾಂತ್ಯ / ಮಾರುಕಟ್ಟೆ",
      gross: "ಸಮಗ್ರ (Gross)",
      net: "ನಿವ್ವಳ (Net)",
      share: "ವಿತರಕರ ಪಾಲು",
      occupancy: "ಆಕ್ಯುಪೆನ್ಸಿ",
      marketShare: "ಮಾರುಕಟ್ಟೆ ಪಾಲು",
    },
    en: {
      pill: "TERRITORY & OVERSEAS AUDIT",
      title: `${movie.movieTitleEn} — Territorial Collection Distribution`,
      subtitle:
        "Comprehensive territory-wise segregation of theatrical gross, statutory ex-GST net, and realized distributor share.",
      territory: "Territory / Market",
      gross: "Gross",
      net: "Net (Ex-GST)",
      share: "Distributor Share",
      occupancy: "Avg Occupancy",
      marketShare: "Market Share",
    },
  }[language === "kn" ? "kn" : "en"];

  const formatAmount = (crores: number) => {
    if (currency === "USD") {
      const millions = ((crores * 10_000_000) / 84.0 / 1_000_000).toFixed(2);
      return `$${millions}M`;
    }
    return `₹${crores.toFixed(2)} Cr`;
  };

  const getMetric = (t: TerritoryFinancialBreakdown) => {
    if (viewMode === "net") return t.netInCrores;
    if (viewMode === "share") return t.distributorShareInCrores;
    return t.grossInCrores;
  };

  return (
    <section className="w-full bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="space-y-2 pb-6 mb-6 border-b border-gray-200/80">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-50 border border-amber-200 text-amber-800 shadow-2xs">
          <Globe2 className="w-3.5 h-3.5 text-amber-600" />
          <span>{labels.pill}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight font-sans">
          {labels.title}
        </h3>

        <p className="text-xs text-gray-500 font-normal">{labels.subtitle}</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 uppercase font-mono tracking-wider bg-gray-50/80">
              <th className="py-3 px-4 font-semibold">{labels.territory}</th>
              <th className="py-3 px-4 font-semibold">{labels.gross}</th>
              <th className="py-3 px-4 font-semibold">{labels.net}</th>
              <th className="py-3 px-4 font-semibold text-[#A92732]">{labels.share}</th>
              <th className="py-3 px-4 font-semibold">{labels.occupancy}</th>
              <th className="py-3 px-4 text-right font-semibold">{labels.marketShare}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-sans">
            {movie.territories.map((t) => {
              const activeVal = getMetric(t);

              return (
                <tr key={t.territory} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-950">
                    <div>
                      {language === "kn" && t.regionalTitle ? t.regionalTitle : t.territory}
                    </div>
                    <span className="text-[10px] text-gray-400 font-normal">
                      {t.territory}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-gray-800">
                    {formatAmount(t.grossInCrores)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-600">
                    {formatAmount(t.netInCrores)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#A92732]">
                    {formatAmount(t.distributorShareInCrores)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-[10px] font-bold font-mono">
                      {t.occupancyRate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${t.marketSharePercent}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-gray-900 text-xs">
                        {t.marketSharePercent}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

