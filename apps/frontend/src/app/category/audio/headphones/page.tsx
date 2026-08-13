import products from "@/data/products.json";
import { findAllCategories, findCategoryByHref, getParentChain } from "@/lib/categories";
import type { MockProduct } from "@/components/product-types";
import { CategoryPageClient } from "../../[...slug]/CategoryPageClient";

export default function HeadphonesPage() {
  const href = "/category/audio/headphones";
  const category = findCategoryByHref(findAllCategories(), href);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Category Not Found</h1>
          <p className="mt-2 text-sm text-gray-500">The headphones category could not be found.</p>
        </div>
      </div>
    );
  }

  const parentChain = getParentChain(findAllCategories(), href);

  const allProducts = (products as MockProduct[]).filter((p) => {
    return p.category.toLowerCase() === "audio" || p.category.toLowerCase().includes("headphone");
  });

  return (
    <CategoryPageClient
      key={href}
      category={category}
      parentChain={parentChain}
      allProducts={allProducts}
    />
  );
}