import { productRepository } from "../repositories/product.repository";
import { toProductDetailDTO } from "../mappers/product.mapper";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";

// تصمیم: Soft Delete به‌جای Hard Delete —
// چون Variant با CartItemهای فعال Relation دارد (بدون Cascade)، و OrderItem
// یک Snapshot تاریخی جدا نگه می‌دارد؛ حذف فیزیکی محصول می‌تواند یا با خطای
// Foreign Key مواجه شود (اگر در سبد کسی باشد) یا تاریخچه‌ی سفارش‌ها را
// به‌هم بریزد. غیرفعال‌سازی (isActive=false, isPublished=false) امن‌تر است.
export async function deleteProductService(id: string) {
  const existing = await productRepository.findById(id);
  if (!existing) {
    throw new BusinessError("محصول یافت نشد", ErrorCodes.PRODUCT_NOT_FOUND);
  }

  const updated = await productRepository.softDelete(id);
  return toProductDetailDTO(updated);
}
  