"use client";

import { RefreshCw, Clock, Shield, CheckCircle, XCircle, Phone } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const features = [
  {
    icon: Clock,
    title: "7-Day Returns",
    desc: "Return any defective product within 7 days of delivery — no questions asked.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: RefreshCw,
    title: "Easy Exchange",
    desc: "Exchange for a different color, variant, or model if available in stock.",
    color: "bg-success/10 text-success",
  },
  {
    icon: Shield,
    title: "Full Refund",
    desc: "Get a complete refund if the product is defective or not as described.",
    color: "bg-violet-500/10 text-violet-500",
  },
];

const eligible = [
  "Product received is defective or damaged",
  "Wrong product delivered",
  "Product is not as described on the website",
  "Missing accessories or parts",
];

const notEligible = [
  "Physical damage caused by the customer",
  "Product opened and used without defect",
  "Return request made after 7 days",
  "Products with tampered serial numbers",
];

const steps = [
  { step: "Contact Us", desc: "Call or WhatsApp us at +8801714039409 with your order details and issue." },
  { step: "Verification", desc: "Our team will verify the issue and approve your return/exchange request." },
  { step: "Ship Back", desc: "We'll arrange a pickup or guide you on how to send the product back." },
  { step: "Resolution", desc: "Receive your replacement or refund within 3–5 business days." },
];

export default function ReturnsPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <span className="transition-colors hover:text-primary">Home</span>
            <span className="text-foreground">{t("policy.returns.breadcrumb")}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-800 via-primary to-primary-600 py-12">
        <div className="container-gadget text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            <RefreshCw className="h-3.5 w-3.5" />
            {t("policy.returns.kicker")}
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">{t("policy.returns.title")}</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/70">{t("policy.returns.hint")}</p>
        </div>
      </div>

      <div className="container-gadget space-y-8 py-10">
        {/* Feature cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
              <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${f.color}`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Eligible / Not eligible */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-success/20 bg-success/5 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
              <CheckCircle className="h-4 w-4 text-success" /> {t("returns.eligible")}
            </h3>
            <ul className="space-y-2.5">
              {eligible.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-error/20 bg-error/5 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
              <XCircle className="h-4 w-4 text-error" /> {t("returns.notEligible")}
            </h3>
            <ul className="space-y-2.5">
              {notEligible.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-error/70" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Process steps */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-6 text-sm font-bold text-foreground">{t("returns.process")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-5 top-5 hidden h-0.5 w-full bg-border lg:block" />
                )}
                <div className="relative flex flex-col gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{s.step}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="flex items-center gap-5 rounded-2xl bg-gradient-to-r from-primary to-primary-800 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <Phone className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">{t("returns.needHelp")}</p>
            <p className="mt-0.5 text-xs text-white/70">
              {t("returns.needHelpHint", { phone: "+8801714039409" })}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
