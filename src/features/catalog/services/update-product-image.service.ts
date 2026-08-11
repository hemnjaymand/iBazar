import { productImageRepository } from "../repositories/product-image.repository";
import { toProductImageDTO } from "../mappers/product-image.mapper";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import type { UpdateProductImageInput } from "../schemas/product-image.schema";

export async function updateProductImageService(input: UpdateProductImageInput) {
  const image = await productImageRepository.findById(input.id);
  if (!image) {
    throw new BusinessError("تصویر یافت نشد", ErrorCodes.PRODUCT_IMAGE_NOT_FOUND);
  }

  // تنها فیلدهای موجود در اسکیما را به‌روز می‌کنیم
  const updated = await productImageRepository.update(input.id, {
    altText: input.altText, 
    sortOrder: input.sortOrder,
    isDefault: input.isDefault,
  });

  return toProductImageDTO(updated);
}