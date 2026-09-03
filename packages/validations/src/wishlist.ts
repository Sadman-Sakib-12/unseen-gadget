import { z } from "zod";

export const wishlistItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export const wishlistToggleSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export type WishlistItemInput = z.infer<typeof wishlistItemSchema>;
export type WishlistToggleInput = z.infer<typeof wishlistToggleSchema>;