import { notFound } from "next/navigation";
import OrdersFeaturePage from "@/features/orders/page";
import { ReportsPage } from "@/features/reports/components/reports-page";

const VALID_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

export default async function OrdersStatusPage({
  params,
}: {
  params: Promise<{ status: string }>;
}) {
  const { status } = await params;

  if (status === "reports") {
    return <ReportsPage />;
  }

  if (!VALID_STATUSES.includes(status)) {
    notFound();
  }

  return <OrdersFeaturePage status={status} />;
}