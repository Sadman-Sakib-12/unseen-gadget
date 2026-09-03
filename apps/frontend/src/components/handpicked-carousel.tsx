"use client";

import { useState, useMemo } from "react";
import type { MockProduct } from "@/components/product-types";
import { ProductCarousel } from "@/components/product-carousel";
import { useTranslation } from "@/hooks/use-translation";

export function HandpickedCarousel({ products = [] }: { products: MockProduct[] }) {
  const { language } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");

  // Dynamically extract categories from available products, plus standard defaults
  const categories = useMemo(() => {
    const foundCategories = new Set<string>();
    products.forEach((p) => {
      if (p.category && typeof p.category === "string" && p.category.trim()) {
        foundCategories.add(p.category.trim());
      }
    });

    const categoryList = Array.from(foundCategories);

    if (categoryList.length === 0) {
      return [{ id: "all", label: "All" }];
    }

    return [
      { id: "all", label: "All" },
      ...categoryList.map((cat) => ({
        id: cat.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: cat,
      })),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;

    const matched = products.filter((p) => {
      const pCat = (p.category || "").toLowerCase();
      const pName = (p.name || "").toLowerCase();
      const target = activeCategory.toLowerCase();
      const normalizedTarget = target.replace(/-/g, " ");

      return (
        pCat.includes(normalizedTarget) ||
        normalizedTarget.includes(pCat) ||
        pName.includes(normalizedTarget) ||
        pCat.replace(/[^a-z0-9]+/g, "-") === target
      );
    });

    return matched.length > 0 ? matched : products;
  }, [products, activeCategory]);

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
            {category.id === "all" ? (language === "bn" ? "সব" : "All") : category.label}
          </button>
        ))}
      </div>

      <ProductCarousel key={activeCategory} products={filteredProducts} />
    </div>
  );
}
