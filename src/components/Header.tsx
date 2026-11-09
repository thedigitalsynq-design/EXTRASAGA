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
  Tv,
  ShieldCheck,
  ChevronDown,
  Clapperboard,
  Archive,
  Sparkles,
  Zap,
} from "lucide-react";
import { MAIN_NAV_ITEMS, MainNavItem } from "@/lib/categories";
import { formatEditorialDate } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import CinephileDiscoveryModal from "@/components/CinephileDiscoveryModal";

export default function Header() {
  const pathname = usePathname();
  const { language, config, t, tCategory, localizeUrl } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDiscoveryModalOpen, setIsDiscoveryModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(formatEditorialDate(new Date().toISOString()));

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

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
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
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
    if (slug === "box-office" || href === "/box-office") {
      return pathname.startsWith("/box-office");
    }
    if (slug === "hypometer" || href === "/hypometer") {
      return pathname.startsWith("/hypometer");
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
    <header className="w-full text-ink relative z-50">
      {/* Top Utility Bar — the press ribbon */}
      <div className="bg-ink text-paper border-b-2 border-ink text-[11px] py-1.5 px-4 sm:px-6 relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 halftone-faint opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 relative">
          {/* Left: Date & Unified Desk Status */}
          <div className="flex items-center gap-3 text-paper/80">
            <span className="font-semibold text-marquee flex items-center gap-1.5 font-mono-tabular">
              {currentDate || "7 November 2026"}
            </span>
            <span className="text-paper/30 hidden md:inline">|</span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-paper/10 text-paper/90 border border-paper/15 text-[10px] font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-press animate-pulse" />
              Unified Indian Cinema Desk
            </span>
          </div>

          {/* Right: Quick Links & Admin */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={localizeUrl("/live")}
              className="flex items-center gap-1.5 text-press hover:text-marquee font-bold transition-colors text-[11px]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-press opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-press"></span>
              </span>
              <span className="font-poster tracking-[0.2em] text-paper hover:text-marquee">LIVE</span>
            </Link>
            <span className="text-paper/30 hidden sm:inline">•</span>
            <Link
              href={localizeUrl("/category/trending")}
              className="flex items-center gap-1 text-paper/70 hover:text-press font-medium transition-colors text-[11px]"
            >
              <TrendingUp className="w-3.5 h-3.5 text-press" />
              <span className="font-poster whitespace-nowrap">#Trending</span>
            </Link>
            <span className="text-paper/30">•</span>
            <Link
              href={localizeUrl("/ott")}
              className="flex items-center gap-1 text-paper/70 hover:text-paper font-medium transition-colors text-[11px]"
            >
              <Tv className="w-3.5 h-3.5 text-violet-soft" />
              <span className="whitespace-nowrap">{t("nav_ott")}</span>
            </Link>
            <span className="text-paper/30">•</span>
            <Link
              href={localizeUrl("/box-office")}
              className="text-paper/70 hover:text-marquee font-medium transition-colors text-[11px]"
            >
              <span className="whitespace-nowrap">{t("nav_boxoffice")}</span>
            </Link>
            <span className="text-paper/30 hidden sm:inline">•</span>
            <Link
              href={localizeUrl("/movies")}
              className="flex items-center gap-1 text-paper/70 hover:text-marquee font-medium transition-colors text-[11px]"
            >
              <Clapperboard className="w-3.5 h-3.5 text-marquee" />
              <span>{language === "en" ? "Now Showing" : tCategory("movies")}</span>
            </Link>
            <span className="text-paper/30 hidden md:inline">•</span>
            <Link
              href={localizeUrl("/archive")}
              className="text-paper/70 hover:text-violet-soft font-medium transition-colors hidden md:inline text-[11px]"
            >
              <span className="flex items-center gap-1">
                <Archive className="w-3 h-3 text-violet-soft" />
                <span>Archive</span>
              </span>
            </Link>
            <span className="text-paper/30 hidden md:inline">•</span>
            <Link
              href={localizeUrl("/cinestars")}
              className="hidden md:flex items-center gap-1 text-marquee hover:text-marquee-soft font-bold transition-colors text-[11px]"
            >
              <Zap className="w-3 h-3" />
              <span className="font-poster tracking-wider">CSTARS</span>
            </Link>
            <span className="text-paper/30">•</span>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-[10px] font-poster px-2.5 py-0.5 bg-marquee text-ink hover:bg-paper border border-ink shadow-xs font-bold tracking-wider uppercase transition-all rounded-xs"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>{t("nav_admin")}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Branding Bar — the poster masthead */}
      <div className="border-b-2 border-ink bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href={localizeUrl("/")} className="flex items-center gap-3.5 group">
            {/* The press block: poster red ink plate */}
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 bg-press border-2 border-ink shadow-press flex items-center justify-center -rotate-2 group-hover:rotate-0 transition-transform duration-300 shrink-0 rounded-xs">
              <Film className="w-5 h-5 sm:w-6 sm:h-6 text-paper" />
              <span className="absolute -bottom-1 -right-1.5 bg-marquee border-2 border-ink w-3.5 h-3.5 rounded-xs"></span>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl sm:text-3xl font-poster tracking-tight text-ink uppercase select-none leading-none">
                  EXTRA<span className="text-press">SAGA</span>
                </span>
                <span
                  className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] font-poster font-bold tracking-[0.16em] uppercase bg-ink text-paper rounded-full border border-ink shadow-xs select-none"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-press" />
                  All Indian Cinema
                </span>
              </div>
              <div className="text-[11px] text-ink-dim font-medium tracking-wide mt-1 flex items-center gap-2 line-clamp-1">
                <span className="font-poster font-bold text-ink uppercase tracking-wider text-[11px]">
                  Where Cinema Comes Alive
                </span>
                <span className="text-ink/30 hidden sm:inline">•</span>
                <span className="text-ink-mute font-medium hidden sm:inline">
                  Six film traditions united on one stage — authentic stories, fearless reviews, and the soul of the silver screen.
                </span>
              </div>
            </div>
          </Link>

          {/* Right Search Button & Cinephile Match Trigger */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Cinephile Vibe Match Trigger */}
            <button
              type="button"
              onClick={() => setIsDiscoveryModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-ink hover:bg-press text-paper text-xs font-poster font-bold tracking-wider uppercase border-2 border-ink shadow-sticker hover:shadow-press transition-all select-none active:scale-95 rounded-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-marquee" />
              <span>Vibe Match</span>
            </button>

            {/* Quick Search Trigger Pill */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 sm:px-3 sm:py-2 bg-sheet hover:bg-paper text-ink border-2 border-ink shadow-sticker hover:shadow-press transition-all flex items-center gap-2 text-xs rounded-xs group"
              aria-label={t("nav_search")}
            >
              <Search className="w-3.5 h-3.5 text-ink-dim group-hover:text-press transition-colors" />
              <span className="hidden sm:inline text-xs text-ink-dim font-medium group-hover:text-ink">{t("nav_search")}...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-mono-tabular bg-band text-ink-mute border border-ink/20 rounded">⌘K</kbd>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 bg-press text-paper border-2 border-ink shadow-sticker hover:shadow-press transition-all rounded-xs"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Search Overlay */}
      {isSearchOpen && (
        <div className="bg-band border-b-2 border-ink px-4 py-4 animate-print-roll">
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
                className="w-full bg-sheet border-2 border-ink shadow-sticker px-10 pr-4 py-2.5 text-sm text-ink placeholder-ink-mute focus:outline-none focus:shadow-press font-sans rounded-xs"
                autoFocus
              />
              <Search className="w-4 h-4 text-ink-dim absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="bg-press hover:bg-press-deep text-paper border-2 border-ink shadow-sticker hover:shadow-press px-5 py-2.5 text-sm font-poster font-bold uppercase tracking-wider transition-all rounded-xs"
            >
              {t("btn_search")}
            </button>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="p-2 border-2 border-ink bg-sheet text-ink-dim hover:text-ink rounded-xs"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
          {/* Quick Trending tags in search bar */}
          <div className="max-w-3xl mx-auto mt-3 flex items-center gap-2 flex-wrap text-[11px] text-ink-dim">
            <span className="font-poster tracking-wider uppercase text-ink bg-marquee px-2 py-0.5 border-2 border-ink shadow-sticker rounded-xs">
              #Hot right now
            </span>
            {config.hotTopics.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchQuery(tag);
                  window.location.href = `/search?q=${encodeURIComponent(tag)}`;
                }}
                className="bg-sheet hover:bg-ink hover:text-paper px-3 py-1 border-2 border-ink font-semibold transition-colors rounded-xs"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Navigation Bar — sleek editorial tabs */}
      <nav
        className={`w-full bg-band border-b-2 border-ink transition-all duration-300 ${
          isSticky
            ? "sticky top-0 z-50 bg-paper/95 backdrop-blur-md shadow-press"
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center overflow-x-auto no-scrollbar py-1.5">
            <div className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap min-w-max py-0.5">
              {MAIN_NAV_ITEMS.map((item) => {
                const isButton = item.isButton;
                const active = isItemActive(item.slug, item.href);
                const label = language === "en" ? item.englishLabel : tCategory(item.slug);

                if (isButton) {
                  return (
                    <Link
                      key={item.id}
                      href={localizeUrl(item.href)}
                      className={`px-3 py-1.5 text-xs font-poster font-bold uppercase tracking-wider transition-all select-none rounded-xs border-2 flex items-center gap-1.5 ${
                        active
                          ? "bg-press-deep text-paper border-ink shadow-press"
                          : "bg-press text-paper border-ink shadow-sticker hover:bg-press-deep hover:shadow-press"
                      }`}
                      title={item.englishLabel}
                    >
                      <Zap className="w-3 h-3 text-marquee fill-marquee" />
                      <span>{label}</span>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={localizeUrl(item.href)}
                    className={`px-3 py-1.5 text-xs sm:text-[13px] font-poster font-bold uppercase tracking-wider select-none rounded-xs transition-all border-2 ${
                      active
                        ? "bg-ink text-paper border-ink shadow-press"
                        : "text-ink/80 hover:text-ink hover:bg-paper/90 border-transparent hover:border-ink/20"
                    }`}
                    title={item.englishLabel}
                  >
                    <span>{label}</span>
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
            className="fixed inset-0 bg-ink/80"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-sheet border-r-2 border-ink h-full flex flex-col p-5 overflow-y-auto z-10 shadow-press-lg text-ink">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-ink">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-press border-2 border-ink shadow-sticker flex items-center justify-center -rotate-2 shrink-0 rounded-xs">
                  <Film className="w-4 h-4 text-paper" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-poster tracking-tight text-ink uppercase">
                      EXTRA<span className="text-press">SAGA</span>
                    </span>
                    <span
                      className="px-2 py-0.5 text-[9px] font-poster font-bold uppercase bg-ink text-paper rounded-full border border-ink"
                    >
                      All Cinema
                    </span>
                  </div>
                  <p className="text-[10px] text-ink-dim font-medium line-clamp-1 mt-0.5 flex items-center gap-1">
                    <span className="font-bold text-ink">Where Cinema Comes Alive</span>
                    <span className="text-ink/30">·</span>
                    <span className="text-ink-mute">Six Film Traditions</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 bg-band border-2 border-ink text-ink-dim hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Unified Platform Banner (Replaces Regional Switcher) */}
            <div className="py-2.5 px-3 border-b-2 border-ink bg-band">
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink font-poster font-bold">
                The Living Heart of Indian Cinema
              </p>
              <p className="text-[10px] text-ink-dim font-medium mt-0.5">
                Bollywood · Tollywood · Sandalwood · Kollywood · Mollywood · Regional Masters
              </p>
            </div>

            {/* Mobile Navigation Categories */}
            <div className="py-4 space-y-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-dim font-poster font-bold px-2 mb-2">
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
                    className={`flex items-center justify-between px-3 py-2.5 transition-colors border-2 ${
                      active
                        ? "bg-press text-paper font-bold border-ink shadow-sticker"
                        : "text-ink-dim hover:bg-band hover:text-ink border-transparent"
                    }`}
                  >
                    <span className="font-medium">{label}</span>
                    <span className="text-[10px] text-ink-mute font-poster uppercase tracking-wider group-hover:text-ink">
                      {item.englishLabel}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Admin Link */}
            <div className="mt-auto pt-4 border-t-2 border-ink">
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-marquee text-ink border-2 border-ink shadow-sticker hover:bg-marquee text-sm font-poster font-bold tracking-wider uppercase transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
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
