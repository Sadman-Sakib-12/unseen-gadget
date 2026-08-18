"use client";

import Link from "next/link";
import banners from "@/data/banners.json";
import homepageCategories from "@/data/homepage-categories.json";
import homepageSections from "@/data/homepage-sections.json";
import articles from "@/data/articles.json";
import {
  ChevronRight, ShoppingCart, Shield, Truck,
  RefreshCw, Headphones, Tag, type LucideIcon,
} from "lucide-react";
import { ProductGrid } from "@/components/product-grid";
import { SectionHeading } from "@/components/section-heading";
import type { MockProduct } from "@/components/product-types";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { NewArrivalCarousel } from "@/components/new-arrival-carousel";
import { TopSellingCarousel } from "@/components/top-selling-carousel";
import { HandpickedCarousel } from "@/components/handpicked-carousel";
import { ShopByBrand } from "@/components/shop-by-brand";
import { useTranslation } from "@/hooks/use-translation";

const W = "mx-auto w-full max-w-[1440px] px-4";

interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  cta?: string;
  href: string;
  image?: string;
  bgColor?: string;
}
interface HomeSection {
  id: string;
  title?: string;
  subtitle?: string;
  cta?: string;
  href?: string;
  viewAllHref?: string;
  products?: MockProduct[];
}

const CI: Record<string, React.ReactNode> = {
  iphones: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="18" y="4" width="28" height="56" rx="5"/><line x1="28" y1="10" x2="36" y2="10"/><circle cx="32" cy="52" r="2"/><rect x="22" y="16" width="20" height="28" rx="1"/></svg>),
  ipads: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="10" y="6" width="44" height="52" rx="4"/><circle cx="32" cy="52" r="2"/><rect x="15" y="12" width="34" height="32" rx="1"/></svg>),
  macbook: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="8" y="10" width="48" height="32" rx="3"/><rect x="16" y="16" width="32" height="20" rx="1"/><path d="M4 42h56l-4 8H8l-4-8z"/><line x1="24" y1="46" x2="40" y2="46"/></svg>),
  "apple-watch": (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="20" y="16" width="24" height="32" rx="8"/><line x1="26" y1="8" x2="26" y2="16"/><line x1="38" y1="8" x2="38" y2="16"/><line x1="26" y1="48" x2="26" y2="56"/><line x1="38" y1="48" x2="38" y2="56"/><circle cx="32" cy="32" r="6"/><line x1="32" y1="26" x2="32" y2="32"/><line x1="32" y1="32" x2="36" y2="35"/></svg>),
  "smart-watches": (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="18" y="14" width="28" height="36" rx="10"/><line x1="24" y1="6" x2="24" y2="14"/><line x1="40" y1="6" x2="40" y2="14"/><line x1="24" y1="50" x2="24" y2="58"/><line x1="40" y1="50" x2="40" y2="58"/><circle cx="32" cy="32" r="8"/><line x1="32" y1="26" x2="32" y2="32"/><line x1="32" y1="32" x2="37" y2="35"/></svg>),
  airpods: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="12" y="8" width="40" height="48" rx="10"/><ellipse cx="26" cy="28" rx="4" ry="6"/><ellipse cx="38" cy="28" rx="4" ry="6"/><line x1="26" y1="34" x2="26" y2="44"/><line x1="38" y1="34" x2="38" y2="44"/></svg>),
  "power-bank": (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="12" y="16" width="40" height="32" rx="6"/><rect x="28" y="10" width="8" height="6" rx="1"/><polyline points="26,24 22,32 28,32 24,40"/><circle cx="44" cy="32" r="4"/></svg>),
  "iphone-cases": (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="16" y="4" width="32" height="56" rx="6"/><rect x="20" y="8" width="24" height="48" rx="4"/><line x1="26" y1="12" x2="38" y2="12"/><circle cx="32" cy="54" r="1.5"/></svg>),
  "ipad-cases": (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="8" y="6" width="48" height="52" rx="4"/><rect x="12" y="10" width="40" height="44" rx="3"/><line x1="8" y1="30" x2="12" y2="30"/><line x1="8" y1="36" x2="12" y2="36"/></svg>),
  cables: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><circle cx="16" cy="44" r="8"/><circle cx="16" cy="44" r="3"/><path d="M22 38 L40 14"/><rect x="36" y="8" width="12" height="10" rx="2"/><line x1="40" y1="18" x2="40" y2="28"/><line x1="44" y1="18" x2="44" y2="28"/></svg>),
  "macbook-protection": (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="6" y="12" width="52" height="32" rx="3"/><rect x="10" y="16" width="44" height="24" rx="1"/><path d="M2 44h60l-4 8H6l-4-8z"/><path d="M25 25 L29 29 L39 19"/></svg>),
  tws: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><ellipse cx="20" cy="26" rx="8" ry="10"/><ellipse cx="44" cy="26" rx="8" ry="10"/><line x1="20" y1="36" x2="20" y2="50"/><line x1="44" y1="36" x2="44" y2="50"/><path d="M20 50 Q32 56 44 50"/><circle cx="20" cy="22" r="3"/><circle cx="44" cy="22" r="3"/></svg>),
  "android-zone": (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><path d="M16 30 Q16 14 32 14 Q48 14 48 30 L48 50 Q48 54 44 54 L20 54 Q16 54 16 50 Z"/><circle cx="24" cy="38" r="2" fill="currentColor"/><circle cx="40" cy="38" r="2" fill="currentColor"/><line x1="22" y1="14" x2="16" y2="6"/><line x1="42" y1="14" x2="48" y2="6"/><line x1="16" y1="42" x2="10" y2="42"/><line x1="48" y1="42" x2="54" y2="42"/></svg>),
  "itunes-gift": (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="8" y="20" width="48" height="36" rx="4"/><path d="M8 32 L56 32"/><path d="M24 20 Q24 12 32 12 Q40 12 40 20"/><line x1="32" y1="32" x2="32" y2="44"/><line x1="26" y1="38" x2="38" y2="38"/></svg>),
};

