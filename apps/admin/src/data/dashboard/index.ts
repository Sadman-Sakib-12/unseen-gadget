import stats from "./stats.json";
import salesOverview from "./sales-overview.json";
import salesByChannel from "./sales-by-channel.json";
import recentOrdersJson from "./recent-orders.json";
import lowStockProductsJson from "./low-stock-products.json";
import topSellingProductsJson from "./top-selling-products.json";
import notificationsJson from "./notifications.json";

import type { DashboardStats, SalesOverview, SalesByChannel, RecentOrder, LowStockProduct, TopProduct, Notification } from "@/features/dashboard/types";

export const dashboardStats = stats as DashboardStats;
export const salesData = salesOverview as SalesOverview[];
export const salesByChannelData = salesByChannel as SalesByChannel[];
export const recentOrders = recentOrdersJson as RecentOrder[];
export const lowStockProducts = lowStockProductsJson as LowStockProduct[];
export const topSellingProducts = topSellingProductsJson as TopProduct[];
export const notifications = notificationsJson as Notification[];
