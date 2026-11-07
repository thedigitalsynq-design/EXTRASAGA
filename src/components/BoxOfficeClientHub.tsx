"use client";

import React, { useState } from "react";
import { ConsolidatedBoxOfficeRecord, CityCinemaTelemetry } from "@/types/boxOffice";
import BoxOfficeTrackingHero from "./BoxOfficeTrackingHero";
import BoxOfficeInteractiveTable from "./BoxOfficeInteractiveTable";
import CityCinemaTelemetrySection from "./CityCinemaTelemetry";
import { ShieldCheck, Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface BoxOfficeClientHubProps {
  initialRecords: ConsolidatedBoxOfficeRecord[];
  initialCityTelemetry: CityCinemaTelemetry[];
}

export default function BoxOfficeClientHub({
  initialRecords,
  initialCityTelemetry,
}: BoxOfficeClientHubProps) {
  const { language } = useLanguage();
  const [records, setRecords] = useState<ConsolidatedBoxOfficeRecord[]>(initialRecords);
  const [cityTelemetry, setCityTelemetry] = useState<CityCinemaTelemetry[]>(initialCityTelemetry);
  const [viewMode, setViewMode] = useState<"gross" | "net" | "share">("gross");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(
    initialRecords[0]?.lastUpdated || new Date().toISOString()
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/box-office?refresh=true");
      if (res.ok) {
        const data = await res.json();
        if (data.records) setRecords(data.records);
        if (data.cityTelemetry) setCityTelemetry(data.cityTelemetry);
        setLastUpdated(new Date().toISOString());
      }
    } catch (err) {
      console.warn("Failed to refresh box office telemetry:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Hero Analytics & Status Switcher */}
      <BoxOfficeTrackingHero
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currency={currency}
        onCurrencyChange={setCurrency}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        lastUpdated={lastUpdated}
        totalTrackedMovies={records.length}
      />

      {/* 2. City Cinema Operations & Theatrical Telemetry */}
      {cityTelemetry.length > 0 && (
        <CityCinemaTelemetrySection
          telemetry={cityTelemetry}
          currency={currency}
        />
      )}

      {/* 3. Main Multi-Source Box Office Consolidated Table */}
      <BoxOfficeInteractiveTable
        records={records}
        viewMode={viewMode}
        currency={currency}
      />

      {/* 4. Privacy & Methodological Transparency Assurance Notice */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex items-start gap-3.5 text-xs text-gray-600">
        <div className="p-2 rounded-xl bg-gray-100 text-gray-800 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="space-y-1">
          <span className="font-bold text-gray-950 font-sans block">
            {language === "kn"
              ? "ನಿಷ್ಪಕ್ಷಪಾತ ಡೇಟಾ ಸಮನ್ವಯ ಮತ್ತು ಗೌಪ್ಯತಾ ಮಾನದಂಡ"
              : "Consolidated Consensus Methodology & Integrity Assurance"}
          </span>
          <p className="leading-relaxed text-gray-500 font-normal">
            {language === "kn"
              ? "ಈ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಪ್ರದರ್ಶಿಸಲಾಗುವ ಬಾಕ್ಸ್ ಆಫೀಸ್ ಅಂಕಿಅಂಶಗಳು ಚಿತ್ರಮಂದಿರಗಳ ನೈಜ ಟಿಕೆಟ್ ಟೆಲಿಮೆಟ್ರಿ, ವಿತರಕರ ಜಿಎಸ್‌ಟಿ-ಪಾವತಿ ವರದಿಗಳು ಮತ್ತು ಸ್ವತಂತ್ರ ಗ್ರೌಂಡ್ ಟ್ರ್ಯಾಕರ್‌ಗಳಿಂದ ಪಡೆದ ಅಂಕಿಅಂಶಗಳ ಸಂಖ್ಯಾಶಾಸ್ತ್ರೀಯ ಕ್ರೋಢೀಕರಣವಾಗಿದೆ. ಕೃತಕ ಪಿಆರ್ ಕ್ಲೈಮ್‌ಗಳನ್ನು ನಿಗ್ರಹಿಸಿ ಒಂದೇ ನಿಖರ ಅಧಿಕೃತ ಫಲಿತಾಂಶವನ್ನು ಒದಗಿಸಲಾಗುತ್ತದೆ."
              : "Our automated aggregation engine normalizes reporting formats across exhibitors, ticketing platforms, and distributor ledgers. By applying interquartile range (IQR) statistical outlier suppression, inflated claims are filtered out, delivering one clean, tamper-free consolidated result."}
          </p>
        </div>
      </div>
    </div>
  );
}

