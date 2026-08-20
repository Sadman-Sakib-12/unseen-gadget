"use client";

import { OrdersPage } from "./components/orders-page";

export default function OrdersFeaturePage({ status }: { status?: string }) {
  return <OrdersPage status={status} />;
}
