"use client";

import { Truck, Clock, MapPin, Package, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const features = [
  {
    icon: Truck,
    title: "Nationwide Delivery",
    desc: "We deliver to all 64 districts across Bangladesh through trusted courier partners.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Clock,
    title: "Same-Day in Dhaka",
    desc: "Order before 3 PM and receive your package the same day within Dhaka city.",
    color: "bg-success/10 text-success",
  },
  {
    icon: MapPin,
    title: "Live Tracking",
    desc: "Track your order in real-time from our warehouse to your doorstep.",
    color: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: Package,
    title: "Safe Packaging",
    desc: "Every product is carefully packed to ensure it arrives in perfect condition.",
    color: "bg-warning/10 text-warning",
  },
];

const charges = [
  { zone: "Inside Dhaka City", time: "Same Day / Next Day", charge: "Free", highlight: true },
  { zone: "Dhaka Suburbs", time: "1–2 Business Days", charge: "৳60", highlight: false },
  { zone: "Divisional Cities", time: "1–3 Business Days", charge: "৳100", highlight: false },
  { zone: "District Towns", time: "2–4 Business Days", charge: "৳120", highlight: false },
  { zone: "Remote Areas", time: "3–5 Business Days", charge: "৳150–৳200", highlight: false },
];

const steps = [
  "Place your order online or call us at +8801714039409",
  "We confirm stock availability and process your order",
  "Order is packed and handed to our courier partner",
  "You receive an SMS with tracking details",
  "Order delivered to your doorstep",
];

export default function ShippingPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <span className="transition-colors hover:text-primary">Home</span>
            <span className="text-foreground">{t("policy.shipping.breadcrumb")}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-800 via-primary to-primary-600 py-12">
        <div className="container-gadget text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            <Truck className="h-3.5 w-3.5" />
            {t("policy.shipping.kicker")}
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">{t("policy.shipping.title")}</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/70">{t("policy.shipping.hint")}</p>
        </div>
      </div>

      <div className="container-gadget space-y-8 py-10">
        {/* Feature cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.color}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Delivery charges table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-sm font-bold text-foreground">{t("shipping.chargesTitle")}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{t("shipping.chargesHint")}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">{t("shipping.zone")}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">{t("shipping.eta")}</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">{t("shipping.charge")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {charges.map((row) => (
                  <tr
                    key={row.zone}
                    className={row.highlight ? "bg-success/5" : "hover:bg-accent/50"}
                  >
                    <td className="px-6 py-3.5">
                      <span className="text-xs font-medium text-foreground">{row.zone}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-xs text-muted-foreground">{row.time}</span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className={`text-xs font-bold ${row.highlight ? "text-success" : "text-foreground"}`}>
                        {row.highlight ? t("shipping.free") : row.charge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-bold text-foreground">{t("shipping.howWorks")}</h2>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <p className="pt-0.5 text-xs leading-relaxed text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-success/20 bg-success/5 p-5 text-center">
          <CheckCircle className="mx-auto h-6 w-6 text-success" />
          <p className="mt-2 text-sm font-semibold text-foreground">{t("shipping.freeDhaka")}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("shipping.freeDhakaHint")}</p>
        </div>
      </div>
    </>
  );
}
