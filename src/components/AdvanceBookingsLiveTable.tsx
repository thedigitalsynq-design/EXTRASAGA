"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AdvanceBookingService,
  AdvanceTrackedMovie,
} from "@/lib/boxOfficeEngine/advanceBookingService";
import BoxOfficeTweetStudioModal from "./BoxOfficeTweetStudioModal";
import {
  Ticket,
  TrendingUp,
  Share2,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";

interface AdvanceBookingsLiveTableProps {
  movies?: AdvanceTrackedMovie[];
}

export default function AdvanceBookingsLiveTable({
  movies = AdvanceBookingService.getTrackedMovies(),
}: AdvanceBookingsLiveTableProps) {
  const [selectedMovie, setSelectedMovie] = useState<AdvanceTrackedMovie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const aggregates = AdvanceBookingService.getAggregateMetrics();

  const handleOpenStudio = (movie: AdvanceTrackedMovie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  return (
    <section
      aria-label="Live Advance Bookings Telemetry Ledger"
      className="space-y-6"
    >
      {/* 1. High-Level Macro Metric Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-sheet border-2 border-ink p-4 shadow-sticker">
          <div className="flex items-center justify-between text-xs font-mono text-ink-dim uppercase mb-1">
            <span>Total Advance Gross</span>
            <Ticket className="w-3.5 h-3.5 text-press" />
          </div>
          <div className="text-2xl font-poster font-bold text-ink">
            {aggregates.totalAdvanceGrossFormatted}
          </div>
          <span className="text-[10px] font-mono text-ink-dim">
            Reconciled multi-territory
          </span>
        </div>

        <div className="bg-sheet border-2 border-ink p-4 shadow-sticker">
          <div className="flex items-center justify-between text-xs font-mono text-ink-dim uppercase mb-1">
            <span>Total Tickets Sold</span>
            <TrendingUp className="w-3.5 h-3.5 text-accent-moss" />
          </div>
          <div className="text-2xl font-poster font-bold text-ink">
            {aggregates.totalTicketsSoldFormatted}
          </div>
          <span className="text-[10px] font-mono text-ink-dim">
            {aggregates.activeTrackedFilmsCount} marquee releases
          </span>
        </div>

        <div className="bg-sheet border-2 border-ink p-4 shadow-sticker">
          <div className="flex items-center justify-between text-xs font-mono text-ink-dim uppercase mb-1">
            <span>PIC National Chains</span>
            <Building2 className="w-3.5 h-3.5 text-press" />
          </div>
          <div className="text-2xl font-poster font-bold text-ink">
            {aggregates.totalPICTicketsFormatted}
          </div>
          <span className="text-[10px] font-mono text-ink-dim">
            PVR • INOX • Cinépolis
          </span>
        </div>

        <div className="bg-sheet border-2 border-ink p-4 shadow-sticker">
          <div className="flex items-center justify-between text-xs font-mono text-ink-dim uppercase mb-1">
            <span>Average Occupancy</span>
            <Clock className="w-3.5 h-3.5 text-accent-signal" />
          </div>
          <div className="text-2xl font-poster font-bold text-ink">
            {aggregates.averageOccupancyPercent}%
          </div>
          <span className="text-[10px] font-mono text-ink-dim">
            Across {aggregates.totalShowsTrackedFormatted} shows
          </span>
        </div>
      </div>

      {/* 2. Main Advance Bookings Telemetry Table */}
      <div className="bg-sheet border-2 border-ink shadow-press overflow-hidden">
        {/* Table Header Bar */}
        <div className="bg-band border-b-2 border-ink px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-press animate-ping" />
            <h2 className="text-sm font-poster uppercase tracking-wide text-ink">
              Live Theatrical Advance Booking &amp; Show Velocity Ledger
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-ink-dim">
            <span className="px-2 py-0.5 bg-paper border border-ink/30 uppercase font-bold text-ink">
              UPDATED EVERY 15 MINS
            </span>
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-paper border-b-2 border-ink text-ink-dim uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-bold">Film &amp; Circuit</th>
                <th className="py-3 px-3 font-bold text-right">Advance Gross</th>
                <th className="py-3 px-3 font-bold text-right">Tickets Sold</th>
                <th className="py-3 px-3 font-bold text-center">Shows / Velocity</th>
                <th className="py-3 px-3 font-bold text-right">PIC Multiplex</th>
                <th className="py-3 px-3 font-bold text-right">Occupancy</th>
                <th className="py-3 px-3 font-bold text-right">Forecasts</th>
                <th className="py-3 px-4 font-bold text-center">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {movies.map((item, idx) => (
                <tr
                  key={item.movieId}
                  className="hover:bg-paper/70 transition-colors group"
                >
                  {/* Film Details */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-ink-dim w-4">
                        0{idx + 1}
                      </span>
                      <div>
                        <Link
                          href={`/movies/${item.slug}`}
                          className="font-poster text-sm uppercase text-ink hover:text-press transition-colors block"
                        >
                          {item.movieTitleEn}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] uppercase px-1.5 py-0.2 bg-paper border border-ink/20 text-ink-dim font-bold">
                            {item.industry}
                          </span>
                          <span className="text-[10px] text-ink-dim font-grotesk">
                            {item.advance.lastTracked}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Advance Gross */}
                  <td className="py-3 px-3 text-right">
                    <span className="font-poster text-sm text-press font-bold block">
                      {item.advance.advanceGrossFormatted}
                    </span>
                    <span className="text-[10px] text-ink-dim block">
                      Day 1 Est: {item.advance.dayPredictionInCrores}
                    </span>
                  </td>

                  {/* Tickets Sold */}
                  <td className="py-3 px-3 text-right">
                    <span className="font-bold text-ink block font-mono-tabular">
                      {item.advance.ticketsSoldFormatted}
                    </span>
                    <span className="text-[10px] text-ink-dim block">
                      {item.advance.trackedTheatres.toLocaleString("en-IN")} venues
                    </span>
                  </td>

                  {/* Shows & Fast Filling */}
                  <td className="py-3 px-3 text-center">
                    <div className="font-mono-tabular font-bold text-ink">
                      {item.advance.totalShows.toLocaleString("en-IN")} shows
                    </div>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <span className="text-[9px] px-1 py-0.2 bg-accent-signal/20 text-ink border border-accent-signal/30 font-bold">
                        {item.advance.fastFillingShows} FF
                      </span>
                      <span className="text-[9px] px-1 py-0.2 bg-press/20 text-press-deep border border-press/30 font-bold">
                        {item.advance.housefullShows} HF
                      </span>
                    </div>
                  </td>

                  {/* PIC Multiplex (PVR-INOX-Cinépolis) */}
                  <td className="py-3 px-3 text-right font-mono-tabular">
                    <span className="font-bold text-ink block">
                      {item.advance.nationalChainsTicketsFormatted}
                    </span>
                    <span className="text-[10px] text-ink-dim block">
                      ₹{item.advance.nationalChainsGrossInCrores.toFixed(1)} Cr
                    </span>
                  </td>

                  {/* Occupancy */}
                  <td className="py-3 px-3 text-right">
                    <span className="font-bold text-accent-moss block">
                      {item.advance.occupancyPercent}%
                    </span>
                    <div className="w-16 h-1.5 bg-paper border border-ink/20 ml-auto mt-1 overflow-hidden">
                      <div
                        className="h-full bg-accent-moss"
                        style={{ width: `${Math.min(100, item.advance.occupancyPercent)}%` }}
                      />
                    </div>
                  </td>

                  {/* Forecasts */}
                  <td className="py-3 px-3 text-right font-mono-tabular">
                    <span className="text-[11px] font-bold text-ink block">
                      Wknd: {item.advance.weekendProjectionInCrores}
                    </span>
                    <span className="text-[10px] text-accent-moss font-semibold">
                      +{item.advance.trendDeltaPercent}% 24h
                    </span>
                  </td>

                  {/* Tweet Studio Share Trigger */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleOpenStudio(item)}
                      aria-label={`Open Tweet Studio for ${item.movieTitleEn}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-band hover:bg-marquee border border-ink text-[10px] font-bold uppercase transition-all shadow-sticker"
                    >
                      <Share2 className="w-3 h-3 text-press" />
                      <span>Card</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Methodology Note */}
        <div className="bg-paper border-t-2 border-ink px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-ink-dim gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-press" />
            <span>
              Telemetry gathered from integrated ticketing endpoints and verified exhibitor feeds.
            </span>
          </div>
          <span className="font-bold text-ink uppercase">
            EXTRA-SAAGA TRADE INTELLIGENCE
          </span>
        </div>
      </div>

      {/* Tweet Studio Modal */}
      <BoxOfficeTweetStudioModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}

