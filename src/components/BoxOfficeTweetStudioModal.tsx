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

  const tweetText = `🚨 EXTRA-SAAGA THEATRICAL LEDGER: #Pushpa2TheRule / ${movie.movieTitleEn}

🎟️ Tickets Sold: ${movie.advance.ticketsSoldFormatted}
💰 Advance Gross: ${movie.advance.advanceGrossFormatted}
🏢 PIC (PVR-INOX-Cinépolis): ${movie.advance.nationalChainsTicketsFormatted}
⚡ Fast-Filling Shows: ${movie.advance.fastFillingShows.toLocaleString("en-IN")}
🔥 Housefull Shows: ${movie.advance.housefullShows.toLocaleString("en-IN")}
🎯 Day 1 Projections: ${movie.advance.dayPredictionInCrores}
📊 Weekend Forecast: ${movie.advance.weekendProjectionInCrores}

Audited multi-source telemetry via @ExtraSaaga
Verified data: https://extra-saaga.com/box-office`;

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-sheet border border-line rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Modal Header */}
        <div className="bg-surface/80 border-b border-line px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-surface text-ink border border-line rounded-lg">
              <Share2 className="w-4 h-4 text-press" />
            </span>
            <div>
              <h2
                id="tweet-studio-title"
                className="text-base font-bold uppercase tracking-wide text-ink"
              >
                Social Tweet Studio &amp; Trade Card
              </h2>
              <span className="text-[10px] font-mono-tabular text-ink-mute uppercase">
                1-Click Formatted Snapshot for X / Instagram
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg border border-line hover:bg-surface text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Card Preview */}
          <div className="bg-surface/60 border border-line rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-start justify-between border-b border-line/40 pb-3 mb-4">
              <div>
                <span className="bg-press/20 text-press border border-press/40 rounded-full text-[9px] font-bold px-2.5 py-0.5 tracking-wider uppercase inline-block">
                  VERIFIED THEATRICAL LEDGER
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-ink mt-1.5">
                  {movie.movieTitleEn}
                </h3>
                <span className="text-xs font-mono-tabular text-ink-mute uppercase">
                  Industry: {movie.industry} • Language: {movie.language.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono-tabular text-ink-mute uppercase block">
                  Advance Gross
                </span>
                <span className="text-2xl font-mono-tabular text-press font-bold">
                  {movie.advance.advanceGrossFormatted}
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono-tabular text-xs mb-4">
              <div className="p-2.5 bg-surface border border-line/60 rounded-lg">
                <span className="text-[10px] text-ink-mute uppercase block">Tickets Sold</span>
                <span className="font-bold text-sm text-ink">
                  {movie.advance.ticketsSoldFormatted}
                </span>
              </div>
              <div className="p-2.5 bg-surface border border-line/60 rounded-lg">
                <span className="text-[10px] text-ink-mute uppercase block">PIC Multiplexes</span>
                <span className="font-bold text-sm text-ink">
                  {movie.advance.nationalChainsTicketsFormatted}
                </span>
              </div>
              <div className="p-2.5 bg-surface border border-line/60 rounded-lg">
                <span className="text-[10px] text-ink-mute uppercase block">Total Shows</span>
                <span className="font-bold text-sm text-ink">
                  {movie.advance.totalShows.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="p-2.5 bg-surface border border-line/60 rounded-lg">
                <span className="text-[10px] text-ink-mute uppercase block">Occupancy</span>
                <span className="font-bold text-sm text-emerald-400">
                  {movie.advance.occupancyPercent}%
                </span>
              </div>
              <div className="p-2.5 bg-surface border border-line/60 rounded-lg">
                <span className="text-[10px] text-ink-mute uppercase block">Fast Filling</span>
                <span className="font-bold text-sm text-amber-400">
                  {movie.advance.fastFillingShows}
                </span>
              </div>
              <div className="p-2.5 bg-surface border border-line/60 rounded-lg">
                <span className="text-[10px] text-ink-mute uppercase block">Housefull</span>
                <span className="font-bold text-sm text-press">
                  {movie.advance.housefullShows}
                </span>
              </div>
            </div>

            {/* Projections Band */}
            <div className="p-3 bg-surface border border-line rounded-lg flex items-center justify-between text-xs font-mono-tabular mb-3">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-ink-mute block">
                  Day 1 Projection
                </span>
                <span className="font-bold text-ink">{movie.advance.dayPredictionInCrores}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-ink-mute block">
                  Weekend Forecast
                </span>
                <span className="font-bold text-ink">{movie.advance.weekendProjectionInCrores}</span>
              </div>
            </div>

            {/* Footer Watermark */}
            <div className="flex items-center justify-between pt-2 border-t border-line/40 text-[10px] font-mono-tabular text-ink-mute">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-press" />
                Multi-Source Reconciled Telemetry
              </span>
              <span className="font-bold uppercase tracking-wider text-ink">EXTRA-SAAGA.COM</span>
            </div>
          </div>

          {/* Tweet Text Output Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="tweet-copy-text"
                className="text-xs font-bold uppercase tracking-wide text-ink flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-press" />
                Ready-to-Post Tweet Copy
              </label>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface hover:bg-surface/80 border border-line rounded-lg text-xs font-mono-tabular font-bold uppercase text-ink transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
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
              className="w-full bg-surface border border-line rounded-xl p-3 font-mono text-xs text-ink focus:outline-none focus:border-press/50 resize-none"
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-surface/80 border-t border-line px-6 py-3.5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-line rounded-lg text-xs font-mono-tabular font-bold uppercase text-ink hover:bg-surface transition-colors"
          >
            Close
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-press text-white border border-press/60 rounded-lg text-xs font-mono-tabular font-bold uppercase hover:bg-press/90 transition-colors shadow-md"
          >
            Post on X (Twitter)
          </a>
        </div>
      </div>
    </div>
  );
}

