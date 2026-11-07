"use client";

import React, { useState } from "react";
import { ConsolidatedBoxOfficeRecord, CityCinemaTelemetry } from "@/types/boxOffice";
import BoxOfficeTrackingHero from "./BoxOfficeTrackingHero";
import BoxOfficeInteractiveTable from "./BoxOfficeInteractiveTable";
import CityCinemaTelemetrySection from "./CityCinemaTelemetry";
import { ShieldCheck } from "lucide-react";

interface BoxOfficeClientHubProps {
  initialRecords: ConsolidatedBoxOfficeRecord[];
  initialCityTelemetry: CityCinemaTelemetry[];
}

export default function BoxOfficeClientHub({
  initialRecords,
  initialCityTelemetry,
}: BoxOfficeClientHubProps) {
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

      {/* 4. Transparency & Consensus Methodology Assurance Notice */}
      <div className="p-5 bg-sheet border-2 border-ink shadow-press flex items-start gap-3.5 text-xs text-ink-dim">
        <div className="p-2 bg-band text-ink border border-ink shrink-0">
          <ShieldCheck className="w-4 h-4 text-press-deep" />
        </div>
        <div className="space-y-1">
          <span className="font-poster uppercase text-ink block">
            Consolidated Consensus Methodology &amp; Integrity Assurance
          </span>
          <p className="leading-relaxed font-grotesk text-ink-dim font-medium">
            Our aggregation engine unifies reporting formats across exhibitors, ticketing platforms, and regional distributor ledgers. By filtering statistical anomalies and inflated claims, we deliver an honest, tamper-free ledger that respects both the science of trade numbers and the craft of cinema.
          </p>
        </div>
      </div>
    </div>
  );
}
