import { notFound } from "next/navigation";
import { InventorySectionPage } from "@/features/inventory/components/inventory-section-page";

const VALID_SECTIONS = [
  "stock-management",
  "stock-in",
  "stock-out",
  "stock-adjustment",
  "stock-transfer",
  "low-stock",
  "out-of-stock",
  "damaged-stock",
  "warehouse",
  "stock-history",
];

export default async function InventorySectionRoute({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  if (!VALID_SECTIONS.includes(section)) {
    notFound();
  }

  return <InventorySectionPage section={section} />;
}