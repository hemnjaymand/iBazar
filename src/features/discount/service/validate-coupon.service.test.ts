import { describe, it, expect, vi } from "vitest";
import { validateCouponService } from "./validate-coupon.service";
import { couponRepository } from "../repositories/coupon.repository";
import { BusinessError } from "@/server/errors/business-error";
import { Prisma } from "@prisma/client"; // اضافه کردن Prisma برای Decimal

vi.mock("../repositories/coupon.repository");

describe("validateCouponService", () => {
  it("throws when coupon is expired", async () => {
    vi.mocked(couponRepository.findByCode).mockResolvedValue({
      id: "1",
      code: "OLD10",
      type: "PERCENTAGE",
      value: new Prisma.Decimal(10), // جایگزین 10 as any
      minOrderAmount: null,
      maxUsageCount: null,
      usedCount: 0,
      expiresAt: new Date("2020-01-01"),
      isActive: true,
      // createdAt: new Date(), // فیلدهای الزامی مدل را پر کنید تا نیازی به any نباشد
      // updatedAt: new Date()
    });

    await expect(validateCouponService("OLD10", 100)).rejects.toThrow(
      BusinessError,
    );
  });

  it("calculates percentage discount correctly", async () => {
    vi.mocked(couponRepository.findByCode).mockResolvedValue({
      id: "1",
      code: "SAVE10",
      type: "PERCENTAGE",
      value: new Prisma.Decimal(10),
      minOrderAmount: null,
      maxUsageCount: null,
      usedCount: 0,
      expiresAt: null,
      isActive: true,
      // createdAt: new Date(),
      // updatedAt: new Date()
    });

    const result = await validateCouponService("SAVE10", 200);
    expect(result.discount).toBe(20);
  });
});
