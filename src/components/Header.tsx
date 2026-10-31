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
} from "lucide-react";
import { CATEGORIES } from "@/data/mockData";
import { formatKannadaDate } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(formatKannadaDate(new Date().toISOString()));

    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="w-full bg-brand-black border-b border-brand-border text-white relative z-50">
      {/* Top Utility Bar */}
      <div className="bg-[#121316] border-b border-brand-border/60 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Date & Welcome */}
          <div className="flex items-center gap-3 text-brand-muted">
            <span className="font-medium text-gray-300">📅 {currentDate || "31 ಅಕ್ಟೋಬರ್ 2026"}</span>
            <span className="hidden sm:inline text-brand-border">•</span>
            <span className="hidden md:inline text-gray-400">
              ಕರ್ನಾಟಕದ ನಂ.1 ಸಿನಿಮಾ ಮತ್ತು ಮನರಂಜನಾ ಪೋರ್ಟಲ್
            </span>
          </div>

          {/* Right: Quick Links & Admin */}
          <div className="flex items-center gap-3">
            <Link
              href="/category/trending"
              className="flex items-center gap-1 text-brand-yellow hover:text-white transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5 text-brand-red animate-pulse" />
              <span>ಟ್ರೆಂಡಿಂಗ್</span>
            </Link>
            <span className="text-brand-border">•</span>
            <Link
              href="/ott"
              className="flex items-center gap-1 text-gray-300 hover:text-brand-red transition-colors"
            >
              <Tv className="w-3.5 h-3.5 text-sky-400" />
              <span>OTT</span>
            </Link>
            <span className="text-brand-border">•</span>
            <Link
              href="/box-office"
              className="text-gray-300 hover:text-brand-red transition-colors"
            >
              ಬಾಕ್ಸ್ ಆಫೀಸ್
            </Link>
            <span className="text-brand-border">•</span>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-brand-red/20 text-brand-red hover:bg-brand-red hover:text-white font-medium transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ಅಡ್ಮಿನ್</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-brand-red via-brand-crimson to-brand-darkred flex items-center justify-center shadow-lg shadow-brand-red/25 group-hover:scale-105 transition-transform">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-kannada text-white">
                ಸಿನಿ
              </span>
              <span className="text-2xl sm:text-3xl font-black font-kannada text-brand-red">
                ಕನ್ನಡ
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-brand-red/20 text-brand-red font-semibold uppercase tracking-wider ml-1 hidden sm:inline">
                CINEMA
              </span>
            </div>
            <p className="text-[11px] text-brand-muted tracking-wide font-kannada -mt-0.5">
              ಸ್ಯಾಂಡಲ್ವುಡ್ ಅಪ್ಡೇಟ್ಸ್ &middot; ವಿಮರ್ಶೆ &middot; ಗಾಸಿಪ್
            </p>
          </div>
        </Link>

        {/* Header Ad Slot (728x90 Leaderboard placeholder / responsive) */}
        <div className="hidden lg:flex items-center justify-center bg-brand-dark border border-dashed border-brand-border rounded-lg px-6 py-2.5 max-w-lg w-full text-center">
          <div className="text-center">
            <span className="text-[10px] text-brand-muted uppercase tracking-wider block">
              ಜಾಹೀರಾತು (Leaderboard 728x90)
            </span>
            <span className="text-xs text-gray-300 font-medium">
              ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 &middot; ಟಾಕ್ಸಿಕ್ &middot; ಮ್ಯಾಕ್ಸ್ ವಿಶೇಷ ಪ್ರಾಯೋಜಕತ್ವ
            </span>
          </div>
        </div>

        {/* Right Search Button & Mobile Toggle */}
        <div className="flex items-center gap-2">
          {/* Quick Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2.5 rounded-lg bg-brand-dark hover:bg-brand-card text-gray-300 hover:text-white border border-brand-border transition-colors flex items-center gap-2 text-sm"
            aria-label="ಹುಡುಕಿ"
          >
            <Search className="w-4 h-4 text-brand-red" />
            <span className="hidden md:inline text-xs text-brand-muted">ಹುಡುಕಿ (Search)...</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-lg bg-brand-dark hover:bg-brand-card text-gray-300 hover:text-white border border-brand-border transition-colors"
            aria-label="ಮೆನು"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Overlay */}
      {isSearchOpen && (
        <div className="bg-brand-dark border-y border-brand-border px-4 py-3 animate-fadeIn">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಹುಡುಕಿ (ಉದಾ: ಕಾಂತಾರ, ಯಶ್, ಸುದೀಪ್, OTT...)"
                className="w-full bg-brand-card border border-brand-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-brand-muted focus:outline-none focus:border-brand-red font-kannada"
                autoFocus
              />
              <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="bg-brand-red hover:bg-brand-crimson text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors font-kannada"
            >
              ಹುಡುಕಿ
            </button>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-brand-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
          {/* Quick Trending tags in search bar */}
          <div className="max-w-3xl mx-auto mt-2 flex items-center gap-2 flex-wrap text-xs text-brand-muted">
            <span className="font-semibold text-gray-300">ಹಾಟ್ ಟಾಪಿಕ್ಸ್:</span>
            {["ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1", "ಟಾಕ್ಸಿಕ್ ಯಶ್", "ಮ್ಯಾಕ್ಸ್ ಸುದೀಪ್", "ರುಕ್ಮಿಣಿ ವಸಂತ್", "ಬಘೀರ"].map(
              (tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag);
                    window.location.href = `/search?q=${encodeURIComponent(tag)}`;
                  }}
                  className="bg-brand-black hover:bg-brand-red/20 hover:text-brand-red px-2.5 py-1 rounded border border-brand-border/60 transition-colors"
                >
                  #{tag}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Sticky Category Navigation Bar */}
      <nav
        className={`w-full bg-brand-black/95 backdrop-blur-md border-y border-brand-border transition-all duration-300 ${
          isSticky ? "sticky top-0 z-50 shadow-2xl shadow-black/80" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center space-x-1 sm:space-x-1.5 whitespace-nowrap min-w-max">
              {CATEGORIES.map((cat) => {
                const href = cat.slug === "mukhaputa" ? "/" : `/category/${cat.slug}`;
                const isActive =
                  cat.slug === "mukhaputa" ? pathname === "/" : pathname === `/category/${cat.slug}`;

                return (
                  <Link
                    key={cat.id}
                    href={href}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium font-kannada transition-all rounded-md relative flex items-center gap-1 ${
                      isActive
                        ? "bg-brand-red text-white font-bold shadow-md shadow-brand-red/30"
                        : "text-gray-300 hover:text-white hover:bg-brand-dark"
                    }`}
                  >
                    {cat.name}
                    {cat.slug === "reviews" && (
                      <span className="text-[10px] bg-brand-yellow/20 text-brand-yellow px-1 py-0.2 rounded font-sans">
                        ★
                      </span>
                    )}
                    {cat.slug === "box-office" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-brand-dark border-r border-brand-border h-full flex flex-col p-5 overflow-y-auto z-10">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-brand-red flex items-center justify-center text-white">
                  <Film className="w-4 h-4" />
                </div>
                <span className="text-xl font-bold font-kannada">ಸಿನಿ ಕನ್ನಡ</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-brand-black text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="py-4 space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-brand-muted font-semibold px-2 mb-2">
                ವಿಭಾಗಗಳು (Categories)
              </p>
              {CATEGORIES.map((cat) => {
                const href = cat.slug === "mukhaputa" ? "/" : `/category/${cat.slug}`;
                const isActive =
                  cat.slug === "mukhaputa" ? pathname === "/" : pathname === `/category/${cat.slug}`;

                return (
                  <Link
                    key={cat.id}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-kannada transition-colors ${
                      isActive
                        ? "bg-brand-red text-white font-bold"
                        : "text-gray-300 hover:bg-brand-card hover:text-white"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-brand-muted font-sans">{cat.englishName}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Admin Link */}
            <div className="mt-auto pt-4 border-t border-brand-border">
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-card hover:bg-brand-red text-white rounded-lg text-sm font-kannada transition-colors border border-brand-border"
              >
                <ShieldCheck className="w-4 h-4 text-brand-red" />
                <span>ಅಡ್ಮಿನ್ ಲಾಗಿನ್ (Admin Panel)</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
