import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateCouponService } from "./validate-coupon.service";
import { couponRepository } from "../repositories/coupon.repository";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import type { Coupon } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/client";

vi.mock("../repositories/coupon.repository");

// ----- تابع کمکی برای شبیه‌سازی Decimal -----
function mockDecimal(value: number): Pick<Decimal, "toNumber" | "toString"> {
  return {
    toNumber: () => value,
    toString: () => String(value),
  };
}

// ----- نوع سفارشی برای overrides -----
type MakeCouponOverrides = Partial<Omit<Coupon, "value" | "minOrderAmount">> & {
  value?: number | Decimal;
  minOrderAmount?: number | Decimal | null;
};

// ----- تابع makeCoupon با نوع‌دهی دقیق (بدون any) -----
function makeCoupon(overrides: MakeCouponOverrides = {}): Coupon {
  // مقادیر پیش‌فرض
  const base = {
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

  // پردازش value و minOrderAmount از overrides
  let finalValue: Decimal = base.value;
  let finalMinOrderAmount: Decimal | null = base.minOrderAmount;

  if (overrides.value !== undefined) {
    finalValue = typeof overrides.value === "number"
      ? mockDecimal(overrides.value) as Decimal
      : overrides.value;
  }

  if (overrides.minOrderAmount !== undefined) {
    finalMinOrderAmount = overrides.minOrderAmount === null
      ? null
      : typeof overrides.minOrderAmount === "number"
        ? mockDecimal(overrides.minOrderAmount) as Decimal
        : overrides.minOrderAmount;
  }

  // ساخت شیء نهایی با ترکیب دستی (بدون spread مستقیم overrides)
  const result: Coupon = {
    id: overrides.id ?? base.id,
    code: overrides.code ?? base.code,
    type: overrides.type ?? base.type,
    value: finalValue,
    minOrderAmount: finalMinOrderAmount,
    maxUsageCount: overrides.maxUsageCount ?? base.maxUsageCount,
    usedCount: overrides.usedCount ?? base.usedCount,
    expiresAt: overrides.expiresAt ?? base.expiresAt,
    isActive: overrides.isActive ?? base.isActive,
  };

  return result;
}

// ----- تست‌ها (بدون تغییر) -----
describe("validateCouponService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws INVALID_COUPON when the code does not exist", async () => {
    vi.mocked(couponRepository.findByCode).mockResolvedValue(null);

    await expect(validateCouponService("MISSING", 100)).rejects.toMatchObject({
      code: ErrorCodes.INVALID_COUPON,
    });
  });

  it("throws INVALID_COUPON when the coupon is inactive", async () => {
    vi.mocked(couponRepository.findByCode).mockResolvedValue(
      makeCoupon({ isActive: false })
    );

    await expect(validateCouponService("TEST10", 100)).rejects.toBeInstanceOf(
      BusinessError
    );
  });

  it("throws INVALID_COUPON when the coupon is expired", async () => {
    vi.mocked(couponRepository.findByCode).mockResolvedValue(
      makeCoupon({ expiresAt: new Date("2020-01-01") })
    );

    await expect(validateCouponService("TEST10", 100)).rejects.toMatchObject({
      code: ErrorCodes.INVALID_COUPON,
    });
  });

  it("throws INVALID_COUPON when usage count has reached the max", async () => {
    vi.mocked(couponRepository.findByCode).mockResolvedValue(
      makeCoupon({ maxUsageCount: 5, usedCount: 5 })
    );

    await expect(validateCouponService("TEST10", 100)).rejects.toBeInstanceOf(
      BusinessError
    );
  });

  it("throws INVALID_COUPON when subtotal is below minOrderAmount", async () => {
    vi.mocked(couponRepository.findByCode).mockResolvedValue(
      makeCoupon({ minOrderAmount: 500 })
    );

    await expect(validateCouponService("TEST10", 100)).rejects.toBeInstanceOf(
      BusinessError
    );
  });

  it("calculates a percentage discount correctly", async () => {
    vi.mocked(couponRepository.findByCode).mockResolvedValue(
      makeCoupon({ type: "PERCENTAGE", value: 10 })
    );

    const result = await validateCouponService("TEST10", 200);
    expect(result.discount).toBe(20);
  });

  it("calculates a fixed-amount discount correctly", async () => {
    vi.mocked(couponRepository.findByCode).mockResolvedValue(
      makeCoupon({ type: "FIXED_AMOUNT", value: 50 })
    );

    const result = await validateCouponService("TEST10", 200);
    expect(result.discount).toBe(50);
  });

  it("caps the discount at the subtotal (never goes negative or exceeds order)", async () => {
    vi.mocked(couponRepository.findByCode).mockResolvedValue(
      makeCoupon({ type: "FIXED_AMOUNT", value: 500 })
    );

    const result = await validateCouponService("TEST10", 200);
    expect(result.discount).toBe(200);
  });
});