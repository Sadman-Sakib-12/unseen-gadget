'use client';

import { useMemo, useState } from 'react';
import { Boxes, LayoutGrid, List, Package, Plus, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { cn } from '@/components/ui/utils';
import { ProductCard } from './product-card';
import { ProductsTable } from './products-table';
import { ProductForm } from './product-form';
import { ProductDetailsModal } from './product-details-modal';
import allProducts from '@/features/products/data/products.json';
import categories from '@/features/products/data/categories.json';
import type { Product } from '../types';

type ViewMode = 'grid' | 'table';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(() => allProducts as Product[]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const stats = useMemo(() => {
    const active = products.filter((p) => p.status === 'ACTIVE').length;
    const inStock = products.filter((p) => p.stock > 0).length;
    const outOfStock = products.filter((p) => p.stock === 0 || p.status === 'OUT_OF_STOCK').length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    return { total: products.length, active, inStock, outOfStock, totalValue };
  }, [products]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
  };

  const handleCloseDetails = () => {
    setViewingProduct(null);
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? ({ ...p, ...productData } as Product) : p))
      );
    } else {
      const nextId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
      const newProduct: Product = {
        ...(productData as Product),
        id: nextId,
        images: ['https://res.cloudinary.com/unseen-gadget/image/upload/default.jpg'],
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product inventory, pricing, and stock levels."
        actions={
          <Button onClick={handleAddProduct}>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
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
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Inventory value: <span className="font-semibold text-gray-900">{formatInventoryValue(stats.totalValue)}</span>
          </p>
          <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                viewMode === 'table' ? 'bg-primary text-primary-foreground' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          products.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white">
              <EmptyState
                title="No products"
                description="Get started by adding your first product."
                action={
                  <Button onClick={handleAddProduct}>
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
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
    </div>
  );
}

function formatInventoryValue(value: number): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(value);
}