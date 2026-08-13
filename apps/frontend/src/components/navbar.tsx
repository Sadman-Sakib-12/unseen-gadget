"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, ShoppingCart, ChevronDown, ChevronRight, Menu, X, Heart } from "lucide-react";
import categories from "@/data/categories.json";
import { useCartStore, cartItemCount, cartSubtotal } from "@/features/cart-store";
import { useWishlistStore } from "@/features/wishlist-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatBDT } from "@/components/price";

interface Category {
  id: string;
  name: string;
  href: string;
  subcategories?: Category[];
}

/* ── Dropdown ───────────────────────────────────────────── */
function SubMenu({ items, depth = 0 }: { items: Category[]; depth?: number }) {
  const [hovered, setHovered] = useState<string | null>(null);
  if (!items?.length) return null;
  return (
    <ul className={
      depth === 0
        ? "absolute left-0 top-full z-50 min-w-[200px] border border-t-0 border-gray-200 bg-white shadow-lg"
        : "absolute left-full top-0 z-50 min-w-[200px] border border-gray-200 bg-white shadow-lg"
    }>
      {items.map((item) => (
        <li key={item.id} className="relative"
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered(null)}
        >
          <Link href={item.href}
            className="flex items-center justify-between px-4 py-2.5 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            {item.name}
            {item.subcategories?.length ? <ChevronRight className="h-3.5 w-3.5 text-gray-400" /> : null}
          </Link>
          {hovered === item.id && item.subcategories?.length
            ? <SubMenu items={item.subcategories} depth={depth + 1} />
            : null}
        </li>
      ))}
    </ul>
  );
}

/* ── Navbar ─────────────────────────────────────────────── */
export function Navbar() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const wishlistIds = useWishlistStore((s) => s.ids);

  const visibleItems = hydrated ? items : [];
  const count = cartItemCount(visibleItems);
  const total = cartSubtotal(visibleItems);
  const wishlistCount = hydrated ? wishlistIds.length : 0;

  return (
    <header className="sticky top-0 z-50">

      {/* ═══ TOP ROW ════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto flex h-[64px] max-w-[1320px] items-center gap-4 px-4">

          {/* LOGO — "Gadget" blue bold, "bd" black bold, ".com" small */}
          <Link href="/" className="shrink-0 mr-4">
            <span className="text-[26px] font-black leading-none tracking-tight">
              <span className="text-blue-600">Unseen Gadget</span>
              <span className="text-gray-900">bd</span>
              <sup className="text-[9px] font-bold text-gray-400 ml-[1px]">.com</sup>
            </span>
          </Link>

          {/* SEARCH — flex-1 fills all available space */}
          <div className="flex flex-1">
            <input
              type="text"
              placeholder="Search for products"
              className="h-[40px] flex-1 rounded-l-full border border-gray-300 border-r-0 bg-white px-5 text-[13px] text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-400"
            />
            <button
              aria-label="Search"
              className="flex h-[40px] w-[44px] shrink-0 items-center justify-center rounded-r-full bg-blue-600 text-white transition hover:bg-blue-700"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
          </div>

          {/* RIGHT ACTIONS — no ml-auto, gap controlled by parent */}
          <div className="flex shrink-0 items-center gap-5">

            {/* SUPPORT — phone handset icon + "Support" + blue number */}
            <a href="tel:+8801714039409"
              className="hidden lg:flex items-center gap-2.5 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {/* Phone icon in rounded-square border box */}
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200">
                <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
                  <path
                    d="M2 3.5A1.5 1.5 0 013.5 2h2.879a.75.75 0 01.707.495l1.15 3.1a.75.75 0 01-.18.797L6.6 7.848A11.04 11.04 0 0012.152 13.4l1.456-1.456a.75.75 0 01.797-.18l3.1 1.15A.75.75 0 0118 13.621V16.5A1.5 1.5 0 0116.5 18 14.5 14.5 0 012 3.5z"
                    stroke="#4b5563" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col leading-none gap-[3px]">
                <span className="text-[11px] text-gray-500">Support</span>
                <span className="text-[13px] font-bold text-blue-600">+8801714039409</span>
              </div>
            </a>

            {/* USER icon */}
            <Link href="/account"
              className="hidden md:flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <User className="h-[22px] w-[22px]" strokeWidth={1.5} />
            </Link>

            {/* WISHLIST — heart icon + count */}
            <Link href="/account/wishlist"
              className="hidden sm:flex items-center justify-center text-gray-600 hover:text-[#ff6b8a] transition-colors"
              aria-label="Wishlist"
            >
              <div className="relative">
                <Heart className="h-[22px] w-[22px]" strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -right-1.5 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#ff6b8a] px-[3px] text-[9px] font-bold text-white leading-none">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </Link>

            {/* CART — blue circle bg + badge + price */}
            <Link href="/cart"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
                  <ShoppingCart className="h-[18px] w-[18px] text-blue-600" strokeWidth={1.6} />
                </div>
                {count > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-[3px] text-[9px] font-bold text-white leading-none">
                    {count}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col leading-none gap-[2px]">
                <span className="text-[10px] text-gray-400">{count} {count === 1 ? "item" : "items"}</span>
                <span className="text-[12px] font-bold text-gray-800">{formatBDT(total)}</span>
              </div>
            </Link>

          </div>
        </div>
      </div>

      {/* ═══ CATEGORY NAV ═══════════════════════════════════ */}
      <nav className="bg-[#f5f5f5] border-b border-gray-200">
        <div className="mx-auto max-w-[1320px] px-4">

          {/* Desktop */}
          <ul className="hidden md:flex h-[40px] items-center">
            {(categories as Category[]).map((cat) => (
              <li key={cat.id} className="relative h-full"
                onMouseEnter={() => setActiveCategory(cat.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link href={cat.href}
                  className={`flex h-full items-center gap-[3px] whitespace-nowrap px-[10px] text-[13px] transition-colors ${
                    activeCategory === cat.id ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {cat.name}
                  {cat.subcategories?.length
                    ? <ChevronDown className="h-[13px] w-[13px] text-gray-500 mt-px" />
                    : null}
                </Link>
                {activeCategory === cat.id && cat.subcategories?.length
                  ? <SubMenu items={cat.subcategories} depth={0} />
                  : null}
              </li>
            ))}
          </ul>

          {/* Mobile */}
          <div className="md:hidden flex h-[40px] items-center">
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center gap-1.5 text-[13px] text-gray-700"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              Categories
              <ChevronDown className={`h-3 w-3 transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            {(categories as Category[]).map((cat) => <MobileItem key={cat.id} cat={cat} />)}
          </div>
        )}
      </nav>

    </header>
  );
}

function MobileItem({ cat }: { cat: Category }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-[13px] text-gray-700 hover:bg-gray-50"
      >
        {cat.name}
        {cat.subcategories?.length
          ? <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
          : null}
      </button>
      {open && cat.subcategories?.length
        ? <div className="bg-gray-50 pl-4">
            {cat.subcategories.map((s) => <MobileItem key={s.id} cat={s} />)}
          </div>
        : null}
    </div>
  );
}
