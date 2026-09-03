"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiRequest } from "@/lib/api";

// Dashboard Stats
export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => apiRequest("/dashboard"),
    staleTime: 1000 * 30, // 30 seconds fresh
  });
}

// Payments
export function useAdminPayments(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["admin", "payments", params],
    queryFn: () =>
      apiRequest("/payment/admin" + (params ? `?${new URLSearchParams(params)}` : "")),
    staleTime: 1000 * 30,
  });
}

// Products
export function useAdminProducts(opts?: Record<string, string>) {
  return useQuery({
    queryKey: ["admin", "products", opts],
    queryFn: () => api.products.list(opts),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useSaveAdminProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: Record<string, unknown> }) =>
      id ? api.products.update(id, data) : api.products.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useDeleteAdminProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.products.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

// Orders
export function useAdminOrders(opts?: Record<string, string>) {
  return useQuery({
    queryKey: ["admin", "orders", opts],
    queryFn: () => api.orders.list(opts),
    staleTime: 1000 * 30,
  });
}

export function useUpdateAdminOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, paymentStatus }: { id: string; status?: string; paymentStatus?: string }) =>
      api.orders.updateStatus(id, { ...(status ? { status } : {}), ...(paymentStatus ? { paymentStatus } : {}) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}

export function useCreateAdminOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.orders.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}

export function useDeleteAdminOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.orders.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}

// Categories & Brands
export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => api.categories.list(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSaveAdminCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: Record<string, unknown> }) =>
      id ? api.categories.update(id, data) : api.categories.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}

export function useDeleteAdminCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.categories.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}

export function useAdminBrands() {
  return useQuery({
    queryKey: ["admin", "brands"],
    queryFn: () => api.brands.list(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSaveAdminBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: Record<string, unknown> }) =>
      id ? api.brands.update(id, data) : api.brands.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
    },
  });
}

export function useDeleteAdminBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.brands.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
    },
  });
}

// Customers
export function useAdminCustomers(opts?: Record<string, string>) {
  return useQuery({
    queryKey: ["admin", "customers", opts],
    queryFn: () => api.customers.list(opts),
    staleTime: 1000 * 60,
  });
}

// Coupons
export function useAdminCoupons() {
  return useQuery({
    queryKey: ["admin", "coupons"],
    queryFn: () => apiRequest("/admin/coupons"),
    staleTime: 1000 * 60 * 2,
  });
}

export function useSaveAdminCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: string; data: Record<string, unknown> }) =>
      id
        ? apiRequest(`/admin/coupons/${id}`, { method: "PUT", body: JSON.stringify(data) })
        : apiRequest("/admin/coupons", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
    },
  });
}

export function useDeleteAdminCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiRequest(`/admin/coupons/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
    },
  });
}

// CMS - Landing
export function useAdminLanding() {
  return useQuery({
    queryKey: ["admin", "cms", "landing"],
    queryFn: () => apiRequest("/cms/landing"),
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateAdminLanding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: unknown) =>
      apiRequest("/cms/landing", {
        method: "PUT",
        body: JSON.stringify({ value: payload }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "cms", "landing"] });
      queryClient.invalidateQueries({ queryKey: ["cms", "landing"] });
    },
  });
}

// CMS - Banners
export function useAdminBanners() {
  return useQuery({
    queryKey: ["admin", "cms", "banners"],
    queryFn: () => apiRequest("/cms/banners"),
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateAdminBanners() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (banners: unknown) =>
      apiRequest("/cms/banners", {
        method: "PUT",
        body: JSON.stringify({ value: banners }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "cms", "banners"] });
      queryClient.invalidateQueries({ queryKey: ["cms", "banners"] });
    },
  });
}

// CMS - Stories
export function useAdminStories() {
  return useQuery({
    queryKey: ["admin", "cms", "stories"],
    queryFn: () => apiRequest("/cms/stories"),
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateAdminStories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stories: unknown) =>
      apiRequest("/cms/stories", {
        method: "PUT",
        body: JSON.stringify({ value: stories }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "cms", "stories"] });
      queryClient.invalidateQueries({ queryKey: ["cms", "stories"] });
    },
  });
}

// CMS - Navbar & General
export function useAdminNavbar() {
  return useQuery({
    queryKey: ["admin", "cms", "navbar"],
    queryFn: async () => {
      const [general, navbar] = await Promise.all([
        apiRequest("/cms/general"),
        apiRequest("/cms/navbar"),
      ]);
      return { general: general.data, navbar: navbar.data };
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateAdminGeneral() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (general: unknown) =>
      apiRequest("/cms/general", {
        method: "PUT",
        body: JSON.stringify({ value: general }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "cms", "navbar"] });
    },
  });
}

export function useUpdateAdminNavbar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (navbar: unknown) =>
      apiRequest("/cms/navbar", {
        method: "PUT",
        body: JSON.stringify({ value: navbar }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "cms", "navbar"] });
    },
  });
}

// CMS - About
export function useAdminAbout() {
  return useQuery({
    queryKey: ["admin", "cms", "about"],
    queryFn: () => apiRequest("/cms/about"),
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateAdminAbout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (about: unknown) =>
      apiRequest("/cms/about", {
        method: "PUT",
        body: JSON.stringify({ value: about }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "cms", "about"] });
    },
  });
}
