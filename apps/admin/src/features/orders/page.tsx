"use client";

import { OrdersPage } from "./components/orders-page";

export default function OrdersFeaturePage({
  status,
  orderId,
}: {
  status?: string;
  orderId?: string;
}) {
  return <OrdersPage status={status} orderId={orderId} />;
}
