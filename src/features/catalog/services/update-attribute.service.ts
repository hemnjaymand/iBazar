import { attributeRepository } from "../repositories/attribute.repository";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";

// تصمیم: فقط نام Attribute قابل ویرایش است، نه slug —
// چون slug در VariantAttributeValueهای موجود به‌طور غیرمستقیم رفرنس می‌شود
// (از طریق attributeId، نه slug مستقیم) ولی تغییر slug باعث سردرگمی در
// Query‌های آینده و URLهای فیلتر می‌شود؛ برای افزودن مقدار جدید هم یک
// سرویس جدا (addAttributeValueService) داریم، نه ویرایش این‌جا.
export async function updateAttributeService(id: string, name: string) {
  const existing = await attributeRepository.findById(id);
  if (!existing) {
    throw new BusinessError(
      "Attribute یافت نشد",
      ErrorCodes.ATTRIBUTE_NOT_FOUND,
    );
  }
  return attributeRepository.updateName(id, name);
}
