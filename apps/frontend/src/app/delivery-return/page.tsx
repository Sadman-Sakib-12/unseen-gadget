"use client";

import { useEffect, useState } from "react";
import {
  Truck,
  Package,
  ShoppingBag,
  Smartphone,
  MapPin,
  ChevronDown,
  Loader2,
  Phone,
  Mail,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

interface ProcessStep {
  step: string;
  title: string;
  icon?: string;
}

interface ChargeRow {
  label: string;
  value: string;
}

interface ChargeTable {
  header: string;
  rows: ChargeRow[];
}

interface ReturnSectionItem {
  term?: string;
  text: string;
}

interface ReturnSection {
  id: string;
  heading: string;
  intro?: string;
  items?: ReturnSectionItem[];
  isNumbered?: boolean;
  hasDividerAfter?: boolean;
}

interface FaqItem {
  q: string;
  a: string;
}

interface DeliveryReturnData {
  heroTitle?: string;
  heroSubtitle?: string;
  overviewHeading?: string;
  overviewDescription?: string;
  processSteps?: ProcessStep[];
  chargeTables?: {
    standard?: ChargeTable;
    sameDay?: ChargeTable;
  };
  lastUpdated?: string;
  returnHeading?: string;
  returnIntro?: string;
  returnSections?: ReturnSection[];
  shippingReturnAddress?: {
    companyName?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  faqs?: FaqItem[];
}

export default function DeliveryReturnPage() {
  const [data, setData] = useState<DeliveryReturnData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    apiRequest("/cms/pages/delivery-return")
      .then((res) => {
        if (res.data) {
          const content = res.data.content || {};
          setData({
            heroTitle: content.heroTitle || res.data.title || "Delivery & Return",
            heroSubtitle: content.heroSubtitle || "",
            overviewHeading: content.overviewHeading || "Delivery Options Overview",
            overviewDescription: content.overviewDescription || "",
            processSteps: Array.isArray(content.processSteps) ? content.processSteps : [],
            chargeTables: content.chargeTables || null,
            lastUpdated:
              content.lastUpdated ||
              (res.data.lastUpdated
                ? new Date(res.data.lastUpdated).toLocaleDateString("en-GB")
                : ""),
            returnHeading: content.returnHeading || "Exchange or Return of Goods",
            returnIntro: content.returnIntro || "",
            returnSections: Array.isArray(content.returnSections) ? content.returnSections : [],
            shippingReturnAddress: content.shippingReturnAddress || null,
            faqs: Array.isArray(content.faqs) ? content.faqs : [],
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load delivery-return from CMS:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background py-6 sm:py-10">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 space-y-10">
        {/* ═══ 1. Blue Hero Banner ═══ */}
        <div className="relative overflow-hidden rounded-2xl bg-blue-600 px-6 py-8 sm:px-10 sm:py-10 text-white shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-lg text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {data.heroTitle}
              </h1>
              <p className="text-xs sm:text-[13.5px] leading-relaxed text-blue-100">
                {data.heroSubtitle}
              </p>
            </div>
            <div className="shrink-0 flex items-center justify-center">
              <div className="relative flex h-24 w-28 sm:h-28 sm:w-32 items-center justify-center rounded-xl bg-blue-500/30 p-2 border border-blue-400/30">
                <Package className="h-16 w-16 text-white drop-shadow-md" />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ 2. Delivery Options Overview ═══ */}
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            {data.overviewHeading}
          </h2>
          {data.overviewDescription && (
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              {data.overviewDescription}
            </p>
          )}

          {/* 4 Process Cards */}
          {data.processSteps && data.processSteps.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
              {data.processSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-between rounded-xl border border-border bg-card p-4 text-center shadow-2xs hover:border-primary/40 transition-colors"
                >
                  <p className="text-[11px] font-semibold text-foreground leading-tight min-h-[34px]">
                    {step.title}
                  </p>
                  <div className="my-3 flex h-14 w-full items-center justify-center rounded-lg bg-muted/40 text-blue-600">
                    {idx === 0 && <ShoppingBag className="h-7 w-7 stroke-[1.5]" />}
                    {idx === 1 && <Smartphone className="h-7 w-7 stroke-[1.5]" />}
                    {idx === 2 && <Truck className="h-7 w-7 stroke-[1.5]" />}
                    {idx === 3 && <MapPin className="h-7 w-7 stroke-[1.5]" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ═══ 3. Delivery Charges Table ═══ */}
        {data.chargeTables && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Package className="h-4 w-4 text-blue-600" />
              <span>Small items</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Standard delivery */}
              {data.chargeTables.standard && (
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
                  <div className="bg-blue-600 px-4 py-2.5 text-xs font-bold text-white">
                    {data.chargeTables.standard.header}
                  </div>
                  <div className="divide-y divide-border text-xs">
                    {data.chargeTables.standard.rows?.map((row, rIdx) => (
                      <div key={rIdx} className="flex items-center justify-between px-4 py-2.5 text-muted-foreground">
                        <span>{row.label}</span>
                        <span className="font-bold text-foreground shrink-0">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Same day delivery */}
              {data.chargeTables.sameDay && (
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
                  <div className="bg-blue-600 px-4 py-2.5 text-xs font-bold text-white">
                    {data.chargeTables.sameDay.header}
                  </div>
                  <div className="divide-y divide-border text-xs">
                    {data.chargeTables.sameDay.rows?.map((row, rIdx) => (
                      <div key={rIdx} className="flex items-center justify-between px-4 py-2.5 text-muted-foreground">
                        <span className="max-w-[190px] sm:max-w-none">{row.label}</span>
                        <span className="font-bold text-foreground shrink-0">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ 4. Exchange or Return of Goods ═══ */}
        <div className="space-y-6 pt-4 border-t border-border/80">
          <div>
            {data.lastUpdated && (
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Last Update: {data.lastUpdated}
              </p>
            )}
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              {data.returnHeading}
            </h2>
            {data.returnIntro && (
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                {data.returnIntro}
              </p>
            )}
          </div>

          {/* Dynamic Return Sections */}
          <div className="space-y-6">
            {data.returnSections?.map((sec, secIdx) => (
              <section key={sec.id || secIdx} className="space-y-2">
                {sec.heading && (
                  <h3 className="text-base font-bold text-foreground tracking-tight">
                    {sec.heading}
                  </h3>
                )}
                {sec.intro && (
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {sec.intro}
                  </p>
                )}

                {sec.items && sec.items.length > 0 && (
                  sec.isNumbered ? (
                    <ol className="list-decimal list-outside pl-5 space-y-1.5 text-[13px] leading-relaxed text-muted-foreground">
                      {sec.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          {item.term ? (
                            <>
                              <strong className="font-bold text-foreground">{item.term}:</strong>{" "}
                              {item.text}
                            </>
                          ) : (
                            item.text
                          )}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="list-disc list-outside pl-5 space-y-1.5 text-[13px] leading-relaxed text-muted-foreground">
                      {sec.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          {item.term ? (
                            <>
                              <strong className="font-bold text-foreground">{item.term}:</strong>{" "}
                              {item.text}
                            </>
                          ) : (
                            item.text
                          )}
                        </li>
                      ))}
                    </ul>
                  )
                )}

                {sec.hasDividerAfter && <hr className="my-5 border-border/60" />}
              </section>
            ))}
          </div>

          {/* Shipping Returns Address Block */}
          {data.shippingReturnAddress && (
            <div className="space-y-2 pt-2">
              <h3 className="text-base font-bold text-foreground tracking-tight">
                Shipping Returns
              </h3>
              <p className="text-[13px] text-muted-foreground">To return your product, mail it to:</p>
              <div className="space-y-1 text-[13px] text-muted-foreground pl-1">
                {data.shippingReturnAddress.companyName && (
                  <p className="font-bold text-foreground">{data.shippingReturnAddress.companyName}</p>
                )}
                {data.shippingReturnAddress.address && (
                  <p>{data.shippingReturnAddress.address}</p>
                )}
                {data.shippingReturnAddress.phone && (
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                    Phone: {data.shippingReturnAddress.phone}
                  </p>
                )}
                {data.shippingReturnAddress.email && (
                  <p className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    Email: {data.shippingReturnAddress.email}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ═══ FAQs Accordion ═══ */}
          {data.faqs && data.faqs.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-border/80">
              <h3 className="text-lg font-bold text-foreground tracking-tight">
                FAQs
              </h3>
              <div className="divide-y divide-border border-y border-border">
                {data.faqs.map((faq, fIdx) => {
                  const isOpen = openFaqIndex === fIdx;
                  return (
                    <div key={fIdx} className="py-3.5">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                        className="flex w-full items-center justify-between text-left text-xs sm:text-[13px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 transition-transform text-muted-foreground ${
                            isOpen ? "rotate-180 text-blue-600" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="mt-2.5 text-xs sm:text-[12.5px] leading-relaxed text-muted-foreground whitespace-pre-line pr-4">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
