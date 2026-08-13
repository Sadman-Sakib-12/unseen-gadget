"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Heart, Lock, ShoppingCart } from "lucide-react";
import type { MockProduct, ViewMode } from "./product-types";
import { formatBDT } from "./price";
import { ColorSwatches } from "./color-swatches";
import { StarRating } from "./star-rating";
import { ImageWithFallback } from "./image-with-fallback";
import { useCartStore } from "@/features/cart-store";
import { useWishlistStore } from "@/features/wishlist-store";
import { useHydrated } from "@/hooks/use-hydrated";

function WishlistButton({ product }: { product: MockProduct }) {
  const hydrated = useHydrated();
  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);
  const wishlisted = hydrated && ids.includes(product.id);

  return (
    <button
      type="button"
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product.id);
        toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
      }}
      className={`flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 ${
        wishlisted
          ? "border-pink-200 text-[#ff6b8a]"
          : "border-gray-200 text-gray-400 hover:border-pink-200 hover:text-[#ff6b8a]"
      }`}
    >
      <Heart className={`h-4 w-4 ${wishlisted ? "fill-[#ff6b8a]" : ""}`} />
    </button>
  );
}

function addToCartToast(product: MockProduct) {
  toast.success(`${product.name} added to cart`);
}

function GridCard({ product }: { product: MockProduct }) {
  const outOfStock = product.inStock === false;
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md">
      {/* Image area */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block bg-white p-3"
      >
        {/* Discount badge
            Only show this badge when discount exists AND no promotional badge,
            grouped to avoid clutter on a small card */}
        {product.discount != null && product.discount > 0 && (
          <div className="absolute left-2 top-2 z-10 flex items-center gap-1">
            {product.badge && (
              <span className="rounded bg-gray-900 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                {product.badge}
              </span>
            )}
            <span className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
              -{product.discount}%
            </span>
          </div>
        )}
        {product.badge && (product.discount == null || product.discount <= 0) && (
          <div className="absolute left-2 top-2 z-10">
            <span className="rounded bg-gray-900 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist */}
        <div className="absolute right-2 top-2 z-10">
          <WishlistButton product={product} />
        </div>

        {/* Product image */}
        <div className="relative mx-auto aspect-square w-full">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            iconSize="h-12 w-12"
          />
        </div>

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/50 py-1.5 text-[10px] font-semibold text-white">
            <Lock className="h-3 w-3" />
            Out of Stock
          </div>
        )}
      </Link>

      {/* Card content */}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-1">
        {product.brand && (
          <p className="mb-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-400">
            {product.brand}
          </p>
        )}

        {/* Product name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-gray-800 transition-colors hover:text-blue-600 min-h-[2.4rem]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating != null && product.rating > 0 && (
          <div className="mt-1.5">
            <StarRating rating={product.rating} reviews={product.reviews} size="h-3 w-3" />
          </div>
        )}

        {/* Price row */}
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-[15px] font-bold text-gray-900">
            {formatBDT(product.price)}
          </span>
          {product.originalPrice != null && product.originalPrice > product.price && (
            <span className="text-[11px] text-gray-400 line-through">
              {formatBDT(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Color dots */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-2">
            <ColorSwatches colors={product.colors} />
          </div>
        )}

        {/* CTA */}
        <div className="mt-3">
          {outOfStock ? (
            <button
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-full bg-gray-100 py-2.5 text-[11px] font-semibold text-gray-400"
            >
              <Lock className="h-3.5 w-3.5" />
              Out of Stock
            </button>
          ) : (
            <button
              onClick={() => {
                addItem(product, 1, product.colors?.[0]);
                addToCartToast(product);
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-full bg-blue-600 py-2.5 text-[11px] font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ListCard({ product }: { product: MockProduct }) {
  const outOfStock = product.inStock === false;
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="group flex overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md">
      {/* Image */}
      <Link
        href={`/product/${product.slug}`}
        className="relative flex w-32 shrink-0 items-center justify-center bg-white p-3 sm:w-40"
      >
        {product.discount != null && product.discount > 0 && (
          <div className="absolute left-1.5 top-1.5 z-10 flex items-center gap-1">
            {product.badge && (
              <span className="rounded bg-gray-900 px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
                {product.badge}
              </span>
            )}
            <span className="rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
              -{product.discount}%
            </span>
          </div>
        )}
        {product.badge && (product.discount == null || product.discount <= 0) && (
          <div className="absolute left-1.5 top-1.5 z-10">
            <span className="rounded bg-gray-900 px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
              {product.badge}
            </span>
          </div>
        )}
        <div className="aspect-square w-full">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
            iconSize="h-10 w-10"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between px-4 py-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
            {product.brand ?? product.category}
          </p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-gray-800 transition-colors hover:text-blue-600">
              {product.name}
            </h3>
          </Link>

          {product.rating != null && product.rating > 0 && (
            <div className="mt-1.5">
              <StarRating rating={product.rating} reviews={product.reviews} size="h-3 w-3" />
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-gray-900">
                {formatBDT(product.price)}
              </span>
              {product.originalPrice != null && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatBDT(product.originalPrice)}
                </span>
              )}
            </div>
            {product.colors && product.colors.length > 0 && (
              <div className="mt-1.5">
                <ColorSwatches colors={product.colors} />
              </div>
            )}
          </div>

          {outOfStock ? (
            <button
              disabled
              className="flex cursor-not-allowed items-center gap-1.5 rounded-full bg-gray-100 px-4 py-2 text-[11px] font-semibold text-gray-400"
            >
              <Lock className="h-3.5 w-3.5" />
              Out of Stock
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden lg:block">
                <WishlistButton product={product} />
              </div>
              <button
                onClick={() => {
                  addItem(product, 1, product.colors?.[0]);
                  addToCartToast(product);
                }}
                className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductCard({
  product,
  viewMode = "grid",
}: {
  product: MockProduct;
  viewMode?: ViewMode;
}) {
  if (viewMode === "list") return <ListCard product={product} />;
  return <GridCard product={product} />;
}