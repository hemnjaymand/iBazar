import type { Coupon } from "@prisma/client";
import { CouponDTO } from "../types";

export function toCouponDTO(c: Coupon): CouponDTO {
  return {
    id: c.id,
    code: c.code,
    type: c.type,
    value: c.value.toString(),
    minOrderAmount: c.minOrderAmount?.toString() ?? null,
    maxUsageCount: c.maxUsageCount,
    usedCount: c.usedCount,
    expiresAt: c.expiresAt?.toISOString() ?? null,
    isActive: c.isActive,
  };
}
