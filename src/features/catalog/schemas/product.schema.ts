import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(220).regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional(),
  categoryId: z.string().cuid({ message: "انتخاب دسته‌بندی الزامی است" }),
  brandId: z.string().cuid().optional(),
  defaultVariant: z.object({
    sku: z.string().min(1).max(64),
    price: z.coerce.number().positive(),
    compareAtPrice: z.coerce.number().positive().optional(),
    stock: z.coerce.number().int().min(0).default(0),
  }),
});
export type CreateProductInput = z.infer<typeof createProductSchema>;