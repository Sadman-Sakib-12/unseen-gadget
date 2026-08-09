import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  discount: z.number().min(0).max(100).optional(),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  categoryId: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  sku: z.string().optional(),
});

export const productVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  sku: z.string().optional(),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
