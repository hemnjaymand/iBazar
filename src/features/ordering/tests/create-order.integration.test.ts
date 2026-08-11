import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateCouponService } from "@/features/discount/service/validate-coupon.service";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import type { Coupon } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/client";
import { couponRepository } from "../repositories";

// ----- شبیه‌ساز Decimal -----
function mockDecimal(value: number): Pick<Decimal, "toNumber" | "toString"> {
  return {
    toNumber: () => value,
    toString: () => String(value),
  };
}

type MakeCouponOverrides = Partial<Omit<Coupon, "value" | "minOrderAmount">> & {
  value?: number | Decimal;
  minOrderAmount?: number | Decimal | null;
};

function makeCoupon(overrides: MakeCouponOverrides = {}): Coupon {
  const defaultValues = {
    id: "coupon_1",
    code: "TEST10",
    type: "PERCENTAGE" as const,
    value: mockDecimal(10) as Decimal,
    minOrderAmount: null as Decimal | null,
    maxUsageCount: null as number | null,
    usedCount: 0,
    expiresAt: null as Date | null,
    isActive: true,
  };

  let finalValue: Decimal = defaultValues.value;
  if (overrides.value !== undefined) {
    finalValue = typeof overrides.value === "number"
      ? mockDecimal(overrides.value) as Decimal
      : overrides.value;
  }

  let finalMinOrderAmount: Decimal | null = defaultValues.minOrderAmount;
  if (overrides.minOrderAmount !== undefined) {
    finalMinOrderAmount = overrides.minOrderAmount === null
      ? null
      : typeof overrides.minOrderAmount === "number"
        ? mockDecimal(overrides.minOrderAmount) as Decimal
        : overrides.minOrderAmount;
  }

  return {
    id: overrides.id ?? defaultValues.id,
    code: overrides.code ?? defaultValues.code,
    type: overrides.type ?? defaultValues.type,
    value: finalValue,
    minOrderAmount: finalMinOrderAmount,
    maxUsageCount: overrides.maxUsageCount ?? defaultValues.maxUsageCount,
    usedCount: overrides.usedCount ?? defaultValues.usedCount,
    expiresAt: overrides.expiresAt ?? defaultValues.expiresAt,
    isActive: overrides.isActive ?? defaultValues.isActive,
  } as Coupon;
}

// ----- تست‌ها (با override مستقیم) -----
describe("validateCouponService", () => {
  beforeEach(() => {
    // بازنویسی متد با یک mock جدید
    couponRepository.findByCode = vi.fn();
  });

  it("throws INVALID_COUPON when the code does not exist", async () => {
    (couponRepository.findByCode as any).mockResolvedValue(null);
    await expect(validateCouponService("MISSING", 100)).rejects.toMatchObject({
      code: ErrorCodes.INVALID_COUPON,
    });
  });

  it("throws INVALID_COUPON when the coupon is inactive", async () => {
    (couponRepository.findByCode as any).mockResolvedValue(
      makeCoupon({ isActive: false })
    );
    await expect(validateCouponService("TEST10", 100)).rejects.toBeInstanceOf(BusinessError);
  });

  it("throws INVALID_COUPON when the coupon is expired", async () => {
    (couponRepository.findByCode as any).mockResolvedValue(
      makeCoupon({ expiresAt: new Date("2020-01-01") })
    );
    await expect(validateCouponService("TEST10", 100)).rejects.toMatchObject({
      code: ErrorCodes.INVALID_COUPON,
    });
  });

  it("throws INVALID_COUPON when usage count has reached the max", async () => {
    (couponRepository.findByCode as any).mockResolvedValue(
      makeCoupon({ maxUsageCount: 5, usedCount: 5 })
    );
    await expect(validateCouponService("TEST10", 100)).rejects.toBeInstanceOf(BusinessError);
  });

  it("throws INVALID_COUPON when subtotal is below minOrderAmount", async () => {
    (couponRepository.findByCode as any).mockResolvedValue(
      makeCoupon({ minOrderAmount: 500 })
    );
    await expect(validateCouponService("TEST10", 100)).rejects.toBeInstanceOf(BusinessError);
  });

  it("calculates a percentage discount correctly", async () => {
    (couponRepository.findByCode as any).mockResolvedValue(
      makeCoupon({ type: "PERCENTAGE", value: 10 })
    );
    const result = await validateCouponService("TEST10", 200);
    expect(result.discount).toBe(20);
  });

  it("calculates a fixed-amount discount correctly", async () => {
    (couponRepository.findByCode as any).mockResolvedValue(
      makeCoupon({ type: "FIXED_AMOUNT", value: 50 })
    );
    const result = await validateCouponService("TEST10", 200);
    expect(result.discount).toBe(50);
  });

  it("caps the discount at the subtotal (never goes negative or exceeds order)", async () => {
    (couponRepository.findByCode as any).mockResolvedValue(
      makeCoupon({ type: "FIXED_AMOUNT", value: 500 })
    );
    const result = await validateCouponService("TEST10", 200);
    expect(result.discount).toBe(200);
  });
});