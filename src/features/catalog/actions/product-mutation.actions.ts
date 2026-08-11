// features/catalog/actions/product-mutation.actions.ts
"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { updateProductService } from "../services/update-product.service";
import { deleteProductService } from "../services/delete-product.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireAdmin } from "@/server/auth/guards";
import { CacheTags } from "@/config/cache";

const updateProductSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(2).max(200).optional(),
  slug: z
    .string()
    .min(2)
    .max(220)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().max(5000).optional(),
  categoryId: z.string().cuid().optional(),
  brandId: z.string().cuid().nullable().optional(),
  isPublished: z.boolean().optional(),
});

export async function toggleProductPublishAction(input: unknown) {
  await requireAdmin();
  const parsed = updateProductSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const { id, ...data } = parsed.data;
    const product = await updateProductService(id, data);
    revalidateTag(CacheTags.PRODUCTS,");");
    return ok(product);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  try {
    const product = await deleteProductService(id);
    revalidateTag(CacheTags.PRODUCTS,"default");
    return ok(product);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}
