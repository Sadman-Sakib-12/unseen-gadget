import products from "@/data/products.json";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { findAllCategories, findCategoryByHref, getParentChain } from "@/lib/categories";
import type { MockProduct } from "@/components/product-types";
import { CategoryPageClient } from "./CategoryPageClient";

const cx = "mx-auto w-full max-w-[1320px] px-4";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const pathSegments = Array.isArray(slug) ? slug : [slug];
  const href = `/category/${pathSegments.join("/")}`;
  const category = findCategoryByHref(findAllCategories(), href);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className={cx}>
          <div className="py-20 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Category Not Found</h1>
            <p className="mt-2 text-sm text-gray-500">The category you are looking for does not exist.</p>
            <Link href="/" className="mt-4 inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">
              Go Home <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const parentChain = getParentChain(findAllCategories(), href);
  const allProducts = (products as MockProduct[]).filter((p) => {
    const categoryName = category.name.toLowerCase();
    const productCategory = p.category.toLowerCase();
    return productCategory.includes(categoryName) || categoryName.includes(productCategory);
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