"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Tag, Gift, Sparkles, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use-translation";
import { apiRequest } from "@/lib/api";

interface PromotionItem {
  id?: string;
  icon?: LucideIcon;
  badge: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  gradient: string;
}

export default function PromotionsPage() {
  const { t } = useTranslation();
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    apiRequest("/cms/promotions")
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: PromotionItem[] = res.data.map((p: any) => ({
            id: p.id,
            icon: p.icon === "gift" ? Gift : p.icon === "tag" ? Tag : Sparkles,
            badge: p.badge || (p.discountValue ? `${p.discountValue}% OFF` : "Special Offer"),
            title: p.title || p.name,
            desc: p.description || "",
            href: p.ctaHref || "/products",
            cta: p.ctaLabel || "Shop Now",
            gradient: p.gradient || "from-primary to-primary-800",
          }));
          setPromotions(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const subscribe = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsSubscribing(true);
    try {
      await apiRequest("/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      toast.success(t("footer.newsletter") || "Subscribed to newsletter!");
      setEmail("");
    } catch (err: any) {
      toast.error(err.error || err.message || "Failed to subscribe");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">{t("shop.breadcrumbHome")}</Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground">{t("listings.promotions.title")}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-error to-warning py-12">
        <div className="container-gadget text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            <Tag className="h-3.5 w-3.5" />
            {t("listings.promotions.kicker")}
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">{t("listings.promotions.title")}</h1>
          <p className="mt-1 text-sm text-white/70">
            {t("listings.promotions.hint")}
          </p>
        </div>
      </div>

      <div className="container-gadget py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promo, idx) => {
            const IconComponent = promo.icon || Tag;
            return (
              <div
                key={promo.id || idx}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${promo.gradient} p-6 text-white`}
              >
                <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold">
                  {promo.badge}
                </span>

                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>

                <h3 className="mt-4 text-lg font-bold">{promo.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{promo.desc}</p>

                <Link
                  href={promo.href}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-foreground transition hover:bg-muted"
                >
                  {promo.cta} <ChevronRight className="h-3.5 w-3.5" />
                </Link>

                <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/5" />
                <div className="pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-white/5" />
              </div>
            );
          })}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <h2 className="text-lg font-bold text-foreground">{t("listings.promotions.newsletterTitle")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("listings.promotions.newsletterHint")}</p>
          <div className="mx-auto mt-4 flex max-w-md gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("footer.newsletterPlaceholder")}
              className="input-field"
            />
            <button
              onClick={subscribe}
              disabled={isSubscribing}
              className="btn-primary"
            >
              {isSubscribing ? "Subscribing..." : t("listings.promotions.subscribe")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
