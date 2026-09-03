"use client";

import { useState, useEffect } from "react";
import { Package, Heart, Star, ShoppingBag, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { TranslationKey } from "@/lib/i18n";
import { useTranslation } from "@/hooks/use-translation";
import { orderApi, apiRequest } from "@/lib/api";

import { useSession } from "next-auth/react";

export default function AccountPage() {
  const { status } = useSession();
  const { t } = useTranslation();
  const [wishlistCount, setWishlistCount] = useState(0);

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    reviews: 0,
  });

  useEffect(() => {
    if (status !== "authenticated") return;
    apiRequest("/wishlist")
      .then((res) => {
        const items = res.data || [];
        setWishlistCount(items.length);
      })
      .catch(() => setWishlistCount(0));
    orderApi.myOrders()
      .then((res) => {
        const orders = res.data || [];
        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter((o: any) => o.status === "PENDING" || o.status === "PROCESSING").length,
          reviews: 0,
        });
      })
      .catch(() => {});
  }, [status]);

  const statItems: { icon: typeof ShoppingBag; label: TranslationKey; value: string; color: string }[] = [
    { icon: ShoppingBag, label: "account.totalOrders", value: String(stats.totalOrders), color: "bg-primary/10 text-primary" },
    { icon: Package, label: "account.pending", value: String(stats.pendingOrders), color: "bg-warning/10 text-warning" },
    { icon: Heart, label: "account.wishlist", value: String(wishlistCount), color: "bg-error/10 text-error" },
    { icon: Star, label: "account.reviews", value: String(stats.reviews), color: "bg-amber-400/10 text-amber-500" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statItems.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center shadow-sm"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{t(stat.label)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-base font-bold text-foreground">{t("account.welcome")}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t("account.welcomeHint")}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            href="/products"
            className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary hover:bg-primary/5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{t("account.browseProducts")}</p>
              <p className="text-xs text-muted-foreground">{t("account.browseHint")}</p>
            </div>
            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            href="/promotions"
            className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-warning hover:bg-warning/5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <Star className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{t("account.promotions")}</p>
              <p className="text-xs text-muted-foreground">{t("account.promotionsHint")}</p>
            </div>
            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">{t("account.recentOrders")}</h3>
          <Link
            href="/account/orders"
            className="text-xs font-medium text-primary transition-colors hover:underline"
          >
            {t("account.viewAll")}
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-10 text-center">
          <Package className="h-10 w-10 text-muted-foreground" strokeWidth={1.2} />
          <p className="mt-2 text-sm font-medium text-foreground">{t("account.noOrders")}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("account.noOrdersHint")}
          </p>
          <Link href="/products" className="btn-primary mt-4 !h-9 !px-4 !text-xs rounded-xl">
            {t("common.startShopping")}
          </Link>
        </div>
      </div>
    </div>
  );
}
