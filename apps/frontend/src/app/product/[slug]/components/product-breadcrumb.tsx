"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import type { ProductDetailsData } from "../ProductDetails";

export function categoryHref(category: string): string {
  return `/category/${category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`;
}

export function ProductBreadcrumb({ product }: { product: ProductDetailsData }) {
  const { t } = useTranslation();

  return (
    <div className="border-b border-border bg-card">
      <div className="container-gadget">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 py-3 text-[12.5px] text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-primary">
            {t("shop.breadcrumbHome")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            href={categoryHref(product.category)}
            className="capitalize transition-colors hover:text-primary"
          >
            {product.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground truncate max-w-[280px] sm:max-w-none">
            {product.name}
          </span>
        </nav>
      </div>
    </div>
  );
}
