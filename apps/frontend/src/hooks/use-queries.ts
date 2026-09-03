"use client";

import { useQuery } from "@tanstack/react-query";
import { productApi, wishlistApi, orderApi, addressApi, catalogApi, apiRequest } from "@/lib/api";

// Product Queries
export function useProducts(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productApi.list(params),
    staleTime: 1000 * 60 * 2, // 2 minutes fresh
  });
}

export function useProductDetail(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => productApi.detail(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useNewArrivals(limit = 8) {
  return useQuery({
    queryKey: ["products", "new-arrivals", limit],
    queryFn: () => productApi.newArrivals(limit),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTopSelling(limit = 8) {
  return useQuery({
    queryKey: ["products", "top-selling", limit],
    queryFn: () => productApi.topSelling(limit),
    staleTime: 1000 * 60 * 5,
  });
}

// Catalog (Categories & Brands)
export function useCategories() {
  return useQuery({
    queryKey: ["catalog", "categories"],
    queryFn: () => catalogApi.categories(),
    staleTime: 1000 * 60 * 10, // 10 minutes (rarely changes)
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ["catalog", "brands"],
    queryFn: () => catalogApi.brands(),
    staleTime: 1000 * 60 * 10,
  });
}

// Wishlist
export function useWishlist() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistApi.list(),
    staleTime: 1000 * 30, // 30 seconds
  });
}

// Addresses
export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressApi.list(),
    staleTime: 1000 * 60,
  });
}

// Orders
export function useMyOrders() {
  return useQuery({
    queryKey: ["orders", "my-orders"],
    queryFn: () => orderApi.myOrders(),
    staleTime: 1000 * 30,
  });
}

// CMS Queries
export function useBanners() {
  return useQuery({
    queryKey: ["cms", "banners"],
    queryFn: () => apiRequest("/cms/banners"),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useFeaturedCategories() {
  return useQuery({
    queryKey: ["cms", "featured-categories"],
    queryFn: () => apiRequest("/cms/featured-categories"),
    staleTime: 1000 * 60 * 10,
  });
}

export function useStories() {
  return useQuery({
    queryKey: ["cms", "stories"],
    queryFn: () => apiRequest("/cms/stories"),
    staleTime: 1000 * 60 * 10,
  });
}

export function useLandingCms() {
  return useQuery({
    queryKey: ["cms", "landing"],
    queryFn: () => apiRequest("/cms/landing"),
    staleTime: 1000 * 60 * 2,
  });
}

export function useArticles() {
  return useQuery({
    queryKey: ["articles"],
    queryFn: () => apiRequest("/article"),
    staleTime: 1000 * 60 * 5,
  });
}

// CMS Page
export function useCmsPage(slug: string) {
  return useQuery({
    queryKey: ["cms", slug],
    queryFn: () => apiRequest(`/cms/pages/${slug}`),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 10,
  });
}

