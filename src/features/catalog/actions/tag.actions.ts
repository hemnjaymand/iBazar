"use server";

import { revalidateTag } from "next/cache";
import { createTagSchema, attachTagSchema } from "../schemas/tag.schema";
import { createTagService } from "../services/create-tag.service";
import { attachTagToProductService } from "../services/attach-tag-to-product.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireAdmin } from "@/server/auth/guards";
import { CacheTags } from "@/config/cache";

export async function createTagAction(input: unknown) {
  await requireAdmin();
  const parsed = createTagSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const tag = await createTagService(parsed.data);
    return ok(tag);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function attachTagToProductAction(input: unknown) {
  await requireAdmin();
  const parsed = attachTagSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    await attachTagToProductService(parsed.data.productId, parsed.data.tagId);
    revalidateTag(CacheTags.PRODUCTS, "default");
    return ok(true);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}
