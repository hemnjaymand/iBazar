// features/catalog/actions/product.actions.ts
"use server";

import { revalidateTag } from "next/cache";
import { createProductSchema } from "../schemas/product.schema";
import { createProductService } from "../services/create-product.service";
import { publishProductService } from "../services/publish-product.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireAdmin } from "@/server/auth/guards";
import { CacheTags } from "@/config/cache";

export async function createProductAction(input: unknown) {
  await requireAdmin();
  const parsed = createProductSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const product = await createProductService(parsed.data);
    revalidateTag(CacheTags.PRODUCTS, "default");
    return ok(product);
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function publishProductAction(productId: string) {
  await requireAdmin();
  try {
    await publishProductService(productId);
    revalidateTag(CacheTags.PRODUCTS,"default");
    return ok(true);
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}