"use client";

import { useMemo } from "react";
import { SectionHeading } from "@/components/section-heading";
import { ProductGrid } from "@/components/product-grid";
import { useProducts } from "@/hooks/use-queries";
import { useTranslation } from "@/hooks/use-translation";
import type { MockProduct } from "@/components/product-types";
import { categoryHref } from "./product-breadcrumb";

interface ProductRelatedSectionProps {
  productId: string | number;
  productSlug: string;
  category: string;
  initialRelated?: any[];
}

export function ProductRelatedSection({
  productId,
  productSlug,
  category,
  initialRelated,
}: ProductRelatedSectionProps) {
  const { t } = useTranslation();
  const { data: moreProductsRes } = useProducts({ limit: 6 });

  const relatedProducts = useMemo<MockProduct[]>(() => {
    if (Array.isArray(initialRelated) && initialRelated.length > 0) {
      return initialRelated.map((p: any) => ({
        ...p,
        category: typeof p.category === "object" ? p.category?.name || "Gadget" : (p.category || "Gadget"),
        brand: typeof p.brand === "object" ? p.brand?.name : (p.brand || "Apple"),
        image: p.image || p.images?.[0] || "",
      }));
    }

    const raw = (moreProductsRes as any)?.data?.items ?? (moreProductsRes as any)?.data ?? moreProductsRes;
    if (Array.isArray(raw)) {
      return raw
        .filter((p: any) => String(p.id) !== String(productId) && p.slug !== productSlug)
        .slice(0, 4)
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: typeof p.category === "object" ? p.category?.name || "Gadget" : (p.category || "Gadget"),
          brand: typeof p.brand === "object" ? p.brand?.name : (p.brand || "Apple"),
          price: Number(p.price) || 0,
          originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
          discount: p.discount ? Number(p.discount) : undefined,
          image: p.image || p.images?.[0] || "",
          images: Array.isArray(p.images) ? p.images : [],
          badge: p.badge,
          colors: Array.isArray(p.colors) ? p.colors : [],
          inStock: p.inStock !== false,
          rating: Number(p.rating) || 4.9,
          reviews: Number(p.reviews) || 0,
        }));
    }
    return [];
  }, [initialRelated, productId, productSlug, moreProductsRes]);

  if (relatedProducts.length === 0) return null;

  return (
    <div className="container-gadget border-t border-border mt-6">
      <div className="py-6">
        <SectionHeading
          title={t("pdp.related") || "Related Products"}
          action={`${t("nav.viewAll")} (${relatedProducts.length})`}
          href={categoryHref(category)}
        />
        <ProductGrid products={relatedProducts} />
      </div>
    </div>
  );
}
