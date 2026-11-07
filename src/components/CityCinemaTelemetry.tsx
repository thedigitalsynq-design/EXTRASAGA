"use client";

import React from "react";
import { Building2, Activity, Ticket, Clock, Percent, MapPin } from "lucide-react";
import { CityCinemaTelemetry } from "@/types/boxOffice";
import { useLanguage } from "@/context/LanguageContext";

interface CityCinemaTelemetryProps {
  telemetry: CityCinemaTelemetry[];
  currency: "INR" | "USD";
}

export default function CityCinemaTelemetrySection({
  telemetry,
  currency,
}: CityCinemaTelemetryProps) {
  const { language } = useLanguage();

  const labels = {
    kn: {
      pill: "ನಗರವಾರು ಲೈವ್ ಟೆಲಿಮೆಟ್ರಿ",
      title: "ಪ್ರಮುಖ ಚಿತ್ರಮಂದಿರಗಳ ಆಕ್ಯುಪೆನ್ಸಿ & ಶೋ ರೇಡಾರ್",
      subtitle:
        "ಪ್ರಮುಖ ಮೆಟ್ರೋ ನಗರಗಳಲ್ಲಿ ದಾಖಲಾಗುತ್ತಿರುವ ಥಿಯೇಟರ್ ಆಸನ ಭರ್ತಿ ಪ್ರಮಾಣ, ಫಾಸ್ಟ್-ಫಿಲ್ಲಿಂಗ್ ಶೋಗಳು ಮತ್ತು ಸರಾಸರಿ ಟಿಕೆಟ್ ದರಗಳ ಲೈವ್ ವಿಶ್ಲೇಷಣೆ.",
      trackedTheatres: "ಥಿಯೇಟರ್‌ಗಳು",
      trackedShows: "ಟ್ರ್ಯಾಕ್ ಆದ ಶೋಗಳು",
      occupancy: "ಆಕ್ಯುಪೆನ್ಸಿ",
      fastFilling: "ಫಾಸ್ಟ್ ಫಿಲ್ಲಿಂಗ್",
      atp: "ಸರಾಸರಿ ಟಿಕೆಟ್ ದರ (ATP)",
      dailyGross: "ದೈನಂದಿನ ಒಟ್ಟು ಗಳಿಕೆ",
      statusLive: "ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್",
      statusFinal: "ದಿನದ ಅಂತಿಮ",
    },
    en: {
      pill: "CITY-WISE CINEMA OPERATIONS",
      title: "Metropolitan Occupancy & Theatrical Show Radar",
      subtitle:
        "Real-time theatre telemetry monitoring seat occupancy, fast-filling show counts, and average ticket price (ATP) across primary markets.",
      trackedTheatres: "Theatres",
      trackedShows: "Tracked Shows",
      occupancy: "Occupancy Rate",
      fastFilling: "Fast Filling",
      atp: "Average Ticket Price",
      dailyGross: "Estimated Daily Gross",
      statusLive: "Live Tracking",
      statusFinal: "Consolidated",
    },
  }[language === "kn" ? "kn" : "en"];

  const formatGross = (crores: number) => {
    if (currency === "USD") {
      const millions = ((crores * 10_000_000) / 84.0 / 1_000_000).toFixed(2);
      return `$${millions}M`;
    }
    return `₹${crores.toFixed(2)} Cr`;
  };

  return (
    <section className="w-full bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase bg-sky-50 border border-sky-200 text-sky-800 shadow-2xs">
            <Activity className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
            <span>{labels.pill}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight font-sans">
            {labels.title}
          </h2>

          <p className="text-xs text-gray-500 max-w-2xl font-normal">
            {labels.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-500 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Real-time polling active</span>
        </div>
      </div>

      {/* City Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {telemetry.map((item) => {
          const isLive = item.status === "live";

          return (
            <div
              key={item.city}
              className="p-5 rounded-2xl bg-gray-50/60 hover:bg-gray-50 border border-gray-200/80 hover:border-gray-300 transition-all shadow-2xs flex flex-col justify-between space-y-4 group"
            >
              {/* City Name & Status Pill */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-800 shadow-2xs group-hover:border-[#A92732] transition-colors">
                    <MapPin className="w-4 h-4 text-[#A92732]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-950 text-sm font-sans">
                      {language === "kn" && item.nativeName ? item.nativeName : item.city}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-sans block">
                      {item.state} • {item.trackedTheatres} {labels.trackedTheatres}
                    </span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    isLive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
                  <span>{isLive ? labels.statusLive : labels.statusFinal}</span>
                </span>
              </div>

              {/* Occupancy Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">{labels.occupancy}</span>
                  <span className="font-black text-gray-950 font-mono text-sm">
                    {item.occupancyPercent}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.occupancyPercent >= 80
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                        : item.occupancyPercent >= 60
                        ? "bg-gradient-to-r from-amber-500 to-emerald-500"
                        : "bg-gray-400"
                    }`}
                    style={{ width: `${item.occupancyPercent}%` }}
                  />
                </div>
              </div>

              {/* Operational Stats Grid */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200/60 text-center font-mono">
                <div className="p-2 rounded-xl bg-white border border-gray-100 shadow-2xs">
                  <span className="text-[9px] text-gray-400 uppercase block tracking-wider font-sans">
                    {labels.trackedShows}
                  </span>
                  <span className="text-xs font-bold text-gray-900 mt-0.5 block">
                    {item.trackedShows.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white border border-gray-100 shadow-2xs">
                  <span className="text-[9px] text-gray-400 uppercase block tracking-wider font-sans">
                    {labels.fastFilling}
                  </span>
                  <span className="text-xs font-bold text-amber-800 mt-0.5 block">
                    {item.fastFillingPercent}%
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white border border-gray-100 shadow-2xs">
                  <span className="text-[9px] text-gray-400 uppercase block tracking-wider font-sans">
                    {labels.atp}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 mt-0.5 block">
                    ₹{item.averageTicketPriceINR}
                  </span>
                </div>
              </div>

              {/* Bottom Daily Gross */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-gray-500 font-medium">{labels.dailyGross}</span>
                <span className="font-black text-[#A92732] font-mono text-sm">
                  {formatGross(item.dailyGrossInCrores)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

