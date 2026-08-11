// features/content/actions/banner.actions.ts
"use server";

import { revalidateTag } from "next/cache";
import { createBannerSchema } from "../schemas/banner.schema";
import { createBannerService } from "../services/create-banner.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireAdmin } from "@/server/auth/guards";
import { bannerRepository } from "../repositories/banner.repository";

export async function createBannerAction(input: unknown) {
  await requireAdmin();
  const parsed = createBannerSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const banner = await createBannerService(parsed.data);
    revalidateTag("banners", "default");
    return ok(banner);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function deleteBannerAction(id: string) {
  await requireAdmin();

  try {
    await bannerRepository.delete(id);
    revalidateTag("banners", "default");
    return ok(true);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}
