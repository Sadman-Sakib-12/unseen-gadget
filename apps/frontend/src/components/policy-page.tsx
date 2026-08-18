"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import type { TranslationKey } from "@/lib/i18n";
import { useTranslation } from "@/hooks/use-translation";

interface PolicySection {
  icon: LucideIcon;
  title: string;
  content: string;
  color?: string;
}

interface PolicyPageProps {
  kickerKey: TranslationKey;
  titleKey: TranslationKey;
  hintKey: TranslationKey;
  updatedKey: TranslationKey;
  breadcrumbKey: TranslationKey;
  sections: PolicySection[];
  note: React.ReactNode;
}

export function PolicyPage({
  kickerKey,
  titleKey,
  hintKey,
  updatedKey,
  breadcrumbKey,
  sections,
  note,
}: PolicyPageProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">{t("shop.breadcrumbHome")}</Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground">{t(breadcrumbKey)}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-800 via-primary to-primary-600 py-12">
        <div className="container-gadget text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            <ChevronRight className="h-3.5 w-3.5 rotate-90" />
            {t(kickerKey)}
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">{t(titleKey)}</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
            {t(hintKey)}
          </p>
          <p className="mt-2 text-xs text-white/50">{t(updatedKey)}</p>
        </div>
      </div>

      <div className="container-gadget py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color ?? "bg-primary/10 text-primary"}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-sm font-bold text-foreground">{s.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
          <p className="text-sm font-medium text-foreground">{note}</p>
        </div>
      </div>
    </>
  );
}
