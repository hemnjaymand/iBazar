'use server';

import { revalidateTag } from 'next/cache';
// import { z } from 'zod';
import { updateCategoryService } from '../services/update-category.service';
// import { deleteCategoryService } from '../services/delete-category.service';
import { ok, fail } from '@/shared/types/result';
import { ApplicationError } from '@/server/errors/application-error';
import { requireAdmin } from '@/server/auth/guards';
import { CacheTags } from '@/config/cache';
import { updateCategorySchema } from '../schemas';
import { deleteCategoryService } from '../services/delete-category.service';

// const updateCategorySchema = z.object({
//   id: z.string().cuid(),
//   name: z.string().min(2).max(120).optional(),
//   slug: z
//     .string()
//     .min(2)
//     .max(140)
//     .regex(/^[a-z0-9-]+$/)
//     .optional(),
//   parentId: z.string().nullable().optional(),
//   isActive: z.coerce.boolean().optional(),
//   imageUrl: z.string().nullable().optional(),
// });

// export async function updateCategoryAction(input: unknown) {
//   await requireAdmin();
//   const parsed = updateCategorySchema.safeParse(input);
//   if (!parsed.success) return fail('VALIDATION_ERROR', 'اطلاعات نامعتبر است');
//    console.error("Validation errors:", parsed.error.errors);

//   try {
//     const { id, ...data } = parsed.data;
//     const category = await updateCategoryService(id, data);

//     // اصلاح شد: استفاده از مقدار صحیح "max"
//     revalidateTag(CacheTags.CATEGORIES, 'max');

//     return ok(category);
//   } catch (error) {
//     if (error instanceof ApplicationError)
//       return fail(error.code, error.message);
//     return fail('INTERNAL_ERROR', 'خطای غیرمنتظره');
//   }
// }

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  try {
    await deleteCategoryService(id);

    // اصلاح شد: استفاده از مقدار صحیح "max"
    revalidateTag(CacheTags.CATEGORIES, 'max');

    return ok(true);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail('INTERNAL_ERROR', 'خطای غیرمنتظره');
  }
}


export async function updateCategoryAction(input: unknown) {
  await requireAdmin();

  // اگر فرانت‌اند به جای شیء، FormData فرستاد، آن را تبدیل می‌کنیم تا ارور ندهد
  let dataToParse = input;
  if (input instanceof FormData) {
    dataToParse = {
      id: input.get("id"),
      name: input.get("name"),
      slug: input.get("slug"),
      parentId: input.get("parentId") || null,
      isActive: input.get("isActive") === "true",
      imageUrl: input.get("imageUrl") || null,
    };
  }

  const parsed = updateCategorySchema.safeParse(dataToParse);
  
  if (!parsed.success) {
    // بسیار مهم: چاپ خطای دقیق Zod در ترمینال سرور برای دیباگ فوری
    console.error("Update Category Validation Error:", parsed.error.flatten().fieldErrors);
    return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");
  }

  try {
    const { id, ...data } = parsed.data;
    const category = await updateCategoryService(id, data);
    
    revalidateTag(CacheTags.CATEGORIES, "max"); 
    
    return ok(category);
  } catch (error) {
    console.error("Update Category Server Error:", error);
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}