"use client";

import React, { useState } from "react";
import { ConsolidatedBoxOfficeRecord, CityCinemaTelemetry } from "@/types/boxOffice";
import { AdvanceBookingService } from "@/lib/boxOfficeEngine/advanceBookingService";
import BoxOfficeTrackingHero from "./BoxOfficeTrackingHero";
import BoxOfficeInteractiveTable from "./BoxOfficeInteractiveTable";
import CityCinemaTelemetrySection from "./CityCinemaTelemetry";
import NationalChainsAdvancePulse from "./NationalChainsAdvancePulse";
import BoxOfficeTrackingSwitcher, { BoxOfficeMode } from "./BoxOfficeTrackingSwitcher";
import AdvanceBookingsLiveTable from "./AdvanceBookingsLiveTable";
import NationalChainsPICCard from "./NationalChainsPICCard";
import StateCircuitTelemetryTable from "./StateCircuitTelemetryTable";
import BoxOfficeYearlyLeaderboard from "./BoxOfficeYearlyLeaderboard";
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
  const [trackingMode, setTrackingMode] = useState<BoxOfficeMode>("all_india");
  const [viewMode, setViewMode] = useState<"gross" | "net" | "share">("gross");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(
    initialRecords[0]?.lastUpdated || new Date().toISOString()
  );

  const pulseItems = AdvanceBookingService.getNationalChainsPulse();

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
    <div className="space-y-6">
      {/* 1. National Chains Advance Pulse Strip (BFILMY Reverse-Engineered Mechanism) */}
      <NationalChainsAdvancePulse pulseItems={pulseItems} />

      {/* 2. Primary Tracking Mode Switcher */}
      <BoxOfficeTrackingSwitcher
        activeMode={trackingMode}
        onModeChange={setTrackingMode}
      />

      {/* 3. Conditional View Modes */}
      {trackingMode === "by_year" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <BoxOfficeYearlyLeaderboard />
        </div>
      )}

      {trackingMode === "all_india" && (
        <div className="space-y-8 animate-in fade-in duration-150">
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

          {cityTelemetry.length > 0 && (
            <CityCinemaTelemetrySection
              telemetry={cityTelemetry}
              currency={currency}
            />
          )}

          <BoxOfficeInteractiveTable
            records={records}
            viewMode={viewMode}
            currency={currency}
          />
        </div>
      )}

      {trackingMode === "advance" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <AdvanceBookingsLiveTable />
        </div>
      )}

      {trackingMode === "national_chains" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <NationalChainsPICCard />
          <AdvanceBookingsLiveTable />
        </div>
      )}

      {trackingMode === "circuits" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <StateCircuitTelemetryTable />
          {cityTelemetry.length > 0 && (
            <CityCinemaTelemetrySection
              telemetry={cityTelemetry}
              currency={currency}
            />
          )}
        </div>
      )}

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
