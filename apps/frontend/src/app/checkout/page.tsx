"use client";

import { useState, FormEvent } from "react";
import { ChevronRight, Truck, Shield, CreditCard, MapPin, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCartStore, cartItemCount, cartSubtotal, cartSavings } from "@/features/cart-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatBDT } from "@/components/price";
import { useTranslation } from "@/hooks/use-translation";

const deliveryMethods = [
  { id: "inside-dhaka", label: "Inside Dhaka", note: "1-2 business days", cost: 0 },
  { id: "outside-dhaka", label: "Outside Dhaka", note: "2-4 business days", cost: 100 },
];

const paymentMethods = [
  { id: "cod", label: "Cash on Delivery", desc: "Pay when you receive your order" },
  { id: "bkash", label: "bKash", desc: "Pay via bKash mobile wallet" },
  { id: "nagad", label: "Nagad", desc: "Pay via Nagad mobile wallet" },
  { id: "card", label: "Debit / Credit Card", desc: "VISA, Mastercard, Amex" },
];

export default function CheckoutPage() {
  const hydrated = useHydrated();
  const { t } = useTranslation();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const shownItems = hydrated ? items : [];
  const count = cartItemCount(shownItems);
  const subtotal = cartSubtotal(shownItems);
  const savings = cartSavings(shownItems);

  const [delivery, setDelivery] = useState(deliveryMethods[0].id);
  const [payment, setPayment] = useState(paymentMethods[0].id);
  const [placing, setPlacing] = useState(false);

  const deliveryCost = deliveryMethods.find((d) => d.id === delivery)?.cost ?? 0;
  const total = subtotal + deliveryCost;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (shownItems.length === 0) return;
    setPlacing(true);
    // Simulate order placement; cart is a demo storefront.
    window.setTimeout(() => {
      clearCart();
      setPlacing(false);
      toast.success("Order placed successfully!");
      router.push("/account/orders");
    }, 800);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">{t("shop.breadcrumbHome")}</Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <Link href="/cart" className="transition-colors hover:text-primary">{t("cart.breadcrumb")}</Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground">{t("checkout.title")}</span>
          </nav>
        </div>
      </div>

      <div className="container-gadget py-6">
        <h1 className="mb-6 text-xl font-bold text-foreground">{t("checkout.title")}</h1>

        {shownItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-24 text-center">
            <h2 className="text-lg font-bold text-foreground">{t("cart.empty")}</h2>
            <Link href="/products" className="btn-primary mt-5 rounded-xl">
              {t("common.startShopping")}
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left: forms */}
              <div className="space-y-4 lg:col-span-2">
                {/* Customer info */}
                <section className="rounded-2xl border border-border bg-card p-5">
                  <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
                    <User className="h-4 w-4 text-primary" />
                    {t("checkout.customerInfo")}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-foreground">Full Name *</label>
                      <input type="text" required className="input-field" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-foreground">Phone *</label>
                      <input type="tel" required className="input-field" placeholder="+8801XXXXXXXXX" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-foreground">Email</label>
                      <input type="email" className="input-field" placeholder="you@example.com" />
                    </div>
                  </div>
                </section>

                {/* Shipping address */}
                <section className="rounded-2xl border border-border bg-card p-5">
                  <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {t("checkout.shippingAddress")}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-foreground">Address *</label>
                      <input type="text" required className="input-field" placeholder="House, Road, Area" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-foreground">City *</label>
                      <input type="text" required className="input-field" placeholder="Dhaka" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-foreground">Postal Code</label>
                      <input type="text" className="input-field" placeholder="1205" />
                    </div>
                  </div>
                </section>

                {/* Delivery method */}
                <section className="rounded-2xl border border-border bg-card p-5">
                  <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
                    <Truck className="h-4 w-4 text-primary" />
                    {t("checkout.deliveryMethod")}
                  </h2>
                  <div className="space-y-2">
                    {deliveryMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                          delivery === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="delivery"
                            value={method.id}
                            checked={delivery === method.id}
                            onChange={() => setDelivery(method.id)}
                            className="h-4 w-4 accent-primary"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">{method.label}</p>
                            <p className="text-xs text-muted-foreground">{method.note}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {method.cost === 0 ? t("cart.free") : formatBDT(method.cost)}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>

                {/* Payment method */}
                <section className="rounded-2xl border border-border bg-card p-5">
                  <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
                    <CreditCard className="h-4 w-4 text-primary" />
                    {t("checkout.paymentMethod")}
                  </h2>
                  <div className="space-y-2">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                          payment === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={payment === method.id}
                            onChange={() => setPayment(method.id)}
                            className="h-4 w-4 accent-primary"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">{method.label}</p>
                            <p className="text-xs text-muted-foreground">{method.desc}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right: order summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <h3 className="mb-4 text-sm font-bold text-foreground">{t("checkout.orderSummary")}</h3>
                    <div className="mb-4 max-h-48 space-y-3 overflow-y-auto">
                      {shownItems.map((item) => (
                        <div key={item.key} className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-[10px] font-bold text-muted-foreground">
                            {item.quantity}×
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-foreground">{item.name}</p>
                            {item.color && <p className="text-[10px] text-muted-foreground">{item.color}</p>}
                          </div>
                          <span className="text-xs font-semibold text-foreground">
                            {formatBDT(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2.5 border-t border-border pt-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{t("cart.subtotal")} ({count})</span>
                        <span className="font-medium text-foreground">{formatBDT(subtotal)}</span>
                      </div>
                      {savings > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{t("cart.discount")}</span>
                          <span className="font-medium text-success">-{formatBDT(savings)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{t("cart.shipping")}</span>
                        <span className="font-medium text-foreground">
                          {deliveryCost === 0 ? t("cart.free") : formatBDT(deliveryCost)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-border pt-2.5">
                        <span className="text-sm font-bold text-foreground">{t("cart.total")}</span>
                        <span className="text-lg font-bold text-foreground">{formatBDT(total)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/cart" className="btn-outline">
                      <ArrowLeft className="h-4 w-4" />
                      {t("checkout.backToCart")}
                    </Link>
                    <button
                      type="submit"
                      disabled={placing}
                      className="btn-primary"
                    >
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
            </div>
          </form>
        )}
      </div>
    </>
  );
}
