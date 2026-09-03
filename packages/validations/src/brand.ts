import { z } from "zod";

export const brandCreateSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  slug: z.string().nullish().transform((v) => (v && v.trim() !== "" ? v.trim() : undefined)),
  logo: z.string().nullish().transform((v) => (v && v.trim() !== "" ? v.trim() : undefined)),
  description: z.string().nullish().transform((v) => (v && v.trim() !== "" ? v.trim() : undefined)),
  active: z.boolean().optional(),
  status: z.string().optional(),
});

export const brandUpdateSchema = brandCreateSchema.partial();

export const brandIdParamsSchema = z.object({
  id: z.string().min(1),
});

export type BrandCreateInput = z.infer<typeof brandCreateSchema>;
export type BrandUpdateInput = z.infer<typeof brandUpdateSchema>;