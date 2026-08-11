// features/inventory/lib/inventory.mapper.ts
import type { StockMovement, Variant, Product } from "@prisma/client/client";
import type { StockMovementDTO, InventoryRowDTO } from "../types/stock-movement.dto";

export function toStockMovementDTO(m: StockMovement): StockMovementDTO {
  return {
    id: m.id,
    type: m.type,
    quantity: m.quantity,
    reason: m.reason,
    createdAt: m.createdAt.toISOString(),
  };
}

// ✅ اصلاح تایپ ورودی: به جای کل مدل Product، فقط فیلد name نیازمند است
export function toInventoryRowDTO(
  v: Variant & { product: Pick<Product, "name"> }
): InventoryRowDTO {
  return {
    variantId: v.id,
    productName: v.product.name,
    sku: v.sku,
    stock: v.stock,
    lowStockThreshold: v.lowStockThreshold,
    isLowStock: v.stock <= v.lowStockThreshold,
  };
}