"use client";

import { useState, FormEvent } from "react";
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
  Phone,
} from "lucide-react";
import categories from "@/data/categories.json";
import { useCartStore, cartItemCount, cartSubtotal } from "@/features/cart-store";
import { useWishlistStore } from "@/features/wishlist-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatBDT } from "@/components/price";
import { useTranslation } from "@/hooks/use-translation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";

interface Category {
  id: string;
  name: string;
  href: string;
  subcategories?: Category[];
}

const SUPPORT_PHONE = "+8801714039409";

/* ── Dropdown ───────────────────────────────────────────── */
function SubMenu({ items, depth = 0 }: { items: Category[]; depth?: number }) {
  const [hovered, setHovered] = useState<string | null>(null);
  if (!items?.length) return null;
  return (
    <ul
      className={
        depth === 0
          ? "dropdown-enter absolute left-0 top-full z-50 min-w-[220px] rounded-lg border border-border bg-card shadow-sm"
          : "absolute left-full top-0 z-50 min-w-[220px] rounded-lg border border-border bg-card shadow-sm"
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
            className="flex items-center justify-between gap-3 px-4 py-2.5 text-[13px] text-foreground transition-colors hover:bg-accent hover:text-primary"
          >
            <span className="truncate">{item.name}</span>
            {item.subcategories?.length ? (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            ) : null}
          </Link>
          {hovered === item.id && item.subcategories?.length ? (
            <SubMenu items={item.subcategories} depth={depth + 1} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/* ── Navbar ─────────────────────────────────────────────── */
export function Navbar() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const hydrated = useHydrated();
  const { t } = useTranslation();
  const items = useCartStore((s) => s.items);
  const wishlistIds = useWishlistStore((s) => s.ids);

  const visibleItems = hydrated ? items : [];
  const count = cartItemCount(visibleItems);
  const total = cartSubtotal(visibleItems);
  const wishlistCount = hydrated ? wishlistIds.length : 0;

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      {/* ═══ TOP ROW ════════════════════════════════════════ */}
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4">
        {/* MOBILE MENU */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={t("nav.menu")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-accent md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* LOGO */}
        <Link href="/" className="mr-1 shrink-0">
          <span className="text-[22px] font-black leading-none tracking-tight text-foreground">
            <span className="text-primary">Unseen Gadget</span>bd
            <sup className="ml-px text-[9px] font-bold text-muted-foreground">.com</sup>
          </span>
        </Link>

        {/* SEARCH */}
        <form onSubmit={onSearch} className="hidden flex-1 sm:flex">
          <div className="relative flex w-full max-w-xl flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("nav.searchPlaceholder")}
              className="h-10 w-full rounded-l-full border border-border border-r-0 bg-card px-5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
            <button
              type="submit"
              aria-label={t("common.search")}
              className="flex h-10 w-11 shrink-0 items-center justify-center rounded-r-full bg-primary text-primary-foreground transition-colors hover:bg-primary-700"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
          </div>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0">
          <div className="hidden lg:block">
            <ThemeSwitcher />
          </div>
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>

          {/* SUPPORT */}
          <a
            href={`tel:${SUPPORT_PHONE}`}
            className="hidden xl:flex items-center gap-2 text-foreground transition-colors hover:text-primary"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-primary">
              <Phone className="h-4 w-4" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[10px] text-muted-foreground">{t("nav.support")}</span>
              <span className="text-[12px] font-bold text-primary">{SUPPORT_PHONE}</span>
            </span>
          </a>

          {/* ACCOUNT */}
          <Link
            href="/account"
            aria-label={t("nav.myAccount")}
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:flex"
          >
            <User className="h-5 w-5" strokeWidth={1.6} />
          </Link>

          {/* WISHLIST */}
          <Link
            href="/account/wishlist"
            aria-label={t("nav.wishlist")}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Heart className="h-5 w-5" strokeWidth={1.6} />
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[9px] font-bold leading-none text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* CART */}
          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-foreground transition-colors hover:border-primary"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <ShoppingCart className="h-4 w-4 text-primary" strokeWidth={1.8} />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold leading-none text-primary-foreground">
                  {count}
                </span>
              )}
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-[10px] text-muted-foreground">
                {count} {count === 1 ? t("nav.item") : t("nav.items")}
              </span>
              <span className="text-[12px] font-bold">{formatBDT(total)}</span>
            </span>
          </Link>
        </div>
      </div>

      {/* ═══ MOBILE SEARCH ═════════════════════════════════ */}
      <div className="px-4 pb-2 sm:hidden">
        <form onSubmit={onSearch} className="flex w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("nav.searchPlaceholder")}
            className="h-9 w-full rounded-l-full border border-border border-r-0 bg-card px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <button
            type="submit"
            aria-label={t("common.search")}
            className="flex h-9 w-10 shrink-0 items-center justify-center rounded-r-full bg-primary text-primary-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* ═══ CATEGORY NAV ════════════════════════════════════ */}
      <nav className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-[1440px] px-4">
          {/* Desktop */}
          <ul className="hidden h-10 items-center md:flex">
            {(categories as Category[]).map((cat) => (
              <li
                key={cat.id}
                className="relative h-full"
                onMouseEnter={() => setActiveCategory(cat.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  href={cat.href}
                  className={`flex h-full items-center gap-1 whitespace-nowrap px-3 text-[13px] font-medium transition-colors ${
                    activeCategory === cat.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </Link>
                {activeCategory === cat.id && cat.subcategories?.length ? (
                  <SubMenu items={cat.subcategories} depth={0} />
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="max-h-[70vh] overflow-y-auto border-t border-border bg-card md:hidden">
            {(categories as Category[]).map((cat) => (
              <MobileItem key={cat.id} cat={cat} onNavigate={() => setMobileOpen(false)} />
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}

function MobileItem({ cat, onNavigate }: { cat: Category; onNavigate: () => void }) {
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
          {cat.name}
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
            <MobileItem key={s.id} cat={s} onNavigate={onNavigate} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
