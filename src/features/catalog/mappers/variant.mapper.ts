import { Variant } from "@prisma/client/client";

export function toVariantDTO(variant: Variant) {
  return {
    id: variant.id,
    sku: variant.sku,
    price: variant.price.toString(),
    stock: variant.stock,
    isDefault: variant.isDefault,
    isActive: variant.isActive,
  };
}
