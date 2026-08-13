"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ProductCard } from "@/components/product-card";
import type { MockProduct } from "@/components/product-types";
import "swiper/css";
import "swiper/css/navigation";

const categories = [
  { id: "all", label: "All" },
  { id: "wireless", label: "Wireless Microphone" },
  { id: "tablet", label: "Mobile And Tablet" },
  { id: "camera", label: "Camera Networking" },
  { id: "gadgets", label: "Smart Gadgets" },
  { id: "accessories", label: "Mobile Accessories" },
  { id: "peripherals", label: "Computer Peripherals" },
];

export function HandpickedCarousel({ products }: { products: MockProduct[] }) {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="w-full">
      {/* Category Filter Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === category.id
                ? "bg-gray-900 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Products Carousel */}
      <div className="relative">
        <style jsx global>{`
          .handpicked-carousel .swiper-button-prev,
          .handpicked-carousel .swiper-button-next {
            width: 44px;
            height: 44px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 50%;
            color: #1f2937;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10;
          }
          
          .handpicked-carousel .swiper-button-prev {
            left: -22px;
          }
          
          .handpicked-carousel .swiper-button-next {
            right: -22px;
          }
          
          .handpicked-carousel .swiper-button-prev:after,
          .handpicked-carousel .swiper-button-next:after {
            font-size: 18px;
            font-weight: 900;
          }
          
          .handpicked-carousel .swiper-button-prev:hover,
          .handpicked-carousel .swiper-button-next:hover {
            background: #2563eb;
            color: white;
            border-color: #2563eb;
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
          }
          
          .handpicked-carousel .swiper-button-disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }
        `}</style>
        <Swiper
          modules={[Navigation]}
          spaceBetween={12}
          navigation
          slidesPerView={2}
          className="handpicked-carousel"
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {products.map((p) => (
            <SwiperSlide key={p.id}>
              <ProductCard product={p} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
