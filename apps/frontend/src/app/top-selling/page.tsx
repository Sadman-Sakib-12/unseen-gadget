"use client";

import { useMemo } from "react";
import { ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { MockProduct } from "@/components/product-types";
import { ProductGrid } from "@/components/product-grid";
import { ProductGridSkeleton } from "@/components/product-card-skeleton";
import { useTranslation } from "@/hooks/use-translation";
import { useTopSelling } from "@/hooks/use-queries";

export default function TopSellingPage() {
  const { t } = useTranslation();
  const { data: topSellingRes, isLoading } = useTopSelling(12);

  const topSelling: MockProduct[] = useMemo(() => {
    const raw = topSellingRes as any;
    const list = Array.isArray(raw?.data) ? raw.data : (raw?.data?.items || []);
    return list.slice(0, 12);
  }, [topSellingRes]);

  return (
    <>
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">{t("shop.breadcrumbHome")}</Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground">{t("listings.topSelling.title")}</span>
          </nav>
        </div>
      </div>

      <div className="bg-gradient-to-r from-warning to-error py-10">
        <div className="container-gadget text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            <TrendingUp className="h-3.5 w-3.5" />
            {t("listings.topSelling.kicker")}
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">{t("listings.topSelling.title")}</h1>
          <p className="mt-1 text-sm text-white/70">
            {t("listings.topSelling.hint")}
          </p>
        </div>
      </div>

      <div className="container-gadget py-8">
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <ProductGrid
            products={topSelling}
            wrapItem={(card, product, i) =>
              i < 3 ? (
                <div key={product.id} className="relative">
                  <div className="absolute -left-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white shadow">
                    #{i + 1}
                  </div>
                  {card}
                </div>
              ) : (
                card
              )
            }
          />
        )}
      </div>
    </>
  );
}
