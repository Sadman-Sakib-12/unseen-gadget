import products from "@/data/products.json";
import { ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import type { MockProduct } from "@/components/product-types";
import { ProductCard } from "@/components/product-card";

const newArrivals = (products as MockProduct[]).filter(
  (p) => p.badge === "New" || p.badge === "New Arrival"
);

const cx = "mx-auto w-full max-w-[1320px] px-4";

export default function NewArrivalsPage() {
  return (
    <>
      {/* Hero */}
      <div className="border-b border-gray-100 bg-white">
        <div className={cx}>
          <nav className="flex items-center gap-1.5 py-3 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900">New Arrivals</span>
          </nav>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-10">
        <div className={`${cx} text-center`}>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            <Sparkles className="h-3.5 w-3.5" />
            Just In
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">New Arrivals</h1>
          <p className="mt-1 text-sm text-blue-100">
            {newArrivals.length} freshly added products — be the first to get them
          </p>
        </div>
      </div>

      <div className={`${cx} py-8`}>
        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center">
            <Sparkles className="h-10 w-10 text-gray-200" />
            <p className="mt-3 text-sm font-medium text-gray-500">No new arrivals at the moment</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Browse Homepage <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
