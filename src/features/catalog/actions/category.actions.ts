// features/catalog/actions/category.actions.ts
"use server";

import { revalidateTag } from "next/cache";
import { createCategorySchema } from "../schemas/category.schema";
import { createCategoryService } from "../services/create-category.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireAdmin } from "@/server/auth/guards";
import { CacheTags } from "@/config/cache";

export async function createCategoryAction(formData: FormData) {
  // ۱. بررسی دسترسی ادمین
  await requireAdmin();

  // ۲. اعتبارسنجی ورودی‌های فرم (اضافه شدن imageUrl)
  const parsed = createCategorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    parentId: formData.get("parentId") || null,
    imageUrl: formData.get("imageUrl") || null, 
  });

  if (!parsed.success) {
    // ثبت خطای دقیق برای دیباگ سریع‌تر در ترمینال
    console.error("Category Validation Errors:", parsed.error.flatten().fieldErrors);
    return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");
  }

  try {
    // ۳. اجرای سرویس ساخت دسته‌بندی
    const category = await createCategoryService(parsed.data);

    // ۴. اینولید کردن کش دسته‌بندی‌ها با استراتژی max
    revalidateTag(CacheTags.CATEGORIES, "max");

    return ok(category);
  } catch (error) {
    if (error instanceof ApplicationError) {
      return fail(error.code, error.message);
    }
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}