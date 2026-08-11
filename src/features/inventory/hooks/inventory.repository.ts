import type { StockMovementType } from "@prisma/client";
import { prisma } from "../../../../lib/prisma";

export const inventoryRepository = {
  findAllWithStock() {
    return prisma.variant.findMany({
      include: { product: { select: { name: true } } },
      orderBy: { stock: "asc" },
    });
  },
  findMovementsByVariant(variantId: string) {
    return prisma.stockMovement.findMany({ where: { variantId }, orderBy: { createdAt: "desc" } });
  },
  applyStockChange(variantId: string, quantity: number, type: StockMovementType, reason?: string, createdBy?: string) {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.variant.updateMany({
        where: { id: variantId, stock: { gte: -quantity } },
        data: { stock: { increment: quantity } },
      });
      if (updated.count === 0) return null;

      return tx.stockMovement.create({ data: { variantId, type, quantity, reason, createdBy } });
    });
  },
};
