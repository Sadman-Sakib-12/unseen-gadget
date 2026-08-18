"use client";

import { useLanguage } from "./use-language";
import {
  translate,
  formatTemplate,
  type Language,
  type TranslationKey,
} from "@/lib/i18n";

export interface Translator {
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
  language: Language;
}

export function useTranslation(): Translator {
  const { language } = useLanguage();

  const t = (key: TranslationKey, values?: Record<string, string | number>) => {
    const template = translate(language, key);
    return values ? formatTemplate(template, values) : template;
  };

  return { t, language };
}
