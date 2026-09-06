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
  Package,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useHydrated } from "@/hooks/use-hydrated";
import { useTranslation } from "@/hooks/use-translation";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";

import { type CartItem, normalizeCartItem, calculateOrderShipping } from "@/types/cart";
import { CouponBox, type AppliedCoupon, getStoredCoupon } from "@/components/coupon-box";

function formatBDT(amount: number) {
  return `৳${amount.toLocaleString("en-BD", { minimumFractionDigits: 0 })}`;
}

export default function CartPage() {
  const hydrated = useHydrated();
  const { t, language } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  const fetchCart = () => {
    apiRequest("/cart/current")
      .then((res) => {
        const rawItems = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.items)
          ? res.data.items
          : [];
        setCart(rawItems.map(normalizeCartItem));
      })
      .catch(() => {
        setCart([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCart();
    const stored = getStoredCoupon();
    if (stored) {
      setAppliedCoupon(stored);
    }
  }, []);

  const items = hydrated ? cart : [];
  const count = items.length;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = items.reduce((sum, item) => {
    if (item.originalPrice != null && item.originalPrice > item.price) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);
  const shipping = calculateOrderShipping(items);
  const couponDiscount = appliedCoupon ? Math.min(appliedCoupon.discountAmount, subtotal) : 0;
  const total = Math.max(0, subtotal + shipping - couponDiscount);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    apiRequest(`/cart/current/items/${id}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }).catch(() => {});
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: string) => {
    apiRequest(`/cart/current/items/${id}`, { method: "DELETE" }).catch(() => {});
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">
              {t("shop.breadcrumbHome")}
            </Link>
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
              {items.length}{" "}
              {items.length === 1 ? t("cart.itemInCart") : t("cart.itemsInCart")}
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:underline"
          >
            {t("cart.continueShopping")}{" "}
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card py-20 text-center">
            <Package className="h-12 w-12 text-muted-foreground" strokeWidth={1.2} />
            <h3 className="mt-3 text-sm font-semibold text-foreground">
              Loading cart...
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Please wait while we fetch your cart.
            </p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cart items */}
            <div className="space-y-3 lg:col-span-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="flex gap-4 p-4">
                    <Link
                      href={`/product/${item.slug}`}
                      className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
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
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-error/10 hover:text-error"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-full border border-border">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-base font-bold text-foreground">
                            {formatBDT(item.price * item.quantity)}
                          </p>
                          {item.originalPrice != null &&
                            item.originalPrice > item.price && (
                              <p className="text-xs text-muted-foreground line-through">
                                {formatBDT(item.originalPrice * item.quantity)}
                              </p>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-3">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="mb-4 text-sm font-bold text-foreground">
                    {t("cart.orderSummary")}
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {t("cart.subtotal")} ({count} {t("common.items")})
                      </span>
                      <span className="font-medium text-foreground">
                        {formatBDT(subtotal)}
                      </span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {t("cart.discount")}
                        </span>
                        <span className="font-medium text-success">
                          -{formatBDT(savings)}
                        </span>
                      </div>
                    )}
                    {couponDiscount > 0 && appliedCoupon && (
                      <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
                        <span className="font-medium">
                          Coupon ({appliedCoupon.code})
                        </span>
                        <span className="font-bold">
                          -{formatBDT(couponDiscount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {t("cart.shipping")}
                      </span>
                      <span className={shipping === 0 ? "font-medium text-success" : "font-medium text-foreground"}>
                        {shipping === 0 ? t("cart.free") : formatBDT(shipping)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-2.5">
                      <span className="text-sm font-bold text-foreground">
                        {t("cart.total")}
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        {formatBDT(total)}
                      </span>
                    </div>
                  </div>

                  <div className="my-4 border-t border-border pt-3">
                    <CouponBox
                      subtotal={subtotal}
                      appliedCoupon={appliedCoupon}
                      onApply={(coupon) => setAppliedCoupon(coupon)}
                      onRemove={() => setAppliedCoupon(null)}
                      disabled={count === 0}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!session?.user) {
                        toast.error(
                          language === "bn"
                            ? "অর্ডার করতে অনুগ্রহ করে প্রথমে লগইন করুন।"
                            : "Please log in to proceed to checkout."
                        );
                        router.push("/login?callbackUrl=/checkout");
                      } else {
                        router.push("/checkout");
                      }
                    }}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-700 cursor-pointer"
                  >
                    {t("cart.checkout")} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

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
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {trust.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-24 text-center">
            <ShoppingCart
              className="h-14 w-14 text-muted-foreground"
              strokeWidth={1.2}
            />
            <h2 className="mt-4 text-lg font-bold text-foreground">
              {t("cart.empty")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("cart.emptyHint")}
            </p>
            <Link href="/products" className="btn-primary mt-5 rounded-xl">
              {t("common.startShopping")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
