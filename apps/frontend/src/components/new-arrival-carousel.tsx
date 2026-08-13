"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ProductCard } from "@/components/product-card";
import type { MockProduct } from "@/components/product-types";
import "swiper/css";
import "swiper/css/navigation";

export function NewArrivalCarousel({ products }: { products: MockProduct[] }) {
  return (
    <div className="relative">
      <style jsx global>{`
        .new-arrival-carousel .swiper-button-prev,
        .new-arrival-carousel .swiper-button-next {
          width: 44px;
          height: 44px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 50%;
          color: #1f2937;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 10;
        }
        
        .new-arrival-carousel .swiper-button-prev {
          left: 10px;
        }
        
        .new-arrival-carousel .swiper-button-next {
          right: 10px;
        }
        
        .new-arrival-carousel .swiper-button-prev:after,
        .new-arrival-carousel .swiper-button-next:after {
          font-size: 18px;
          font-weight: 900;
        }
        
        .new-arrival-carousel .swiper-button-prev:hover,
        .new-arrival-carousel .swiper-button-next:hover {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
        }
        
        .new-arrival-carousel .swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>
      <Swiper
        modules={[Navigation]}
        spaceBetween={12}
        navigation
        slidesPerView={1.2}
        className="new-arrival-carousel"
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {products.map((p) => (
          <SwiperSlide key={p.id}>
            <div className="max-w-[250px]">
              <ProductCard product={p} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