interface HomeCategory {
  id: string;
  name: string;
  href: string;
  image?: string;
}
function CatBtn({ c }: { c: HomeCategory }) {
  const icon = CI[c.id];
  return (
    <Link href={c.href} className="group flex flex-col items-center gap-1.5">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-border bg-card p-4 text-muted-foreground transition group-hover:border-primary group-hover:bg-primary/5 group-hover:text-primary group-hover:shadow-sm">
        {icon ?? (
          <ImageWithFallback
            src={c.image}
            alt={c.name}
            className="h-full w-full object-contain"
            iconSize="h-6 w-6"
          />
        )}
      </div>
      <span className="text-center text-[11px] leading-tight text-muted-foreground transition-colors group-hover:text-primary">
        {c.name}
      </span>
    </Link>
  );
}

/* ── Benefits ───────────────────────────────────────────── */
const BENEFITS: { icon: LucideIcon; key: "home.benefits.emi" | "home.benefits.delivery" | "home.benefits.exchange" | "home.benefits.deals" | "home.benefits.service" }[] = [
  { icon: Shield,    key: "home.benefits.emi" },
  { icon: Truck,     key: "home.benefits.delivery" },
  { icon: RefreshCw, key: "home.benefits.exchange" },
  { icon: Tag,       key: "home.benefits.deals" },
  { icon: Headphones,key: "home.benefits.service" },
];

/* ── Why-choose cards ───────────────────────────────────── */
const WHY = [
  {
    icon: ShoppingCart,
    title: "Bangladesh's #1 Apple Accessories & Gadget Store",
    desc: "GadgetBD is one of Bangladesh's most trusted sources for genuine Apple accessories and premium tech gadgets. From iPhones and MacBooks to iPads, AirPods, and wearables — all available under one roof.",
  },
  {
    icon: Shield,
    title: "Smartwatches & Fitness Bands from Apple, Samsung & More",
    desc: "Smartwatches are your health tracker, workout companion, and personal assistant — all on your wrist. We carry Apple Watch, Samsung Galaxy Watch, and fitness bands with official warranty.",
  },
  {
    icon: Headphones,
    title: "AirPods, Wireless Earbuds & Premium Audio Devices",
    desc: "Music should sound rich, clear, and uninterrupted. We carry Apple AirPods, Samsung Galaxy Buds, noise-cancelling headphones, true wireless earbuds, and Bluetooth speakers.",
  },
];

