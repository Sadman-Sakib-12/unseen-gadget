export interface DashboardStats {
  totalSales: number;
  todaySales: number;
  grossProfit: number;
  totalOrders: number;
  pendingOrders: number;
  inventoryValue: number;
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  totalSuppliers: number;
  totalCustomers: number;
  totalExpenses: number;
  totalRevenue: number;
  revenueChange: number;
  ordersChange: number;
  profitChange: number;
  expensesChange: number;
}

export interface SalesOverview {
  month: string;
  orders: number;
  revenue: number;
  cost: number;
  profit: number;
}

export interface SalesTrend {
  month: string;
  sales: number;
  orders: number;
}

export interface SalesByChannel {
  channel: string;
  orders: number;
  revenue: number;
  percentage: number;
}

export interface RecentOrder {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  product: string;
  amount: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  date: string;
  city: string;
}

export interface LowStockProduct {
  id: string | number;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  status: "LOW" | "CRITICAL";
}

export interface TopProduct {
  id: string | number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  image: string;
}

export interface SupplierDue {
  id: string | number;
  supplierName: string;
  amount: number;
  dueDate: string;
  status: "PENDING" | "OVERDUE" | "PAID";
}

export interface Notification {
  id: string | number;
  title: string;
  message: string;
  type: "ORDER" | "ALERT" | "PAYMENT" | "CUSTOMER" | "SHIPPING" | "RETURN";
  time: string;
  read: boolean;
}

export interface QuickAction {
  id: string | number;
  title: string;
  description: string;
  icon: string;
  href: string;
}
