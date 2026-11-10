"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Film,
  Camera,
  TrendingUp,
  Award,
  Sparkles,
  Archive,
  ArrowUpRight,
  Flame,
  Star,
  Clapperboard,
  CheckCircle2,
} from "lucide-react";

type DepartmentTab =
  | "DISCOVER"
  | "THE SCREEN"
  | "THE STARS"
  | "THE BUZZ"
  | "THE BUSINESS"
  | "THE CRITICS"
  | "THE ARCHIVE";

interface ShowcaseCardItem {
  id: string;
  department: string;
  badge: string;
  badgeColor?: string;
  title: string;
  subtitle: string;
  image: string;
  metricLabel: string;
  metricValue: string;
  tag: string;
  href: string;
}

const DEPARTMENT_DATA: Record<DepartmentTab, ShowcaseCardItem[]> = {
  DISCOVER: [
    {
      id: "disc-1",
      department: "THE SCREEN",
      badge: "IN THEATRES NOW",
      badgeColor: "bg-press text-paper",
      title: "Pushpa 2: The Rule",
      subtitle: "Allu Arjun, Rashmika Mandanna • Dir. Sukumar",
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Active Theatrical Footprint",
      metricValue: "14,200+ Screens Nationwide",
      tag: "PAN-INDIA RELEASE",
      href: "/movies",
    },
    {
      id: "disc-2",
      department: "THE STARS",
      badge: "ARCHIVAL LEGEND",
      badgeColor: "bg-[#4F2BEF] text-paper",
      title: "Dr. Rajkumar & Cinema Titans",
      subtitle: "Photos of All Cinema Legends • Archival Rare Frames",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Permanent Preservation",
      metricValue: "208 Classics · Dadasaheb Phalke",
      tag: "THE CELLULOID VAULT",
      href: "/cinestars",
    },
    {
      id: "disc-3",
      department: "THE BUSINESS",
      badge: "TRADE TELEMETRY",
      badgeColor: "bg-[#F0B429] text-ink",
      title: "Ramayana: Monday Ledger Surge",
      subtitle: "Day 5 All-India Collections & PIC Chains Audit",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Audited Cumulative Gross",
      metricValue: "₹ 310.97 Cr (₹ 81.38 Cr Day 5)",
      tag: "RECEIPTS VERIFIED",
      href: "/box-office",
    },
    {
      id: "disc-4",
      department: "THE CRITICS",
      badge: "DUAL-AXIS VERDICT",
      badgeColor: "bg-emerald-600 text-paper",
      title: "Ramayana Part 1: Magnum Opus",
      subtitle: "Nitesh Tiwari • Ranbir Kapoor, Yash, Sai Pallavi",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Craft vs Story Score",
      metricValue: "4.5 / 5.0 ★ · 96% Craft",
      tag: "MUST WATCH IN IMAX",
      href: "/reviews",
    },
  ],

  "THE SCREEN": [
    {
      id: "screen-1",
      department: "THE SCREEN",
      badge: "NOW SHOWING",
      badgeColor: "bg-press text-paper",
      title: "Pushpa 2: The Rule",
      subtitle: "Mythri Movie Makers • Record 5-Language Release",
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Advance Booking Telemetry",
      metricValue: "₹ 115 Cr Pre-Sales Gross",
      tag: "DAY 1 HISTORIC",
      href: "/movies",
    },
    {
      id: "screen-2",
      department: "THE SCREEN",
      badge: "NOW SHOWING",
      badgeColor: "bg-press text-paper",
      title: "Ramayana: Part 1",
      subtitle: "Namit Malhotra & DNEG • Epic Indian Saga",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Worldwide Theatrical Run",
      metricValue: "Day 5 Active · 11,500 Screens",
      tag: "IMAX 3D / 2D",
      href: "/movies",
    },
    {
      id: "screen-3",
      department: "THE SCREEN",
      badge: "UPCOMING DEEP FOCUS",
      badgeColor: "bg-[#4F2BEF] text-paper",
      title: "Kantara: Chapter 1",
      subtitle: "Rishab Shetty & Hombale Films • Mythological Prequel",
      image:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Release Countdown",
      metricValue: "Releasing Oct 2026",
      tag: "SANDALWOOD OPUS",
      href: "/movies",
    },
    {
      id: "screen-4",
      department: "THE SCREEN",
      badge: "EPIC SCI-FI",
      badgeColor: "bg-[#F0B429] text-ink",
      title: "Kalki 2898 AD: The Saga Continues",
      subtitle: "Nag Ashwin • Prabhas, Amitabh Bachchan, Kamal Haasan",
      image:
        "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Theatrical Milestone",
      metricValue: "₹ 1,050 Cr Lifetime Gross",
      tag: "GLOBAL BENCHMARK",
      href: "/movies",
    },
  ],

  "THE STARS": [
    {
      id: "star-1",
      department: "THE STARS",
      badge: "CULTURAL ICON",
      badgeColor: "bg-press text-paper",
      title: "Dr. Rajkumar",
      subtitle: "Photos of All Cinema Legends • Sandalwood's Annavru",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Cinema Legacy",
      metricValue: "208 Masterworks · Padma Bhushan",
      tag: "DADASAHEB PHALKE",
      href: "/cinestars",
    },
    {
      id: "star-2",
      department: "THE STARS",
      badge: "LIVING LEGEND",
      badgeColor: "bg-[#4F2BEF] text-paper",
      title: "Amitabh Bachchan",
      subtitle: "The Shahenshah of Indian Cinema • 5 Decades of Brilliance",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Filmography Milestone",
      metricValue: "200+ Films · 4 National Awards",
      tag: "CINEMA MONARCH",
      href: "/cinestars",
    },
    {
      id: "star-3",
      department: "THE STARS",
      badge: "MAESTRO OF CRAFT",
      badgeColor: "bg-emerald-600 text-paper",
      title: "Kamal Haasan",
      subtitle: "Ulaganayagan • The Unmatched Chameleon of Screen Craft",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Artistic Innovation",
      metricValue: "6 Decades · 19 Filmfare Awards",
      tag: "THE SCREEN GENIUS",
      href: "/cinestars",
    },
    {
      id: "star-4",
      department: "THE STARS",
      badge: "PEOPLE'S EMPEROR",
      badgeColor: "bg-[#F0B429] text-ink",
      title: "N.T. Rama Rao",
      subtitle: "Viswa Vikhyatha Nata Sarvabhouma • Tollywood Patriarch",
      image:
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Legendary Archival Record",
      metricValue: "300+ Films · Mythological Deity",
      tag: "ARCHIVE TREASURE",
      href: "/cinestars",
    },
  ],

  "THE BUZZ": [
    {
      id: "buzz-1",
      department: "THE BUZZ",
      badge: "HYPOMETER #1",
      badgeColor: "bg-press text-paper",
      title: "Maatrubhumi",
      subtitle: "Aditya Dhar's High-Stakes Geopolitical Action Thriller",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Audience Anticipation",
      metricValue: "1,21,000+ Verified Interested",
      tag: "25 DAYS TO RELEASE",
      href: "/hypometer",
    },
    {
      id: "buzz-2",
      department: "THE BUZZ",
      badge: "CULT IN THE MAKING",
      badgeColor: "bg-[#4F2BEF] text-paper",
      title: "Toxic: A Fairy Tale for Grown-ups",
      subtitle: "Geetu Mohandas & Yash • High-Voltage Neo-Noir Drama",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Pan-India Hype Index",
      metricValue: "98/100 Resonance Rating",
      tag: "GLOBAL ANTICIPATION",
      href: "/hypometer",
    },
    {
      id: "buzz-3",
      department: "THE BUZZ",
      badge: "EXPLOSIVE TRACKER",
      badgeColor: "bg-[#F0B429] text-ink",
      title: "Spirit (Prabhas & Sandeep Vanga)",
      subtitle: "T-Series & Bhadrakali Pictures • Raw Cop Universe",
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Digital Conversation Share",
      metricValue: "4.8M Impressions / 24h",
      tag: "VIRAL SENSATION",
      href: "/hypometer",
    },
    {
      id: "buzz-4",
      department: "THE BUZZ",
      badge: "GLOBETROTTER",
      badgeColor: "bg-emerald-600 text-paper",
      title: "SSMB29 (SS Rajamouli & Mahesh Babu)",
      subtitle: "African Jungle Adventure on Unprecedented International Scale",
      image:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Global Pre-Buzz Score",
      metricValue: "Highest Tracked Project",
      tag: "RAJA MOULI VISION",
      href: "/hypometer",
    },
  ],

  "THE BUSINESS": [
    {
      id: "biz-1",
      department: "THE BUSINESS",
      badge: "ALL-TIME RECORD",
      badgeColor: "bg-press text-paper",
      title: "Dangal (2016)",
      subtitle: "Nitesh Tiwari • Aamir Khan • The Gold Standard",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Worldwide Gross Record",
      metricValue: "₹ 2,024 Cr (China Surge)",
      tag: "#1 HIGHEST GROSSING",
      href: "/box-office",
    },
    {
      id: "biz-2",
      department: "THE BUSINESS",
      badge: "BENCHMARK TITAN",
      badgeColor: "bg-[#4F2BEF] text-paper",
      title: "Baahubali 2: The Conclusion",
      subtitle: "S.S. Rajamouli • Prabhas, Rana Daggubati, Anushka",
      image:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Domestic India Net Record",
      metricValue: "₹ 1,810 Cr Worldwide",
      tag: "HISTORIC RUN",
      href: "/box-office",
    },
    {
      id: "biz-3",
      department: "THE BUSINESS",
      badge: "GLOBAL PHENOMENON",
      badgeColor: "bg-[#F0B429] text-ink",
      title: "RRR (Rise Roar Revolt)",
      subtitle: "S.S. Rajamouli • Ram Charan, Jr NTR • Oscar Winner",
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
      metricLabel: "International Gross",
      metricValue: "₹ 1,387 Cr Worldwide",
      tag: "OSCAR CERTIFIED",
      href: "/box-office",
    },
    {
      id: "biz-4",
      department: "THE BUSINESS",
      badge: "SANDALWOOD MONSTER",
      badgeColor: "bg-emerald-600 text-paper",
      title: "KGF Chapter 2",
      subtitle: "Prashanth Neel • Yash, Sanjay Dutt, Raveena Tandon",
      image:
        "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Single-Day India Net",
      metricValue: "₹ 1,250 Cr Worldwide",
      tag: "THE MONSTER HIT",
      href: "/box-office",
    },
  ],

  "THE CRITICS": [
    {
      id: "crit-1",
      department: "THE CRITICS",
      badge: "REVERENT AUDIT",
      badgeColor: "bg-press text-paper",
      title: "Ramayana: Part 1 — The Celluloid Testament",
      subtitle: "Nitesh Tiwari • The Definitive Retelling of the Epic",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Narrative & Craft Matrix",
      metricValue: "Story 92% · Visual Craft 96%",
      tag: "UNBIASED VERDICT",
      href: "/reviews",
    },
    {
      id: "crit-2",
      department: "THE CRITICS",
      badge: "MASTERWORK",
      badgeColor: "bg-[#4F2BEF] text-paper",
      title: "Kantara: The Folklore Resonance",
      subtitle: "Rishab Shetty • Where Divinity Meets Rooted Cinematography",
      image:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Critic Consensus",
      metricValue: "4.8 / 5.0 ★ · Cultural Masterpiece",
      tag: "PRESERVATION QUALITY",
      href: "/reviews",
    },
    {
      id: "crit-3",
      department: "THE CRITICS",
      badge: "TECHNICAL FEAT",
      badgeColor: "bg-[#F0B429] text-ink",
      title: "Kalki 2898 AD: Worldbuilding Audit",
      subtitle: "Nag Ashwin • The Convergence of Myth and Distant Future",
      image:
        "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Visual Engineering",
      metricValue: "Craft 95% · Worldbuilding 93%",
      tag: "AUDIOVISUAL SPECTACLE",
      href: "/reviews",
    },
    {
      id: "crit-4",
      department: "THE CRITICS",
      badge: "CHARACTER STUDY",
      badgeColor: "bg-emerald-600 text-paper",
      title: "Pushpa 2: The Fire & Performance",
      subtitle: "Sukumar • Allu Arjun's Ferocious Swag and Command",
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Performance Index",
      metricValue: "Allu Arjun 98% · Music 91%",
      tag: "RIVETING ENERGY",
      href: "/reviews",
    },
  ],

  "THE ARCHIVE": [
    {
      id: "arch-1",
      department: "THE ARCHIVE",
      badge: "MYTHOLOGICAL PEAK",
      badgeColor: "bg-press text-paper",
      title: "Mayabazar (1957)",
      subtitle: "K.V. Reddy • NTR, S.V. Ranga Rao, Savitri • Telugu & Tamil",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Cultural Standing",
      metricValue: "Voted India's Greatest Film (CNN-IBN)",
      tag: "IMMORTAL CELLULOID",
      href: "/archive",
    },
    {
      id: "arch-2",
      department: "THE ARCHIVE",
      badge: "MILESTONE CLASSIC",
      badgeColor: "bg-[#4F2BEF] text-paper",
      title: "Babruvahana (1977)",
      subtitle: "Hunsur Krishnamurthy • Dr. Rajkumar in Dual Glory",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Sandalwood Heritage",
      metricValue: "All-Time Golden Era Masterpiece",
      tag: "MONUMENTAL DIALOGUE",
      href: "/archive",
    },
    {
      id: "arch-3",
      department: "THE ARCHIVE",
      badge: "REVOLUTIONARY NOIR",
      badgeColor: "bg-[#F0B429] text-ink",
      title: "Nayakan (1987)",
      subtitle: "Mani Ratnam • Kamal Haasan • TIME's All-Time 100",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Global Recognition",
      metricValue: "TIME Magazine All-Time Top 100",
      tag: "CINEMATIC BENCHMARK",
      href: "/archive",
    },
    {
      id: "arch-4",
      department: "THE ARCHIVE",
      badge: "WESTERN MASALA",
      badgeColor: "bg-emerald-600 text-paper",
      title: "Sholay (1975)",
      subtitle: "Ramesh Sippy • Amitabh Bachchan, Dharmendra, Amjad Khan",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
      metricLabel: "Theatrical Endurance",
      metricValue: "5+ Continuous Years at Minerva",
      tag: "THE ICONIC EPIC",
      href: "/archive",
    },
  ],
};

