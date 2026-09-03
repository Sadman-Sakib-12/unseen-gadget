import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1).optional(),
  parentId: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export const categoryIdParamsSchema = z.object({
  id: z.string().min(1),
});

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;