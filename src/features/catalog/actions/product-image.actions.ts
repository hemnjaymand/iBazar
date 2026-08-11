// features/catalog/actions/product-image.actions.ts
"use server";

import { revalidateTag } from "next/cache";
import { addProductImageSchema } from "../schemas/product-image.schema";
import { addProductImageService } from "../services/add-product-image.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireAdmin } from "@/server/auth/guards";
import { CacheTags } from "@/config/cache";

export async function addProductImageAction(input: unknown) {
  await requireAdmin();
  const parsed = addProductImageSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const image = await addProductImageService(parsed.data);
    revalidateTag(CacheTags.PRODUCTS,"default");
    return ok(image);
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}