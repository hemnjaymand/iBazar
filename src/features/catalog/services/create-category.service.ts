import { categoryRepository } from "../repositories/category.repository";
import { toCategoryResponseDTO } from "../mappers/category.mapper";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import type { CategoryFormInput } from "../schemas/category.schema";

export async function createCategoryService(input: CategoryFormInput) {
  const existing = await categoryRepository.findBySlug(input.slug);
  if (existing) {
    throw new BusinessError(
      "این slug قبلاً استفاده شده است",
      ErrorCodes.SLUG_ALREADY_EXISTS,
    );
  }
  if (input.parentId) {
    const parent = await categoryRepository.findById(input.parentId);
    if (!parent) {
      throw new BusinessError(
        "دسته‌بندی والد یافت نشد",
        ErrorCodes.CATEGORY_NOT_FOUND,
      );
    }
  }
  const category = await categoryRepository.create(input);

  // ✅ اضافه کردن imageUrl از input به شیء (بدون as any)
  return toCategoryResponseDTO({
    ...category,
    imageUrl:  null,
  });
}