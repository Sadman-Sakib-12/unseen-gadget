"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Language = "en" | "bn";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("unseen-language");
      if (saved === "bn" || saved === "en") {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      }
    } catch {}
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    try {
      localStorage.setItem("unseen-language", next);
      document.documentElement.lang = next;
      const googleTransCookie = next === "bn" ? "/en/bn" : "/en/en";
      document.cookie = `googtrans=${googleTransCookie}; path=/;`;
      if (typeof window !== "undefined" && window.location.hostname) {
        document.cookie = `googtrans=${googleTransCookie}; path=/; domain=.${window.location.hostname};`;
      }
    } catch {}
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  return useContext(LanguageContext);
}
