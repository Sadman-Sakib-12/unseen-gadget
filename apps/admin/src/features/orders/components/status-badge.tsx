"use client";

import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = {
    PENDING: "outline" as const,
    CONFIRMED: "secondary" as const,
    PROCESSING: "secondary" as const,
    SHIPPED: "secondary" as const,
    DELIVERED: "success" as const,
    CANCELLED: "destructive" as const,
  }[status as "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"];

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}
