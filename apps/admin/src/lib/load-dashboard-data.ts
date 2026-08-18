import {
  dashboardStats,
  salesData,
  salesTrendData,
  salesByChannelData,
  recentOrders,
  lowStockProducts,
  topSellingProducts,
  supplierDues,
  notifications,
  quickActions,
} from "@/features/dashboard/data";

export {
  dashboardStats,
  salesData,
  salesTrendData,
  salesByChannelData,
  recentOrders,
  lowStockProducts,
  topSellingProducts,
  supplierDues,
  notifications,
  quickActions,
};

// Kept for backward compatibility — canonical helpers now live in @/lib/format.
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
