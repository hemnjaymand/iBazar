import { productImageRepository } from "../repositories/product-image.repository";
import { toProductImageDTO } from "../mappers/product-image.mapper";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import type { DeleteProductImageInput } from "../schemas/product-image.schema";

export async function deleteProductImageService(
  input: DeleteProductImageInput,
) {
  const image = await productImageRepository.findById(input.id);
  if (!image) {
    throw new BusinessError(
      "تصویر یافت نشد",
      ErrorCodes.PRODUCT_IMAGE_NOT_FOUND,
    );
  }

  const deleted = await productImageRepository.delete(input.id);
  return toProductImageDTO(deleted);
}
 