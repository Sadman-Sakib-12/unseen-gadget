"use client";

import type { MockProduct } from "@/components/product-types";
import { ProductCarousel } from "@/components/product-carousel";

export function TopSellingCarousel({ products }: { products: MockProduct[] }) {
  return <ProductCarousel products={products} overlay />;
}
