// features/inventory/services/adjust-stock.service.ts
import { inventoryRepository } from "../repositories/inventory.repository";
import { toStockMovementDTO } from "../mappers/inventory.mapper";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import type { AdjustStockInput } from "../schemas/adjust-stock.schema";

export async function adjustStockService(
  input: AdjustStockInput,
  adminUserId: string,
) {
  const movement = await inventoryRepository.applyStockChange(
    input.variantId,
    input.quantity,
    input.type,
    input.reason,
    adminUserId,
  );

  if (!movement) {
    throw new BusinessError(
      "موجودی کافی نیست یا Variant یافت نشد",
      ErrorCodes.INSUFFICIENT_STOCK,
    );
  }

  return toStockMovementDTO(movement);
}
