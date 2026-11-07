"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LanguageCode } from "@/types";
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  getLanguageConfig,
  isLanguageCode,
  LanguageConfig,
} from "@/lib/languages";
import { Translations, getTranslation, getLocalizedCategoryName } from "@/lib/translations";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  config: LanguageConfig;
  languages: LanguageConfig[];
  t: (key: keyof Translations) => string;
  tCategory: (slug: string) => string;
  localizeUrl: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  config: getLanguageConfig(DEFAULT_LANGUAGE),
  languages: SUPPORTED_LANGUAGES,
  t: (key) => getTranslation(DEFAULT_LANGUAGE, key),
  tCategory: (slug) => getLocalizedCategoryName(slug, DEFAULT_LANGUAGE),
  localizeUrl: (path) => path,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const url = new URL(window.location.href);
    const urlLang = url.searchParams.get("lang");
    const savedLang = localStorage.getItem("cinijaatre_lang");
    const effectiveLang = isLanguageCode(urlLang)
      ? urlLang
      : isLanguageCode(savedLang)
      ? savedLang
      : DEFAULT_LANGUAGE;

    setLanguageState(effectiveLang);
    document.documentElement.lang = effectiveLang;
    document.documentElement.setAttribute("data-lang", effectiveLang);

    if (
      (urlLang !== null && urlLang !== effectiveLang) ||
      (urlLang === null && effectiveLang !== DEFAULT_LANGUAGE)
    ) {
      if (effectiveLang === DEFAULT_LANGUAGE) {
        url.searchParams.delete("lang");
      } else {
        url.searchParams.set("lang", effectiveLang);
      }
      router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false });
    }
  }, [router]);

  const setLanguage = useCallback((code: LanguageCode) => {
    setLanguageState(code);
    if (typeof window !== "undefined") {
      localStorage.setItem("cinijaatre_lang", code);
      document.cookie = `cinijaatre_lang=${code}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = code;
      document.documentElement.setAttribute("data-lang", code);

      const url = new URL(window.location.href);
      if (code === DEFAULT_LANGUAGE) {
        url.searchParams.delete("lang");
      } else {
        url.searchParams.set("lang", code);
      }
      router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false });
      window.dispatchEvent(new CustomEvent("languagechange", { detail: code }));
    }
  }, [router]);

  const config = getLanguageConfig(language);

  const t = useCallback((key: keyof Translations) => getTranslation(language, key), [language]);

  const tCategory = useCallback((slug: string) => getLocalizedCategoryName(slug, language), [language]);

  const localizeUrl = useCallback(
    (path: string) => {
      if (language === DEFAULT_LANGUAGE) return path;
      const separator = path.includes("?") ? "&" : "?";
      return `${path}${separator}lang=${language}`;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        config,
        languages: SUPPORTED_LANGUAGES,
        t,
        tCategory,
        localizeUrl,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
