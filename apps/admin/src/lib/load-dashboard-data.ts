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

export const formatBDT = (amount: number): string => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

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
