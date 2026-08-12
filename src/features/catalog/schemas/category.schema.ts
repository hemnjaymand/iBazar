// features/catalog/schemas/category.schema.ts
import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().min(2, 'نام حداقل ۲ کاراکتر است').max(120),
  slug: z
    .string()
    .min(2, 'slug حداقل ۲ کاراکتر است')
    .max(140)
    .regex(/^[a-z0-9-]+$/, 'فقط حروف کوچک، اعداد و خط تیره مجاز است'),
  parentId: z.string().nullable().optional(),
  imageUrl: z.string().url('آدرس عکس نامعتبر است').optional().or(z.literal('')),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;

// اسکیماهای قبلی را می‌توانید برای اعتبارسنجی در اکشن‌ها نگه دارید
export const createCategorySchema = categoryFormSchema;
export const updateCategorySchema = categoryFormSchema.extend({
  id: z.string().cuid(),
});
