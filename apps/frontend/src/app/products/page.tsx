"use client";

import { useMemo } from "react";
import type { MockProduct } from "@/components/product-types";
import { CategoryPageClient } from "@/app/category/[...slug]/CategoryPageClient";
import { useProducts } from "@/hooks/use-queries";

const shopCategory = {
  id: "shop",
  name: "Shop",
  href: "/products",
};

export default function ShopPage() {
  const { data: prodRes } = useProducts();

  const products: MockProduct[] = useMemo(() => {
    const raw = prodRes as any;
    return Array.isArray(raw?.data) ? raw.data : (raw?.data?.items || []);
  }, [prodRes]);

  return (
    <CategoryPageClient
      key="shop"
      category={shopCategory}
      parentChain={[]}
      allProducts={products}
    />
  );
}
