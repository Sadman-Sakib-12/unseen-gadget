"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "./product-card";
import { ProductsTable } from "./products-table";
import { ProductForm } from "./product-form";
import allProducts from "@/features/products/data/products.json";
import categories from "@/features/products/data/categories.json";
import type { Product } from "../types";

type ViewMode = "grid" | "table";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (productId: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  const handleViewProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } as Product : p)));
    } else {
      const newProduct: Product = {
        ...productData,
        id: Date.now(),
        images: ["https://res.cloudinary.com/unseen-gadget/image/upload/default.jpg"],
      } as Product;
      setProducts([...products, newProduct]);
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white text-sm font-medium hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setViewMode("table")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            viewMode === "table" ? "bg-black text-white" : "border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Table View
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            viewMode === "grid" ? "bg-black text-white" : "border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Grid View
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Products", value: products.length.toString() },
          { label: "Active", value: products.filter((p) => p.status === "ACTIVE").length.toString() },
          { label: "In Stock", value: products.filter((p) => p.stock > 0).length.toString() },
          { label: "Out of Stock", value: products.filter((p) => p.status === "OUT_OF_STOCK").length.toString() },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      ) : (
        <ProductsTable
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onView={handleViewProduct}
        />
      )}

      <ProductForm
        key={editingProduct ? editingProduct.id : "new"}
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingProduct(null); }}
        product={editingProduct}
        categories={categories}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
