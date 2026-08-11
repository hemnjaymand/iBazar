"use server";

import { applyCouponSchema } from "../schemas/apply-coupon.schema";
import { validateCouponService } from "../service/validate-coupon.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { couponRepository } from "../../ordering/repositories";
import { toCouponDTO } from "../mappers/coupon.mapper";
// ✅ اکشن جدید برای لیست کردن کوپن‌ها
export async function listCouponsAction() {
  try {
    const coupons = await couponRepository.findAll();
    const data = coupons.map(toCouponDTO);
    return ok(data);
  } catch (error) {
    return fail("INTERNAL_ERROR", "خطا در دریافت لیست کدهای تخفیف");
  }
}
export async function applyCouponAction(input: unknown, subtotal: number) {
  const parsed = applyCouponSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "کد نامعتبر است");

  try {
    const { discount } = await validateCouponService(
      parsed.data.code,
      subtotal,
    );
    return ok({ discount: discount.toFixed(2) });
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}
