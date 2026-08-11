import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().min(1).max(60),
  slug: z.string().min(1).max(60).regex(/^[a-z0-9-]+$/),
});
export type CreateTagInput = z.infer<typeof createTagSchema>;

export const attachTagSchema = z.object({
  productId: z.string().cuid(),
  tagId: z.string().cuid(),
});
