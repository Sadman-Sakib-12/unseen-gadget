export interface SalesReportData {
  id: string;
  period: string;
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  topProducts: { name: string; revenue: number }[];
  salesByChannel: { channel: string; revenue: number }[];
  dailyData: { date: string; revenue: number; orders: number }[];
}

export interface PurchaseReportData {
  id: string;
  period: string;
  totalPurchases: number;
  totalSuppliers: number;
  totalProductsPurchased: number;
  averagePurchaseValue: number;
  topSuppliers: { name: string; amount: number }[];
  categoryBreakdown: { category: string; amount: number }[];
  monthlyData: { month: string; amount: number }[];
}

export interface ProfitReportData {
  id: string;
  period: string;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  monthlyBreakdown: { month: string; revenue: number; cost: number; profit: number }[];
  topCategories: { category: string; profit: number }[];
}

export interface ExpenseReportData {
  id: string;
  period: string;
  totalExpenses: number;
  categories: { category: string; amount: number }[];
  monthlyTrend: { month: string; amount: number }[];
  topExpenses: { description: string; amount: number }[];
}
