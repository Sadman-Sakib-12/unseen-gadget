"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ProductCard } from "@/components/product-card";
import type { MockProduct } from "@/components/product-types";
import "swiper/css";
import "swiper/css/navigation";

interface ProductCarouselProps {
  products: MockProduct[];
  slidesPerView?: number;
  breakpoints?: Record<number, { slidesPerView: number }>;
  spaceBetween?: number;
  overlay?: boolean;
}

export function ProductCarousel({
  products,
  slidesPerView = 2,
  breakpoints = {
    640: { slidesPerView: 3 },
    768: { slidesPerView: 4 },
    1024: { slidesPerView: 5 },
  },
  spaceBetween = 12,
  overlay = false,
}: ProductCarouselProps) {
  return (
    <div className="relative w-full min-w-0 max-w-full overflow-hidden">
      <Swiper
        modules={[Navigation]}
        spaceBetween={spaceBetween}
        navigation
        slidesPerView={slidesPerView}
        className={overlay ? "product-carousel px-1 py-2 w-full" : "product-carousel w-full"}
        breakpoints={breakpoints}
      >
        {products.map((p, idx) => (
          <SwiperSlide key={`${p.id}-${idx}`} className="!h-auto">
            <div className="h-full pb-1">
              <ProductCard product={p} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
