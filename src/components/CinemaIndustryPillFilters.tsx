"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Globe, ChevronRight } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  count: string;
  color: string;
  activeColor: string;
  image?: string;
  icon?: React.ElementType;
}

interface CinemaIndustryPillFiltersProps {
  activeIndustry?: string;
  onSelectIndustry?: (industryId: string) => void;
}

export default function CinemaIndustryPillFilters({
  activeIndustry = "all",
  onSelectIndustry,
}: CinemaIndustryPillFiltersProps) {
  const [selected, setSelected] = useState<string>(activeIndustry);

  const filters: FilterOption[] = [
    {
      id: "all",
      label: "All Traditions",
      count: "1,840+",
      color: "bg-[#E2F952] text-[#17140F]", // Neon Lime-Yellow
      activeColor: "bg-[#D4ED30] text-[#17140F] ring-2 ring-ink ring-offset-2",
      icon: Sparkles,
    },
    {
      id: "bollywood",
      label: "Bollywood",
      count: "540+",
      color: "bg-[#FFAAA6] text-[#17140F]", // Muted Pink
      activeColor: "bg-[#FF9690] text-[#17140F] ring-2 ring-ink ring-offset-2",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: "tollywood",
      label: "Tollywood",
      count: "420+",
      color: "bg-[#F79D65] text-[#17140F]", // Vibrant Apricot Orange
      activeColor: "bg-[#F58D4D] text-[#17140F] ring-2 ring-ink ring-offset-2",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: "kollywood",
      label: "Kollywood",
      count: "380+",
      color: "bg-[#CBB2FE] text-[#17140F]", // Lavender
      activeColor: "bg-[#B89CF5] text-[#17140F] ring-2 ring-ink ring-offset-2",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: "mollywood",
      label: "Mollywood",
      count: "260+",
      color: "bg-[#D4EDDA] text-[#17140F]", // Soft Lime / Sage
      activeColor: "bg-[#BFDFCA] text-[#17140F] ring-2 ring-ink ring-offset-2",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: "sandalwood",
      label: "Sandalwood",
      count: "240+",
      color: "bg-[#FFE082] text-[#17140F]", // Buttercup Warm Yellow
      activeColor: "bg-[#FFD54F] text-[#17140F] ring-2 ring-ink ring-offset-2",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: "global",
      label: "Pan-India & Global",
      count: "Worldwide",
      color: "bg-sheet text-ink", // Stark Off-White
      activeColor: "bg-band text-ink ring-2 ring-ink ring-offset-2",
      icon: Globe,
    },
  ];

  const handleSelect = (id: string) => {
    setSelected(id);
    if (onSelectIndustry) {
      onSelectIndustry(id);
    }
  };

  return (
    <section aria-label="Cinema Industry Category Filters" className="w-full py-4">
      {/* Editorial Category Label with Subtle Connecting Line Motif */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 text-xs font-poster uppercase tracking-wider text-ink font-bold">
          <span className="w-2 h-2 rounded-full bg-press" />
          <span>FILTER BY FILM TRADITION</span>
          <span className="text-ink/40 hidden sm:inline">·</span>
          <span className="text-[11px] font-mono font-medium text-ink-dim hidden sm:inline">
            6 Industries, One Cinema Canvas
          </span>
        </div>
        <span className="text-[11px] font-mono text-ink-dim hidden md:inline">
          Click any pill to curate your frontpage
        </span>
      </div>

      {/* Horizontally Scrollable Pills Bar */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2 px-1">
        {filters.map((filter) => {
          const isSelected = selected === filter.id;
          const Icon = filter.icon;

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => handleSelect(filter.id)}
              className={`group flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border-2 border-ink text-xs sm:text-sm font-poster uppercase font-bold tracking-wide whitespace-nowrap shadow-sticker transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                filter.color
              } ${isSelected ? filter.activeColor + " shadow-press scale-105" : "hover:shadow-press"}`}
            >
              {/* Creatively embedded thumbnail if available */}
              {filter.image ? (
                <span className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden shrink-0 border border-ink/40 group-hover:scale-110 transition-transform">
                  <Image
                    src={filter.image}
                    alt={filter.label}
                    fill
                    className="object-cover"
                  />
                </span>
              ) : Icon ? (
                <Icon className="w-4 h-4 shrink-0 text-ink group-hover:rotate-12 transition-transform" />
              ) : null}

              <span>{filter.label}</span>

              {/* Pill count badge */}
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-ink/10 text-ink/80 group-hover:bg-ink group-hover:text-paper transition-colors">
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
