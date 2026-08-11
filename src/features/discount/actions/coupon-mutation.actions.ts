"use server";

import { createCouponSchema } from "../schemas/create-coupon.schema";
import { createCouponService } from "../service/create-coupon.service";
import { couponRepository } from "../repositories/coupon.repository";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireAdmin } from "@/server/auth/guards";

export async function createCouponAction(input: unknown) {
  await requireAdmin();
  const parsed = createCouponSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const coupon = await createCouponService(parsed.data);
    return ok(coupon);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function deleteCouponAction(id: string) {
  await requireAdmin();
  try {
    await couponRepository.delete(id);
    return ok(true);
  } catch {
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}
