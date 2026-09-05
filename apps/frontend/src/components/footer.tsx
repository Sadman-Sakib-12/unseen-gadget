"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Facebook, Twitter, Youtube, Linkedin, Instagram } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { translateCategory } from "@/lib/i18n";
import { apiRequest } from "@/lib/api";
import type { FooterCms, FooterSection, FooterLink } from "@unseen-gadget/types";

const W = "mx-auto w-full max-w-[1440px] px-4";

export function Footer() {
  const { t, language } = useTranslation();
  const [footerData, setFooterData] = useState<FooterCms | null>(null);

  useEffect(() => {
    apiRequest("/cms/footer")
      .then((res) => {
        if (res?.data && typeof res.data === "object") {
          setFooterData(res.data as FooterCms);
        }
      })
      .catch(() => {});
  }, []);

  const showrooms = Array.isArray(footerData?.showrooms) ? footerData.showrooms : [];
  const sections = Array.isArray(footerData?.sections) ? footerData.sections : [];
  const payments = Array.isArray(footerData?.paymentMethods) ? footerData.paymentMethods : [];

  const socials = [
    ...(footerData?.socials?.facebook
      ? [{ Icon: Facebook, href: footerData.socials.facebook, label: "Facebook" }]
      : []),
    ...(footerData?.socials?.twitter
      ? [{ Icon: Twitter, href: footerData.socials.twitter, label: "Twitter" }]
      : []),
    ...(footerData?.socials?.youtube
      ? [{ Icon: Youtube, href: footerData.socials.youtube, label: "YouTube" }]
      : []),
    ...(footerData?.socials?.linkedin
      ? [{ Icon: Linkedin, href: footerData.socials.linkedin, label: "LinkedIn" }]
      : []),
    ...(footerData?.socials?.instagram
      ? [{ Icon: Instagram, href: footerData.socials.instagram, label: "Instagram" }]
      : []),
  ];

  const copyrightText =
    footerData?.copyright ||
    `${t("footer.rights")} © 2013–${new Date().getFullYear()}`;

  return (
    <footer className="border-t border-border bg-background text-foreground">
      {/* ── Showroom row ─────────────────────────────────── */}
      {showrooms.length > 0 && (
        <div className="border-b border-border">
          <div className={`${W} py-6`}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {showrooms.map((s, idx) => (
                <div key={idx}>
                  <p className="text-[13px] font-semibold text-foreground">
                    {translateCategory(s.name, language)}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {translateCategory(s.addr, language)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main footer columns ───────────────────────────── */}
      <div className={`${W} py-8`}>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-[2fr_1fr_1fr_1fr_1.5fr]">
          {/* Brand + social */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Unseen Gadget Home">
              <span className="text-[22px] font-black leading-none tracking-tight text-foreground">
                <span className="text-primary">Unseen Gadget</span>bd
                <sup className="ml-px text-[9px] font-bold text-muted-foreground">.com</sup>
              </span>
            </Link>

            <p className="mt-5 text-xs font-semibold">{t("footer.subscribe")}</p>
            <div className="mt-2 flex gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-primary hover:border-primary hover:text-primary-foreground"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {sections.map((col: FooterSection, idx: number) => (
            <div key={col.key || idx}>
              <h3 className="text-[13px] font-semibold text-foreground">
                {col.titleKey ? t(col.titleKey as any) : translateCategory(col.title, language)}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((lk: FooterLink, lkIdx: number) => (
                  <li key={lk.key || lk.label || lkIdx}>
                    <Link
                      href={lk.href}
                      className="text-[12.5px] text-muted-foreground transition-colors hover:text-primary"
                    >
                      {translateCategory(lk.label, language)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* App download */}
          <div>
            <h3 className="text-[13px] font-semibold text-foreground">{t("footer.downloadApp")}</h3>
            <p className="mt-1 text-[11.5px] text-muted-foreground">{t("footer.freeDeliveryFirst")}</p>
            <div className="mt-3 flex flex-col gap-2">
              {/* Google Play */}
              <a
                href="#"
                className="flex h-10 w-[136px] items-center gap-2 rounded-md border border-foreground/20 bg-foreground px-3 text-background transition-opacity hover:opacity-85"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-current">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.75.75 0 01-.61-.74V2.555a.75.75 0 01.609-.741zM14.85 13.06l2.302 2.302-8.937 5.108 6.635-7.41zm3.211-1.06a1.25 1.25 0 010 2l-1.96 1.121L13.584 12l2.517-3.121 1.96 1.121zM8.215 3.53l8.937 5.108-2.302 2.302-6.635-7.41z" />
                </svg>
                <div className="flex flex-col leading-none">
                  <span className="text-[8px] uppercase tracking-wide opacity-80">
                    {language === "bn" ? "ডাউনলোড করুন" : "GET IT ON"}
                  </span>
                  <span className="text-[11px] font-semibold">Google Play</span>
                </div>
              </a>
              {/* App Store */}
              <a
                href="#"
                className="flex h-10 w-[136px] items-center gap-2 rounded-md border border-foreground/20 bg-foreground px-3 text-background transition-opacity hover:opacity-85"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-current">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="flex flex-col leading-none">
                  <span className="text-[8px] uppercase tracking-wide opacity-80">
                    {language === "bn" ? "ডাউনলোড করুন" : "Download on the"}
                  </span>
                  <span className="text-[11px] font-semibold">App Store</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────── */}
      <div className="border-t border-border">
        <div className={`${W} flex flex-col items-center justify-between gap-3 py-4 sm:flex-row`}>
          <p className="text-xs text-muted-foreground">{copyrightText}</p>
          <div className="flex items-center gap-1.5">
            {payments.map((m) => (
              <span
                key={m}
                className="inline-flex h-6 items-center rounded border border-border bg-card px-2 text-[10px] font-bold text-muted-foreground"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

