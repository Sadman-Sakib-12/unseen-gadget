"use client";

import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const adminApiClient = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const method = (options.method || "GET").toUpperCase();
    const config: AxiosRequestConfig = {
      url: endpoint,
      method: method as any,
      headers: (options.headers as any) || {},
    };

    if (options.body) {
      if (typeof options.body === "string") {
        try {
          config.data = JSON.parse(options.body);
        } catch {
          config.data = options.body;
        }
      } else {
        config.data = options.body;
      }
    }

    const response: AxiosResponse<ApiResponse<T>> = await adminApiClient(config);
    return response.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    const errorMessage =
      errorData?.error || errorData?.message || error.message || "API request failed";
    throw new Error(errorMessage);
  }
}

// Auth APIs (admin)
export const adminAuthApi = {
  login: (data: { email: string; password: string }) =>
    apiRequest("/admin/auth/login", { method: "POST", body: JSON.stringify(data) }),

  logout: () => apiRequest("/admin/auth/logout", { method: "POST" }),

  me: () => apiRequest("/admin/auth/me"),

  register: (data: { name: string; email: string; password: string }) =>
    apiRequest("/admin/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  refresh: (token: string) => apiRequest("/admin/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ token }),
  }),
};

// Admin resource APIs (all under /api/admin)
export const api = {
  // Products
  products: {
    list: (opts?: Record<string, string>) =>
      apiRequest("/products" + (opts ? `?${new URLSearchParams(opts)}` : "")),
    get: (idOrSlug: string) => apiRequest(`/products/${idOrSlug}`),
    create: (data: Record<string, unknown>) =>
      apiRequest("/admin/products", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      apiRequest(`/admin/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest(`/admin/products/${id}`, { method: "DELETE" }),
  },

  // Categories
  categories: {
    list: () => apiRequest("/admin/categories"),
    create: (data: Record<string, unknown>) =>
      apiRequest("/admin/categories", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      apiRequest(`/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest(`/admin/categories/${id}`, { method: "DELETE" }),
  },

  // Brands
  brands: {
    list: () => apiRequest("/admin/brands"),
    create: (data: Record<string, unknown>) =>
      apiRequest("/admin/brands", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      apiRequest(`/admin/brands/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest(`/admin/brands/${id}`, { method: "DELETE" }),
  },

  // Orders
  orders: {
    list: (opts?: Record<string, string>) =>
      apiRequest("/admin/orders" + (opts ? `?${new URLSearchParams(opts)}` : "")),
    get: (id: string) => apiRequest(`/admin/orders/${id}`),
    create: (data: Record<string, unknown>) =>
      apiRequest("/admin/orders", { method: "POST", body: JSON.stringify(data) }),
    updateStatus: (id: string, statusOrData: string | Record<string, unknown>) =>
      apiRequest(`/admin/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify(typeof statusOrData === "string" ? { status: statusOrData } : statusOrData),
      }),
    delete: (id: string) => apiRequest(`/admin/orders/${id}`, { method: "DELETE" }),
  },

  // Customers
  customers: {
    list: (opts?: Record<string, string>) =>
      apiRequest("/admin/customers" + (opts ? `?${new URLSearchParams(opts)}` : "")),
    get: (id: string) => apiRequest(`/admin/customers/${id}`),
  },

  // CMS
  cms: {
    // Posts
    posts: (opts?: Record<string, string>) => apiRequest("/cms/posts" + (opts ? `?${new URLSearchParams(opts)}` : ""), { cache: "no-store" }),
    postsId: (id: string) => apiRequest(`/cms/posts/${id}`),
    createPost: (data: Record<string, unknown>) =>
      apiRequest("/cms/posts", { method: "POST", body: JSON.stringify(data) }),
    updatePost: (id: string, data: Record<string, unknown>) =>
      apiRequest(`/cms/posts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deletePost: (id: string) => apiRequest(`/cms/posts/${id}`, { method: "DELETE" }),

    // Promotions
    promotions: (opts?: Record<string, string>) => apiRequest("/cms/promotions" + (opts ? `?${new URLSearchParams(opts)}` : ""), { cache: "no-store" }),
    promotionsId: (id: string) => apiRequest(`/cms/promotions/${id}`),
    createPromotion: (data: Record<string, unknown>) =>
      apiRequest("/cms/promotions", { method: "POST", body: JSON.stringify(data) }),
    updatePromotion: (id: string, data: Record<string, unknown>) =>
      apiRequest(`/cms/promotions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deletePromotion: (id: string) => apiRequest(`/cms/promotions/${id}`, { method: "DELETE" }),

    // Jobs
    jobs: (opts?: Record<string, string>) => apiRequest("/cms/jobs" + (opts ? `?${new URLSearchParams(opts)}` : ""), { cache: "no-store" }),
    jobsId: (id: string) => apiRequest(`/cms/jobs/${id}`),
    createJob: (data: Record<string, unknown>) =>
      apiRequest("/cms/jobs", { method: "POST", body: JSON.stringify(data) }),
    updateJob: (id: string, data: Record<string, unknown>) =>
      apiRequest(`/cms/jobs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteJob: (id: string) => apiRequest(`/cms/jobs/${id}`, { method: "DELETE" }),

    // Pages
    pages: (opts?: Record<string, string>) => apiRequest("/cms/pages" + (opts ? `?${new URLSearchParams(opts)}` : ""), { cache: "no-store" }),
    pagesSlug: (slug: string) => apiRequest(`/cms/pages/${slug}`),
    createPage: (data: Record<string, unknown>) =>
      apiRequest("/cms/pages", { method: "POST", body: JSON.stringify(data) }),
    updatePage: (slug: string, data: Record<string, unknown>) =>
      apiRequest(`/cms/pages/${slug}`, { method: "PUT", body: JSON.stringify(data) }),
    deletePage: (slug: string) => apiRequest(`/cms/pages/${slug}`, { method: "DELETE" }),

    // Footer
    footer: () => apiRequest("/cms/footer"),
    updateFooter: (data: Record<string, unknown>) =>
      apiRequest("/cms/footer", { method: "PUT", body: JSON.stringify(data) }),

    // Other CMS sections
    banners: () => apiRequest("/cms/banners"),
    navbar: () => apiRequest("/cms/navbar"),
    about: () => apiRequest("/cms/about"),
    landing: () => apiRequest("/cms/landing"),
  },

  // Suppliers
  suppliers: {
    list: () => apiRequest("/admin/suppliers"),
    get: (id: string) => apiRequest(`/admin/suppliers/${id}`),
    create: (data: { name: string; phone?: string; email?: string; address?: string; company?: string; dueAmount?: number; status?: string }) =>
      apiRequest("/admin/suppliers", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<{ name: string; phone?: string; email?: string; address?: string; company?: string; dueAmount?: number; status?: string }>) =>
      apiRequest(`/admin/suppliers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest(`/admin/suppliers/${id}`, { method: "DELETE" }),
    transactions: (id: string) => apiRequest(`/admin/suppliers/${id}/transactions`),
    createTransaction: (id: string, data: { type: string; amount: number; date?: string; reference?: string; note?: string }) =>
      apiRequest(`/admin/suppliers/${id}/transactions`, { method: "POST", body: JSON.stringify(data) }),
  },

  // Purchases
  purchases: {
    list: () => apiRequest("/admin/purchases"),
    get: (id: string) => apiRequest(`/admin/purchases/${id}`),
    create: (data: { supplierId: string; items: Array<{ productId?: string; productName: string; quantity: number; unitPrice: number }>; discount?: number; tax?: number; paidAmount?: number; invoiceNumber?: string; date?: string }) =>
      apiRequest("/admin/purchases", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<{ supplierId: string; items?: Array<{ productId?: string; productName: string; quantity: number; unitPrice: number }>; discount?: number; tax?: number; paidAmount?: number; invoiceNumber?: string; date?: string }>) =>
      apiRequest(`/admin/purchases/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest(`/admin/purchases/${id}`, { method: "DELETE" }),
  },

  // Inventory
  inventory: {
    list: () => apiRequest("/admin/inventory"),
    get: (id: string) => apiRequest(`/admin/inventory/${id}`),
    update: (id: string, data: { minStock?: number; maxStock?: number }) =>
      apiRequest(`/admin/inventory/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    stockMovements: () => apiRequest("/admin/inventory/stock-movements"),
    createStockMovement: (data: { productId: string; type: "IN" | "OUT" | "ADJUSTMENT"; quantity: number; note?: string; reference?: string }) =>
      apiRequest("/admin/inventory/stock-movements", { method: "POST", body: JSON.stringify(data) }),
  },

  // Reviews (admin)
  reviews: {
    list: (status?: string) => apiRequest(`/admin/reviews${status ? `?status=${status}` : ""}`),
    get: (id: string) => apiRequest(`/admin/reviews/${id}`),
    status: (id: string, data: { status: "APPROVED" | "PENDING" | "REJECTED" }) =>
      apiRequest(`/admin/reviews/${id}/status`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest(`/admin/reviews/${id}`, { method: "DELETE" }),
  },

  // Returns
  returns: {
    list: () => apiRequest("/admin/returns"),
    get: (id: string) => apiRequest(`/admin/returns/${id}`),
    status: (id: string, data: { status: "PENDING" | "APPROVED" | "REFUNDED" | "REJECTED"; refundAmount?: number }) =>
      apiRequest(`/admin/returns/${id}/status`, { method: "PATCH", body: JSON.stringify(data) }),
    customer: (data: { orderId: string; product?: string; reason: string; refundAmount?: number }) =>
      apiRequest("/return", { method: "POST", body: JSON.stringify(data) }),
  },

  // Deliveries
  deliveries: {
    list: () => apiRequest("/admin/deliveries"),
    get: (id: string) => apiRequest(`/admin/deliveries/${id}`),
    update: (id: string, data: { status?: string; courier?: string; trackingNumber?: string; estimatedDelivery?: string }) =>
      apiRequest(`/admin/deliveries/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  },

  // Expenses
  expenses: {
    list: () => apiRequest("/admin/expenses"),
    get: (id: string) => apiRequest(`/admin/expenses/${id}`),
    create: (data: { category: string; amount: number; description?: string; date?: string; paymentMethod?: string; receipt?: string }) =>
      apiRequest("/admin/expenses", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<{ category: string; amount: number; description?: string; date?: string; paymentMethod?: string; receipt?: string }>) =>
      apiRequest(`/admin/expenses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest(`/admin/expenses/${id}`, { method: "DELETE" }),
  },

  // Notifications
  notifications: {
    list: () => apiRequest("/admin/notifications"),
    create: (data: { title: string; message: string; type: "ORDER" | "PAYMENT" | "RETURN" | "ALERT" | "SHIPPING" | "CUSTOMER" | "SYSTEM"; actionUrl?: string }) =>
      apiRequest("/admin/notifications", { method: "POST", body: JSON.stringify(data) }),
    read: (id: string) => apiRequest(`/admin/notifications/${id}/read`, { method: "PATCH", body: JSON.stringify({ read: true }) }),
    readAll: () => apiRequest("/admin/notifications/read-all", { method: "PATCH", body: JSON.stringify({ readAll: true }) }),
  },

  // Promotions (admin)
  promotions: {
    list: () => apiRequest("/admin/promotions"),
    get: (id: string) => apiRequest(`/admin/promotions/${id}`),
    create: (data: { name: string; title?: string; badge?: string; description?: string; type?: string; discountType?: string; discountValue?: number; applicableTo?: string; startDate?: string; endDate?: string; status?: string; ctaLabel?: string; ctaHref?: string; icon?: string; gradient?: string; sortOrder?: number; active?: boolean }) =>
      apiRequest("/admin/promotions", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<{ name: string; title?: string; badge?: string; description?: string; type?: string; discountType?: string; discountValue?: number; applicableTo?: string; startDate?: string; endDate?: string; status?: string; ctaLabel?: string; ctaHref?: string; icon?: string; gradient?: string; sortOrder?: number; active?: boolean }>) =>
      apiRequest(`/admin/promotions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest(`/admin/promotions/${id}`, { method: "DELETE" }),
  },

  // POS
  pos: {
    listSessions: () => apiRequest("/admin/pos/sessions"),
    getSession: (id: string) => apiRequest(`/admin/pos/sessions/${id}`),
    createSession: (data: { cashInHand?: number }) =>
      apiRequest("/admin/pos/sessions", { method: "POST", body: JSON.stringify(data) }),
    recordSale: (id: string, data: { amount: number }) =>
      apiRequest(`/admin/pos/sessions/${id}/sale`, { method: "PATCH", body: JSON.stringify(data) }),
    closeSession: (id: string, data: { totalSales?: number; totalOrders?: number }) =>
      apiRequest(`/admin/pos/sessions/${id}/close`, { method: "PATCH", body: JSON.stringify(data) }),
  },

  // Settings
  settings: {
    list: () => apiRequest("/admin/settings"),
    get: (key: string) => apiRequest(`/admin/settings/${key}`),
    update: (key: string, data: unknown) =>
      apiRequest(`/admin/settings/${key}`, { method: "PUT", body: JSON.stringify(data) }),
  },

  // Admin management
  admins: {
    list: () => apiRequest("/admin/admins"),
    create: (data: { name: string; email: string; password?: string; roleId?: string; status?: string }) =>
      apiRequest("/admin/admins", { method: "POST", body: JSON.stringify(data) }),
    get: (id: string) => apiRequest(`/admin/admins/${id}`),
    update: (id: string, data: Partial<{ name: string; email: string; password: string; roleId: string; status?: string }>) =>
      apiRequest(`/admin/admins/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest(`/admin/admins/${id}`, { method: "DELETE" }),
  },

  roles: {
    list: () => apiRequest("/admin/roles"),
    create: (data: { name: string; permissions?: string[]; description?: string }) =>
      apiRequest("/admin/roles", { method: "POST", body: JSON.stringify(data) }),
    get: (id: string) => apiRequest(`/admin/roles/${id}`),
    update: (id: string, data: Partial<{ name: string; permissions?: string[]; description?: string }>) =>
      apiRequest(`/admin/roles/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest(`/admin/roles/${id}`, { method: "DELETE" }),
  },
};

export default apiRequest;