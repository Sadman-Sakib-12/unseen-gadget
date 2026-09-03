"use client";

import { useState, FormEvent, useEffect } from "react";
import { ChevronRight, Truck, Package } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { apiRequest, orderApi } from "@/lib/api";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatBDT } from "@/components/price";
import { useTranslation } from "@/hooks/use-translation";
import { useSession } from "next-auth/react";
import { type CartItem, normalizeCartItem, calculateOrderShipping } from "@/types/cart";
import { CheckoutCustomerForm } from "./components/checkout-customer-form";
import { CheckoutPaymentSection } from "./components/checkout-payment-section";
import { CheckoutOrderSummary } from "./components/checkout-order-summary";

const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery", desc: "Pay when you receive your order" },
  { id: "bkash", label: "bKash", desc: "Pay via bKash mobile wallet" },
  { id: "nagad", label: "Nagad", desc: "Pay via Nagad mobile wallet" },
];

interface PaymentConfig {
  acceptCashOnDelivery?: boolean;
  acceptMobileBanking?: boolean;
  bkashNumber?: string;
  nagadNumber?: string;
  rocketNumber?: string;
  mobileBankingInstructions?: string;
}

export default function CheckoutPage() {
  const hydrated = useHydrated();
  const { t, language } = useTranslation();
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
    acceptCashOnDelivery: true,
    acceptMobileBanking: true,
    bkashNumber: "",
    nagadNumber: "",
  });

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error(
        language === "bn"
          ? "অর্ডার সম্পন্ন করতে অনুগ্রহ করে প্রথমে লগইন করুন।"
          : "Please log in to proceed with your order."
      );
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router, language]);

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    address: "",
    city: "Dhaka",
    postalCode: "",
  });

  const updateFormData = (patch: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        customerName: prev.customerName || session.user.name || "",
        customerEmail: prev.customerEmail || session.user.email || "",
      }));
    }
  }, [session]);

  useEffect(() => {
    apiRequest("/cms/payment")
      .then((res) => {
        if (res.success && res.data) {
          setPaymentConfig(res.data);
        }
      })
      .catch(() => {});

    apiRequest("/auth/me")
      .then((res) => {
        const user = res.data?.user || res.data;
        if (user) {
          setFormData((prev) => ({
            ...prev,
            customerName: prev.customerName || user.name || "",
            customerPhone: prev.customerPhone || user.phone || "",
            customerEmail: prev.customerEmail || user.email || "",
          }));
        }
      })
      .catch(() => {});

    apiRequest("/address/default")
      .then((res) => {
        if (res.data) {
          setFormData((prev) => ({
            ...prev,
            address: prev.address || res.data.address || "",
            city: prev.city || res.data.city || "Dhaka",
            postalCode: prev.postalCode || res.data.zipCode || res.data.postalCode || "",
          }));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    apiRequest("/cart/current")
      .then((res) => {
        const rawItems = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.items)
          ? res.data.items
          : [];
        setItems(rawItems.map(normalizeCartItem));
      })
      .catch(() => {
        setItems([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const shownItems = hydrated ? items : [];
  const count = shownItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = shownItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = shownItems.reduce((sum, item) => {
    if (item.originalPrice != null && item.originalPrice > item.price) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  const [payment, setPayment] = useState(PAYMENT_METHODS[0].id);
  const [placing, setPlacing] = useState(false);
  const [trxId, setTrxId] = useState("");

  const shippingCost = calculateOrderShipping(shownItems);
  const total = subtotal + shippingCost;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (shownItems.length === 0) return;
    if ((payment === "bkash" || payment === "nagad") && !trxId.trim()) {
      toast.error(`Please enter your ${payment.toUpperCase()} Transaction ID (TrxID)`);
      return;
    }

    const customerName = formData.customerName.trim();
    const customerPhone = formData.customerPhone.trim();
    const customerEmail = formData.customerEmail.trim() || session?.user?.email || undefined;
    const fullShippingAddress = [
      formData.address.trim(),
      formData.city.trim(),
      formData.postalCode.trim(),
    ]
      .filter(Boolean)
      .join(", ");

    if (!session?.user) {
      toast.error(
        language === "bn"
          ? "অর্ডার সম্পন্ন করতে অনুগ্রহ করে লগইন করুন।"
          : "Please log in to place an order."
      );
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    if (!customerName) {
      toast.error("Please enter your name");
      return;
    }
    if (!customerPhone) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }

    setPlacing(true);
    try {
      const res = await orderApi.checkout({
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: fullShippingAddress,
        paymentMethod: payment.toUpperCase() as "COD" | "BKASH" | "NAGAD",
        items: shownItems.map((item) => ({
          productId: String(item.productId),
          variantId: item.variantId ? String(item.variantId) : undefined,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      if ((payment === "bkash" || payment === "nagad") && trxId.trim() && res?.data?.id) {
        await apiRequest("/payment", {
          method: "POST",
          body: JSON.stringify({
            orderId: res.data.id,
            customerName,
            amount: total,
            method: payment === "bkash" ? "bKash" : "Nagad",
            transactionId: trxId.trim(),
          }),
        }).catch(() => {});
      }

      await apiRequest("/cart/current/clear", { method: "POST" }).catch(() => {});

      toast.success(
        language === "bn"
          ? "আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!"
          : "Your order has been placed successfully!"
      );
      router.push(`/account/orders`);
    } catch (err: unknown) {
      const msg =
        (err as { message?: string }).message ||
        (language === "bn"
          ? "অর্ডার সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।"
          : "Could not place order. Please try again.");
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
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
            <Link href="/cart" className="transition-colors hover:text-primary">
              {t("cart.breadcrumb")}
            </Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground">{t("checkout.title")}</span>
          </nav>
        </div>
      </div>

      <div className="container-gadget py-6">
        <h1 className="mb-6 text-xl font-bold text-foreground">{t("checkout.title")}</h1>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-24 text-center">
            <Package className="h-12 w-12 text-muted-foreground" strokeWidth={1.2} />
            <h3 className="mt-3 text-sm font-semibold text-foreground">Loading cart...</h3>
            <p className="mt-1 text-sm text-muted-foreground">Please wait while we fetch your cart.</p>
          </div>
        ) : shownItems.length === 0 ? (
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
                <CheckoutCustomerForm
                  formData={formData}
                  onChange={updateFormData}
                  t={t}
                />

                {/* Delivery info */}
                <section className="rounded-2xl border border-border bg-card p-5">
                  <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
                    <Truck className="h-4 w-4 text-primary" />
                    {t("checkout.deliveryMethod")}
                  </h2>
                  <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">Standard Delivery</p>
                        <p className="text-xs text-muted-foreground">
                          {shippingCost === 0
                            ? "Free Shipping on your order"
                            : "Calculated per product"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={
                        shippingCost === 0
                          ? "text-sm font-semibold text-success"
                          : "text-sm font-semibold text-foreground"
                      }
                    >
                      {shippingCost === 0 ? t("cart.free") : formatBDT(shippingCost)}
                    </span>
                  </div>
                </section>

                <CheckoutPaymentSection
                  payment={payment}
                  onPaymentChange={setPayment}
                  trxId={trxId}
                  onTrxIdChange={setTrxId}
                  paymentConfig={paymentConfig}
                  paymentMethods={PAYMENT_METHODS}
                  total={total}
                  t={t}
                />
              </div>

              {/* Right: order summary */}
              <CheckoutOrderSummary
                items={shownItems}
                subtotal={subtotal}
                savings={savings}
                shippingCost={shippingCost}
                total={total}
                count={count}
                placing={placing}
                t={t}
              />
            </div>
          </form>
        )}
      </div>
    </>
  );
}
