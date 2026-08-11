// features/coupons/services/create-coupon.service.ts
import { couponRepository } from "../repositories/coupon.repository";
import { toCouponDTO } from "../mappers/coupon.mapper";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
// ✅ وارد کردن CreateCouponOutput به جای CreateCouponInput
import type { CreateCouponOutput } from "../schemas/create-coupon.schema";

export async function createCouponService(input: CreateCouponOutput) {
  const existing = await couponRepository.findByCode(input.code);
  if (existing) {
    throw new BusinessError(
      "این کد تخفیف قبلاً وجود دارد",
      ErrorCodes.COUPON_CODE_ALREADY_EXISTS,
    );
  }

  // ✅ اکنون input.value و سایر فیلدها به صورت قطعی number هستند و ارور برطرف می‌شود
  const coupon = await couponRepository.create({
    code: input.code,
    type: input.type,
    value: input.value,
    minOrderAmount: input.minOrderAmount,
    maxUsageCount: input.maxUsageCount,
    expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
  });

  return toCouponDTO(coupon);
}
