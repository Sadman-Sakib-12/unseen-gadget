"use client";

import { Shield, Truck, RefreshCw, Tag, Headphones, type LucideIcon } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const BENEFITS: { icon: LucideIcon; key: "home.benefits.emi" | "home.benefits.delivery" | "home.benefits.exchange" | "home.benefits.deals" | "home.benefits.service" }[] = [
  { icon: Shield,    key: "home.benefits.emi" },
  { icon: Truck,     key: "home.benefits.delivery" },
  { icon: RefreshCw, key: "home.benefits.exchange" },
  { icon: Tag,       key: "home.benefits.deals" },
  { icon: Headphones,key: "home.benefits.service" },
];

export function BenefitsBar({ containerClass = "mx-auto w-full max-w-[1440px] px-4" }: { containerClass?: string }) {
  const { t } = useTranslation();

  return (
    <section className="border-y border-border bg-muted/40">
      <div className={containerClass}>
        <div className="grid grid-cols-2 divide-x divide-border sm:grid-cols-3 lg:grid-cols-5">
          {BENEFITS.map((b) => (
            <div key={b.key} className="flex items-center justify-center gap-2 py-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <b.icon className="h-3.5 w-3.5" />
              </span>
              <span className="text-[11.5px] font-medium text-foreground">{t(b.key)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
