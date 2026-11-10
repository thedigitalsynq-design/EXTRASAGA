"use client";

import React from "react";
import Link from "next/link";
import { NationalChainsAdvancePulseItem } from "@/types/boxOffice";
import { ArrowUpRight, ArrowDownRight, Flame } from "lucide-react";

interface NationalChainsAdvancePulseProps {
  pulseItems: NationalChainsAdvancePulseItem[];
}

export default function NationalChainsAdvancePulse({
  pulseItems,
}: NationalChainsAdvancePulseProps) {
  if (!pulseItems || pulseItems.length === 0) return null;

  return (
    <section
      aria-label="National Chains Advance Booking Pulse"
      className="w-full bg-sheet border border-line rounded-xl shadow-lg overflow-hidden my-6 select-none"
    >
      <div className="flex flex-col md:flex-row md:items-stretch">
        {/* Ticker Lead Header */}
        <div className="bg-surface text-ink border-b md:border-b-0 md:border-r border-line px-4 py-3 flex items-center gap-2.5 shrink-0">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-press animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-press" />
          </div>
          <Flame className="w-4 h-4 text-press shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-ink-dim leading-none">
              PIC NATIONAL CHAINS
            </span>
            <span className="text-xs font-poster tracking-wide uppercase text-ink mt-0.5 whitespace-nowrap">
              LIVE ADVANCE PULSE
            </span>
          </div>
        </div>

        {/* Scrolling Telemetry Marquee */}
        <div className="flex-1 overflow-x-auto scrollbar-none py-2 px-3 flex items-center gap-3">
          {pulseItems.map((item) => (
            <Link
              key={item.movieId}
              href={`/movies/${item.slug}`}
              className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-surface hover:bg-band border border-line hover:border-press/40 transition-all rounded-lg text-xs shrink-0 group"
            >
              <span className="font-bold text-ink group-hover:text-press transition-colors">
                {item.movieTitle}
              </span>

              {/* PIC Tickets Badge */}
              <span className="inline-flex items-center gap-1 font-mono-tabular font-bold bg-band px-2 py-0.5 border border-line rounded text-ink text-[11px]">
                <span className="text-[9px] uppercase tracking-wider text-ink-dim">PIC:</span>
                {item.picTicketsSoldFormatted}
              </span>

              {/* Gross */}
              <span className="font-mono-tabular text-ink-dim text-[11px] font-semibold">
                ₹{item.picGrossInCrores.toFixed(1)} Cr
              </span>

              {/* Trend Indicator */}
              <span
                className={`inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  item.trend === "up"
                    ? "bg-[#4ADE80]/20 text-[#4ADE80]"
                    : "bg-press/20 text-press"
                }`}
              >
                {item.trend === "up" ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5 text-[#4ADE80]" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-0.5 text-press" />
                )}
                {item.trendDelta}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

