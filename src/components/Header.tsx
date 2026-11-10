"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBoxOfficeDropdownOpen, setIsBoxOfficeDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("fd_theme");
      if (storedTheme === "light" || storedTheme === "dark") {
        setTheme(storedTheme);
        document.documentElement.setAttribute("data-theme", storedTheme);
      }
    } catch (e) {
      console.warn("Theme load error", e);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !/input|textarea|select/i.test((document.activeElement || {}).tagName || "")) {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMenuOpen(false);
        setIsBoxOfficeDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("fd_theme", nextTheme);
    } catch (e) {
      console.warn("Theme save error", e);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={`site-head ${isMenuOpen ? "open" : ""}`} id="site-head">
      <div className="wrap">
        <Link className="brand" href="/" aria-label="EXTRA-SAAGA">
          EXTRA-<span>SAAGA</span>
        </Link>

        {/* Theme switcher toggle button */}
        <button
          className="theme-btn"
          type="button"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title="Light / dark mode"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <svg
              className="sun"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg
              className="moon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>

        {/* Main Navigation */}
        <nav className="nav" aria-label="Main">
          <Link
            href="/movies"
            aria-current={pathname.startsWith("/movies") ? "page" : undefined}
            onClick={() => setIsMenuOpen(false)}
          >
            The Screen
          </Link>
          <Link
            href="/cinestars"
            aria-current={pathname.startsWith("/cinestars") ? "page" : undefined}
            onClick={() => setIsMenuOpen(false)}
          >
            The Stars
          </Link>
          <Link
            href="/hypometer"
            aria-current={pathname === "/hypometer" ? "page" : undefined}
            onClick={() => setIsMenuOpen(false)}
          >
            The Buzz
          </Link>

          {/* The Business (Box Office Dropdown) */}
          <div
            className={`dd ${isBoxOfficeDropdownOpen ? "open" : ""}`}
            ref={dropdownRef}
            onMouseEnter={() => setIsBoxOfficeDropdownOpen(true)}
            onMouseLeave={() => setIsBoxOfficeDropdownOpen(false)}
          >
            <button
              className="dd-top"
              type="button"
              aria-expanded={isBoxOfficeDropdownOpen}
              onClick={() => setIsBoxOfficeDropdownOpen(!isBoxOfficeDropdownOpen)}
              data-current={pathname.startsWith("/box-office") ? "true" : undefined}
            >
              <span>The Business</span>
              <span className="caret">▼</span>
            </button>
            <div className="dd-menu">
              <Link
                href="/box-office"
                onClick={() => {
                  setIsBoxOfficeDropdownOpen(false);
                  setIsMenuOpen(false);
                }}
              >
                2026 box office
              </Link>
              <Link
                href="/box-office"
                onClick={() => {
                  setIsBoxOfficeDropdownOpen(false);
                  setIsMenuOpen(false);
                }}
              >
                All-time records
              </Link>
              <Link
                href="/box-office"
                onClick={() => {
                  setIsBoxOfficeDropdownOpen(false);
                  setIsMenuOpen(false);
                }}
              >
                Compare films
              </Link>
            </div>
          </div>

          <Link
            href="/reviews"
            aria-current={pathname.startsWith("/reviews") ? "page" : undefined}
            onClick={() => setIsMenuOpen(false)}
          >
            The Critics
          </Link>
          <Link
            href="/archive"
            aria-current={pathname.startsWith("/archive") ? "page" : undefined}
            onClick={() => setIsMenuOpen(false)}
          >
            The Archive
          </Link>
        </nav>

        {/* Search trigger button */}
        <button
          className="search-btn"
          type="button"
          aria-expanded={isSearchOpen}
          aria-label="Open search"
          onClick={() => {
            setIsSearchOpen(!isSearchOpen);
            if (!isSearchOpen) {
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span>Search</span>
        </button>

        {/* Mobile menu hamburger toggle */}
        <button
          className="menu-btn"
          type="button"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="bars" />
          <span className="mb-label">{isMenuOpen ? "Close" : "Menu"}</span>
        </button>
      </div>

      {/* Slide-out Search Form */}
      {isSearchOpen && (
        <form
          id="site-search"
          className="site-search"
          role="search"
          onSubmit={handleSearchSubmit}
        >
          <div className="wrap">
            <input
              ref={searchInputRef}
              id="ss-q"
              name="q"
              type="search"
              placeholder="Search films, actors, directors, years…"
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      )}
    </header>
  );
}