/* ═════════════════════════════════════════════════════════ */
export default function Home() {
  const S = (id: string) => homepageSections.find((s) => (s as HomeSection).id === id) as HomeSection | undefined;
  const iS = S("ipads-section");
  const nS = S("new-arrival-section");
  const bS = S("budget-tablets-section");
  const tS = S("top-selling-section");

  const { t } = useTranslation();

  const bannerData = banners as Banner[];
  const categoryData = homepageCategories as HomeCategory[];
  const articleData = articles as { id: number; title: string; category: string; date: string; image?: string; excerpt: string }[];

  const iPs = iS?.products ?? [];
  const nPs = nS?.products ?? [];
  const bPs = bS?.products ?? [];
  const tPs = tS?.products ?? [];

  return (
    <>
      {/* ══ HERO ════════════════════════════════════════════ */}
      <section className="py-2">
        <div className={W}>
          <div className="grid gap-2 lg:grid-cols-3">
            {/* Large banner */}
            <Link
              href={bannerData[0]?.href || "/"}
              className="group relative block overflow-hidden rounded-xl lg:col-span-2"
            >
              <div className="relative h-[420px] overflow-hidden bg-muted sm:h-[500px]">
                {bannerData[0]?.image ? (
                  <img
                    src={bannerData[0].image}
                    alt={bannerData[0].title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-start justify-center bg-gradient-to-r from-primary/5 via-transparent to-primary/10 px-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                      {t("home.heroKicker")}
                    </p>
                    <h2 className="mt-2 text-4xl font-black leading-tight text-foreground">
                      Unseen<br />Gadget
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">{t("home.heroSubtitle")}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                      {t("home.heroCta")} <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                )}
              </div>
            </Link>

            {/* Two side banners */}
            <div className="flex flex-col gap-2">
              {bannerData.slice(1, 3).map((b) => (
                <Link
                  key={b.id}
                  href={b.href}
                  className="group relative block flex-1 overflow-hidden rounded-xl"
                >
                  <div className="relative h-full min-h-[148px] overflow-hidden bg-muted">
                    {b.image ? (
                      <img
                        src={b.image}
                        alt={b.title}
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col justify-center px-5">
                        <p className="text-base font-black text-foreground">{b.title}</p>
                        {b.subtitle && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{b.subtitle}</p>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ BENEFITS BAR ════════════════════════════════════ */}
      <section className="border-y border-border bg-muted/40">
        <div className={W}>
          <div className="grid grid-cols-2 divide-x divide-border sm:grid-cols-3 lg:grid-cols-5">
            {BENEFITS.map((b) => (
              <div key={b.key} className="flex items-center justify-center gap-2 py-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <b.icon className="h-3.5 w-3.5" />
                </span>
                <span className="text-[11.5px] font-medium text-foreground">{t(b.key)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SHOP BY CATEGORY ═════════════════════════════════ */}
      <section className="py-6">
        <div className={W}>
          <div className="mb-5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              {t("home.categoriesKicker")}
            </p>
            <h2 className="mt-1.5 text-[19px] font-bold text-foreground">
              {t("home.categoriesTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-7">
            {categoryData.slice(0, 7).map((c) => <CatBtn key={c.id} c={c} />)}
          </div>
          <hr className="my-5 border-border" />
          <div className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-7">
            {categoryData.slice(7).map((c) => <CatBtn key={c.id} c={c} />)}
          </div>
        </div>
      </section>

      <ShopByBrand />

      {/* ══ iPADS ════════════════════════════════════════════ */}
      <section className="border-t border-border py-5">
        <div className={W}>
          <SectionHeading title={t("home.section.iPads")} href={iS?.viewAllHref ?? "/category/ipads-tablets"} />
          <ProductGrid products={iPs} />
        </div>
      </section>

      {/* ══ NEW ARRIVAL — promo panel + carousel (two-column) ══ */}
      <section className="border-t border-border py-5">
        <div className={W}>
          <div className="grid gap-3 lg:grid-cols-5">
            {/* Promo panel — Mac mini M4 (section element, NOT a ProductCard) */}
            <div className="flex flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-transparent to-primary/15">
              <div className="px-4 py-6 text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">New</p>
                <p className="mt-0.5 text-2xl font-black leading-none text-foreground">
                  Mac&nbsp;mini&nbsp;<span className="text-primary">M4</span>
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Mighty power. Mini size.</p>
              </div>
            </div>
            {/* Heading + carousel */}
            <div className="lg:col-span-4">
              <SectionHeading title={t("home.section.newArrival")} href={nS?.viewAllHref ?? "/new-arrivals"} />
              <NewArrivalCarousel products={nPs} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ BUDGET TABLETS ═══════════════════════════════════ */}
      <section className="border-t border-border py-5">
        <div className={W}>
          <SectionHeading title={t("home.section.budgetTablets")} href={bS?.viewAllHref ?? "/category/ipads-tablets"} />
          <ProductGrid products={bPs} />
        </div>
      </section>

      {/* ══ TOP SELLING ════════════════════════════════════ */}
      <section className="border-t border-border py-5">
        <div className={W}>
          <SectionHeading title={t("home.section.topSelling")} href={tS?.viewAllHref ?? "/top-selling"} />
          <TopSellingCarousel products={tPs} />
        </div>
      </section>

      {/* ══ HANDPICKED PRODUCTS FOR YOU ════════════════════ */}
      <section className="border-t border-border py-6">
        <div className={W}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-foreground">{t("home.section.handpicked")}</h2>
            <Link
              href="/products"
              className="flex items-center gap-1 text-[13px] font-semibold text-primary transition-colors hover:text-primary-700"
            >
              {t("nav.viewAll")} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <HandpickedCarousel products={[...tPs, ...nPs].slice(0, 15)} />
        </div>
      </section>

      {/* ══ WHY CHOOSE US ═══════════════════════════════════ */}
      <section className="border-t border-border py-6">
        <div className={W}>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            {t("home.whyKicker")}
          </p>
          <h2 className="mt-1.5 max-w-xl text-[20px] font-bold leading-snug text-foreground">
            {t("home.whyTitle")}
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map((card) => (
              <div
                key={card.title}
                className="card-surface p-5 border-l-4 border-l-primary/60"
              >
                <card.icon className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
                <h3 className="mt-3 text-[13px] font-bold text-foreground">{card.title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OUR ARTICLES ════════════════════════════════════ */}
      <section className="border-t border-border py-6">
        <div className={W}>
          <h2 className="mb-4 text-[18px] font-bold text-foreground">{t("home.articles")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {articleData.slice(0, 4).map((a) => (
              <Link
                key={a.id}
                href={`/articles/${a.id}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:shadow-md"
              >
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  {a.image ? (
                    <img
                      src={a.image}
                      alt={a.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
                      <span className="text-[11px] font-medium text-primary">{a.category}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <p className="text-[10px] text-muted-foreground">
                    {a.category}&nbsp;/&nbsp;{a.date}
                  </p>
                  <h3 className="mt-1.5 line-clamp-2 text-[12.5px] font-semibold text-foreground group-hover:text-primary">
                    {a.title}
                  </h3>
                  <p className="mt-1 line-clamp-3 text-[11.5px] leading-relaxed text-muted-foreground">
                    {a.excerpt}
                  </p>
                  <span className="mt-auto pt-2.5 text-[11.5px] font-semibold text-primary group-hover:underline">
                    {t("home.continueReading")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SEO TEXT ══════════════════════════════════════════ */}
      <section className="border-t border-border py-6">
        <div className={W}>
          <h2 className="text-[15px] font-bold text-foreground">Welcome to Unseen Gadget</h2>
          <p className="mt-2 max-w-3xl text-[12.5px] leading-relaxed text-muted-foreground">
            Unseen Gadget, your trusted source for top-notch yet affordable MacBook, iMac, iPhone, iPad, and Apple
            Watch accessories in Dhaka, Bangladesh since 2024. As the best online gadget shop in Bangladesh,
            we&rsquo;re driven by big dreams and a commitment to provide you with a diverse range of the latest
            high-quality products at budget-friendly prices.
          </p>
          <p className="mt-2 max-w-3xl text-[12.5px] leading-relaxed text-muted-foreground">
            At Unseen Gadget, quality is our hallmark. Our team meticulously evaluates each product to ensure
            excellence, partnering exclusively with dependable suppliers.
          </p>
          <button className="btn-outline mt-3 !h-8 !px-3.5 !text-[11.5px]">
            {t("common.readMore")} <ChevronRight className="h-3 w-3" />
          </button>

          <h2 className="mt-7 text-[15px] font-bold text-foreground">
            Unseen Gadget: Your Trusted Source for Apple Products
          </h2>
          <p className="mt-2 max-w-3xl text-[12.5px] leading-relaxed text-muted-foreground">
            When it comes to purchasing Apple products in Bangladesh, authenticity and quality are paramount.
            At Unseen Gadget &mdash; Bangladesh&rsquo;s Leading online Gadget Shop &mdash; we pride ourselves on offering genuine
            iPhones, iPads, MacBooks, and a wide range of accessories. Order online for fast nationwide delivery
            across Bangladesh, or visit our Dhaka Showrooms at Bashundhara City Shopping Mall.
          </p>
          <button className="btn-outline mt-3 !h-8 !px-3.5 !text-[11.5px]">
            {t("common.readMore")} <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </section>
    </>
  );
}
