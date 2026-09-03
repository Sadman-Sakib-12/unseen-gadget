"use client";

import { Heart, ShoppingBag, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { formatBDT } from "@/components/price";

import { useHydrated } from "@/hooks/use-hydrated";
import { useTranslation } from "@/hooks/use-translation";
import { apiRequest, wishlistApi } from "@/lib/api";

interface WishlistProduct {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image?: string;
  inStock?: boolean;
}

function normalizeWishlistItem(raw: any): WishlistProduct {
  const p = raw.product || raw;
  const productId = String(raw.productId || p.id || raw.id || "");
  return {
    id: String(raw.id || productId),
    productId,
    name: p.name || raw.name || "Product",
    slug: p.slug || raw.slug || "",
    price: Number(p.price ?? raw.price ?? 0),
    originalPrice:
      p.originalPrice != null
        ? Number(p.originalPrice)
        : raw.originalPrice != null
        ? Number(raw.originalPrice)
        : undefined,
    image: p.images?.[0] || p.image || raw.image || "",
    inStock: typeof p.stock === "number" ? p.stock > 0 : (p.inStock ?? true),
  };
}

import { useSession } from "next-auth/react";

export default function WishlistPage() {
  const { status } = useSession();
  const hydrated = useHydrated();
  const { t } = useTranslation();

  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    wishlistApi
      .list()
      .then((res) => {
        const rawItems = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.items)
          ? res.data.items
          : [];
        setProducts(rawItems.map(normalizeWishlistItem));
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [status]);

  const wishlistProducts: WishlistProduct[] = hydrated ? products : [];

  const handleRemove = async (productId: string, name: string) => {
    setRemovingId(productId);
    try {
      await wishlistApi.remove(productId);
      setProducts((prev) => prev.filter((p) => p.productId !== productId && p.id !== productId));
      toast.success(t("product.wishlist.removed"), { description: name });
    } catch (error: any) {
      toast.error(error.message || "Failed to remove from wishlist");
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (product: WishlistProduct) => {
    setAddingToCartId(product.id);
    try {
      await apiRequest("/cart/current/items", {
        method: "POST",
        body: JSON.stringify({ productId: product.productId || product.id, quantity: 1 }),
      });
      toast.success(t("product.addedToCart"), { description: product.name });
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setAddingToCartId(null);
    }
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card py-20 text-center">
          <Heart className="h-12 w-12 text-muted-foreground" strokeWidth={1.2} />
          <h3 className="mt-3 text-sm font-semibold text-foreground">Loading wishlist...</h3>
          <p className="mt-1 text-xs text-muted-foreground">Please wait...</p>
        </div>
      ) : wishlistProducts.length === 0 ? (
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
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-[11px] font-bold text-muted-foreground">
                    {product.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
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
                    disabled={!product.inStock || addingToCartId === product.id}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {addingToCartId === product.id ? t("state.loading") : t("wishlist.addToCart")}
                  </button>
                  <Link
                    href={`/product/${product.slug}`}
                    aria-label={product.name}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleRemove(product.productId || product.id, product.name)}
                    disabled={removingId === (product.productId || product.id)}
                    aria-label={`Remove ${product.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-error hover:text-error disabled:opacity-50"
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
