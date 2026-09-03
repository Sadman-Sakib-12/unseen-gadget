'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Boxes, LayoutGrid, List, Package, Plus, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ProductCard } from './product-card';
import { ProductsTable } from './products-table';
import { ProductForm } from './product-form';
import { ProductDetailsModal } from './product-details-modal';
import type { Product, Category } from '../types';
import {
  useAdminProducts,
  useAdminCategories,
  useSaveAdminProduct,
  useDeleteAdminProduct,
} from '@/hooks/use-admin-queries';

type ViewMode = 'grid' | 'table';

function formatInventoryValue(value: number): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductsPage() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const { data: productsRes } = useAdminProducts({ limit: '100' });
  const { data: categoriesRes } = useAdminCategories();
  const saveProductMutation = useSaveAdminProduct();
  const deleteProductMutation = useDeleteAdminProduct();

  const products = useMemo(() => {
    const res = productsRes as any;
    if (!res) return [];
    const rawList = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res)
      ? res
      : Array.isArray(res.data?.items)
      ? res.data.items
      : [];

    return (rawList as Array<Partial<Product> & { image?: string }>).map((item) => ({
      id: item.id || '',
      name: item.name || '',
      brand: item.brand || '',
      category: item.category || '',
      description: item.description || '',
      price: Number(item.price) || 0,
      discount: Number(item.discount) || 0,
      sku: item.sku || '',
      barcode: item.barcode || '',
      images: Array.isArray(item.images) && item.images.length > 0 ? item.images : (item.image ? [item.image] : []),
      stock: Number(item.stock) || 0,
      warranty: item.warranty || '',
      specifications: item.specifications || {},
      status: (item.status as 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK') || 'ACTIVE',
      variants: item.variants || [],
      shippingType: (item.shippingType as 'FREE' | 'PAID') || 'FREE',
      shippingCost: Number(item.shippingCost) || 0,
    }));
  }, [productsRes]);

  const categories = useMemo(() => {
    const res = categoriesRes as any;
    if (!res) return [];
    return (Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []) as Category[];
  }, [categoriesRes]);

  const stats = useMemo(() => {
    const active = products.filter((p) => p.status === 'ACTIVE').length;
    const inStock = products.filter((p) => p.stock > 0).length;
    const outOfStock = products.filter((p) => p.stock === 0 || p.status === 'OUT_OF_STOCK').length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    return { total: products.length, active, inStock, outOfStock, totalValue };
  }, [products]);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (productId: string | number) => {
    setDeleteTarget(products.find((p) => p.id === productId) ?? null);
  };

  const confirmDeleteProduct = async () => {
    if (deleteTarget) {
      try {
        await deleteProductMutation.mutateAsync(String(deleteTarget.id));
        setDeleteTarget(null);
      } catch (err: any) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
  };

  const handleCloseDetails = () => {
    setViewingProduct(null);
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      await saveProductMutation.mutateAsync({
        id: editingProduct?.id ? String(editingProduct.id) : undefined,
        data: productData as Record<string, unknown>,
      });
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      alert(errorObj.message || 'Failed to save product');
    }
  };

  const handleModeChange = (value: ViewMode) => {
    setViewMode(value);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product inventory, pricing, and stock levels."
        actions={
          <Link href="/products/new">
            <Button>
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total products"
          value={stats.total}
          icon={Package}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Active"
          value={stats.active}
          icon={Boxes}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="In stock"
          value={stats.inStock}
          icon={List}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Out of stock"
          value={stats.outOfStock}
          icon={TriangleAlert}
          iconClassName="bg-red-50 text-red-700"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Inventory value:{' '}
            <span className="font-semibold text-gray-900">{formatInventoryValue(stats.totalValue)}</span>
          </p>
          <SegmentedControl
            aria-label="Product view"
            value={viewMode}
            onValueChange={(value) => handleModeChange(value as ViewMode)}
            options={[
              { value: 'table', label: 'Table', icon: List, iconOnly: false },
              { value: 'grid', label: 'Grid', icon: LayoutGrid, iconOnly: false },
            ]}
          />
        </div>

        {viewMode === 'grid' ? (
          products.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white">
              <EmptyState
                title="No products"
                description="Get started by adding your first product."
                action={
                  <Link href="/products/new">
                    <Button>
                      <Plus className="h-4 w-4" />
                      Add Product
                    </Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  onView={handleViewProduct}
                />
              ))}
            </div>
          )
        ) : (
          <ProductsTable
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onView={handleViewProduct}
          />
        )}
      </div>

      <ProductForm
        key={editingProduct ? editingProduct.id : 'new'}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        categories={categories}
        onSave={handleSaveProduct}
      />

      <ProductDetailsModal
        product={viewingProduct}
        onClose={handleCloseDetails}
        onEdit={(product) => {
          setViewingProduct(null);
          handleEditProduct(product);
        }}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete product"
        description="This will permanently remove the product from your catalog."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDeleteProduct}
      >
        <p>
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900">{deleteTarget?.name}</span>?
          This action cannot be undone.
        </p>
      </ConfirmDialog>
    </div>
  );
}