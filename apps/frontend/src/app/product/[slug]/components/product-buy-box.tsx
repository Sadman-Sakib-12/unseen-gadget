"use client";

import {
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Heart,
  Share2,
  Phone,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import { formatBDT } from "@/components/price";

interface ProductBuyBoxProps {
  product: any;
  selectedVariant: any;
  effectiveVariantIndex: number | null;
  setSelectedVariantIndex: (idx: number) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string) => void;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  outOfStock: boolean;
  addingToCart: boolean;
  wishlisted: boolean;
  wishlistLoading: boolean;
  supportPhone?: string;
  colorHex: (colorName: string) => string;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onToggleWishlist: () => void;
  t: (key: string) => string;
}

export function ProductBuyBox({
  product,
  selectedVariant,
  effectiveVariantIndex,
  setSelectedVariantIndex,
  selectedColor,
  setSelectedColor,
  quantity,
  setQuantity,
  outOfStock,
  addingToCart,
  wishlisted,
  wishlistLoading,
  supportPhone,
  colorHex,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  t,
}: ProductBuyBoxProps) {
  return (
    <>
      {/* Product Variants Selection */}
      {product.variants && product.variants.length > 0 && (
        <div className="mt-4">
          <span className="mb-2 block text-[13px] font-medium text-foreground">
            Variant: <span className="font-semibold text-foreground">{selectedVariant?.name}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v: any, idx: number) => {
              const active = (effectiveVariantIndex ?? 0) === idx;
              const isOut = (v.stock ?? 0) <= 0;
              return (
                <button
                  key={v.id || idx}
                  onClick={() => {
                    setSelectedVariantIndex(idx);
                    if (product.colors?.includes(v.name)) {
                      setSelectedColor(v.name);
                    }
                  }}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[12.5px] font-medium transition-all ${
                    active
                      ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                      : isOut
                      ? "border-border bg-muted/40 text-muted-foreground opacity-60 hover:opacity-100"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  }`}
                >
                  {v.images && v.images.length > 0 && (
                    <img
                      src={v.images[0]}
                      alt={v.name}
                      className="h-6 w-6 rounded object-cover border border-border"
                    />
                  )}
                  <span className="font-semibold">{v.name}</span>
                  {v.price && v.price !== product.price ? (
                    <span className="text-[11px] text-muted-foreground">
                      ({formatBDT(v.price)})
                    </span>
                  ) : null}
                  {isOut && (
                    <span className="text-[10px] font-bold text-error">
                      (Out of stock)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color variants (if distinct from variants) */}
      {product.colors && product.colors.length > 0 && (!product.variants || product.variants.length === 0) && (
        <div className="mt-4">
          <span className="mb-2 block text-[13px] font-medium text-foreground">
            {t("common.color")}: <span className="text-foreground">{selectedColor}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color: string) => {
              const active = selectedColor === color;
              return (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                  }}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    active
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-border"
                    style={{ backgroundColor: colorHex(color) }}
                  />
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="mt-5 flex items-center gap-4">
        <span className="text-[13px] font-medium text-foreground">{t("common.quantity")}:</span>
        <div className="flex items-center rounded-full border border-border bg-card">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-[14px] font-bold text-foreground">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 space-y-3">
        <button
          disabled={outOfStock || addingToCart}
          onClick={onAddToCart}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-[14px] font-bold text-primary-foreground transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart className="h-5 w-5" />
          {addingToCart ? t("state.loading") : t("pdp.addToCart")}
        </button>
        <button
          disabled={outOfStock || addingToCart}
          onClick={onBuyNow}
          className="flex w-full items-center justify-center rounded-full border border-primary bg-card py-3 text-[14px] font-bold text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Zap className="h-5 w-5" />
          {addingToCart ? t("state.loading") : t("pdp.buyNow")}
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onToggleWishlist}
            disabled={wishlistLoading}
            className={`flex items-center justify-center gap-2 rounded-full border py-2.5 text-[12.5px] font-medium transition-colors ${
              wishlisted
                ? "border-error bg-error text-white"
                : "border-border bg-card text-muted-foreground hover:border-error/60 hover:text-error"
            }`}
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-white" : ""}`} />
            {wishlisted ? t("pdp.wishlisted") : t("pdp.wishlist")}
          </button>
          <button className="flex items-center justify-center gap-2 rounded-full border border-border bg-card py-2.5 text-[12.5px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <Share2 className="h-4 w-4" />
            {t("pdp.share")}
          </button>
        </div>
      </div>

      {/* Quick order by phone */}
      {supportPhone ? (
        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="text-center">
            <p className="mb-2 text-[13px] font-semibold text-primary">
              {t("pdp.quickOrder")}
            </p>
            <a
              href={`tel:${supportPhone}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[12.5px] font-bold text-primary-foreground transition-colors hover:bg-primary-700"
            >
              <Phone className="h-4 w-4" />
              {t("pdp.call")}: {supportPhone}
            </a>
          </div>
        </div>
      ) : null}

      {/* Service info */}
      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl border border-border bg-muted/40 p-3">
          <Truck className="mx-auto mb-1 h-5 w-5 text-primary" />
          <div className="text-[12px] font-semibold text-foreground">{t("pdp.freeDelivery")}</div>
          <div className="text-[11px] text-muted-foreground">{t("pdp.insideDhaka")}</div>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-3">
          <Shield className="mx-auto mb-1 h-5 w-5 text-success" />
          <div className="text-[12px] font-semibold text-foreground">1 Year</div>
          <div className="text-[11px] text-muted-foreground">{t("pdp.warranty")}</div>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-3">
          <RefreshCw className="mx-auto mb-1 h-5 w-5 text-warning" />
          <div className="text-[12px] font-semibold text-foreground">7 Days</div>
          <div className="text-[11px] text-muted-foreground">{t("pdp.returnDays")}</div>
        </div>
      </div>
    </>
  );
}
