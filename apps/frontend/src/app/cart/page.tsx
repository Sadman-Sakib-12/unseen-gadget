"use client";

import {
  ChevronRight,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  Truck,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useCartStore, cartItemCount, cartSubtotal, cartSavings } from "@/features/cart-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatBDT } from "@/components/price";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { useTranslation } from "@/hooks/use-translation";

export default function CartPage() {
  const hydrated = useHydrated();
  const { t } = useTranslation();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const shownItems = hydrated ? items : [];
  const count = cartItemCount(shownItems);
  const subtotal = cartSubtotal(shownItems);
  const savings = cartSavings(shownItems);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">{t("shop.breadcrumbHome")}</Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground">{t("cart.breadcrumb")}</span>
          </nav>
        </div>
      </div>

      <div className="container-gadget py-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">{t("cart.title")}</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {shownItems.length}{" "}
              {shownItems.length === 1 ? t("cart.itemInCart") : t("cart.itemsInCart")}
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:underline"
          >
            {t("cart.continueShopping")} <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {shownItems.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cart items */}
            <div className="space-y-3 lg:col-span-2">
              {shownItems.map((item) => (
                <div
                  key={item.key}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="flex gap-4 p-4">
                    {/* Image */}
                    <Link
                      href={`/product/${item.slug}`}
                      className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted"
                    >
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        label={item.name}
                        className="h-full w-full object-contain"
                        iconSize="h-8 w-8"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/product/${item.slug}`}
                            className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
                          >
                            {item.name}
                          </Link>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {item.color && (
                              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                                {t("cart.color")}: {item.color}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.key)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-error/10 hover:text-error"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Qty */}
                        <div className="flex items-center gap-1 rounded-full border border-border">
                          <button
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-base font-bold text-foreground">
                            {formatBDT(item.price * item.quantity)}
                          </p>
                          {item.originalPrice != null && item.originalPrice > item.price && (
                            <p className="text-xs text-muted-foreground line-through">
                              {formatBDT(item.originalPrice * item.quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {item.originalPrice != null && item.originalPrice > item.price && (
                    <div className="flex items-center gap-1.5 border-t border-dashed border-success/30 bg-success/5 px-4 py-2">
                      <Tag className="h-3 w-3 text-success" />
                      <span className="text-[11px] font-medium text-success">
                        {t("cart.saving", {
                          amount: formatBDT((item.originalPrice - item.price) * item.quantity),
                        })}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* Coupon */}
              <div className="rounded-2xl border border-dashed border-border bg-card p-4">
                <p className="mb-2 text-xs font-semibold text-foreground">{t("cart.coupon")}</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t("cart.couponPlaceholder")}
                    className="flex-1 rounded-xl border border-border bg-muted px-3 py-2 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                  />
                  <button className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary">
                    {t("common.apply")}
                  </button>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-3">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="mb-4 text-sm font-bold text-foreground">{t("cart.orderSummary")}</h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t("cart.subtotal")} ({count} {t("common.items")})</span>
                      <span className="font-medium text-foreground">
                        {formatBDT(subtotal)}
                      </span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{t("cart.discount")}</span>
                        <span className="font-medium text-success">
                          -{formatBDT(savings)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t("cart.shipping")}</span>
                      <span className="font-medium text-success">{t("cart.free")}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-2.5">
                      <span className="text-sm font-bold text-foreground">{t("cart.total")}</span>
                      <span className="text-lg font-bold text-foreground">
                        {formatBDT(total)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-700"
                  >
                    {t("cart.checkout")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Trust row */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: Truck, label: t("cart.freeDelivery") },
                    { icon: Shield, label: t("cart.securePay") },
                    { icon: Tag, label: t("cart.bestPrice") },
                  ].map((trust, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card py-3 text-center"
                    >
                      <trust.icon className="h-4 w-4 text-primary" />
                      <span className="text-[10px] font-medium text-muted-foreground">{trust.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-24 text-center">
            <ShoppingCart className="h-14 w-14 text-muted-foreground" strokeWidth={1.2} />
            <h2 className="mt-4 text-lg font-bold text-foreground">{t("cart.empty")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("cart.emptyHint")}
            </p>
            <Link
              href="/"
              className="btn-primary mt-5 rounded-xl"
            >
              {t("common.startShopping")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
