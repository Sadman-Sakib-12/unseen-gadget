import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional(),
  color: z.string().optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(20, "Quantity cannot exceed 20"),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(20, "Quantity cannot exceed 20"),
});

export const clearCartSchema = z.object({});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type ClearCartInput = z.infer<typeof clearCartSchema>;
