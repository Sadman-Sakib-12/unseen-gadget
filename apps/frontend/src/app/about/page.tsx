"use client";

import { Shield, Users, Zap, Star, MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";
import type { TranslationKey } from "@/lib/i18n";
import { useTranslation } from "@/hooks/use-translation";

const values = [
  {
    icon: Shield,
    title: "Authenticity Guaranteed",
    desc: "Every product we sell is 100% genuine, sourced directly from authorized distributors.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "Customer First",
    desc: "Your satisfaction is our top priority. We go above and beyond to exceed expectations.",
    color: "bg-success/10 text-success",
  },
  {
    icon: Zap,
    title: "Fast & Reliable",
    desc: "Same-day delivery in Dhaka. Nationwide delivery in 1–3 business days.",
    color: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: Star,
    title: "Best Prices",
    desc: "Competitive pricing without compromising quality. We match the best deals.",
    color: "bg-warning/10 text-warning",
  },
];

const stats: { value: string; label: TranslationKey }[] = [
  { value: "10,000+", label: "about.stats.happy" },
  { value: "5,000+", label: "about.stats.products" },
  { value: "2024", label: "about.stats.founded" },
  { value: "64+", label: "about.stats.districts" },
];

const contactInfo: { icon: typeof MapPin; title: TranslationKey; value: string }[] = [
  { icon: MapPin, title: "about.location", value: "Shop #84, Block C, Level 05, Bashundhara City, Dhaka 1229" },
  { icon: Phone, title: "about.phone", value: "+8801714039409" },
  { icon: Mail, title: "about.email", value: "support@unseengadget.com" },
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 via-primary to-primary-600 py-16">
        <div className="mx-auto w-full max-w-4xl px-4 text-center">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
            {t("about.kicker")}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            {t("about.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70">
            {t("about.subtitle")}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-4xl px-4">
          <div className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-8">
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                <span className="mt-1 text-xs text-muted-foreground">{t(stat.label)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-muted/50 py-12">
        <div className="mx-auto w-full max-w-4xl px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-foreground">{t("about.story")}</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Our journey began with a simple mission: to provide Bangladeshi customers with genuine,
                  high-quality gadgets at competitive prices. We saw a gap in the market — customers
                  struggling to find authentic products with proper warranty support.
                </p>
                <p>
                  Today, we serve customers across Dhaka and all 64 districts nationwide with fast delivery,
                  authentic products, and exceptional customer service — whether you shop online or visit us
                  in person at Bashundhara City.
                </p>
                <p>
                  At Unseen Gadget, quality is our hallmark. Our team meticulously evaluates each product
                  to ensure excellence, partnering exclusively with dependable suppliers.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{t("about.mission")}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                To become Bangladesh&rsquo;s most trusted online gadget store by providing authentic products,
                competitive pricing, and outstanding customer service. We aim to make premium technology
                accessible to everyone across the country.
              </p>
              <div className="mt-6 space-y-3">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">{t(item.title)}</p>
                      <p className="text-xs text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-background py-12">
        <div className="mx-auto w-full max-w-4xl px-4">
          <h2 className="text-xl font-bold text-foreground">{t("about.values")}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${v.color}`}>
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground">{v.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>

          {/* Trust checklist */}
          <div className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
            {[
              "100% Original Products",
              "Official Warranty Support",
              "Same-Day Delivery in Dhaka",
              "7-Day Easy Returns",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
