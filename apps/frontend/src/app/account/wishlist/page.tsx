"use client";

import { Heart, ShoppingBag, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import products from "@/data/products.json";
import type { MockProduct } from "@/components/product-types";
import { formatBDT } from "@/components/price";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { useWishlistStore } from "@/features/wishlist-store";
import { useCartStore } from "@/features/cart-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { useTranslation } from "@/hooks/use-translation";

export default function WishlistPage() {
  const hydrated = useHydrated();
  const { t } = useTranslation();
  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);
  const addItem = useCartStore((s) => s.addItem);

  const wishlistProducts: MockProduct[] = hydrated
    ? (products as MockProduct[]).filter((p) => ids.includes(p.id))
    : [];

  const handleRemove = (id: number, name: string) => {
    toggle(id);
    toast.success(t("product.wishlist.removed"), { description: name });
  };

  const handleAddToCart = (product: MockProduct) => {
    addItem(product);
    toast.success(t("product.addedToCart"), { description: product.name });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">{t("wishlist.title")}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {wishlistProducts.length} {t("wishlist.itemsCount")}
          </p>
        </div>
        {wishlistProducts.length > 0 && (
          <Link href="/products" className="text-xs font-medium text-primary transition-colors hover:underline">
            {t("wishlist.browse")}
          </Link>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card py-20 text-center">
          <Heart className="h-12 w-12 text-muted-foreground" strokeWidth={1.2} />
          <h3 className="mt-3 text-sm font-semibold text-foreground">{t("account.noWishlist")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t("account.noWishlistHint")}</p>
          <Link href="/products" className="btn-primary mt-5 !h-9 !px-4 !text-xs rounded-xl">
            <ShoppingBag className="h-4 w-4" />
            {t("wishlist.browse")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {wishlistProducts.map((product) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <Link
                href={`/product/${product.slug}`}
                className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted"
              >
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  label={product.name}
                  className="h-full w-full object-contain"
                  iconSize="h-8 w-8"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  href={`/product/${product.slug}`}
                  className="line-clamp-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                >
                  {product.name}
                </Link>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-base font-bold text-foreground">{formatBDT(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatBDT(product.originalPrice)}
                    </span>
                  )}
                </div>
                {!product.inStock && (
                  <span className="mt-1 w-fit rounded-full bg-error/10 px-2 py-0.5 text-[10px] font-medium text-error">
                    {t("pdp.outOfStock")}
                  </span>
                )}

                <div className="mt-auto flex items-center gap-2 pt-3">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {t("wishlist.addToCart")}
                  </button>
                  <Link
                    href={`/product/${product.slug}`}
                    aria-label={product.name}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleRemove(product.id, product.name)}
                    aria-label={`Remove ${product.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-error hover:text-error"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
