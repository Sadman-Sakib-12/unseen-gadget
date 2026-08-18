"use client";

import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="container-gadget flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-error/10">
        <AlertTriangle className="h-12 w-12 text-error" strokeWidth={1.2} />
      </div>
      <h1 className="mt-6 text-xl font-bold text-foreground">{t("state.error")}</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{t("state.errorHint")}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button onClick={reset} className="btn-primary">
          <RotateCcw className="h-4 w-4" />
          {t("state.tryAgain")}
        </button>
        <Link href="/" className="btn-outline">
          <Home className="h-4 w-4" />
          {t("state.backHome")}
        </Link>
      </div>
    </div>
  );
}
