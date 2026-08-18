"use client";

import { Shield, CheckCircle, XCircle, Clock, Phone, Wrench } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const covered = [
  "Manufacturing defects",
  "Hardware component failures",
  "Software or firmware issues",
  "Battery defects (capacity below 80% within warranty)",
  "Display or speaker malfunctions",
];

const notCovered = [
  "Physical damage from drops or impacts",
  "Water or liquid damage",
  "Unauthorized repairs or modifications",
  "Accidental damage",
  "Normal wear and tear",
];

const periods = [
  { product: "iPhones & iPads", period: "1 Year", provider: "Apple Official", color: "bg-primary/10 text-primary" },
  { product: "MacBooks & iMac", period: "1 Year", provider: "Apple Official", color: "bg-primary/10 text-primary" },
  { product: "Samsung Devices", period: "1 Year", provider: "Samsung Bangladesh", color: "bg-indigo-500/10 text-indigo-500" },
  { product: "Accessories", period: "6 Months", provider: "Brand Warranty", color: "bg-violet-500/10 text-violet-500" },
  { product: "Headphones & Audio", period: "6–12 Months", provider: "Brand Warranty", color: "bg-success/10 text-success" },
  { product: "Smartwatches", period: "1 Year", provider: "Brand Warranty", color: "bg-warning/10 text-warning" },
];

const claimSteps = [
  { n: "1", title: "Contact Support", desc: "Call or message us with your order number and a description of the issue." },
  { n: "2", title: "Diagnosis", desc: "We'll assess the issue and determine if it falls under warranty coverage." },
  { n: "3", title: "Resolution", desc: "Receive a repair, replacement, or refund depending on the nature of the defect." },
];

export default function WarrantyPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <span className="transition-colors hover:text-primary">Home</span>
            <span className="text-foreground">{t("policy.warranty.breadcrumb")}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-800 via-primary to-primary-600 py-12">
        <div className="container-gadget text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            <Shield className="h-3.5 w-3.5" />
            {t("policy.warranty.kicker")}
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">{t("policy.warranty.title")}</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/70">{t("policy.warranty.hint")}</p>
        </div>
      </div>

      <div className="container-gadget space-y-8 py-10">
        {/* Covered / Not covered */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
              <CheckCircle className="h-4 w-4 text-success" /> {t("warranty.covered")}
            </h3>
            <ul className="space-y-2.5">
              {covered.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
              <XCircle className="h-4 w-4 text-error" /> {t("warranty.notCovered")}
            </h3>
            <ul className="space-y-2.5">
              {notCovered.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-error/70" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Warranty periods */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-sm font-bold text-foreground">{t("warranty.periods")}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">{t("warranty.category")}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">{t("warranty.period")}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">{t("warranty.provider")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {periods.map((row) => (
                  <tr key={row.product} className="hover:bg-accent/50">
                    <td className="px-6 py-3.5">
                      <span className="text-xs font-medium text-foreground">{row.product}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 text-muted-foreground" /> {row.period}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${row.color}`}>
                        {row.provider}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Claim process */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-sm font-bold text-foreground">
            <Wrench className="h-4 w-4 text-primary" /> {t("warranty.claim")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {claimSteps.map((s) => (
              <div key={s.n} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {s.n}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{s.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
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
            <p className="text-sm font-bold text-white">{t("warranty.issueTitle")}</p>
            <p className="mt-0.5 text-xs text-white/70">
              {t("warranty.issueHint", { phone: "+8801714039409", email: "support@unseengadget.com" })}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
