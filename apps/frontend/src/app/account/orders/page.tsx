"use client";

import { Package, Clock, Truck, CheckCircle2, XCircle, ShoppingBag, Eye, RotateCcw } from "lucide-react";
import Link from "next/link";
import type { TranslationKey } from "@/lib/i18n";
import { formatBDT } from "@/components/price";
import { useTranslation } from "@/hooks/use-translation";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  id: number;
  name: string;
  slug: string;
  image?: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
}

const statusMeta: Record<
  OrderStatus,
  { icon: typeof Clock; className: string; key: TranslationKey }
> = {
  pending: { icon: Clock, className: "bg-warning/10 text-warning", key: "orders.status.pending" },
  processing: { icon: Package, className: "bg-primary/10 text-primary", key: "orders.status.processing" },
  shipped: { icon: Truck, className: "bg-primary/10 text-primary", key: "orders.status.shipped" },
  delivered: { icon: CheckCircle2, className: "bg-success/10 text-success", key: "orders.status.delivered" },
  cancelled: { icon: XCircle, className: "bg-error/10 text-error", key: "orders.status.cancelled" },
};

// Demo data — no backend
const demoOrders: Order[] = [];

export default function OrdersPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-foreground">{t("orders.title")}</h1>
      </div>

      {demoOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card py-20 text-center">
          <Package className="h-12 w-12 text-muted-foreground" strokeWidth={1.2} />
          <h3 className="mt-3 text-sm font-semibold text-foreground">{t("orders.empty")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t("orders.emptyHint")}</p>
          <Link href="/products" className="btn-primary mt-5 !h-9 !px-4 !text-xs rounded-xl">
            <ShoppingBag className="h-4 w-4" />
            {t("wishlist.browse")}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {demoOrders.map((order) => {
            const meta = statusMeta[order.status];
            return (
              <div key={order.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      {t("orders.orderNo", { id: order.id })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{t("orders.placedOn")} {order.date}</span>
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${meta.className}`}
                    >
                      <meta.icon className="h-3 w-3" />
                      {t(meta.key)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-3">
                    {order.items.map((item) => (
                      <Link
                        key={item.id}
                        href={`/product/${item.slug}`}
                        className="group flex items-center gap-2"
                      >
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-muted">
                          <span className="text-[10px] font-bold text-muted-foreground">{item.qty}×</span>
                        </div>
                        <div className="max-w-40">
                          <p className="truncate text-xs font-medium text-foreground transition-colors group-hover:text-primary">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">{formatBDT(item.price)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{t("orders.total")}</p>
                      <p className="text-sm font-bold text-foreground">{formatBDT(order.total)}</p>
                    </div>
                    <Link
                      href="#"
                      className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {t("orders.viewDetails")}
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-700"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      {t("orders.buyAgain")}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
