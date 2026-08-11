// features/inventory/services/decrease-stock-for-sale.service.ts
// این سرویس در فاز ۶ (Ordering) هنگام ثبت سفارش صدا زده می‌شه
import { inventoryRepository } from "../repositories/inventory.repository";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";

export async function decreaseStockForSaleService(variantId: string, quantity: number, orderId: string) {
  const movement = await inventoryRepository.applyStockChange(
    variantId,
    -Math.abs(quantity),
    "SALE",
    `Order #${orderId}`
  );

  if (!movement) {
    throw new BusinessError("موجودی کافی نیست", ErrorCodes.OUT_OF_STOCK);
  }

  return movement;
}