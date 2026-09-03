import { prisma } from "@unseen-gadget/database";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function getDashboardStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalOrders,
    pendingOrders,
    totalProducts,
    totalCustomers,
    totalSuppliers,
    totalExpenses,
    ordersThisMonth,
    ordersPrevMonth,
    paidOrdersThisMonth,
    paidOrdersPrevMonth,
    lowStockProducts,
    outOfStockProducts,
    inventoryAgg,
    expensesThisMonth,
    expensesPrevMonth,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.user.count(),
    prisma.supplier.count({ where: { status: "ACTIVE" } }),
    prisma.expense.aggregate({ _sum: { amount: true } }),

    prisma.order.aggregate({
      _sum: { total: true },
      _count: true,
      where: { createdAt: { gte: startOfMonth } },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      _count: true,
      where: { createdAt: { gte: startOfPrevMonth, lte: endOfPrevMonth } },
    }),

    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID", createdAt: { gte: startOfMonth } },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID", createdAt: { gte: startOfPrevMonth, lte: endOfPrevMonth } },
    }),

    prisma.product.findMany({
      where: { status: "ACTIVE", stock: { gt: 0, lte: 5 } },
      select: { id: true },
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE", stock: 0 },
      select: { id: true },
    }),

    prisma.product.aggregate({
      _sum: { stock: true },
      where: { status: "ACTIVE" },
    }),

    prisma.expense.aggregate({
      _sum: { amount: true },
      where: { createdAt: { gte: startOfMonth } },
    }),
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: { createdAt: { gte: startOfPrevMonth, lte: endOfPrevMonth } },
    }),
  ]);

  const totalSales = paidOrdersThisMonth._sum.total ?? 0;
  const prevSales = paidOrdersPrevMonth._sum.total ?? 0;
  const todaySales = await prisma.order.aggregate({
    _sum: { total: true },
    where: { paymentStatus: "PAID", createdAt: { gte: startOfDay } },
  });

  const setting = await prisma.setting.findFirst({ where: { key: "profitMargin" } });
  const profitMargin = (typeof setting?.value === "number" ? setting.value : Number(setting?.value ?? "0.4"));
  const grossProfit = Math.round(totalSales * profitMargin);
  const totalRevenue = totalSales;
  const totalExpensesVal = totalExpenses._sum.amount ?? 0;
  const inventoryValue = (inventoryAgg._sum.stock ?? 0) * 1000;

  const revenueChange = prevSales > 0 ? Math.round(((totalSales - prevSales) / prevSales) * 1000) / 10 : 0;
  const prevOrderCount = ordersPrevMonth._count;
  const thisOrderCount = ordersThisMonth._count;
  const ordersChange = prevOrderCount > 0 ? Math.round(((thisOrderCount - prevOrderCount) / prevOrderCount) * 1000) / 10 : 0;

  const expensesThis = expensesThisMonth._sum.amount ?? 0;
  const expensesPrev = expensesPrevMonth._sum.amount ?? 0;
  const expensesChange = expensesPrev > 0 ? Math.round(((expensesThis - expensesPrev) / expensesPrev) * 1000) / 10 : 0;
  const profitChange = revenueChange;

  return {
    totalSales,
    todaySales: todaySales._sum.total ?? 0,
    grossProfit,
    totalOrders: totalOrders,
    pendingOrders,
    inventoryValue,
    totalProducts,
    lowStock: lowStockProducts.length,
    outOfStock: outOfStockProducts.length,
    totalSuppliers,
    totalCustomers,
    totalExpenses: totalExpensesVal,
    totalRevenue,
    revenueChange,
    ordersChange,
    profitChange,
    expensesChange,
  };
}

export async function getSalesOverview() {
  const now = new Date();
  const results: { month: string; orders: number; revenue: number; cost: number; profit: number }[] = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const [orderData, expenseData] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        _count: true,
        where: { createdAt: { gte: monthStart, lte: monthEnd } },
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: monthStart, lte: monthEnd } },
      }),
    ]);

    const revenue = orderData._sum.total ?? 0;
    const cost = expenseData._sum.amount ?? 0;
    const profit = revenue - cost;

    results.push({
      month: MONTH_NAMES[date.getMonth()],
      orders: orderData._count,
      revenue,
      cost,
      profit,
    });
  }

  return results;
}

export async function getSalesTrend() {
  const now = new Date();
  const results: { month: string; sales: number; orders: number }[] = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const data = await prisma.order.aggregate({
      _sum: { total: true },
      _count: true,
      where: { createdAt: { gte: monthStart, lte: monthEnd } },
    });

    results.push({
      month: MONTH_NAMES[date.getMonth()],
      sales: data._sum.total ?? 0,
      orders: data._count,
    });
  }

  return results;
}

