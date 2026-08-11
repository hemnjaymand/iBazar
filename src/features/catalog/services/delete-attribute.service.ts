import { attributeRepository } from "../repositories/attribute.repository";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import { prisma } from "../../../../lib/prisma";

export async function deleteAttributeService(id: string) {
  const existing = await attributeRepository.findById(id);
  if (!existing) {
    throw new BusinessError("Attribute یافت نشد", ErrorCodes.ATTRIBUTE_NOT_FOUND);
  }

  const valueIds = existing.values.map((v) => v.id);
  const usageCount = await prisma.variantAttributeValue.count({
    where: { attributeValueId: { in: valueIds } },
  });
  if (usageCount > 0) {
    throw new BusinessError(
      "این Attribute در حال حاضر روی حداقل یک Variant استفاده شده و قابل حذف نیست",
      ErrorCodes.ATTRIBUTE_IN_USE
    );
  }

  await attributeRepository.delete(id);
}