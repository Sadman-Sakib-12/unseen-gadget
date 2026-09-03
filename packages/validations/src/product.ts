import { z } from "zod";

export const productStatusSchema = z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]);

export const productVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Variant name is required"),
  price: z.number().int().positive().optional(),
  stock: z.number().int().min(0).optional(),
  sku: z.string().nullish().transform((v) => (v && v.trim() !== "" ? v.trim() : undefined)),
  images: z.array(z.string().min(1)).optional().default([]),
});

export const shippingTypeSchema = z.enum(["FREE", "PAID"]);

export const productBaseSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1).nullish().transform((v) => (v && v.trim() !== "" ? v.trim() : undefined)),
  description: z.string().nullish().transform((v) => (v && v.trim() !== "" ? v.trim() : undefined)),
  price: z.number().int().positive("Price must be positive"),
  originalPrice: z.number().int().positive().optional(),
  discount: z.number().int().min(0).max(100).optional(),
  stock: z.number().int().min(0).optional(),
  inStock: z.boolean().optional(),
  badge: z.string().nullish().transform((v) => (v && v.trim() !== "" ? v.trim() : undefined)),
  colors: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.string(), z.unknown()).optional(),
  deliveryInfo: z.record(z.string(), z.unknown()).optional(),
  warrantyInfo: z.array(z.string()).optional(),
  warranty: z.string().nullish().transform((v) => (v && v.trim() !== "" ? v.trim() : undefined)),
  images: z.array(z.string().min(1)).optional().default([]),
  sku: z.string().nullish().transform((v) => (v && v.trim() !== "" ? v.trim() : undefined)),
  barcode: z.string().nullish().transform((v) => (v && v.trim() !== "" ? v.trim() : undefined)),
  category: z.string().min(1, "Category is required"),
  brand: z.string().nullish().transform((v) => (v && v.trim() !== "" ? v.trim() : undefined)),
  status: productStatusSchema.optional(),
  shippingType: shippingTypeSchema.optional().default("FREE"),
  shippingCost: z.number().int().min(0, "Shipping cost must be non-negative").optional().default(0),
  featured: z.boolean().optional(),
  variants: z.array(productVariantSchema).optional(),
});

export const productCreateSchema = productBaseSchema.refine((data) => {
  const type = data.shippingType ?? "FREE";
  const cost = data.shippingCost ?? 0;
  if (type === "FREE") return cost === 0;
  if (type === "PAID") return cost > 0;
  return true;
}, {
  message: "For FREE shipping, shipping cost must be 0. For PAID shipping, shipping cost must be greater than 0.",
  path: ["shippingCost"],
});

export const productUpdateSchema = productBaseSchema.partial().refine((data) => {
  if (data.shippingType === "FREE" && data.shippingCost !== undefined) {
    return data.shippingCost === 0;
  }
  if (data.shippingType === "PAID" && data.shippingCost !== undefined) {
    return data.shippingCost > 0;
  }
  return true;
}, {
  message: "For FREE shipping, shipping cost must be 0. For PAID shipping, shipping cost must be greater than 0.",
  path: ["shippingCost"],
});

export const productQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  inStock: z.enum(["true", "false"]).optional(),
  featured: z.enum(["true", "false"]).optional(),
  sort: z
    .enum(["newest", "price_asc", "price_desc", "rating", "popular", "featured"])
    .optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const productSlugParamsSchema = z.object({
  slug: z.string().min(1),
});

export const productIdParamsSchema = z.object({
  id: z.string().min(1),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;