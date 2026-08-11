"use server";

import { revalidateTag } from "next/cache";
// import { addVariantSchema } from "../schemas/add-variant.schema";
import { addVariantService } from "../services/add-variant.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireAdmin } from "@/server/auth/guards";
import { CacheTags } from "@/config/cache";
import { addVariantSchema } from "../schemas/variant.schema";

export async function addVariantAction(input: unknown) {
  await requireAdmin();
  const parsed = addVariantSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const variant = await addVariantService(parsed.data);
    revalidateTag(CacheTags.PRODUCTS, "default");
    return ok(variant);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}
