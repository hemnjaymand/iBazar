import { prisma } from "../../../../lib/prisma";
import type { Coupon } from "@prisma/client";

export const couponRepository = {
  findByCode(code: string): Promise<Coupon | null> {
    return prisma.coupon.findUnique({ where: { code } });
  },

  findAll(): Promise<Coupon[]> {
    return prisma.coupon.findMany({ orderBy: { code: "asc" } });
  },

  create(data: {
    code: string;
    type: "PERCENTAGE" | "FIXED_AMOUNT";
    value: number;
    minOrderAmount?: number;
    maxUsageCount?: number;
    expiresAt?: Date;
  }): Promise<Coupon> {
    return prisma.coupon.create({ data });
  },

  delete(id: string): Promise<Coupon> {
    return prisma.coupon.delete({ where: { id } });
  },

  incrementUsage(id: string): Promise<Coupon> {
    return prisma.coupon.update({
      where: { id },
      data: { usedCount: { increment: 1 } },
    });
  },
};
