import { prisma } from "@unseen-gadget/database";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function getSalesReport() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [orders, totalCustomers] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: startOfYear } },
      select: { total: true, createdAt: true },
    }),
    prisma.user.count(),
  ]);

  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  const topItems = await prisma.orderItem.groupBy({
    by: ["productName"],
    _sum: { total: true },
    orderBy: { _sum: { total: "desc" } },
    take: 5,
  });

  const channelData = await prisma.order.groupBy({
    by: ["paymentMethod"],
    _sum: { total: true },
    where: { createdAt: { gte: startOfYear } },
  });

  const channelMap: Record<string, string> = {
    CASH_ON_DELIVERY: "COD",
    MOBILE_BANKING: "Mobile Banking",
    BANK_TRANSFER: "Bank Transfer",
    CARD: "Card",
  };

  const salesByChannel = channelData.map((c) => ({
    channel: channelMap[c.paymentMethod] ?? c.paymentMethod,
    revenue: c._sum.total ?? 0,
  }));

  const dailyData: { date: string; revenue: number; orders: number }[] = [];
  for (let d = 1; d <= Math.min(now.getDate(), 31); d++) {
    const dayStart = new Date(now.getFullYear(), now.getMonth(), d);
    const dayEnd = new Date(now.getFullYear(), now.getMonth(), d + 1);
    const dayOrders = orders.filter((o) => o.createdAt >= dayStart && o.createdAt < dayEnd);
    dailyData.push({
      date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      orders: dayOrders.length,
    });
  }

  return [
    {
      id: `SALES-${now.getFullYear()}`,
      period: `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`,
      totalSales,
      totalOrders,
      totalCustomers,
      averageOrderValue,
      topProducts: topItems.map((t) => ({ name: t.productName, revenue: t._sum.total ?? 0 })),
      salesByChannel,
      dailyData,
    },
  ];
}

export async function getPurchaseReport() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [purchases, suppliers, purchaseItems] = await Promise.all([
    prisma.purchase.findMany({
      where: { createdAt: { gte: startOfYear } },
      select: { total: true, createdAt: true },
    }),
    prisma.supplier.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true, totalPurchases: true },
      orderBy: { totalPurchases: "desc" },
      take: 5,
    }),
    prisma.purchaseItem.groupBy({
      by: ["productName"],
      _sum: { quantity: true, total: true },
      orderBy: { _sum: { total: "desc" } },
      take: 5,
    }),
  ]);

  const totalPurchases = purchases.reduce((s, p) => s + p.total, 0);
  const totalProductsPurchased = purchaseItems.reduce((s, i) => s + (i._sum.quantity ?? 0), 0);

  const monthlyData: { month: string; amount: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const mEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const monthPurchases = purchases.filter((p) => p.createdAt >= mStart && p.createdAt <= mEnd);
    monthlyData.push({
      month: MONTH_NAMES[date.getMonth()],
      amount: monthPurchases.reduce((s, p) => s + p.total, 0),
    });
  }

  const categoryBreakdown = purchaseItems.map((i) => ({
    category: i.productName,
    amount: i._sum.total ?? 0,
  }));

  return [
    {
      id: `PURCHASE-${now.getFullYear()}`,
      period: `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`,
      totalPurchases,
      totalSuppliers: suppliers.length,
      totalProductsPurchased,
      averagePurchaseValue: purchases.length > 0 ? Math.round(totalPurchases / purchases.length) : 0,
      topSuppliers: suppliers.map((s) => ({ name: s.name, amount: s.totalPurchases })),
      categoryBreakdown,
      monthlyData,
    },
  ];
}

export async function getProfitReport() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [orders, expenses] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: startOfYear } },
      select: { total: true, createdAt: true },
    }),
    prisma.expense.findMany({
      where: { createdAt: { gte: startOfYear } },
      select: { amount: true, category: true, createdAt: true },
    }),
  ]);

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalCost = expenses.reduce((s, e) => s + e.amount, 0);
  const grossProfit = totalRevenue - totalCost;
  const netProfit = grossProfit;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 1000) / 10 : 0;

  const monthlyBreakdown: { month: string; revenue: number; cost: number; profit: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const mEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const mRevenue = orders.filter((o) => o.createdAt >= mStart && o.createdAt <= mEnd).reduce((s, o) => s + o.total, 0);
    const mCost = expenses.filter((e) => e.createdAt >= mStart && e.createdAt <= mEnd).reduce((s, e) => s + e.amount, 0);
    monthlyBreakdown.push({
      month: MONTH_NAMES[date.getMonth()],
      revenue: mRevenue,
      cost: mCost,
      profit: mRevenue - mCost,
    });
  }

  const categoryProfit = new Map<string, number>();
  expenses.forEach((e) => {
    const current = categoryProfit.get(e.category) ?? 0;
    categoryProfit.set(e.category, current + e.amount);
  });

  const topCategories = Array.from(categoryProfit.entries())
    .map(([category, profit]) => ({ category, profit: -profit }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5);

  return [
    {
      id: `PROFIT-${now.getFullYear()}`,
      period: `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`,
      totalRevenue,
      totalCost,
      grossProfit,
      netProfit,
      profitMargin,
      monthlyBreakdown,
      topCategories,
    },
  ];
}

export async function getExpenseReport() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const expenses = await prisma.expense.findMany({
    where: { createdAt: { gte: startOfYear } },
    select: { amount: true, category: true, description: true, createdAt: true },
  });

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const categoryMap = new Map<string, number>();
  expenses.forEach((e) => {
    const current = categoryMap.get(e.category) ?? 0;
    categoryMap.set(e.category, current + e.amount);
  });

  const categories = Array.from(categoryMap.entries()).map(([category, amount]) => ({ category, amount }));

  const monthlyTrend: { month: string; amount: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const mEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const monthExpenses = expenses.filter((e) => e.createdAt >= mStart && e.createdAt <= mEnd);
    monthlyTrend.push({
      month: MONTH_NAMES[date.getMonth()],
      amount: monthExpenses.reduce((s, e) => s + e.amount, 0),
    });
  }

  const topExpenses = expenses
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10)
    .map((e) => ({ description: e.description ?? e.category, amount: e.amount }));

  return [
    {
      id: `EXPENSE-${now.getFullYear()}`,
      period: `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`,
      totalExpenses,
      categories,
      monthlyTrend,
      topExpenses,
    },
  ];
}

export const ReportsService = {
  getSalesReport,
  getPurchaseReport,
  getProfitReport,
  getExpenseReport,
};

export default ReportsService;
