"use client";

import { useState } from "react";
import type { MockProduct } from "@/components/product-types";
import { ProductCarousel } from "@/components/product-carousel";

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
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === category.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <ProductCarousel products={products} />
    </div>
  );
}
