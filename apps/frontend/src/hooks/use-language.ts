"use client";

import { useState, useEffect } from "react";

export type Language = "en" | "bn";

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export function useLanguage(): LanguageState {
  // Read from localStorage directly at render time
  const storedLanguage =
    typeof window !== "undefined" ? localStorage.getItem("unseen-language") : null;

  const initialLanguage: Language = storedLanguage === "bn" ? "bn" : "en";

  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    localStorage.setItem("unseen-language", language);
    document.documentElement.lang = language;
  }, [language]);

  return { language, setLanguage };
}
