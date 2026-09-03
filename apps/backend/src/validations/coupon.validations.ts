import { z } from "zod";

export const couponValidateSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  amount: z.number().positive("Order amount must be positive").optional(),
  items: z
    .array(
      z.object({
        id: z.number().optional(),
        price: z.number().positive("Price must be positive"),
        quantity: z.number().int().positive("Quantity must be positive"),
      })
    )
    .optional(),
});

export type CouponValidateInput = z.infer<typeof couponValidateSchema>;