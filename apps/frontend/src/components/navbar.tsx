"use client";

import { useState, FormEvent, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  User,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatBDT } from "@/components/price";
import { useTranslation } from "@/hooks/use-translation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useSession } from "next-auth/react";
import { mapCategoryNodes, type Category } from "@/lib/categories";
import { translateCategory } from "@/lib/i18n";

interface NavLinkItem {
  id: string;
  label: string;
  url: string;
  order?: number;
}

/* ── Dropdown ───────────────────────────────────────────── */
function SubMenu({ items, depth = 0, language = "en" }: { items: Category[]; depth?: number; language?: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  if (!items?.length) return null;
  return (
    <ul
      className={
        depth === 0
          ? "dropdown-enter absolute left-0 top-full z-50 min-w-[220px] rounded-lg border border-border bg-card shadow-lg py-1.5"
          : "absolute left-full top-0 z-50 min-w-[220px] rounded-lg border border-border bg-card shadow-lg py-1.5"
      }
    >
      {items.map((item) => (
        <li
          key={item.id}
          className="relative"
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered(null)}
        >
          <Link
            href={item.href}
            className="flex items-center justify-between gap-3 px-4 py-2 text-[13px] text-foreground transition-colors hover:bg-accent hover:text-[#182C61] dark:hover:text-primary"
          >
            <span className="truncate">{translateCategory(item.name, language as any)}</span>
            {item.subcategories?.length ? (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            ) : null}
          </Link>
          {hovered === item.id && item.subcategories?.length ? (
            <SubMenu items={item.subcategories} depth={depth + 1} language={language} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/* ── Custom Handset Icon matching screenshot ───────────── */
function HandsetIcon({ className = "h-6 w-6 text-gray-700" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 3a4 4 0 0 1 4 4" />
      <path d="M14 7a1 1 0 0 1 1 1" />
      <path d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

/* ── Navbar ─────────────────────────────────────────────── */
export function Navbar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [navLinks, setNavLinks] = useState<NavLinkItem[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string>("Unseen Gadget");
  const [supportPhone, setSupportPhone] = useState<string>("");
  const [supportLabel, setSupportLabel] = useState<string>("Support");
  const { data: session } = useSession();
  const router = useRouter();
  const hydrated = useHydrated();
  const { t, language } = useTranslation();

  const fetchCartAndWishlist = useCallback(() => {
    apiRequest("/cart/current")
      .then((res) => {
        const items = res.data || [];
        setCartCount(items.reduce((sum: number, item: any) => sum + item.quantity, 0));
        setCartTotal(items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0));
      })
      .catch(() => {
        setCartCount(0);
        setCartTotal(0);
      });

    apiRequest("/wishlist")
      .then((res) => {
        const items = res.data || [];
        setWishlistCount(items.length);
      })
      .catch(() => {
        setWishlistCount(0);
      });
  }, []);

  useEffect(() => {
    // 1. Fetch Store Identity & Logo from CMS General
    apiRequest("/cms/general")
      .then((res) => {
        if (res.data) {
          if (res.data.logo) setLogoUrl(res.data.logo);
          if (res.data.storeName) setStoreName(res.data.storeName);
          if (res.data.supportPhone || res.data.storePhone) {
            setSupportPhone(res.data.supportPhone || res.data.storePhone);
          }
          if (res.data.supportLabel) setSupportLabel(res.data.supportLabel);
        }
      })
      .catch(() => {});

    // 2. Fetch Navbar CMS Links
    apiRequest("/cms/navbar")
      .then((res) => {
        if (res.data) {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setNavLinks(res.data);
          } else if (typeof res.data === "object" && res.data !== null) {
            if (res.data.logo) setLogoUrl(res.data.logo);
            if (res.data.storeName) setStoreName(res.data.storeName);
            if (res.data.supportPhone) setSupportPhone(res.data.supportPhone);
            if (res.data.supportLabel) setSupportLabel(res.data.supportLabel);
            if (Array.isArray(res.data.links)) setNavLinks(res.data.links);
          }
        }
      })
      .catch(() => {});

    // 3. Fetch Category Tree from Database Catalog API
    apiRequest("/catalog/categories")
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = mapCategoryNodes(res.data);
          if (mapped.length > 0) {
            setCategories(mapped);
          }
        }
      })
      .catch(() => {});

    // 4. Initial Cart & Wishlist fetch
    fetchCartAndWishlist();
  }, [fetchCartAndWishlist]);

  const count = hydrated ? cartCount : 0;
  const total = hydrated ? cartTotal : 0;
  const wCount = hydrated ? wishlistCount : 0;

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-white dark:bg-card shadow-xs transition-all duration-200"
    >
      {/* ═══ TOP MAIN BAR ════════════════════════════════════ */}
      <div className="mx-auto flex h-16 sm:h-20 max-w-[1440px] items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 lg:px-8">
        {/* MOBILE MENU TOGGLE */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={t("nav.menu")}
          className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 text-foreground transition-colors hover:bg-gray-100 dark:border-border dark:hover:bg-accent md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* 1. BRAND LOGO (Left: Exact Navy Color) */}
        <Link href="/" aria-label={storeName} className="shrink-0 flex items-center pr-1 sm:pr-2">
          {logoUrl ? (
            <img src={logoUrl} alt={storeName} className="h-8 sm:h-9 max-w-[140px] sm:max-w-[180px] object-contain" />
          ) : (
            <span className="text-xl sm:text-[24px] lg:text-[26px] font-black tracking-tight text-[#182C61] dark:text-primary flex items-baseline select-none">
              <span>{storeName}</span>
            </span>
          )}
        </Link>

        {/* 2. SEARCH BAR (Center Pill Shape with Exact Navy Blue Circle Search Button) */}
        <form onSubmit={onSearch} className="hidden flex-1 max-w-2xl mx-4 lg:mx-8 md:flex">
          <div className="relative flex w-full items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("nav.searchPlaceholder")}
              className="h-11 w-full rounded-full border border-gray-300 dark:border-border bg-white dark:bg-background pl-5 pr-12 text-[13.5px] text-foreground outline-none transition-all placeholder:text-gray-400 focus:border-[#182C61] dark:focus:border-primary focus:ring-2 focus:ring-[#182C61]/10"
            />
            <button
              type="submit"
              aria-label={t("common.search")}
              className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#182C61] dark:bg-primary text-white shadow-xs transition-transform hover:scale-105 active:scale-95"
            >
              <Search className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </form>

        {/* 3. RIGHT WIDGETS */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-4 lg:gap-5">
          {/* SUPPORT PHONE (Exact Navy Color Number) */}
          {supportPhone ? (
            <a
              href={`tel:${supportPhone}`}
              className="hidden lg:flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-90 mr-1"
            >
              <HandsetIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  {supportLabel && supportLabel !== "Support" ? supportLabel : t("nav.support")}
                </span>
                <span className="text-[13px] font-bold text-[#182C61] dark:text-primary tracking-tight">
                  {supportPhone}
                </span>
              </div>
            </a>
          ) : null}

          {/* BANGLA / ENGLISH SWITCHER */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* DARK / LIGHT THEME TOGGLE (🌙 / ☀️) */}
          <ThemeSwitcher className="h-8 w-8 sm:h-9 sm:w-9" />

          {/* USER ACCOUNT ICON */}
          <Link
            href={session?.user ? "/account" : "/login"}
            aria-label={session?.user ? (session.user.name || "My Account") : t("nav.myAccount")}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center text-gray-700 dark:text-gray-300 transition-colors hover:text-[#182C61] dark:hover:text-primary"
          >
            {session?.user?.avatar ? (
              <img
                src={session.user.avatar}
                alt="Avatar"
                className="h-7 w-7 rounded-full object-cover border border-gray-200"
              />
            ) : session?.user?.name ? (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#182C61]/10 dark:bg-primary/10 text-xs font-bold text-[#182C61] dark:text-primary">
                {session.user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.5]" />
            )}
          </Link>

          {/* WISHLIST */}
          <Link
            href="/account/wishlist"
            aria-label={t("nav.wishlist")}
            className="relative hidden sm:flex h-9 w-9 items-center justify-center text-gray-700 dark:text-gray-300 transition-colors hover:text-[#182C61] dark:hover:text-primary"
          >
            <Heart className="h-5 w-5 stroke-[1.5]" />
            {wCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#182C61] dark:bg-primary px-1 text-[9px] font-bold text-white shadow-xs">
                {wCount}
              </span>
            )}
          </Link>

          {/* EXACT NAVY BLUE CIRCULAR CART BUTTON + PRICE */}
          <Link
            href="/cart"
            aria-label={`${t("nav.cart") || "Cart"} (${count} items)`}
            className="flex items-center gap-2 group cursor-pointer transition-transform active:scale-95"
          >
            <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#182C61] dark:bg-primary text-white shadow-sm transition-transform group-hover:scale-105">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2]" />
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white text-[#182C61] dark:text-primary border border-[#182C61] dark:border-primary text-[9px] sm:text-[10px] font-bold shadow-xs px-0.5 leading-none">
                {count}
              </span>
            </div>
            <span className="text-[14px] font-bold text-gray-800 dark:text-foreground tracking-tight hidden sm:inline-block">
              {formatBDT(total)}
            </span>
          </Link>
        </div>
      </div>

      {/* ═══ MOBILE SEARCH ═════════════════════════════════ */}
      <div className="px-4 pb-3 md:hidden">
        <form onSubmit={onSearch} className="relative flex w-full items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("nav.searchPlaceholder")}
            className="h-10 w-full rounded-full border border-gray-300 dark:border-border bg-white dark:bg-background pl-4 pr-11 text-sm text-foreground outline-none placeholder:text-gray-400 focus:border-[#182C61]"
          />
          <button
            type="submit"
            aria-label={t("common.search")}
            className="absolute right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#182C61] dark:bg-primary text-white"
          >
            <Search className="h-4 w-4 stroke-[2.5]" />
          </button>
        </form>
      </div>

      {/* ═══ CATEGORY NAV (Bottom Bar) ════════════════════════ */}
      <nav className="border-t border-gray-200 dark:border-border bg-white dark:bg-card">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          {/* Desktop Category Row */}
          <ul className="hidden h-10 items-center md:flex gap-2">
            {(categories as Category[]).map((cat) => (
              <li
                key={cat.id}
                className="relative h-full"
                onMouseEnter={() => setActiveCategory(cat.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  href={cat.href}
                  className={`flex h-full items-center gap-1 whitespace-nowrap px-3 text-[13px] font-semibold transition-colors ${
                    activeCategory === cat.id
                      ? "text-[#182C61] dark:text-primary font-bold"
                      : "text-gray-700 dark:text-gray-300 hover:text-[#182C61] dark:hover:text-primary"
                  }`}
                >
                  {translateCategory(cat.name, language)}
                </Link>
                {activeCategory === cat.id && cat.subcategories?.length ? (
                  <SubMenu items={cat.subcategories} depth={0} language={language} />
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="max-h-[70vh] overflow-y-auto border-t border-border bg-card md:hidden">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
              <span className="text-xs font-bold text-muted-foreground">
                {language === "bn" ? "পছন্দসমূহ" : "Preferences"}
              </span>
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeSwitcher />
              </div>
            </div>
            {(categories as Category[]).map((cat) => (
              <MobileItem key={cat.id} cat={cat} language={language} onNavigate={() => setMobileOpen(false)} />
            ))}
            {navLinks.length > 0 && (
              <div className="border-t border-border p-3 bg-muted/10 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.url}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary rounded-md"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

function MobileItem({ cat, language = "en", onNavigate }: { cat: Category; language?: string; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!cat.subcategories?.length;
  return (
    <div className="border-b border-border last:border-0">
      <div className="flex items-center">
        <Link
          href={cat.href}
          onClick={onNavigate}
          className="flex flex-1 items-center px-4 py-3 text-sm text-foreground transition-colors hover:bg-accent"
        >
          {translateCategory(cat.name, language as any)}
        </Link>
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={`${cat.name} subcategories`}
            className="flex h-10 w-10 items-center justify-center text-muted-foreground"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        ) : null}
      </div>
      {open && hasChildren ? (
        <div className="bg-muted/40 pl-4">
          {cat.subcategories!.map((s) => (
            <MobileItem key={s.id} cat={s} language={language} onNavigate={onNavigate} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
