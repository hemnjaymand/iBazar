// import { couponRepository } from "../repositories/coupon.repository";
// import { BusinessError } from "@/server/errors/business-error";
// import { ErrorCodes } from "@/server/errors/error-codes";

// export async function validateCouponService(code: string, subtotal: number) {
//   const coupon = await couponRepository.findByCode(code);
//   if (!coupon || !coupon.isActive) {
//     throw new BusinessError("کد تخفیف معتبر نیست", ErrorCodes.INVALID_COUPON);
//   }
//   if (coupon.expiresAt && coupon.expiresAt < new Date()) {
//     throw new BusinessError(
//       "کد تخفیف منقضی شده است",
//       ErrorCodes.INVALID_COUPON,
//     );
//   }
//   if (coupon.maxUsageCount && coupon.usedCount >= coupon.maxUsageCount) {
//     throw new BusinessError(
//       "ظرفیت استفاده از کد تخفیف تمام شده است",
//       ErrorCodes.INVALID_COUPON,
//     );
//   }
//   if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount.toNumber()) {
//     throw new BusinessError(
//       "مبلغ سفارش برای این کد تخفیف کافی نیست",
//       ErrorCodes.INVALID_COUPON,
//     );
//   }

//   const discount =
//     coupon.type === "PERCENTAGE"
//       ? (subtotal * coupon.value.toNumber()) / 100
//       : coupon.value.toNumber();

//   return { coupon, discount: Math.min(discount, subtotal) };
// }

import { couponRepository } from "../repositories/coupon.repository";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";

// ----- تابع کمکی برای تبدیل مقدار به عدد (هم Decimal و هم number را پشتیبانی می‌کند) -----
function toNumber(value: any): number {
  if (typeof value === "number") return value;
  if (value && typeof value.toNumber === "function") return value.toNumber();
  return Number(value) || 0;
}

export async function validateCouponService(code: string, subtotal: number) {
  const coupon = await couponRepository.findByCode(code);
  if (!coupon || !coupon.isActive) {
    throw new BusinessError("کد تخفیف معتبر نیست", ErrorCodes.INVALID_COUPON);
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw new BusinessError(
      "کد تخفیف منقضی شده است",
      ErrorCodes.INVALID_COUPON,
    );
  }
  if (coupon.maxUsageCount && coupon.usedCount >= coupon.maxUsageCount) {
    throw new BusinessError(
      "ظرفیت استفاده از کد تخفیف تمام شده است",
      ErrorCodes.INVALID_COUPON,
    );
  }

  // استفاده از toNumber برای minOrderAmount
  const minOrderAmount = coupon.minOrderAmount
    ? toNumber(coupon.minOrderAmount)
    : 0;
  if (minOrderAmount > 0 && subtotal < minOrderAmount) {
    throw new BusinessError(
      "مبلغ سفارش برای این کد تخفیف کافی نیست",
      ErrorCodes.INVALID_COUPON,
    );
  }

  // استفاده از toNumber برای value
  const value = toNumber(coupon.value);
  const discount =
    coupon.type === "PERCENTAGE" ? (subtotal * value) / 100 : value;

  return { coupon, discount: Math.min(discount, subtotal) };
}
