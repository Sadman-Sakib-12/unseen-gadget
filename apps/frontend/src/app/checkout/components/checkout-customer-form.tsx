import { MapPin, User } from "lucide-react";

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
  t: (key: string) => string;
}

export function CheckoutCustomerForm({ formData, onChange, t }: CheckoutCustomerFormProps) {
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
