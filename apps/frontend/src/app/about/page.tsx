"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Sparkles,
  Apple,
  Truck,
  Eye,
  Target,
  Phone,
  MapPin,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useTranslation } from "@/hooks/use-translation";

interface AboutData {
  title: string;
  subtitle: string;
  coverImage?: string | null;
  story: string;
  appleStory?: string;
  deliveryStory?: string;
  vision: string;
  mission: string;
}

export default function AboutPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [supportPhone, setSupportPhone] = useState<string>("");
  const [showrooms, setShowrooms] = useState<{ name: string; addr?: string }[]>([]);

  useEffect(() => {
    Promise.all([
      apiRequest("/cms/about").catch(() => null),
      apiRequest("/cms/general").catch(() => null),
      apiRequest("/cms/footer").catch(() => null),
    ])
      .then(([aboutRes, genRes, footerRes]) => {
        if (aboutRes?.data && typeof aboutRes.data === "object") {
          setData(aboutRes.data as AboutData);
        }
        if (genRes?.data?.supportPhone || genRes?.data?.storePhone) {
          setSupportPhone(genRes.data.supportPhone || genRes.data.storePhone);
        }
        if (footerRes?.data?.showrooms && Array.isArray(footerRes.data.showrooms)) {
          setShowrooms(footerRes.data.showrooms);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-xl font-bold text-foreground">About Us</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Content is currently being configured in the admin panel.
        </p>
        <Link href="/" className="btn-primary mt-4 text-xs">
          Return Home
        </Link>
      </div>
    );
  }

  const title = data.title || "About Unseen Gadget";
  const subtitle = data.subtitle || "";
  const story = data.story || "";
  const appleStory = data.appleStory || "";
  const deliveryStory = data.deliveryStory || "";
  const vision = data.vision || "";
  const mission = data.mission || "";

  return (
    <div className="space-y-8 pb-16">
      {/* ── Breadcrumb ── */}
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">
              {t("shop.breadcrumbHome")}
            </Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground">{title}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary to-primary-700 py-16 text-white sm:py-20">
        {data?.coverImage && (
          <img
            src={data.coverImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
        )}
        <div className="container-gadget relative text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Unseen Gadget</span>
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            {subtitle}
          </p>
        </div>
      </div>

      {/* ── 3-Column Core Stories ── */}
      <div className="container-gadget">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Welcome Story */}
          {story && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-base font-bold text-foreground">Welcome to Unseen Gadget</h2>
              <div className="mt-2.5 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                {story}
              </div>
            </div>
          )}

          {/* Apple Ecosystem */}
          {appleStory && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Apple className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-base font-bold text-foreground">Genuine Apple Products</h2>
              <div className="mt-2.5 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                {appleStory}
              </div>
            </div>
          )}

          {/* Delivery & Trust */}
          {deliveryStory && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Truck className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-base font-bold text-foreground">Nationwide Express Delivery</h2>
              <div className="mt-2.5 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                {deliveryStory}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Vision & Mission ── */}
      {(vision || mission) && (
        <div className="container-gadget">
          <div className="grid gap-6 sm:grid-cols-2">
            {vision && (
              <div className="rounded-2xl border border-border bg-muted/30 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Eye className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Our Vision</h3>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{vision}</p>
              </div>
            )}
            {mission && (
              <div className="rounded-2xl border border-border bg-muted/30 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Target className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Our Mission</h3>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{mission}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Showrooms & Help Hotline ── */}
      {showrooms.length > 0 && (
        <div className="container-gadget">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h3 className="text-base font-bold text-foreground">Visit Our Showrooms</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {showrooms.map((s, i) => (
                <div key={i} className="rounded-xl border border-border/70 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{s.name}</span>
                  </div>
                  {s.addr && <p className="mt-1 text-xs text-muted-foreground">{s.addr}</p>}
                </div>
              ))}
            </div>

            {supportPhone && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-primary/5 p-4 border border-primary/20">
                <div>
                  <p className="text-xs font-bold text-foreground">Need Assistance?</p>
                  <p className="text-xs text-muted-foreground">Our customer support is always ready to assist you.</p>
                </div>
                <a
                  href={`tel:${supportPhone}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition hover:opacity-90"
                >
                  <Phone className="h-3.5 w-3.5" /> Call Hotline: {supportPhone}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
