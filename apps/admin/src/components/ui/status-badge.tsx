import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/utils";

export type StatusTone =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning";

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
  refunded: "success",
  critical: "destructive",

  pending: "warning",
  confirmed: "warning",
  processing: "warning",
  scheduled: "warning",
  requested: "warning",
  awaiting: "warning",
  unpaid: "warning",
  low: "warning",
  low_stock: "warning",
  picked_up: "warning",
  in_transit: "warning",
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

  shipped: "secondary",
  inactive: "secondary",
  draft: "secondary",
  archived: "secondary",
  ended: "secondary",
  unfulfilled: "secondary",
  unread: "secondary",
};

/** Resolve the tone for any status string, normalizing case first. */
export function resolveStatusTone(status: string): StatusTone {
  const key = status.trim().toLowerCase().replace(/-/g, "_");
  return TONE_OVERRIDES[key] ?? "secondary";
}

/** Humanize a status string, e.g. "IN_TRANSIT" -> "In Transit". */
export function humanizeStatus(status: string): string {
  return status
    .trim()
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

interface StatusBadgeProps {
  status: string;
  tone?: StatusTone;
  className?: string;
}

function StatusBadge({ status, tone, className }: StatusBadgeProps) {
  return (
    <Badge
      variant={tone ?? resolveStatusTone(status)}
      className={cn("font-medium", className)}
    >
      {humanizeStatus(status)}
    </Badge>
  );
}

export { StatusBadge };