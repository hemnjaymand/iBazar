import { productRepository } from "../repositories/product.repository";
import { toProductEditDTO } from "../mappers/product.mapper";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";

export async function getProductForEditService(id: string) {
  const product = await productRepository.findById(id);

  if (!product) {
    throw new BusinessError(
      "محصول یافت نشد",
      ErrorCodes.PRODUCT_NOT_FOUND,
    );
  }

  return toProductEditDTO(product);
}