import products from "@/data/products.json";
import { ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { MockProduct } from "@/components/product-types";
import { ProductCard } from "@/components/product-card";

const topSelling = (products as MockProduct[]).slice(0, 12);

const cx = "mx-auto w-full max-w-[1320px] px-4";

export default function TopSellingPage() {
  return (
    <>
      <div className="border-b border-gray-100 bg-white">
        <div className={cx}>
          <nav className="flex items-center gap-1.5 py-3 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900">Top Selling</span>
          </nav>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-10">
        <div className={`${cx} text-center`}>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            <TrendingUp className="h-3.5 w-3.5" />
            Best Sellers
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">Top Selling Products</h1>
          <p className="mt-1 text-sm text-orange-100">
            Our most popular products loved by customers across Bangladesh
          </p>
        </div>
      </div>

      <div className={`${cx} py-8`}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {topSelling.map((product, i) => (
            <div key={product.id} className="relative">
              {i < 3 && (
                <div className="absolute -left-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow">
                  #{i + 1}
                </div>
              )}
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
