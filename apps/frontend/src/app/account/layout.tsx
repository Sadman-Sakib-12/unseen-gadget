"use client";

import { ChevronRight, User, Package, Heart, MapPin, Bell, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";

const navItems = [
  { icon: User, label: "account.dashboard", href: "/account" },
  { icon: Package, label: "account.orders", href: "/account/orders" },
  { icon: Heart, label: "account.wishlist", href: "/account/wishlist" },
  { icon: MapPin, label: "account.addresses", href: "/account/addresses" },
  { icon: Bell, label: "account.notifications", href: "/account/notifications" },
  { icon: Settings, label: "account.settings", href: "/account/settings" },
] as const;

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/account") return pathname === "/account";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">{t("shop.breadcrumbHome")}</Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground">{t("account.breadcrumb")}</span>
          </nav>
        </div>
      </div>

      <div className="container-gadget py-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {/* Profile header */}
              <div className="bg-gradient-to-br from-primary to-primary-800 px-5 py-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                  <User className="h-8 w-8 text-white" />
                </div>
                <p className="mt-3 text-sm font-bold text-white">{t("account.guest")}</p>
                <p className="mt-0.5 text-xs text-primary-foreground/70">{t("account.notLoggedIn")}</p>
                <Link
                  href="/login"
                  className="mt-3 inline-block rounded-lg bg-white px-4 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
                >
                  {t("account.signIn")}
                </Link>
              </div>

              {/* Nav */}
              <nav className="p-2">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4" />
                        {t(item.label)}
                      </span>
                    </Link>
                  );
                })}

                <button className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-error transition-colors hover:bg-error/10">
                  <LogOut className="h-4 w-4" />
                  {t("account.logout")}
                </button>
              </nav>
            </div>
          </aside>

          {/* Main */}
          <div className="min-w-0 lg:col-span-3">{children}</div>
        </div>
      </div>
    </>
  );
}
