import { variantAttributeRepository } from "../repositories/variant-attribute.repository";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import { prisma } from "../../../../lib/prisma";

export async function assignVariantAttributesService(variantId: string, attributeValueIds: string[]) {
  const variant = await prisma.variant.findUnique({ where: { id: variantId } });
  if (!variant) throw new BusinessError("Variant یافت نشد", ErrorCodes.VARIANT_NOT_FOUND);

  const values = await prisma.attributeValue.findMany({
    where: { id: { in: attributeValueIds } },
    select: { attributeId: true },
  });
  const attributeIds = values.map((v) => v.attributeId);
  if (new Set(attributeIds).size !== attributeIds.length) {
    throw new BusinessError(
      "هر Variant فقط یک مقدار از هر Attribute می‌تواند داشته باشد",
      ErrorCodes.DUPLICATE_ATTRIBUTE_PER_VARIANT
    );
  }

  return variantAttributeRepository.replaceForVariant(variantId, attributeValueIds);
}
