import { z } from "zod";

export const orderCreateSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  customerPhone: z.string().min(1, "Phone is required"),
  shippingAddress: z.string().min(1, "Address is required"),
  paymentMethod: z
    .string()
    .transform((val) => val.toUpperCase())
    .pipe(z.enum(["COD", "BKASH", "NAGAD", "SSLCOMMERZ"])),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        quantity: z.number().int().min(1),
        price: z.number().positive(),
      })
    )
    .min(1, "At least one item is required"),
  couponCode: z.string().optional(),
});

export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
