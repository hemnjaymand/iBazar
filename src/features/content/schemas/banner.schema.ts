// features/content/schemas/banner.schema.ts
import { z } from "zod";

export const createBannerSchema = z.object({
  title: z.string().min(2).max(140),
  imageUrl: z.string().url(),
  linkUrl: z.string().url().optional(),
  placement: z.enum(["HOMEPAGE_HERO", "HOMEPAGE_PROMO", "CATEGORY_SIDEBAR"]),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type CreateBannerInput = z.infer<typeof createBannerSchema>;
