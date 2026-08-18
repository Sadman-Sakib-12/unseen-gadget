import products from "@/data/products.json";
import type { MockProduct } from "@/components/product-types";
import { CategoryPageClient } from "@/app/category/[...slug]/CategoryPageClient";

const shopCategory = {
  id: "shop",
  name: "Shop",
  href: "/products",
};

export default function ShopPage() {
  return (
    <CategoryPageClient
      key="shop"
      category={shopCategory}
      parentChain={[]}
      allProducts={products as MockProduct[]}
    />
  );
}
