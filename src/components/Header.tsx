"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Film,
  TrendingUp,
  Share2,
  Tv,
  Camera,
  PlaySquare,
  ShieldCheck,
  ChevronDown,
  Clapperboard,
  Archive,
  Sparkles,
} from "lucide-react";
import { CATEGORIES, MAIN_NAV_ITEMS, MainNavItem } from "@/lib/categories";
import { formatKannadaDate } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import CinephileDiscoveryModal from "@/components/CinephileDiscoveryModal";

export default function Header() {
  const pathname = usePathname();
  const { language, setLanguage, config, languages, t, tCategory, localizeUrl } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isDiscoveryModalOpen, setIsDiscoveryModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(formatKannadaDate(new Date().toISOString()));

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsSticky(window.scrollY > 120);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const isItemActive = (slug: string, href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/movies") {
      return pathname.startsWith("/movies");
    }
    if (slug === "latest" || slug === "news") {
      return pathname === "/category/latest" || pathname.startsWith("/news");
    }
    if (slug === "reviews") {
      return pathname === "/category/reviews" || pathname.startsWith("/reviews");
    }
    if (slug === "television" || slug === "tv") {
      return pathname === "/category/television" || pathname.startsWith("/ott");
    }
    if (slug === "celebrity") {
      return (
        pathname === "/category/celebrity" ||
        pathname === "/category/actors" ||
        pathname === "/category/actresses"
      );
    }
    if (slug === "interviews") {
      return pathname === "/category/interviews";
    }
    if (slug === "gossip") {
      return pathname === "/category/gossip";
    }
    if (slug === "gallery" || slug === "photos") {
      return pathname === "/category/gallery";
    }
    if (slug === "videos") {
      return pathname === "/category/videos";
    }
    if (slug === "events") {
      return pathname === "/category/events";
    }
    if (slug === "trending") {
      return pathname === "/category/trending";
    }
    return pathname === href || pathname === `/category/${slug}`;
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-[#E5EBE7] text-[#0F3529] relative z-50 shadow-xs">
      {/* Top Utility Bar (Jade Horizon Reference) */}
      <div className="bg-[#F8FAF9] border-b border-[#E5EBE7] text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Date & Status */}
          <div className="flex items-center gap-3 text-gray-600">
            <span className="font-semibold text-[#1A5140] flex items-center gap-1.5">
              <span>📅</span> {currentDate || "7 November 2026"}
            </span>
            <span className="text-gray-300 hidden md:inline">|</span>
            <span className="text-[11px] font-sans text-[#288760] hidden md:inline-flex items-center gap-1.5 bg-[#E8F8EB] px-2.5 py-0.5 rounded-full border border-[#B7E5BA] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#288760] animate-pulse"></span>
              ONE INDIAN CINEMA INDUSTRY • ONE UNIFIED PLATFORM
            </span>
          </div>

          {/* Right: Quick Links, Language Switcher & Admin */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Interactive Language & Industry Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#E8F8EB] text-xs font-semibold border border-[#E5EBE7] text-[#1A5140] transition-all shadow-2xs"
                aria-label="ಭಾಷೆ / ಚಿತ್ರರಂಗ ಆಯ್ಕೆ"
              >
                <Globe className="w-3.5 h-3.5 text-[#288760]" />
                <span className="font-bold">{config.name}</span>
                <span className="text-[10px] text-[#288760] font-sans uppercase font-bold hidden sm:inline">
                  ({config.industryName})
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-1 w-64 rounded-2xl bg-white border border-[#E5EBE7] shadow-xl py-2 z-50 animate-fadeIn">
                  <div className="px-3.5 py-1.5 text-[10px] uppercase font-bold text-gray-400 tracking-wider border-b border-gray-100">
                    {t("nav_select_industry")}
                  </div>
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setLanguage(item.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors ${
                        language === item.code
                          ? "bg-[#288760] text-white font-bold"
                          : "text-gray-700 hover:bg-[#E8F8EB] hover:text-[#1A5140]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.flagEmoji}</span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-sans uppercase font-bold ${
                          language === item.code ? "bg-white/20 text-white" : "text-gray-600 bg-gray-100"
                        }`}
                      >
                        {item.industryName}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-gray-300 hidden sm:inline">•</span>
            <Link
              href={localizeUrl("/live")}
              className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-bold transition-colors text-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="font-black text-[11px] font-sans tracking-wider">LIVE</span>
            </Link>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <Link
              href={localizeUrl("/category/trending")}
              className="flex items-center gap-1 text-emerald-800 hover:text-[#288760] font-medium transition-colors text-xs"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#288760] animate-pulse" />
              <span>{t("nav_trending")}</span>
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href={localizeUrl("/ott")}
              className="flex items-center gap-1 text-gray-700 hover:text-[#288760] font-medium transition-colors text-xs"
            >
              <Tv className="w-3.5 h-3.5 text-sky-600" />
              <span>{t("nav_ott")}</span>
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href={localizeUrl("/box-office")}
              className="text-gray-700 hover:text-[#288760] font-medium transition-colors text-xs"
            >
              {t("nav_boxoffice")}
            </Link>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <Link
              href={localizeUrl("/movies")}
              className="flex items-center gap-1 text-[#1A5140] hover:text-[#288760] font-medium transition-colors text-xs"
            >
              <Clapperboard className="w-3.5 h-3.5 text-[#288760]" />
              <span>ಬಿಡುಗಡೆ (Releases)</span>
            </Link>
            <span className="text-gray-300 hidden md:inline">•</span>
            <Link
              href={localizeUrl("/archive")}
              className="text-gray-700 hover:text-cyan-700 font-medium transition-colors hidden md:inline text-xs"
            >
              <span className="flex items-center gap-1">
                <Archive className="w-3 h-3 text-cyan-600" />
                <span>ಆರ್ಕೈವ್</span>
              </span>
            </Link>
            <span className="text-gray-300 hidden md:inline">•</span>
            <Link
              href={localizeUrl("/cinestars")}
              className="hidden md:flex items-center gap-1 text-[#288760] hover:text-[#1A5140] font-black transition-colors text-xs"
            >
              <span>⭐</span>
              <span>CineStar</span>
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-[#E8F8EB] text-[#1A5140] hover:bg-[#288760] hover:text-white font-bold transition-all border border-[#B7E5BA]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#288760]" />
              <span>{t("nav_admin")}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Branding Bar (Floating Island Style - Reference Image 3) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={localizeUrl("/")} className="flex items-center gap-3.5 group">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#1A5140] flex items-center justify-center shadow-md shadow-emerald-950/15 group-hover:bg-[#288760] transition-all duration-300 shrink-0">
            <Film className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#28D070] border-2 border-white animate-pulse"></span>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tight font-sans text-[#0F3529] uppercase select-none">
                EXTRA
              </span>
              <span className="text-2xl sm:text-3xl font-black tracking-tight font-sans text-[#288760] uppercase select-none">
                SAGA
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-sans font-bold tracking-wider uppercase bg-[#E8F8EB] text-[#1A5140] border border-[#B7E5BA] shadow-2xs select-none"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#288760] animate-pulse"></span>
                ONE INDIAN CINEMA
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium tracking-wide mt-0.5 flex items-center gap-1.5 line-clamp-1">
              <span className="font-bold text-[#1A5140]">
                EXTRASAGA
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-600 font-medium">
                Different Languages. Different Cultures. One Platform.
              </span>
            </p>
          </div>
        </Link>

        {/* Right Search Button & Cinephile Match Trigger */}
        <div className="flex items-center gap-2.5">
          {/* Cinephile Vibe Match Luxury Trigger (Reference Image 3 CTA Button) */}
          <button
            type="button"
            onClick={() => setIsDiscoveryModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#288760] hover:bg-[#1A5140] text-white text-xs font-bold shadow-md shadow-emerald-900/15 transition-all select-none active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B7E5BA] group-hover:rotate-12 transition-transform" />
            <span>Cinephile Match</span>
          </button>

          {/* Quick Search Trigger Pill */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 sm:px-3.5 sm:py-2 rounded-full bg-[#F3F7F5] hover:bg-white text-gray-700 hover:text-[#0F3529] border border-[#E5EBE7] hover:border-[#288760] transition-all flex items-center gap-2 text-sm shadow-2xs"
            aria-label={t("nav_search")}
          >
            <Search className="w-4 h-4 text-[#288760]" />
            <span className="hidden sm:inline text-xs text-gray-500 font-medium">{t("nav_search")}...</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-950 border border-gray-200 transition-colors"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Overlay */}
      {isSearchOpen && (
        <div className="bg-[#F8FAF9] border-y border-[#E5EBE7] px-4 py-3 animate-fadeIn">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("nav_search_placeholder")}
                className="w-full bg-white border border-[#E5EBE7] rounded-full pl-10 pr-4 py-2.5 text-sm text-[#0F3529] placeholder-gray-400 focus:outline-none focus:border-[#288760] focus:ring-1 focus:ring-[#288760] font-sans shadow-2xs"
                autoFocus
              />
              <Search className="w-4 h-4 text-[#288760] absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="bg-[#288760] hover:bg-[#1A5140] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors font-sans shadow-sm"
            >
              {t("btn_search")}
            </button>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
          {/* Quick Trending tags in search bar */}
          <div className="max-w-3xl mx-auto mt-2 flex items-center gap-2 flex-wrap text-xs text-gray-500">
            <span className="font-semibold text-[#1A5140]">{t("nav_hot_topics")}</span>
            {config.hotTopics.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchQuery(tag);
                  window.location.href = `/search?q=${encodeURIComponent(tag)}&lang=${language}`;
                }}
                className="bg-white hover:bg-[#E8F8EB] hover:text-[#1A5140] px-3 py-1 rounded-full border border-[#E5EBE7] text-gray-700 font-medium transition-colors shadow-2xs"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Navigation Bar (Jade Horizon Reference) */}
      <nav
        className={`w-full bg-[#FAFCFB] border-y border-[#E5EBE7] transition-all duration-300 ${
          isSticky ? "sticky top-0 z-50 shadow-md bg-white/95 backdrop-blur-md" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          <div className="flex items-center overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-1.5 whitespace-nowrap min-w-max py-1">
              {MAIN_NAV_ITEMS.map((item) => {
                const isButton = item.isButton;
                const active = isItemActive(item.slug, item.href);
                const label = language === "en" ? item.englishLabel : tCategory(item.slug);

                if (isButton) {
                  return (
                    <Link
                      key={item.id}
                      href={localizeUrl(item.href)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs select-none ${
                        active
                          ? "bg-[#288760] text-white"
                          : "bg-white hover:bg-[#E8F8EB] text-[#1A5140] border border-[#E5EBE7]"
                      }`}
                      title={item.englishLabel}
                    >
                      <span>{label}</span>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={localizeUrl(item.href)}
                    className={`px-3.5 py-1.5 text-xs sm:text-[13px] font-bold rounded-full transition-all select-none ${
                      active
                        ? "bg-[#288760] text-white shadow-xs"
                        : "text-[#1A5140] hover:bg-[#E8F8EB] hover:text-[#0F3529]"
                    }`}
                    title={item.englishLabel}
                  >
                    <span>{label}</span>
                    {item.slug === "reviews" && (
                      <span className="ml-1 text-[10px] text-amber-500 font-sans hidden md:inline">
                        ★
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white border-r border-[#E5EBE7] h-full flex flex-col p-5 overflow-y-auto z-10 shadow-2xl text-[#0F3529]">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5EBE7]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#1A5140] flex items-center justify-center text-white shadow-md shrink-0">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-black font-sans tracking-tight text-[#0F3529] uppercase">
                      CINI <span className="text-[#288760]">JAATRE</span>
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] font-sans font-bold uppercase bg-[#E8F8EB] text-[#1A5140] border border-[#B7E5BA]"
                    >
                      {config.industryName}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium line-clamp-1 mt-0.5 flex items-center gap-1">
                    <span className={language === "kn" ? "font-hubballi font-bold text-[#1A5140]" : "font-semibold text-[#1A5140]"}>
                      {config.brandNameNative}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className={language === "kn" ? "font-hubballi font-bold text-gray-500" : "text-gray-500"}>
                      {config.headerTagline}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Language Selector */}
            <div className="py-3 border-b border-gray-200">
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold px-2 mb-2">
                {t("nav_select_industry")}
              </p>
              <div className="grid grid-cols-2 gap-1.5 px-1">
                {languages.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLanguage(item.code);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-bold transition-all ${
                      language === item.code
                        ? "bg-[#A92732] text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span>{item.flagEmoji}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Navigation Categories */}
            <div className="py-4 space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold px-2 mb-2">
                {t("nav_categories")}
              </p>
              {MAIN_NAV_ITEMS.map((item) => {
                const active = isItemActive(item.slug, item.href);
                const label = language === "en" ? item.englishLabel : tCategory(item.slug);

                return (
                  <Link
                    key={item.id}
                    href={localizeUrl(item.href)}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-[#A92732] text-white font-bold shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <span className="font-medium">{label}</span>
                    <span className="text-xs text-gray-400 font-sans">{item.englishLabel}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Admin Link */}
            <div className="mt-auto pt-4 border-t border-gray-200">
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 hover:bg-[#A92732] text-gray-800 hover:text-white rounded-lg text-sm font-sans font-semibold transition-colors border border-gray-200"
              >
                <ShieldCheck className="w-4 h-4 text-brand-crimson" />
                <span>{t("nav_admin")}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Cinephile Discovery Quiz Modal (Accessible from Header) */}
      <CinephileDiscoveryModal
        isOpen={isDiscoveryModalOpen}
        onClose={() => setIsDiscoveryModalOpen(false)}
      />
    </header>
  );
}

