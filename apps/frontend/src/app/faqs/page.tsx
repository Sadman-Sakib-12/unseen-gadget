"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { ChevronRight, HelpCircle, Phone, Mail } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

type FaqItem = { q: string; a: string };
type FaqCategory = { label: string; faqs: FaqItem[] };

export default function FAQsPage() {
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [supportPhone, setSupportPhone] = useState<string>("");
  const [supportEmail, setSupportEmail] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const [faqRes, genRes] = await Promise.all([
          apiRequest("/cms/pages/faq"),
          apiRequest("/cms/general"),
        ]);
        const rawCats =
          faqRes?.data?.categories ||
          faqRes?.data?.content?.categories ||
          (typeof faqRes?.data?.content === "object" ? (faqRes.data.content as any)?.categories : null);
        if (Array.isArray(rawCats) && rawCats.length > 0) {
          setCategories(rawCats);
        } else {
          // Check if delivery-return has faqs from CMS API
          const delivRes = await apiRequest("/cms/pages/delivery-return").catch(() => null);
          const delivFaqs = delivRes?.data?.content?.faqs;
          if (Array.isArray(delivFaqs) && delivFaqs.length > 0) {
            setCategories([
              {
                label: "Delivery & Return FAQs",
                faqs: delivFaqs,
              },
            ]);
          } else {
            setCategories([]);
          }
        }
        if (genRes.data?.supportPhone || genRes.data?.storePhone) {
          setSupportPhone(genRes.data.supportPhone || genRes.data.storePhone);
        }
        if (genRes.data?.supportEmail || genRes.data?.email) {
          setSupportEmail(genRes.data.supportEmail || genRes.data.email);
        }
      } catch (e) {
        setCategories([]);
        console.error("Failed to load FAQs:", e);
      }
    };
    loadFaqs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">
              <span>{t("shop.breadcrumbHome")}</span>
            </Link>
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
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
            <p className="mt-2 text-sm font-semibold text-foreground">No FAQs available yet</p>
            <p className="text-xs text-muted-foreground mt-1">Please contact our support team for any queries.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {categories.map((cat) => (
              <div key={cat.label} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2">
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${cat.label === "Orders & Payment" ? "bg-primary/10 text-primary" : cat.label === "Delivery" ? "bg-success/10 text-success" : cat.label === "Returns & Warranty" ? "bg-violet-500/10 text-violet-500" : cat.label === "Product Authenticity" ? "bg-warning/10 text-warning" : "bg-muted text-foreground"}`}>
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
        )}
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
            {supportPhone && (
              <a
                href={`tel:${supportPhone}`}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-primary transition hover:bg-white/90 shadow-sm"
              >
                <Phone className="h-3.5 w-3.5" /> {supportPhone}
              </a>
            )}
            {supportEmail && (
              <a
                href={`mailto:${supportEmail}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                <Mail className="h-3.5 w-3.5" /> {supportEmail}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
