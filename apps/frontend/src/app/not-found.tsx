"use client";

import { FileQuestion, Home, Search } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="container-gadget flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-muted">
        <FileQuestion className="h-12 w-12 text-muted-foreground" strokeWidth={1.2} />
      </div>
      <p className="mt-6 text-5xl font-extrabold text-foreground">404</p>
      <h1 className="mt-2 text-xl font-bold text-foreground">{t("state.notFoundTitle")}</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{t("state.notFoundHint")}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          <Home className="h-4 w-4" />
          {t("state.backHome")}
        </Link>
        <Link href="/products" className="btn-outline">
          <Search className="h-4 w-4" />
          {t("common.startShopping")}
        </Link>
      </div>
    </div>
  );
}
