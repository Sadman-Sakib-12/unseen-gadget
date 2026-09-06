"use client";

import { useState } from "react";
import { Tag, CheckCircle2, X, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { couponApi } from "@/lib/api";
import { formatBDT } from "@/components/price";

export interface AppliedCoupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  discountAmount: number;
  minimumOrder?: number;
  maximumDiscount?: number | null;
}

const STORAGE_KEY = "unseen_applied_coupon";

export function getStoredCoupon(): AppliedCoupon | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredCoupon(coupon: AppliedCoupon): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupon));
  } catch {}
}

export function clearStoredCoupon(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

interface CouponBoxProps {
  subtotal: number;
  appliedCoupon: AppliedCoupon | null;
  onApply: (coupon: AppliedCoupon) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function CouponBox({
  subtotal,
  appliedCoupon,
  onApply,
  onRemove,
  disabled = false,
}: CouponBoxProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      toast.error("অনুগ্রহ করে একটি কুপন কোড লিখুন / Please enter a coupon code");
      return;
    }

    if (subtotal <= 0) {
      toast.error("কার্ট খালি থাকলে কুপন ব্যবহার করা যাবে না / Cart is empty");
      return;
    }

    setLoading(true);
    try {
      const res = await couponApi.validate({
        code: cleanCode,
        amount: subtotal,
      });

      if (res.success && res.data?.coupon) {
        const couponData: AppliedCoupon = res.data.coupon;
        setStoredCoupon(couponData);
        onApply(couponData);
        setCode("");
        toast.success(
          `কুপন "${couponData.code}" যোগ হয়েছে! ছাড়: ${formatBDT(couponData.discountAmount)}`
        );
      } else {
        toast.error(res.message || "Invalid coupon code");
      }
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        "Invalid or expired coupon code";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    clearStoredCoupon();
    onRemove();
    toast.info("কুপন সরিয়ে নেওয়া হয়েছে / Coupon removed");
  };

  if (appliedCoupon) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                  {appliedCoupon.code}
                </span>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-[11px] font-medium text-muted-foreground truncate">
                Discount: {formatBDT(appliedCoupon.discountAmount)} off
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer disabled:opacity-50"
            title="Remove coupon"
          >
            <X className="h-3.5 w-3.5" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Tag className="h-3.5 w-3.5 text-primary" />
        <span>Have a promo coupon?</span>
      </div>
      <form onSubmit={handleApply} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, ""))}
            placeholder="PROMO CODE"
            disabled={disabled || loading}
            autoCapitalize="characters"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono font-medium uppercase tracking-wider text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={disabled || loading || !code.trim()}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Applying...</span>
            </>
          ) : (
            <span>Apply</span>
          )}
        </button>
      </form>
    </div>
  );
}
