"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Package } from "lucide-react";
import Link from "next/link";
import { findCategoryByHref, getParentChain, mapCategoryNodes, type Category } from "@/lib/categories";
import { apiRequest, productApi } from "@/lib/api";
import { ProductGridSkeleton } from "@/components/product-card-skeleton";
import { CategoryPageClient } from "./CategoryPageClient";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = React.use(params);
  const pathSegments = Array.isArray(slug) ? slug : [slug];
  const href = `/category/${pathSegments.join("/")}`;
  const targetSlug = pathSegments[pathSegments.length - 1] || "";
  const formattedName = decodeURIComponent(targetSlug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const [category, setCategory] = useState<Category | null>(null);
  const [parentChain, setParentChain] = useState<Category[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      apiRequest("/catalog/categories").catch(() => ({ data: [] })),
      productApi.list({ category: targetSlug }).catch(() => ({ data: [] })),
    ])
      .then(([catRes, prodRes]) => {
        if (!isMounted) return;
        const allTree = mapCategoryNodes(catRes.data || []);
        const matched = findCategoryByHref(allTree, href);
        const chain = matched ? getParentChain(allTree, href) : [];

        const activeCat: Category = matched || {
          id: targetSlug,
          name: formattedName,
          slug: targetSlug,
          href,
        };

        setCategory(activeCat);
        setParentChain(chain);
        const rawList = Array.isArray(prodRes?.data)
          ? prodRes.data
          : Array.isArray(prodRes?.data?.items)
          ? prodRes.data.items
          : [];
        setProducts(rawList);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [href, targetSlug, formattedName]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border">
          <div className="container-gadget">
            <div className="flex items-center gap-2 py-3.5 animate-pulse">
              <div className="h-3 w-12 rounded bg-muted/60" />
              <ChevronRight className="h-3 w-3 opacity-30" />
              <div className="h-3 w-20 rounded bg-muted/60" />
            </div>
          </div>
        </div>

        <div className="container-gadget py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Sidebar Skeleton */}
            <div className="hidden lg:block space-y-5">
              <div className="rounded-xl border border-border bg-card p-4 animate-pulse space-y-3">
                <div className="h-4 w-1/2 rounded bg-muted" />
                <div className="h-2 w-full rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
              </div>
              <div className="rounded-xl border border-border bg-card p-4 animate-pulse space-y-3">
                <div className="h-4 w-1/3 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-4/5 rounded bg-muted" />
                <div className="h-3 w-2/3 rounded bg-muted" />
              </div>
            </div>

            {/* Product Grid Skeleton */}
            <div className="lg:col-span-3">
              <div className="mb-4 flex items-center justify-between animate-pulse">
                <div className="h-6 w-36 rounded bg-muted" />
                <div className="h-8 w-28 rounded bg-muted" />
              </div>
              <ProductGridSkeleton count={8} desktopCols={4} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-gadget">
          <div className="py-20 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" strokeWidth={1.2} />
            <h1 className="mt-4 text-2xl font-bold text-foreground">Category Not Found</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The category you are looking for does not exist.
            </p>
            <Link href="/" className="btn-primary mt-6 inline-flex items-center gap-1.5 rounded-xl">
              Go Home <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CategoryPageClient
      key={href}
      category={category}
      parentChain={parentChain}
      allProducts={products}
    />
  );
}
