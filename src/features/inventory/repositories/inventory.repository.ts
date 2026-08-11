// features/inventory/repositories/inventory.repository.ts
import { prisma } from "../../../../lib/prisma";
import type { StockMovementType } from "@prisma/client";

export const inventoryRepository = {
  findAllWithStock() {
    return prisma.variant.findMany({
      include: { product: { select: { name: true } } },
      orderBy: { stock: "asc" },
    });
  },
  findMovementsByVariant(variantId: string) {
    return prisma.stockMovement.findMany({
      where: { variantId },
      orderBy: { createdAt: "desc" },
    });
  },
  // آپدیت اتمیک: فقط اگر stock نهایی منفی نشه، موفق می‌شه
  applyStockChange(variantId: string, quantity: number, type: StockMovementType, reason?: string, createdBy?: string) {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.variant.updateMany({
        where: { id: variantId, stock: { gte: -quantity } }, // شرط جلوگیری از موجودی منفی
        data: { stock: { increment: quantity } },
      });

      if (updated.count === 0) {
        return null; // یعنی موجودی کافی نبود یا Variant پیدا نشد
      }

      const movement = await tx.stockMovement.create({
        data: { variantId, type, quantity, reason, createdBy },
      });

      return movement;
    });
  },
};