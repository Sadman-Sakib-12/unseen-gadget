import { MapPin, User, Truck } from "lucide-react";
import type { DeliveryZone } from "@/types/cart";
import { formatBDT } from "@/components/price";

interface CheckoutFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  postalCode: string;
}

interface CheckoutCustomerFormProps {
  formData: CheckoutFormData;
  onChange: (patch: Partial<CheckoutFormData>) => void;
  deliveryZone: DeliveryZone;
  onDeliveryZoneChange: (zone: DeliveryZone) => void;
  insideCost: number;
  outsideCost: number;
  t: (key: string) => string;
}

export function CheckoutCustomerForm({
  formData,
  onChange,
  deliveryZone,
  onDeliveryZoneChange,
  insideCost,
  outsideCost,
  t,
}: CheckoutCustomerFormProps) {
  return (
    <>
      {/* Customer info */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
          <User className="h-4 w-4 text-primary" />
          {t("checkout.customerInfo")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Full Name *</label>
            <input
              type="text"
              name="customerName"
              required
              value={formData.customerName}
              onChange={(e) => onChange({ customerName: e.target.value })}
              className="input-field"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Phone *</label>
            <input
              type="tel"
              name="customerPhone"
              required
              value={formData.customerPhone}
              onChange={(e) => onChange({ customerPhone: e.target.value })}
              className="input-field"
              placeholder="+8801XXXXXXXXX"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-foreground">Email</label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={(e) => onChange({ customerEmail: e.target.value })}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
        </div>
      </section>

      {/* Delivery Zone (Inside Dhaka vs Outside Dhaka) */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
          <Truck className="h-4 w-4 text-primary" />
          Select Delivery Area (ডেলিভারি এরিয়া) *
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Inside Dhaka */}
          <div
            onClick={() => onDeliveryZoneChange("inside-dhaka")}
            className={`cursor-pointer rounded-xl border p-4 transition-all ${
              deliveryZone === "inside-dhaka"
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border bg-muted/20 hover:border-primary/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="deliveryZone"
                checked={deliveryZone === "inside-dhaka"}
                onChange={() => onDeliveryZoneChange("inside-dhaka")}
                className="mt-1 h-4 w-4 text-primary focus:ring-primary cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">
                    Inside Dhaka (ঢাকার ভেতরে)
                  </span>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    {insideCost === 0 ? "FREE" : formatBDT(insideCost)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Home Delivery within 24–48 hours
                </p>
              </div>
            </div>
          </div>

          {/* Outside Dhaka */}
          <div
            onClick={() => onDeliveryZoneChange("outside-dhaka")}
            className={`cursor-pointer rounded-xl border p-4 transition-all ${
              deliveryZone === "outside-dhaka"
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border bg-muted/20 hover:border-primary/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="deliveryZone"
                checked={deliveryZone === "outside-dhaka"}
                onChange={() => onDeliveryZoneChange("outside-dhaka")}
                className="mt-1 h-4 w-4 text-primary focus:ring-primary cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">
                    Outside Dhaka (ঢাকার বাইরে)
                  </span>
                  <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                    {outsideCost === 0 ? "FREE" : formatBDT(outsideCost)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Courier Delivery within 2–4 days
                </p>
              </div>
            </div>
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
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={(e) => onChange({ address: e.target.value })}
              className="input-field"
              placeholder="House, Road, Area"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">City *</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={(e) => onChange({ city: e.target.value })}
              className="input-field"
              placeholder="Dhaka"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={(e) => onChange({ postalCode: e.target.value })}
              className="input-field"
              placeholder="1205"
            />
          </div>
        </div>
      </section>
    </>
  );
}
