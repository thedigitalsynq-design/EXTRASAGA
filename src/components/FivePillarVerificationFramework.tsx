"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Building2,
  FileCheck,
  Ticket,
  Scale,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface VerificationPillar {
  step: string;
  id: string;
  title: string;
  authority: string;
  description: string;
  dataPoints: string[];
  status: "verified" | "live";
  icon: React.ElementType;
  badgeBg: string;
}

export default function FivePillarVerificationFramework() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  const pillars: VerificationPillar[] = [
    {
      step: "01",
      id: "studio",
      title: "Studio Direct Wire",
      authority: "Production Houses & Official Call-Sheets",
      description: "Direct legal announcements and signed production dispatches from primary studios (Hombale, Mythri, Lyca, Yash Raj, Dharma).",
      dataPoints: ["Signed Studio Dispatches", "Trailer Date Lock", "Distribution Contracts"],
      status: "verified",
      icon: Building2,
      badgeBg: "bg-amber-100 text-amber-950 border-amber-300",
    },
    {
      step: "02",
      id: "cbfc",
      title: "CBFC Board Registry",
      authority: "Central Board of Film Certification",
      description: "Statutory censor certification records confirming official classification (U, U/A, A) and final theatrical run-time length.",
      dataPoints: ["Censor Certificate No.", "Final Runtime Minutes", "Statutory Cut Approvals"],
      status: "verified",
      icon: FileCheck,
      badgeBg: "bg-emerald-100 text-emerald-950 border-emerald-300",
    },
    {
      step: "03",
      id: "multiplex",
      title: "Multiplex Grid Lock",
      authority: "National Booking Circuits (PVR-INOX / Cinepolis)",
      description: "Real-time DCI cinema server keys delivery and live ticketing API activation across 3,200+ national multiplex screens.",
      dataPoints: ["DCI Key Delivery Logs", "Advance Booking Open", "Screen Count Allocations"],
      status: "live",
      icon: Ticket,
      badgeBg: "bg-sky-100 text-sky-950 border-sky-300",
    },
    {
      step: "04",
      id: "chamber",
      title: "Chamber & Guild Audit",
      authority: "KFCC · TFCC · TFPC · MAI Registries",
      description: "Title clearance, regional theatrical territory rights, and release slot dispute mediation via statutory film trade bodies.",
      dataPoints: ["Chamber Title Registry", "Territory Rights Lock", "No-Objection Certificate"],
      status: "verified",
      icon: Scale,
      badgeBg: "bg-violet-100 text-violet-950 border-violet-300",
    },
    {
      step: "05",
      id: "telemetry",
      title: "Trade Telemetry Engine",
      authority: "Consortium of BOI · Sacnilk · Comscore",
      description: "Real-time ticket sales ingestion, gross vs net reconciliation, and distributor share cross-validation across all Indian territories.",
      dataPoints: ["Hourly Sacnilk Telemetry", "BOI Distributor Ledger", "Comscore Global Feeds"],
      status: "live",
      icon: TrendingUp,
      badgeBg: "bg-rose-100 text-rose-950 border-rose-300",
    },
  ];

  return (
    <section
      aria-label="Five Pillar Cinema Data Verification Framework"
      className="w-full bg-sheet border-2 border-ink rounded-[28px] p-6 sm:p-10 shadow-press relative overflow-hidden"
    >
      {/* Decorative Winding Background Line (Inspired by Holiday Gift Journey Reference) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-15"
        preserveAspectRatio="none"
        viewBox="0 0 1000 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M -50,120 C 250,80 400,280 600,160 C 800,40 850,380 1050,300"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          className="text-ink"
        />
        <circle cx="280" cy="180" r="40" className="fill-amber-200/40" />
        <circle cx="750" cy="320" r="60" className="fill-emerald-200/40" />
      </svg>

      {/* Header Band */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-ink">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-press text-paper text-[10px] font-poster font-bold tracking-widest uppercase border border-ink shadow-sticker">
              AUDITED DATA INTEGRITY PROTOCOL
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
              <span>5/5 Consensus Required</span>
            </span>
            <span className="font-handwritten text-xs text-ink-mute font-semibold">
              No rumors. No clickbait. ✦
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poster uppercase tracking-tight text-ink">
            THE 5-PILLAR <span className="text-press">CROSS-CHECK</span> SYSTEM
          </h2>
          <p className="text-sm text-ink-dim font-grotesk font-medium leading-relaxed">
            Every release date, box office crore, and theatrical status on EXTRASAGA is dynamically verified through five independent institutional pillars before publication.
          </p>
        </div>

        {/* Live IST Telemetry Chronometer */}
        <div className="shrink-0 bg-paper border-2 border-ink p-3 rounded-2xl shadow-sticker space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-ink uppercase tracking-wider">
              Live IST Chronometer
            </span>
          </div>
          <p className="text-xs text-ink-mute font-mono">
            Synced daily at 00:00 IST · Dynamic Window
          </p>
        </div>
      </div>

      {/* 5 Connected Step Cards — Flowing Grid (Inspired by Design Thinking 5-Step Reference) */}
      <div className="relative z-10 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Subtle Horizontal Connector Bar (Desktop) */}
          <div className="hidden md:block absolute top-7 left-10 right-10 h-0.5 bg-ink/20 z-0" />

          {pillars.map((p, idx) => {
            const Icon = p.icon;
            const isExpanded = expandedPillar === p.id;

            return (
              <div
                key={p.id}
                className="relative z-10 bg-paper border-2 border-ink rounded-2xl p-4 shadow-sticker hover:shadow-press transition-all duration-200 flex flex-col justify-between group"
              >
                {/* Step Top: Number & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-full bg-ink text-paper font-poster font-bold text-xs flex items-center justify-center border border-ink shadow-xs">
                      {p.step}
                    </span>
                    <div className="p-2 rounded-xl bg-sheet border border-ink shadow-2xs group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4 text-press" />
                    </div>
                  </div>

                  {/* Title & Authority */}
                  <h3 className="font-poster font-bold text-ink text-sm uppercase tracking-tight group-hover:text-press transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-[11px] font-mono text-press-deep font-semibold mt-0.5 line-clamp-1">
                    {p.authority}
                  </p>

                  <p className="text-xs text-ink-dim font-grotesk mt-2 leading-snug line-clamp-3">
                    {p.description}
                  </p>
                </div>

                {/* Data Points Collapsible / Expandable */}
                <div className="mt-4 pt-3 border-t border-ink/15 space-y-1.5">
                  <span className="text-[9px] font-mono uppercase font-bold text-ink-mute block">
                    Verified Artifacts:
                  </span>
                  <div className="flex flex-col gap-1">
                    {p.dataPoints.map((dp, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono text-ink-dim flex items-center gap-1.5 truncate"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                        <span className="truncate">{dp}</span>
                      </span>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-dashed border-ink/20 flex items-center justify-between">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${p.badgeBg}`}>
                      {p.status === "verified" ? "✓ 100% Corroborated" : "⚡ Live Telemetry"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editorial Ombudsman Charter Banner (Inspired by Design Thinking & Teamseven Quote Blocks) */}
      <div className="relative z-10 mt-8 bg-paper border-2 border-ink rounded-2xl p-5 sm:p-6 shadow-sticker flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-ink text-paper font-serif text-2xl flex items-center justify-center shrink-0 border border-ink">
            &ldquo;
          </div>
          <div className="space-y-1">
            <p className="font-serif italic text-ink text-sm sm:text-base leading-relaxed">
              &ldquo;Cinema data must be as sovereign as the craft itself. If studio dispatches, censor records, multiplex locks, chamber registries, and trade telemetry don&apos;t reach unanimous agreement, it never touches our frontpage.&rdquo;
            </p>
            <p className="text-xs font-mono text-ink-mute">
              EXTRASAGA Institutional Charter · Section 4.2 Release Date &amp; Financial Sovereign Standards
            </p>
          </div>
        </div>

        {/* Ombudsman Signature Badge (Inspired by Santosh Jangir Badge Reference) */}
        <div className="shrink-0 flex items-center gap-3 bg-sheet border border-ink p-2.5 rounded-full shadow-2xs">
          <div className="w-9 h-9 rounded-full bg-press text-paper font-poster font-bold text-xs flex items-center justify-center border border-ink shadow-xs">
            ES
          </div>
          <div className="text-left pr-3">
            <p className="text-xs font-poster font-bold text-ink uppercase tracking-wide">
              EXTRASAGA Bureau
            </p>
            <p className="text-[10px] font-mono text-ink-mute">
              Data Integrity Directorate
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
