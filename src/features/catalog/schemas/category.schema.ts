// features/catalog/schemas/category.schema.ts
import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(140).regex(/^[a-z0-9-]+$/),
  parentId: z.string().nullable().optional(),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;

// اسکیماهای قبلی را می‌توانید برای اعتبارسنجی در اکشن‌ها نگه دارید
export const createCategorySchema = categoryFormSchema;
export const updateCategorySchema = categoryFormSchema.extend({
  id: z.string().cuid(),
});