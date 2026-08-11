import { productRepository } from "../repositories/product.repository";
import { toProductDetailDTO } from "../mappers/product.mapper";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import type { CreateProductInput } from "../schemas/product.schema";

export async function createProductService(input: CreateProductInput) {
  const skuTaken = await productRepository.findSkuExists(input.defaultVariant.sku);
  if (skuTaken) {
    throw new BusinessError("این SKU قبلاً استفاده شده است", ErrorCodes.SKU_ALREADY_EXISTS);
  }

  const product = await productRepository.createWithDefaultVariant({
    name: input.name,
    slug: input.slug,
    description: input.description,
    categoryId: input.categoryId,
    brandId: input.brandId,
    defaultVariant: input.defaultVariant,
  });

  return toProductDetailDTO(product);
}