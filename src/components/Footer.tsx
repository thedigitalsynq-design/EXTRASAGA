"use client";

import React from "react";
import Link from "next/link";
import { Film, Send, ShieldCheck, BadgeCheck } from "lucide-react";
import { CATEGORIES } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { language, config, t, tCategory, localizeUrl } = useLanguage();

  return (
    <footer className="w-full bg-ink text-paper border-t-2 border-ink mt-16 pt-14 pb-10 relative overflow-hidden">
      {/* Halftone plate on the colophon */}
      <div aria-hidden="true" className="absolute inset-0 halftone-faint opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b-2 border-dashed border-paper/30">
          {/* Col 1 & 2: Branding & About */}
          <div className="lg:col-span-2 space-y-5">
            <Link href={localizeUrl("/")} className="flex items-center gap-3 group w-fit">
              <div className="w-11 h-11 bg-press border-2 border-paper shadow-sticker flex items-center justify-center -rotate-3 group-hover:rotate-2 transition-transform shrink-0">
                <Film className="w-5 h-5 text-paper" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-poster text-paper tracking-tight select-none leading-none">
                    EXTRA<span className="text-marquee">SAGA</span>
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-poster font-bold uppercase tracking-wider bg-violet text-paper border-2 border-paper rotate-1">
                    ONE UNIFIED PLATFORM
                  </span>
                </div>
                <p className="text-[10px] text-paper/60 font-poster tracking-[0.2em] uppercase mt-1 flex items-center gap-1.5">
                  <span className="font-bold text-marquee">House Full</span>
                  <span className="text-paper/30">·</span>
                  <span>All Indian Cinema. One Screen.</span>
                </p>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-paper/70 leading-relaxed max-w-sm">
              EXTRASAGA is the unified home for Indian cinema lovers everywhere. From Mumbai studios and Hyderabad soundstages to Bengaluru backlots and Kerala landscapes, we bring you receipt-backed box office truth, fearless reviews, and the timeless magic of the silver screen — honest, independent, and proudly in English.
            </p>

            <div className="pt-1">
              <span className="text-[10px] font-poster font-bold uppercase tracking-[0.2em] text-paper block mb-2.5">
                {t("footer_telegram_whatsapp")}
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-paper text-ink hover:bg-marquee border-2 border-paper text-xs font-poster font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t("footer_telegram")}</span>
                </a>
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-transparent text-paper hover:bg-paper hover:text-ink border-2 border-paper text-xs font-poster font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <span>{t("footer_whatsapp")}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Categories 1 */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-poster text-paper uppercase tracking-widest mb-4">
              <span className="inline-block w-4 h-4 bg-press border-2 border-paper -rotate-3" />
              {t("footer_quick_links")}
            </h4>
            <ul className="space-y-2.5 text-xs text-paper/70">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={localizeUrl(cat.slug === "mukhaputa" ? "/" : `/category/${cat.slug}`)}
                    className="hover:text-marquee transition-colors block py-0.5 font-medium"
                  >
                    {tCategory(cat.slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Categories 2 */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-poster text-paper uppercase tracking-widest mb-4">
              <span className="inline-block w-4 h-4 bg-violet border-2 border-paper rotate-2" />
              {t("footer_cinema_industries")}
            </h4>
            <ul className="space-y-2.5 text-xs text-paper/70">
              {CATEGORIES.slice(6, 12).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={localizeUrl(`/category/${cat.slug}`)}
                    className="hover:text-marquee transition-colors block py-0.5 font-medium"
                  >
                    {tCategory(cat.slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Desks & Admin */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-poster text-paper uppercase tracking-widest mb-4">
              <span className="inline-block w-4 h-4 bg-marquee border-2 border-paper -rotate-2" />
              Pan-India Desks
            </h4>
            <ul className="space-y-2.5 text-xs text-paper/70">
              <li>
                <Link
                  href={localizeUrl("/box-office")}
                  className="hover:text-marquee transition-colors block py-0.5 font-medium"
                >
                  {t("nav_boxoffice")} (All Industries)
                </Link>
              </li>
              <li>
                <Link
                  href={localizeUrl("/movies")}
                  className="hover:text-marquee transition-colors block py-0.5 font-medium"
                >
                  Now Showing
                </Link>
              </li>
              <li>
                <Link
                  href={localizeUrl("/archive")}
                  className="hover:text-marquee transition-colors block py-0.5 font-medium"
                >
                  The Deep Print
                </Link>
              </li>
              <li>
                <Link
                  href={localizeUrl("/ott")}
                  className="hover:text-marquee transition-colors block py-0.5 font-medium"
                >
                  {t("nav_ott")}
                </Link>
              </li>
              <li>
                <Link
                  href={localizeUrl("/category/reviews")}
                  className="hover:text-marquee transition-colors block py-0.5 font-medium"
                >
                  {t("nav_reviews")}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 text-marquee font-poster font-bold uppercase tracking-wider hover:text-paper py-0.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t("nav_admin")}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom colophon strip */}
        <div className="mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-paper/60">
          <p className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-marquee" />
            <span>
              &copy; {new Date().getFullYear()} EXTRASAGA — Six traditions, one eternal screen. Dedicated to the artists, dreamers, and audiences of Indian cinema. All rights reserved.
            </span>
          </p>
          <div className="flex items-center gap-4 text-[11px] font-poster uppercase tracking-wider text-paper/60">
            <span className="hover:text-marquee cursor-pointer">{t("footer_privacy")}</span>
            <span>•</span>
            <span className="hover:text-marquee cursor-pointer">{t("footer_terms")}</span>
            <span>•</span>
            <span className="hover:text-marquee cursor-pointer">{t("footer_contact")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