const TABS: DepartmentTab[] = [
  "DISCOVER",
  "THE SCREEN",
  "THE STARS",
  "THE BUZZ",
  "THE BUSINESS",
  "THE CRITICS",
  "THE ARCHIVE",
];

export default function ExtraSaagaHeroShowcase() {
  const [activeTab, setActiveTab] = useState<DepartmentTab>("DISCOVER");

  const cards = DEPARTMENT_DATA[activeTab];

  return (
    <section
      aria-label="EXTRASAAGA Showcase"
      className="w-full pt-6 pb-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans"
    >
      {/* =========================================================================
          TOP MASTHEAD (Directly matching the sketch)
          - Left: PHOTOS OF ALL CINEMA LEGENDS
          - Center: EXTRASAAGA
          - Right: PHOTOS OF ALL CINEMA LEGENDS
          - Red horizontal dividing line below
      ========================================================================= */}
      <div className="flex flex-col items-center justify-between text-center pb-4 select-none">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 items-center gap-3 sm:gap-6 pb-3">
          {/* Left Kicker */}
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <span className="p-1.5 bg-sheet border border-press/30 text-press rounded-md shadow-sm">
              <Camera className="w-4 h-4" />
            </span>
            <div className="text-left">
              <span className="block text-[11px] sm:text-xs font-black tracking-widest uppercase text-ink font-mono-tabular">
                PHOTOS OF ALL CINEMA LEGENDS
              </span>
              <span className="block text-[10px] text-ink-dim uppercase tracking-wider font-semibold">
                Archival Vault · 1931–2026
              </span>
            </div>
          </div>

          {/* Center Title: EXTRASAAGA */}
          <div className="flex flex-col items-center justify-center">
            <Link
              href="/"
              className="inline-block group focus:outline-none focus-visible:ring-2 focus-visible:ring-press rounded-md"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase text-ink hover:text-press transition-colors duration-200">
                EXTRA<span className="text-press">SAAGA</span>
              </h1>
            </Link>
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-ink-dim uppercase mt-1">
              One Indian Cinema Industry · One Unified Platform
            </p>
          </div>

          {/* Right Kicker */}
          <div className="flex items-center justify-center md:justify-end gap-2.5">
            <div className="text-right hidden md:block">
              <span className="block text-[11px] sm:text-xs font-black tracking-widest uppercase text-ink font-mono-tabular">
                PHOTOS OF ALL CINEMA LEGENDS
              </span>
              <span className="block text-[10px] text-ink-dim uppercase tracking-wider font-semibold">
                10,000+ Celluloid Frames
              </span>
            </div>
            <span className="p-1.5 bg-sheet border border-press/30 text-press rounded-md shadow-sm">
              <Film className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Solid Red Divider Rule (matching the red horizontal line in sketch) */}
        <div
          className="w-full h-[2.5px] bg-press mt-2 mb-6 shadow-sm"
          role="separator"
        />
      </div>

      {/* =========================================================================
          FOLDER TAB BAR & OUTLINED CONTAINER (The red pen container from sketch)
      ========================================================================= */}
      <div className="w-full relative">
        {/* Navigation Tabs Bar */}
        <div className="flex items-end overflow-x-auto no-scrollbar gap-1.5 sm:gap-2 px-1 z-10 relative">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            const isDiscover = tab === "DISCOVER";

            if (isDiscover) {
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 rounded-t-xl shrink-0 ${
                    isActive
                      ? "border-t-2 border-l-2 border-r-2 border-press bg-sheet text-press z-20 shadow-[0_-4px_12px_rgba(224,58,47,0.08)] -mb-[2px] pb-[13px]"
                      : "border-t-2 border-l-2 border-r-2 border-line hover:border-press/60 bg-paper/60 text-ink hover:text-press z-0"
                  }`}
                >
                  <Sparkles
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                      isActive ? "text-press fill-press/20" : "text-ink-dim"
                    }`}
                  />
                  <span>{tab}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-press animate-ping ml-0.5" />
                  )}
                </button>
              );
            }

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 border-b-2 ${
                  isActive
                    ? "border-press text-press font-black bg-press/5 rounded-t-md"
                    : "border-transparent text-ink-dim hover:text-ink hover:border-press/40"
                }`}
              >
                <span>{tab}</span>
                {/* Red Underline Accent from Sketch */}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-press rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* The Outlined Red Container (from the sketch's red enclosing line) */}
        <div className="w-full bg-sheet border-2 border-press rounded-b-2xl rounded-tr-2xl p-4 sm:p-6 lg:p-7 shadow-xl relative overflow-hidden">
          {/* Subtle Background Halftone / Watermark Accent */}
          <div
            className="absolute top-0 right-0 w-96 h-96 bg-press/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"
            aria-hidden="true"
          />

          {/* Department Bar inside Container */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-line">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-press text-paper text-[10px] font-black uppercase tracking-widest rounded shadow-sm">
                ACTIVE SECTOR: {activeTab}
              </span>
              <span className="text-xs text-ink-dim font-medium hidden sm:inline">
                Verified Multi-Source Intelligence &amp; Celluloid Telemetry
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-ink">
              <CheckCircle2 className="w-4 h-4 text-press" />
              <span>Receipts Backed · 100% Independent</span>
            </div>
          </div>

          {/* =====================================================================
              THE 4 FEATURED CARDS GRID (Representing the 4 blue blocks in the sketch)
          ===================================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {cards.map((card, idx) => (
              <Link
                key={card.id}
                href={card.href}
                className="group relative flex flex-col justify-between bg-surface border border-line rounded-xl overflow-hidden hover:border-press/60 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Top Poster / Photo Plate */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-band">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded shadow-md ${
                        card.badgeColor || "bg-press text-paper"
                      }`}
                    >
                      {card.badge}
                    </span>
                  </div>

                  {/* Top Right Slot Indicator (1 to 4) */}
                  <div className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center text-[10px] font-mono font-black backdrop-blur-sm">
                    {idx + 1}
                  </div>

                  {/* Overlay Department Tag */}
                  <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between text-white">
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                      {card.tag}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-white/80 group-hover:text-press group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                {/* Card Body & Editorial Typography */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-press font-bold tracking-wider block">
                      {card.department}
                    </span>
                    <h3 className="text-base sm:text-lg font-black uppercase text-ink tracking-tight group-hover:text-press transition-colors line-clamp-2 mt-0.5 leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs text-ink-dim line-clamp-2 mt-1 leading-relaxed">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Data / Telemetry Box */}
                  <div className="pt-3 border-t border-line/70">
                    <span className="text-[10px] font-mono text-ink-mute uppercase tracking-wider block">
                      {card.metricLabel}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-ink font-mono-tabular block mt-0.5 text-press">
                      {card.metricValue}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Control / Quick Link Bar */}
          <div className="mt-6 pt-4 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-ink-dim font-medium">
              Click any category tab above to explore that department&apos;s full four-pillar spread.
            </span>
            <div className="flex items-center gap-4">
              <Link
                href="/cinestars"
                className="font-bold text-press hover:underline inline-flex items-center gap-1"
              >
                <span>View All Cinema Legends Archive</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-line">|</span>
              <Link
                href="/box-office"
                className="font-bold text-ink hover:text-press transition-colors inline-flex items-center gap-1"
              >
                <span>Live Box Office</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

