import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/utils";

export type StatusTone =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning"
  | "info"
  | "purple";

const TONE_OVERRIDES: Record<string, StatusTone> = {
  delivered: "success",
  paid: "success",
  active: "success",
  approved: "success",
  completed: "success",
  received: "success",
  fulfilled: "success",
  cleared: "success",
  published: "success",
  in_stock: "success",
  reconciled: "success",

  shipped: "info",
  processing: "info",
  confirmed: "info",
  in_transit: "info",
  picked_up: "info",

  pending: "warning",
  scheduled: "warning",
  requested: "warning",
  awaiting: "warning",
  unpaid: "warning",
  low: "warning",
  low_stock: "warning",
  reserved: "warning",
  partially_fulfilled: "warning",

  cancelled: "destructive",
  cancelled_by_user: "destructive",
  rejected: "destructive",
  failed: "destructive",
  out_of_stock: "destructive",
  expired: "destructive",
  blocked: "destructive",
  overdue: "destructive",
  returned: "destructive",
  void: "destructive",

  refunded: "purple",
  inactive: "secondary",
  draft: "secondary",
  archived: "secondary",
  ended: "secondary",
  unfulfilled: "secondary",
  unread: "secondary",
};

/** Resolve the tone for any status string, normalizing case first. */
export function resolveStatusTone(status?: string | null): StatusTone {
  if (!status || typeof status !== "string") return "secondary";
  const key = status.trim().toLowerCase().replace(/-/g, "_");
  return TONE_OVERRIDES[key] ?? "secondary";
}

/** Humanize a status string, e.g. "IN_TRANSIT" -> "In Transit". */
export function humanizeStatus(status?: string | null): string {
  if (!status || typeof status !== "string") return "Unknown";
  return status
    .trim()
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

interface StatusBadgeProps {
  status?: string | null;
  tone?: StatusTone;
  className?: string;
}

function StatusBadge({ status = "unknown", tone, className }: StatusBadgeProps) {
  const safeStatus = status || "unknown";
  return (
    <Badge
      variant={tone ?? resolveStatusTone(safeStatus)}
      className={cn("font-medium", className)}
    >
      {humanizeStatus(safeStatus)}
    </Badge>
  );
}

export { StatusBadge };