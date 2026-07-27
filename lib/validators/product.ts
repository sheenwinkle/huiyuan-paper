import { z } from "zod";

export const createCategorySchema = z.object({
  kind: z.literal("category"),
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(500),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0)
});

export const createProductSchema = z.object({
  kind: z.literal("product"),
  categoryId: z.string().trim().min(1),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(1000),
  specsText: z.string().trim().max(1000).optional().default("")
});

export const productManagementSchema = z.discriminatedUnion("kind", [
  createCategorySchema,
  createProductSchema
]);

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(500),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0)
});

export const updateProductSchema = z.object({
  categoryId: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().min(1).max(1000).optional(),
  specsText: z.string().trim().max(1000).optional(),
  isActive: z.boolean().optional()
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
