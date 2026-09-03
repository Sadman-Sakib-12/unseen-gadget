// Re-export formatBDT from the canonical location.
export { formatBDT } from "./format";

export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "DELIVERED":
    case "PAID":
      return "default";
    case "SHIPPED":
    case "PROCESSING":
      return "secondary";
    case "PENDING":
      return "outline";
    case "CANCELLED":
    case "REFUNDED":
      return "destructive";
    case "CRITICAL":
      return "destructive";
    case "LOW":
      return "secondary";
    default:
      return "default";
  }
};
