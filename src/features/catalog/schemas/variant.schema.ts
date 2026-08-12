// features/catalog/schemas/variant.schema.ts
import { z } from "zod";

export const addVariantSchema = z.object({
  productId: z.string().cuid(),
  sku: z.string().min(1).max(64),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0).default(0),
});
export type AddVariantInput = z.infer<typeof addVariantSchema>;