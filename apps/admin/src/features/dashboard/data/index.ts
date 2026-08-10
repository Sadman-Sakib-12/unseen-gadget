import stats from "@/data/dashboard/stats.json";
import salesOverview from "@/data/dashboard/sales-overview.json";
import salesByChannel from "@/data/dashboard/sales-by-channel.json";
import recentOrdersJson from "@/data/dashboard/recent-orders.json";
import lowStockProductsJson from "@/data/dashboard/low-stock-products.json";
import topSellingProductsJson from "@/data/dashboard/top-selling-products.json";
import notificationsJson from "@/data/dashboard/notifications.json";
import salesTrendJson from "./sales-trend.json";
import supplierDueJson from "./supplier-due.json";
import quickActionsJson from "./quick-actions.json";

import type {
  DashboardStats,
  SalesOverview,
  SalesTrend,
  SalesByChannel,
  RecentOrder,
  LowStockProduct,
  TopProduct,
  SupplierDue,
  Notification,
  QuickAction,
} from "@/features/dashboard/types";

export const dashboardStats = stats as DashboardStats;
export const salesData = salesOverview as SalesOverview[];
export const salesTrendData = salesTrendJson as SalesTrend[];
export const salesByChannelData = salesByChannel as SalesByChannel[];
export const recentOrders = recentOrdersJson as RecentOrder[];
export const lowStockProducts = lowStockProductsJson as LowStockProduct[];
export const topSellingProducts = topSellingProductsJson as TopProduct[];
export const supplierDues = supplierDueJson as SupplierDue[];
export const notifications = notificationsJson as Notification[];
export const quickActions = quickActionsJson as QuickAction[];
