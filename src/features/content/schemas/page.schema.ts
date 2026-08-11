import { z } from "zod";

export const upsertPageSchema = z.object({
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2).max(100),
  htmlContent: z.string().min(5),
  isPublished: z.boolean().default(false),
});

export type UpsertPageInput = z.infer<typeof upsertPageSchema>;
export type UpsertPageOutput = z.output<typeof upsertPageSchema>;