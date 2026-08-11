"use server";

import { revalidateTag } from "next/cache";
import { createBrandSchema } from "../schemas/brand.schema";
import { createBrandService } from "../services/create-brand.service";
import { updateBrandService } from "../services/update-brand.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireAdmin } from "@/server/auth/guards";
import { CacheTags } from "@/config/cache";

export async function createBrandAction(input: unknown) {
  await requireAdmin();
  const parsed = createBrandSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const brand = await createBrandService(parsed.data);
    revalidateTag(CacheTags.BRANDS, "default");
    return ok(brand);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function updateBrandAction(id: string, input: unknown) {
  await requireAdmin();
  const parsed = createBrandSchema.partial().safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const brand = await updateBrandService(id, parsed.data);
    revalidateTag(CacheTags.BRANDS, "default");
    return ok(brand);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}
