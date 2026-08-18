import type { ReactNode } from "react";
import { ProductCard } from "@/components/product-card";
import type { MockProduct } from "@/components/product-types";

export function ProductGrid({
  products,
  wrapItem,
  className = "",
  desktopCols = 5,
}: {
  products: MockProduct[];
  wrapItem?: (card: ReactNode, product: MockProduct, index: number) => ReactNode;
  className?: string;
  desktopCols?: 4 | 5;
}) {
  const cols = desktopCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5";
  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 ${cols} ${className}`}>
      {products.map((product, i) => {
        const card = <ProductCard key={product.id} product={product} />;
        return wrapItem ? wrapItem(card, product, i) : card;
      })}
    </div>
  );
}
