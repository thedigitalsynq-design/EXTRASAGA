"use client";

import React, { useState } from "react";
import { AdvanceTrackedMovie } from "@/lib/boxOfficeEngine/advanceBookingService";
import { X, Copy, Check, Share2, Sparkles, ShieldCheck } from "lucide-react";

interface BoxOfficeTweetStudioModalProps {
  movie: AdvanceTrackedMovie | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BoxOfficeTweetStudioModal({
  movie,
  isOpen,
  onClose,
}: BoxOfficeTweetStudioModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !movie) return null;

  const tweetText = `🚨 EXTRASAGA THEATRICAL LEDGER: #Pushpa2TheRule / ${movie.movieTitleEn}

🎟️ Tickets Sold: ${movie.advance.ticketsSoldFormatted}
💰 Advance Gross: ${movie.advance.advanceGrossFormatted}
🏢 PIC (PVR-INOX-Cinépolis): ${movie.advance.nationalChainsTicketsFormatted}
⚡ Fast-Filling Shows: ${movie.advance.fastFillingShows.toLocaleString("en-IN")}
🔥 Housefull Shows: ${movie.advance.housefullShows.toLocaleString("en-IN")}
🎯 Day 1 Projections: ${movie.advance.dayPredictionInCrores}
📊 Weekend Forecast: ${movie.advance.weekendProjectionInCrores}

Audited multi-source telemetry via @extrasaga
Verified data: https://extrasaga.com/box-office`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tweetText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn("Failed to copy:", err);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tweet-studio-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-paper border-2 border-ink shadow-press w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-sheet border-b-2 border-ink px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-band text-ink border border-ink">
              <Share2 className="w-4 h-4 text-press" />
            </span>
            <div>
              <h2
                id="tweet-studio-title"
                className="text-base font-poster uppercase tracking-wide text-ink"
              >
                Social Tweet Studio &amp; Trade Card
              </h2>
              <span className="text-[10px] font-mono text-ink-dim uppercase">
                1-Click Formatted Snapshot for X / Instagram
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 border border-ink hover:bg-paper text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Card Preview (Editorial BroadSheet Style) */}
          <div className="bg-sheet border-2 border-ink p-5 shadow-sticker relative overflow-hidden">
            <div className="flex items-start justify-between border-b-2 border-ink pb-3 mb-4">
              <div>
                <span className="sticker bg-press text-paper border border-ink text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase">
                  VERIFIED THEATRICAL LEDGER
                </span>
                <h3 className="text-xl font-poster uppercase tracking-tight text-ink mt-1.5">
                  {movie.movieTitleEn}
                </h3>
                <span className="text-xs font-mono text-ink-dim uppercase">
                  Industry: {movie.industry} • Language: {movie.language.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-ink-dim uppercase block">
                  Advance Gross
                </span>
                <span className="text-2xl font-poster text-press font-bold">
                  {movie.advance.advanceGrossFormatted}
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs mb-4">
              <div className="p-2.5 bg-paper border border-ink/20">
                <span className="text-[10px] text-ink-dim uppercase block">Tickets Sold</span>
                <span className="font-bold text-sm text-ink">
                  {movie.advance.ticketsSoldFormatted}
                </span>
              </div>
              <div className="p-2.5 bg-paper border border-ink/20">
                <span className="text-[10px] text-ink-dim uppercase block">PIC Multiplexes</span>
                <span className="font-bold text-sm text-ink">
                  {movie.advance.nationalChainsTicketsFormatted}
                </span>
              </div>
              <div className="p-2.5 bg-paper border border-ink/20">
                <span className="text-[10px] text-ink-dim uppercase block">Total Shows</span>
                <span className="font-bold text-sm text-ink">
                  {movie.advance.totalShows.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="p-2.5 bg-paper border border-ink/20">
                <span className="text-[10px] text-ink-dim uppercase block">Occupancy</span>
                <span className="font-bold text-sm text-accent-moss">
                  {movie.advance.occupancyPercent}%
                </span>
              </div>
              <div className="p-2.5 bg-paper border border-ink/20">
                <span className="text-[10px] text-ink-dim uppercase block">Fast Filling</span>
                <span className="font-bold text-sm text-accent-signal">
                  {movie.advance.fastFillingShows}
                </span>
              </div>
              <div className="p-2.5 bg-paper border border-ink/20">
                <span className="text-[10px] text-ink-dim uppercase block">Housefull</span>
                <span className="font-bold text-sm text-press">
                  {movie.advance.housefullShows}
                </span>
              </div>
            </div>

            {/* Projections Band */}
            <div className="p-3 bg-band border border-ink flex items-center justify-between text-xs font-mono mb-3">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-ink-dim block">
                  Day 1 Projection
                </span>
                <span className="font-bold text-ink">{movie.advance.dayPredictionInCrores}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-ink-dim block">
                  Weekend Forecast
                </span>
                <span className="font-bold text-ink">{movie.advance.weekendProjectionInCrores}</span>
              </div>
            </div>

            {/* Footer Watermark */}
            <div className="flex items-center justify-between pt-2 border-t border-ink/20 text-[10px] font-mono text-ink-dim">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-press" />
                Multi-Source Reconciled Telemetry
              </span>
              <span className="font-bold uppercase tracking-wider text-ink">EXTRASAGA.COM</span>
            </div>
          </div>

          {/* Tweet Text Output Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="tweet-copy-text"
                className="text-xs font-poster uppercase tracking-wide text-ink flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-press" />
                Ready-to-Post Tweet Copy
              </label>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-band hover:bg-marquee border border-ink text-xs font-mono font-bold uppercase transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-accent-moss" />
                    COPIED TO CLIPBOARD
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-ink" />
                    COPY TEXT
                  </>
                )}
              </button>
            </div>
            <textarea
              id="tweet-copy-text"
              readOnly
              value={tweetText}
              rows={7}
              className="w-full bg-sheet border-2 border-ink p-3 font-mono text-xs text-ink focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-sheet border-t-2 border-ink px-5 py-3 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 border-ink text-xs font-mono font-bold uppercase hover:bg-paper transition-colors"
          >
            Close
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-press text-paper border-2 border-ink text-xs font-mono font-bold uppercase hover:bg-press-deep transition-colors shadow-sticker"
          >
            Post on X (Twitter)
          </a>
        </div>
      </div>
    </div>
  );
}

