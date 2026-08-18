"use client";

import type { MockProduct } from "@/components/product-types";
import { ProductCarousel } from "@/components/product-carousel";

export function NewArrivalCarousel({ products }: { products: MockProduct[] }) {
  return (
    <ProductCarousel
      products={products}
      slidesPerView={2}
      breakpoints={{
        640: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 4 },
      }}
    />
  );
}
