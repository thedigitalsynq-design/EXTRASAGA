"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { LanguageCode } from "@/types";
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  getLanguageConfig,
  LanguageConfig,
} from "@/lib/languages";
import { Translations, getTranslation, getLocalizedCategoryName } from "@/lib/translations";

/**
 * English-only edition: the language state is permanently "en".
 * The context and its API are kept so existing consumers keep working,
 * but every resolution is a no-op toward the English configuration.
 */
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
  const [language] = useState<LanguageCode>(DEFAULT_LANGUAGE);

  const setLanguage = useCallback((code: LanguageCode) => {
    // Single-language edition: switching is a no-op (always English).
    void code;
  }, []);

  const config = getLanguageConfig(language);

  const t = useCallback((key: keyof Translations) => getTranslation(language, key), [language]);

  const tCategory = useCallback((slug: string) => getLocalizedCategoryName(slug, language), [language]);

  const localizeUrl = useCallback(
    (path: string) => {
      return path;
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
