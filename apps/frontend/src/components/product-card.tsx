"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Heart, Lock, ShoppingCart } from "lucide-react";
import type { MockProduct } from "./product-types";
import { formatBDT } from "./price";
import { ColorSwatches } from "./color-swatches";
import { ImageWithFallback } from "./image-with-fallback";
import { useCartStore } from "@/features/cart-store";
import { useWishlistStore } from "@/features/wishlist-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { useTranslation } from "@/hooks/use-translation";

function WishlistButton({ product }: { product: MockProduct }) {
  const hydrated = useHydrated();
  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);
  const { t } = useTranslation();
  const wishlisted = hydrated && ids.includes(product.id);

  return (
    <button
      type="button"
      aria-label={wishlisted ? t("product.wishlist.removed") : t("product.wishlist.added")}
      title={wishlisted ? t("product.wishlist.removed") : t("product.wishlist.added")}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product.id);
        toast.success(wishlisted ? t("product.wishlist.removed") : t("product.wishlist.added"));
      }}
      className={`flex h-9 w-9 items-center justify-center rounded-full border bg-card shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
        wishlisted
          ? "border-primary/40 text-primary"
          : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
      }`}
    >
      <Heart className={`h-4 w-4 ${wishlisted ? "fill-primary" : ""}`} />
    </button>
  );
}

export function ProductCard({ product }: { product: MockProduct }) {
  const outOfStock = product.inStock === false;
  const addItem = useCartStore((s) => s.addItem);
  const { t } = useTranslation();

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Image area */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block bg-card p-3"
      >
        {product.discount != null && product.discount > 0 && (
          <div className="absolute left-2 top-2 z-10 flex items-center gap-1">
            {product.badge && (
              <span className="rounded bg-foreground px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-background">
                {product.badge}
              </span>
            )}
            <span className="rounded bg-error px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
              -{product.discount}%
            </span>
          </div>
        )}
        {product.badge && (product.discount == null || product.discount <= 0) && (
          <div className="absolute left-2 top-2 z-10">
            <span className="rounded bg-foreground px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-background">
              {product.badge}
            </span>
          </div>
        )}

        <div className="absolute right-2 top-2 z-10">
          <WishlistButton product={product} />
        </div>

        <div className="relative mx-auto aspect-square w-full">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            label={product.name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            iconSize="h-12 w-12"
          />
        </div>

        {outOfStock && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-slate-900/60 py-1.5 text-[10px] font-semibold text-white">
            <Lock className="h-3 w-3" />
            {t("common.outOfStock")}
          </div>
        )}
      </Link>

      {/* Card content */}
      <div className="flex flex-1 flex-col px-4 py-3">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[44px] text-[15px] font-medium leading-snug text-foreground transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1.5 flex min-h-[22px] items-baseline gap-1.5">
          <span className="text-[15px] font-bold text-foreground">
            {formatBDT(product.price)}
          </span>
          {product.originalPrice != null && product.originalPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatBDT(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="mt-2 min-h-[14px]">
          {product.colors && product.colors.length > 0 && (
            <ColorSwatches colors={product.colors} />
          )}
        </div>

        <div className="mt-3 mt-auto">
          {outOfStock ? (
            <button
              disabled
              className="flex h-10 w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-full bg-muted text-[11px] font-semibold text-muted-foreground"
            >
              <Lock className="h-3.5 w-3.5" />
              {t("common.outOfStock")}
            </button>
          ) : (
            <button
              onClick={() => {
                addItem(product, 1, product.colors?.[0]);
                toast.success(`${product.name} ${t("product.addedToCart")}`);
              }}
              className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-primary text-[11px] font-semibold text-primary-foreground transition hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {t("common.addToCart")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
