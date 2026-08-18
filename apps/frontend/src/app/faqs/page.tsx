"use client";

import Link from "next/link";
import { ChevronRight, HelpCircle, Phone, Mail } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const categories = [
  {
    label: "Orders & Payment",
    color: "bg-primary/10 text-primary",
    faqs: [
      {
        q: "How can I place an order?",
        a: "Browse our products, select what you want, and click 'Add to Cart'. Then proceed to checkout and fill in your delivery details.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept cash on delivery, bKash, Nagad, Rocket, and bank transfers. All online payments are processed securely.",
      },
    ],
  },
  {
    label: "Delivery",
    color: "bg-success/10 text-success",
    faqs: [
      {
        q: "How long does delivery take?",
        a: "Same-day delivery in Dhaka. For other areas, delivery typically takes 1–3 business days across Bangladesh.",
      },
      {
        q: "Do you deliver nationwide?",
        a: "Yes, we deliver to all 64 districts across Bangladesh through reliable courier partners.",
      },
    ],
  },
  {
    label: "Returns & Warranty",
    color: "bg-violet-500/10 text-violet-500",
    faqs: [
      {
        q: "Do you offer warranty on products?",
        a: "Yes, all our products come with official brand warranty. The warranty period varies by product and brand.",
      },
      {
        q: "What is your return policy?",
        a: "We have a 7-day return policy for defective products. The product must be in original condition with all accessories.",
      },
    ],
  },
  {
    label: "Product Authenticity",
    color: "bg-warning/10 text-warning",
    faqs: [
      {
        q: "Are all products genuine?",
        a: "Yes, we guarantee 100% authentic products sourced directly from authorized distributors and official brands.",
      },
      {
        q: "Can I verify product authenticity?",
        a: "Absolutely. All our products come with manufacturer serial numbers and warranty cards that can be verified.",
      },
    ],
  },
];

export default function FAQsPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">{t("shop.breadcrumbHome")}</Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground">{t("faqs.title")}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-800 via-primary to-primary-600 py-12">
        <div className="container-gadget text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            <HelpCircle className="h-3.5 w-3.5" />
            {t("faqs.kicker")}
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">{t("faqs.breadcrumb")}</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
            {t("faqs.subtitle")}
          </p>
        </div>
      </div>

      <div className="container-gadget py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          {categories.map((cat) => (
            <div key={cat.label} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${cat.color}`}>
                  {cat.label}
                </span>
              </div>
              <div className="space-y-4">
                {cat.faqs.map((faq) => (
                  <div key={faq.q} className="rounded-xl border border-border bg-muted/40 p-4">
                    <p className="flex items-start gap-2 text-sm font-semibold text-foreground">
                      <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {faq.q}
                    </p>
                    <p className="mt-2 pl-6 text-xs leading-relaxed text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-primary to-primary-800 p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="text-white">
              <h2 className="text-lg font-bold">{t("faqs.still")}</h2>
              <p className="mt-1 text-sm text-white/70">
                {t("faqs.stillHint")}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end sm:justify-center">
              <a
                href="tel:+8801714039409"
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-muted"
              >
                <Phone className="h-4 w-4" /> {t("faqs.callUs")}
              </a>
              <a
                href="mailto:support@unseengadget.com"
                className="flex items-center gap-2 rounded-xl bg-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/25"
              >
                <Mail className="h-4 w-4" /> {t("faqs.emailSupport")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
