"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export function SectionHeading({
  title,
  href,
  action,
  className = "",
}: {
  title: string;
  href?: string;
  action?: string;
  className?: string;
}) {
  const { t } = useTranslation();
  const actionLabel = action ?? t("nav.viewAll");

  return (
    <div className={`mb-4 flex items-center justify-between ${className}`}>
      <h2 className="text-[18px] font-bold text-foreground">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {actionLabel}
          <ChevronRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}
