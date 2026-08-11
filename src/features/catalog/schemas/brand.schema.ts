// features/catalog/schemas/brand.schema.ts
import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(140).regex(/^[a-z0-9-]+$/),
  logoUrl: z.string().url().nullable().optional(),
});
export type CreateBrandInput = z.infer<typeof createBrandSchema>;