export async function getSalesByChannel() {
  const orders = await prisma.order.groupBy({
    by: ["paymentMethod"],
    _sum: { total: true },
    _count: true,
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o._sum.total ?? 0), 0);

  const channelMap: Record<string, string> = {
    CASH_ON_DELIVERY: "COD",
    MOBILE_BANKING: "Mobile Banking",
    BANK_TRANSFER: "Bank Transfer",
    CARD: "Card",
  };

  return orders.map((o) => ({
    channel: channelMap[o.paymentMethod] ?? o.paymentMethod,
    orders: o._count,
    revenue: o._sum.total ?? 0,
    percentage: totalRevenue > 0 ? Math.round(((o._sum.total ?? 0) / totalRevenue) * 1000) / 10 : 0,
  }));
}

export async function getRecentOrders() {
  const orders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      shippingAddress: true,
      status: true,
      paymentStatus: true,
      total: true,
      city: true,
      createdAt: true,
      items: {
        take: 1,
        select: { productName: true },
      },
    },
  });

  return orders.map((o) => ({
    id: o.id,
    customerName: o.customerName,
    email: o.customerEmail ?? "",
    phone: o.customerPhone,
    product: o.items[0]?.productName ?? "",
    amount: o.total,
    status: o.status,
    paymentStatus: o.paymentStatus,
    date: o.createdAt.toISOString().split("T")[0],
    city: o.city ?? "",
  }));
}

export async function getLowStockProducts() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", stock: { gt: 0 }, inStock: true },
    orderBy: { stock: "asc" },
    take: 10,
    select: {
      id: true,
      name: true,
      sku: true,
      stock: true,
    },
  });

  const setting = await prisma.setting.findFirst({ where: { key: "lowStockThreshold" } });
  const lowStockThreshold = Number(setting?.value ?? 15);
  return products
    .filter((p) => p.stock <= lowStockThreshold)
    .map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku ?? "N/A",
      stock: p.stock,
      minStock: Math.max(p.stock + 2, 5),
      status: p.stock <= 3 ? ("CRITICAL" as const) : ("LOW" as const),
    }));
}

export async function getTopSellingProducts() {
  const topItems = await prisma.orderItem.groupBy({
    by: ["productId", "productName"],
    _sum: { quantity: true, total: true },
    _count: true,
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
    where: { productId: { not: null } },
  });

  const productIds = topItems.map((i) => i.productId).filter(Boolean) as string[];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      images: true,
      category: { select: { name: true } },
    },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  return topItems.map((item) => {
    const product = productMap.get(item.productId!);
    return {
      id: item.productId ?? `top-${item.productName}`,
      name: item.productName,
      category: product?.category?.name ?? "",
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
      sold: item._sum.quantity ?? 0,
      image: product?.images?.[0] ?? "/images/placeholder.jpg",
    };
  });
}

export async function getSupplierDues() {
  const suppliers = await prisma.supplier.findMany({
    where: { dueAmount: { gt: 0 } },
    orderBy: { dueAmount: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      dueAmount: true,
    },
  });

  return suppliers.map((s) => ({
    id: s.id,
    supplierName: s.name,
    amount: s.dueAmount,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "PENDING" as const,
  }));
}

export async function getNotifications() {
  const notifications = await prisma.notification.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      message: true,
      type: true,
      time: true,
      read: true,
    },
  });

  return notifications.map((n, idx) => ({
    id: n.id || `notif-${idx}`,
    title: n.title,
    message: n.message,
    type: n.type,
    time: formatTimeAgo(n.time),
    read: n.read,
  }));
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs === 1 ? "" : "s"} ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export async function getDashboardAll() {
  const [stats, salesOverview, salesTrend, salesByChannel, recentOrders, lowStockProducts, topSellingProducts, supplierDues, notifications] = await Promise.all([
    getDashboardStats(),
    getSalesOverview(),
    getSalesTrend(),
    getSalesByChannel(),
    getRecentOrders(),
    getLowStockProducts(),
    getTopSellingProducts(),
    getSupplierDues(),
    getNotifications(),
  ]);

  return {
    stats,
    salesOverview,
    salesTrend,
    salesByChannel,
    recentOrders,
    lowStockProducts,
    topSellingProducts,
    supplierDues,
    notifications,
  };
}

export const DashboardService = {
  getDashboardStats,
  getSalesOverview,
  getSalesTrend,
  getSalesByChannel,
  getRecentOrders,
  getLowStockProducts,
  getTopSellingProducts,
  getSupplierDues,
  getNotifications,
  getDashboardAll,
};

export default DashboardService;
