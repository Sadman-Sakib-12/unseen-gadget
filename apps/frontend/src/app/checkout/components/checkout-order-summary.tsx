import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { formatBDT } from "@/components/price";
import type { CartItem } from "@/types/cart";
import { CouponBox, type AppliedCoupon } from "@/components/coupon-box";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  savings: number;
  shippingCost: number;
  couponDiscount?: number;
  appliedCoupon?: AppliedCoupon | null;
  onApplyCoupon?: (coupon: AppliedCoupon) => void;
  onRemoveCoupon?: () => void;
  total: number;
  count: number;
  placing: boolean;
  t: (key: string) => string;
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  savings,
  shippingCost,
  couponDiscount = 0,
  appliedCoupon = null,
  onApplyCoupon,
  onRemoveCoupon,
  total,
  count,
  placing,
  t,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-20 space-y-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-bold text-foreground">
            {t("checkout.orderSummary")}
          </h2>

          <div className="max-h-60 space-y-2.5 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain"
                  />
                  <span className="absolute bottom-0 right-0 rounded-tl-md bg-foreground px-1 py-0.2 text-[10px] font-bold text-background">
                    x{item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-xs font-medium text-foreground">
                    {item.name}
                  </p>
                  {item.variantName && (
                    <p className="text-[11px] text-muted-foreground">{item.variantName}</p>
                  )}
                  <p className="text-xs font-semibold text-primary">
                    {formatBDT(item.price)}
                  </p>
                </div>
                <span className="text-xs font-bold text-foreground">
                  {formatBDT(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 border-t border-border pt-3">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                {t("cart.subtotal")} ({count})
              </span>
              <span className="font-medium text-foreground">{formatBDT(subtotal)}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{t("cart.discount")}</span>
                <span className="font-medium text-success">-{formatBDT(savings)}</span>
              </div>
            )}
            {couponDiscount > 0 && appliedCoupon && (
              <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
                <span className="font-medium">Coupon ({appliedCoupon.code})</span>
                <span className="font-bold">-{formatBDT(couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{t("cart.shipping")}</span>
              <span
                className={
                  shippingCost === 0
                    ? "font-medium text-success"
                    : "font-medium text-foreground"
                }
              >
                {shippingCost === 0 ? t("cart.free") : formatBDT(shippingCost)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2.5">
              <span className="text-sm font-bold text-foreground">{t("cart.total")}</span>
              <span className="text-lg font-bold text-foreground">{formatBDT(total)}</span>
            </div>
          </div>

          {onApplyCoupon && onRemoveCoupon && (
            <div className="my-3 border-t border-border pt-3">
              <CouponBox
                subtotal={subtotal}
                appliedCoupon={appliedCoupon}
                onApply={onApplyCoupon}
                onRemove={onRemoveCoupon}
                disabled={placing}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link href="/cart" className="btn-outline">
            <ArrowLeft className="h-4 w-4" />
            {t("checkout.backToCart")}
          </Link>
          <button type="submit" disabled={placing} className="btn-primary">
            {placing ? t("state.loading") : t("checkout.placeOrder")}
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-center">
          <Shield className="h-4 w-4 text-success" />
          <span className="text-[11px] font-medium text-muted-foreground">
            100% Secure Checkout
          </span>
        </div>
      </div>
    </div>
  );
}
