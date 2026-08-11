"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { updateCategoryService } from "../services/update-category.service";
import { deleteCategoryService } from "../services/delete-category.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireAdmin } from "@/server/auth/guards";
import { CacheTags } from "@/config/cache";

const updateCategorySchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(2).max(120).optional(),
  slug: z
    .string()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  parentId: z.string().nullable().optional(),
  isActive: z.coerce.boolean().optional(),
});

export async function updateCategoryAction(input: unknown) {
  await requireAdmin();
  const parsed = updateCategorySchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const { id, ...data } = parsed.data;
    const category = await updateCategoryService(id, data);
    revalidateTag(CacheTags.CATEGORIES,"default");
    return ok(category);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  try {
    await deleteCategoryService(id);
    revalidateTag(CacheTags.CATEGORIES,"default");
    return ok(true);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}
