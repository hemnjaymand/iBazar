import { variantRepository } from "../repositories/variant.repository";
import { productRepository } from "../repositories/product.repository";
import { toVariantResponseDTO } from "../mappers/product.mapper";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import { AddVariantInput } from "../schemas/variant.schema";
// import type { AddVariantInput } from "../schemas/add-variant.schema";

export async function addVariantService(input: AddVariantInput) {
  const skuTaken = await productRepository.findSkuExists(input.sku);
  if (skuTaken) {
    throw new BusinessError(
      "این SKU قبلاً استفاده شده است",
      ErrorCodes.SKU_ALREADY_EXISTS,
    );
  }

  const variant = await variantRepository.create(input);
  return toVariantResponseDTO({ ...variant, attributeValues: [] } as any);
}
