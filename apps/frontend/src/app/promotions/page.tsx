"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Tag,
  Gift,
  Sparkles,
  Zap,
  Percent,
  ShoppingBag,
  Flame,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use-translation";
import { apiRequest } from "@/lib/api";

interface PromotionItem {
  id?: string;
  icon: LucideIcon;
  badge: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  gradient: string;
}

const CURATED_GRADIENTS = [
  "from-blue-600 via-indigo-600 to-indigo-800",
  "from-violet-600 via-purple-600 to-indigo-800",
  "from-teal-600 via-emerald-600 to-cyan-800",
  "from-rose-600 via-pink-600 to-purple-800",
  "from-amber-600 via-orange-600 to-red-700",
  "from-cyan-600 via-blue-600 to-indigo-700",
];

function resolveIcon(iconName?: string): LucideIcon {
  switch (iconName?.toLowerCase()) {
    case "gift":
      return Gift;
    case "tag":
      return Tag;
    case "zap":
      return Zap;
    case "percent":
      return Percent;
    case "bag":
    case "shopping-bag":
      return ShoppingBag;
    case "flame":
    case "fire":
      return Flame;
    default:
      return Sparkles;
  }
}

export default function PromotionsPage() {
  const { t } = useTranslation();
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    apiRequest("/cms/promotions")
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          // Filter only active promotions
          const activeOnly = res.data.filter(
            (p: any) => p.active !== false && (!p.status || p.status === "ACTIVE")
          );

          const mapped: PromotionItem[] = activeOnly.map((p: any, idx: number) => {
            const fallbackGradient = CURATED_GRADIENTS[idx % CURATED_GRADIENTS.length];
            return {
              id: p.id || `promo-${idx}`,
              icon: resolveIcon(p.icon),
              badge:
                p.badge && p.badge.trim().length > 0
                  ? p.badge
                  : p.discountValue && p.discountValue > 0
                  ? `${p.discountValue}% OFF`
                  : "Special Offer",
              title: p.title || p.name || "Special Deal",
              desc: p.description || "",
              href: p.ctaHref || "/products",
              cta: p.ctaLabel || "Shop Now",
              gradient: p.gradient && p.gradient.trim().length > 0 ? p.gradient : fallbackGradient,
            };
          });

          setPromotions(mapped);
        }
      })
      .catch(() => {
        setPromotions([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
      <div className="border-b border-border bg-background/50 backdrop-blur-sm">
        <div className="container-gadget">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">
              {t("shop.breadcrumbHome")}
            </Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground font-medium">
              {t("listings.promotions.title")}
            </span>
          </nav>
        </div>
      </div>

      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 border-b border-border/80 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/25 via-transparent to-transparent" />
        <div className="container-gadget relative text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/40 px-3.5 py-1 text-xs font-semibold text-primary-300 backdrop-blur-md shadow-sm">
            <Tag className="h-3.5 w-3.5" />
            {t("listings.promotions.kicker")}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t("listings.promotions.title")}
          </h1>
          <p className="mt-2 max-w-xl mx-auto text-sm text-slate-300/80 leading-relaxed">
            {t("listings.promotions.hint")}
          </p>
        </div>
      </div>

      <div className="container-gadget py-10">
        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <div
                key={k}
                className="h-[270px] rounded-2xl border border-border/60 bg-muted/40 p-6 flex flex-col justify-between animate-pulse shadow-sm"
              >
                <div>
                  <div className="h-5 w-24 rounded-full bg-muted/80" />
                  <div className="mt-5 h-12 w-12 rounded-2xl bg-muted/80" />
                  <div className="mt-4 h-6 w-3/4 rounded-lg bg-muted/80" />
                  <div className="mt-2 space-y-1.5">
                    <div className="h-3.5 w-full rounded bg-muted/60" />
                    <div className="h-3.5 w-4/5 rounded bg-muted/60" />
                  </div>
                </div>
                <div className="h-9 w-28 rounded-xl bg-muted/80" />
              </div>
            ))}
          </div>
        ) : promotions.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promo) => {
              const IconComponent = promo.icon;
              return (
                <div
                  key={promo.id}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${promo.gradient} p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full`}
                >
                  <div className="flex-1 flex flex-col">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-0.5 text-[11px] font-bold tracking-wide text-white border border-white/10 shadow-sm">
                        {promo.badge}
                      </span>
                    </div>

                    <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md transition-transform duration-300 group-hover:scale-110 shadow-inner">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>

                    <h3 className="mt-4 text-lg font-bold leading-snug text-white line-clamp-2">
                      {promo.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/85 line-clamp-3">
                      {promo.desc}
                    </p>
                  </div>

                  <div className="mt-auto pt-6">
                    <Link
                      href={promo.href}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-900 shadow-sm transition hover:bg-slate-100 group-hover:gap-2"
                    >
                      {promo.cta}{" "}
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>

                  {/* Ambient decorative elements */}
                  <div className="pointer-events-none absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-white/10 blur-xl" />
                  <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/5 blur-lg" />
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-sm max-w-lg mx-auto">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Tag className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-foreground">
              No Active Promotions Right Now
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              We update our offers frequently. Check back soon or explore our latest products and deals.
            </p>
            <div className="mt-6">
              <Link href="/products" className="btn-primary inline-flex items-center gap-1.5 text-xs px-5 py-2.5 rounded-xl">
                Explore All Products <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-12 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary mb-3">
            <Gift className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {t("listings.promotions.newsletterTitle")}
          </h2>
          <p className="mt-1 max-w-md mx-auto text-sm text-muted-foreground">
            {t("listings.promotions.newsletterHint")}
          </p>
          <div className="mx-auto mt-5 flex max-w-md gap-2">
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
              className="btn-primary shrink-0"
            >
              {isSubscribing
                ? "Subscribing..."
                : t("listings.promotions.subscribe")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
