import { attributeRepository } from "../repositories/attribute.repository";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";

export async function addAttributeValueService(attributeId: string, value: string, slug: string) {
  const attribute = await attributeRepository.findById(attributeId);
  if (!attribute) {
    throw new BusinessError("Attribute یافت نشد", ErrorCodes.ATTRIBUTE_NOT_FOUND);
  }
  const duplicate = attribute.values.some((v) => v.slug === slug);
  if (duplicate) {
    throw new BusinessError("این مقدار قبلاً برای این Attribute ثبت شده است", ErrorCodes.ATTRIBUTE_VALUE_ALREADY_EXISTS);
  }
  return attributeRepository.addValue(attributeId, value, slug);
}