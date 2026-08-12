import { productRepository } from "../repositories/product.repository";
import { toProductDetailDTO } from "../mappers/product.mapper";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";

export async function unpublishProductService(productId: string) {
  const existing = await productRepository.findById(productId);

  if (!existing) {
    throw new BusinessError(
      "محصول یافت نشد",
      ErrorCodes.PRODUCT_NOT_FOUND,
    );
  }

  const updated = await productRepository.update(productId, {
    isPublished: false,
  });

  return toProductDetailDTO(updated);
}