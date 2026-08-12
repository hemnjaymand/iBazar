
import { categoryRepository } from "../repositories/category.repository";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import { prisma } from "../../../../lib/prisma";

export async function deleteCategoryService(id: string) {
  const existing = await categoryRepository.findById(id);
  if (!existing) {
    throw new BusinessError("دسته‌بندی یافت نشد", ErrorCodes.CATEGORY_NOT_FOUND);
  }

  const childrenCount = await prisma.category.count({ where: { parentId: id } });
  if (childrenCount > 0) {
    throw new BusinessError(
      "ابتدا باید زیرمجموعه‌های این دسته‌بندی را حذف یا جابه‌جا کنید",
      ErrorCodes.CATEGORY_HAS_CHILDREN
    );
  }
 
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    throw new BusinessError(
      "این دسته‌بندی محصول دارد؛ ابتدا محصولات را به دسته‌ی دیگری منتقل کنید",
      ErrorCodes.CATEGORY_HAS_PRODUCTS
    );
  }

  await categoryRepository.delete(id);
}