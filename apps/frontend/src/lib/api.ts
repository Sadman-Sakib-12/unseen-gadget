import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Session cache to prevent redundant /api/auth/session calls on every API request
let cachedSession: { token?: string; refreshToken?: string; expiresAt: number } | null = null;
let sessionPromise: Promise<{ token?: string; refreshToken?: string }> | null = null;

async function getCachedSessionTokens(): Promise<{ token?: string; refreshToken?: string }> {
  if (typeof window === "undefined") return {};

  const now = Date.now();
  if (cachedSession && cachedSession.expiresAt > now) {
    return { token: cachedSession.token, refreshToken: cachedSession.refreshToken };
  }

  if (sessionPromise) {
    return sessionPromise;
  }

  sessionPromise = (async () => {
    try {
      const session = await getSession();
      const token = session?.user?.accessToken;
      const refreshToken = session?.user?.refreshToken;
      cachedSession = {
        token,
        refreshToken,
        expiresAt: Date.now() + 10 * 1000, // 10s cache
      };
      return { token, refreshToken };
    } catch {
      return {};
    } finally {
      sessionPromise = null;
    }
  })();

  return sessionPromise;
}

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request Interceptor: inject Bearer token from cached session
apiClient.interceptors.request.use(async (config) => {
  const isPublicRoute =
    config.url?.startsWith("/products") ||
    config.url?.startsWith("/catalog") ||
    config.url?.startsWith("/cms");

  if (!isPublicRoute || config.headers?.Authorization) {
    const { token } = await getCachedSessionTokens();
    if (token && !config.headers?.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Response Interceptor: handle 401 and auto-refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/logout")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken } = await getCachedSessionTokens();
        const refreshRes = await axios.post(
          `${API_URL}/api/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        if (refreshRes.data?.success && refreshRes.data?.data?.accessToken) {
          const newToken = refreshRes.data.data.accessToken;
          if (cachedSession) {
            cachedSession.token = newToken;
            cachedSession.refreshToken =
              refreshRes.data.data.refreshToken || cachedSession.refreshToken;
            cachedSession.expiresAt = Date.now() + 10 * 1000;
          }
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const method = (options.method || "GET").toUpperCase();
    const { token } = await getCachedSessionTokens();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token && !headers["Authorization"] && !headers["authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config: AxiosRequestConfig = {
      url: endpoint,
      method: method as any,
      headers,
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

    const response: AxiosResponse<ApiResponse<T>> = await apiClient(config);
    return response.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    const errorMessage =
      errorData?.error || errorData?.message || error.message || "API request failed";
    throw new Error(errorMessage);
  }
}

// Auth APIs
export const authApi = {
  register: (data: { email: string; name: string; phone: string; password: string }) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  verifyEmail: (data: { token: string }) =>
    apiRequest("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string; sessionId?: string }) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () => apiRequest("/auth/logout", { method: "POST" }),

  me: () => apiRequest("/auth/me"),

  refresh: (token: string) => apiRequest("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ token }),
  }),

  forgotPassword: (email: string) =>
    apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (data: { token: string; password: string }) =>
    apiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Product APIs
export const productApi = {
  list: (params?: {
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    featured?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
  }) => {
    const paramsString = new URLSearchParams();
    if (params) {
      if (params.q) paramsString.append("q", params.q);
      if (params.category) paramsString.append("category", params.category);
      if (params.brand) paramsString.append("brand", params.brand);
      if (params.minPrice !== undefined) paramsString.append("minPrice", String(params.minPrice));
      if (params.maxPrice !== undefined) paramsString.append("maxPrice", String(params.maxPrice));
      if (params.inStock !== undefined) paramsString.append("inStock", params.inStock ? "true" : "false");
      if (params.featured !== undefined) paramsString.append("featured", params.featured ? "true" : "false");
      if (params.page !== undefined) paramsString.append("page", String(params.page));
      if (params.limit !== undefined) paramsString.append("limit", String(params.limit));
      if (params.sort) paramsString.append("sort", params.sort);
    }
    return apiRequest(`/products?${paramsString.toString()}`);
  },

  detail: (slug: string) => apiRequest(`/products/${slug}`),

  newArrivals: (limit?: number) => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", String(limit));
    return apiRequest(`/products/new-arrivals?${params.toString()}`);
  },

  topSelling: (limit?: number) => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", String(limit));
    return apiRequest(`/products/top-selling?${params.toString()}`);
  },

  reviews: (slug: string) => apiRequest(`/products/${slug}/reviews`),
};

// Cart APIs
export const cartApi = {
  list: (cartId: string) => apiRequest(`/cart/${cartId}`),

  add: (cartId: string, productId: number, quantity?: number, color?: string) =>
    apiRequest(`/cart/${cartId}/items`, {
      method: "POST",
      body: JSON.stringify({ productId, quantity, color }),
    }),

  remove: (cartItemId: string) =>
    apiRequest(`/cart/items/${cartItemId}`, {
      method: "DELETE",
    }),

  update: (cartItemId: string, quantity: number) =>
    apiRequest(`/cart/items/${cartItemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),

  clear: (cartId: string) => apiRequest(`/cart/${cartId}/clear`, {
    method: "POST",
    body: JSON.stringify({}),
  }),

  guest: (sessionId: string) => apiRequest(`/guest/${sessionId}`),
};

// Wishlist APIs
export const wishlistApi = {
  list: () =>
    apiRequest(`/wishlist`, {
      method: "GET",
    }),

  add: (productId: string | number) =>
    apiRequest("/wishlist", {
      method: "POST",
      body: JSON.stringify({ productId: String(productId) }),
    }),

  remove: (productId: string | number) =>
    apiRequest(`/wishlist/${productId}`, {
      method: "DELETE",
    }),
};

// Address APIs
export const addressApi = {
  list: () => apiRequest("/address"),

  create: (data: {
    name: string;
    phone: string;
    address: string;
    city: string;
    zipCode?: string;
    isDefault?: boolean;
  }) =>
    apiRequest("/address", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (addressId: string, data: { isDefault?: boolean }) =>
    apiRequest(`/address/${addressId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (addressId: string) =>
    apiRequest(`/address/${addressId}`, {
      method: "DELETE",
    }),

  default: () => apiRequest("/address/default"),
};

// Order APIs
export const orderApi = {
  checkout: (data: {
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: "cod" | "bkash" | "nagad" | "COD" | "BKASH" | "NAGAD" | "SSLCOMMERZ" | string;
    items: { productId: string | number; variantId?: string | number; quantity: number; price: number }[];
  }) =>
    apiRequest("/order/checkout", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  list: () => apiRequest("/order"),

  myOrders: () => apiRequest("/order"),

  detail: (orderId: string) => apiRequest(`/order/${orderId}`),

  cancel: (orderId: string) => apiRequest(`/order/${orderId}/cancel`, {
    method: "POST",
  }),

  payment: (paymentId: string) => apiRequest(`/payments/${paymentId}`),
};

// Payment APIs
export const paymentApi = {
  create: (data: {
    orderId: string;
    customerName: string;
    amount: number;
    method: "bKash" | "Nagad";
    transactionId: string;
  }) =>
    apiRequest("/payment", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  detail: (paymentId: string) =>
    apiRequest(`/payment/${paymentId}`),

  orderPayment: (orderId: string) =>
    apiRequest(`/payment/order/${orderId}/payment`),
};

// Search
export const searchApi = {
  query: (q: string) => apiRequest(`/products?q=${encodeURIComponent(q)}`),
};

// Catalog APIs
export const catalogApi = {
  categories: () => apiRequest("/catalog/categories"),
  brands: () => apiRequest("/catalog/brands"),
};

// CMS/Static Pages
export const cmsApi = {
  page: (slug: string) => apiRequest(`/cms/pages/${slug}`),
};

export default apiRequest;