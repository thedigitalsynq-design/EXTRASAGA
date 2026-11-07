"use client";

import React from "react";
import Link from "next/link";
import { Film, Send, ShieldCheck, Heart } from "lucide-react";
import { CATEGORIES } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { language, config, t, tCategory, localizeUrl } = useLanguage();

  return (
    <footer className="w-full bg-[#F8FAF9] border-t border-[#E5EBE7] mt-16 pt-14 pb-10 text-[#374151]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#E5EBE7]">
          {/* Col 1 & 2: Branding & About */}
          <div className="lg:col-span-2 space-y-4">
            <Link href={localizeUrl("/")} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#288760] to-[#1A5140] flex items-center justify-center text-white shadow-md shadow-[#288760]/20 ring-1 ring-[#5CA87C]/30 group-hover:scale-105 transition-all shrink-0">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black font-sans text-[#0F3529] tracking-tight">CINI</span>
                  <span className="text-2xl font-black font-sans text-[#288760] tracking-tight">JAATRE</span>
                  <span className="ml-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#E8F8EB] text-[#1A5140] border border-[#B7E5BA] shadow-2xs">
                    {config.industryName}
                  </span>
                </div>
                <p className="text-[11px] text-[#4B6358] font-medium tracking-wide mt-0.5 flex items-center gap-1.5">
                  <span className={language === "kn" ? "font-hubballi font-bold text-[#288760]" : "font-semibold text-[#288760]"}>
                    {config.brandNameNative}
                  </span>
                  <span className="text-[#A3B8B0]">·</span>
                  <span className={language === "kn" ? "font-hubballi font-semibold text-[#4B6358]" : "text-[#4B6358]"}>
                    {config.headerTagline}
                  </span>
                </p>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#4B6358] leading-relaxed max-w-sm">
              {t("footer_about")}
            </p>

            <div className="pt-2">
              <span className="text-xs font-bold text-[#0F3529] block mb-2">
                {t("footer_telegram_whatsapp")}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-white text-[#1A5140] hover:bg-[#E8F8EB] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#E5EBE7] shadow-2xs hover:border-[#5CA87C]"
                >
                  <Send className="w-3.5 h-3.5 text-[#288760]" />
                  <span>{t("footer_telegram")}</span>
                </a>
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-white text-[#1A5140] hover:bg-[#E8F8EB] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#E5EBE7] shadow-2xs hover:border-[#5CA87C]"
                >
                  <span>{t("footer_whatsapp")}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Categories 1 */}
          <div>
            <h4 className="text-sm font-bold text-[#0F3529] uppercase tracking-wider mb-4 border-l-2 border-[#288760] pl-2.5">
              {t("footer_quick_links")}
            </h4>
            <ul className="space-y-2 text-xs text-[#4B6358]">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={localizeUrl(cat.slug === "mukhaputa" ? "/" : `/category/${cat.slug}`)}
                    className="hover:text-[#288760] transition-colors block py-0.5 font-medium"
                  >
                    {tCategory(cat.slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Categories 2 */}
          <div>
            <h4 className="text-sm font-bold text-[#0F3529] uppercase tracking-wider mb-4 border-l-2 border-[#288760] pl-2.5">
              {t("footer_cinema_industries")}
            </h4>
            <ul className="space-y-2 text-xs text-[#4B6358]">
              {CATEGORIES.slice(6, 12).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={localizeUrl(`/category/${cat.slug}`)}
                    className="hover:text-[#288760] transition-colors block py-0.5 font-medium"
                  >
                    {tCategory(cat.slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Special & Admin */}
          <div>
            <h4 className="text-sm font-bold text-[#0F3529] uppercase tracking-wider mb-4 border-l-2 border-[#288760] pl-2.5">
              {config.industryName} Hub
            </h4>
            <ul className="space-y-2 text-xs text-[#4B6358]">
              <li>
                <Link
                  href={localizeUrl("/box-office")}
                  className="hover:text-[#288760] transition-colors block py-0.5 font-medium"
                >
                  {t("nav_boxoffice")} ({config.industryName})
                </Link>
              </li>
              <li>
                <Link
                  href={localizeUrl("/movies")}
                  className="hover:text-[#288760] transition-colors block py-0.5 font-medium"
                >
                  ಸಿನಿಮಾ ಬಿಡುಗಡೆಗಳು (Cinema Releases)
                </Link>
              </li>
              <li>
                <Link
                  href={localizeUrl("/archive")}
                  className="hover:text-[#288760] transition-colors block py-0.5 font-medium"
                >
                  ಶಾಶ್ವತ ಆರ್ಕೈವ್ (Permanent Archive)
                </Link>
              </li>
              <li>
                <Link
                  href={localizeUrl("/ott")}
                  className="hover:text-[#288760] transition-colors block py-0.5 font-medium"
                >
                  {t("nav_ott")}
                </Link>
              </li>
              <li>
                <Link
                  href={localizeUrl("/category/reviews")}
                  className="hover:text-[#288760] transition-colors block py-0.5 font-medium"
                >
                  {t("nav_reviews")}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 text-[#288760] font-bold hover:underline py-0.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t("nav_admin")}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <p>
            &copy; {new Date().getFullYear()} CINI JAATRE (ಸಿನಿ ಜಾತ್ರೆ). {t("footer_rights")}
          </p>
          <div className="flex items-center gap-4 text-[11px] text-[#4B6358]">
            <span className="hover:text-[#288760] cursor-pointer">{t("footer_privacy")}</span>
            <span>•</span>
            <span className="hover:text-[#288760] cursor-pointer">{t("footer_terms")}</span>
            <span>•</span>
            <span className="hover:text-[#288760] cursor-pointer">{t("footer_contact")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
