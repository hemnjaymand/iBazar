import { z } from "zod";

export const createAttributeSchema = z.object({
  name: z.string().min(2).max(60),
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
  values: z.array(z.object({
    value: z.string().min(1).max(60),
    slug: z.string().min(1).max(60).regex(/^[a-z0-9-]+$/),
    
  })).min(1),
});
export type CreateAttributeInput = z.infer<typeof createAttributeSchema>;
