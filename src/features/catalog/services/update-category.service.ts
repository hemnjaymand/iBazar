import { categoryRepository } from "../repositories/category.repository";
import { toCategoryResponseDTO } from "../mappers/category.mapper";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import { UpdateCategoryInput } from "../types/category.dto";

export async function updateCategoryService(
  id: string,
  input: UpdateCategoryInput,
) {
  const existing = await categoryRepository.findById(id);
  if (!existing) {
    throw new BusinessError(
      "دسته‌بندی یافت نشد",
      ErrorCodes.CATEGORY_NOT_FOUND,
    );
  }

  if (input.slug && input.slug !== existing.slug) {
    const slugTaken = await categoryRepository.findBySlug(input.slug);
    if (slugTaken) {
      throw new BusinessError(
        "این slug قبلاً استفاده شده است",
        ErrorCodes.SLUG_ALREADY_EXISTS,
      );
    }
  }

  if (input.parentId) {
    if (input.parentId === id) {
      throw new BusinessError(
        "دسته‌بندی نمی‌تواند والد خودش باشد",
        ErrorCodes.INVALID_CATEGORY_PARENT,
      );
    }
    const allCategories = await categoryRepository.findAll();
    const isDescendant = (candidateId: string, ancestorId: string): boolean => {
      const candidate = allCategories.find((c ) => c.id === candidateId);
      if (!candidate || !candidate.parentId) return false;
      if (candidate.parentId === ancestorId) return true;
      return isDescendant(candidate.parentId, ancestorId);
    };
    if (isDescendant(input.parentId, id)) {
      throw new BusinessError(
        "دسته‌بندی والد نمی‌تواند یکی از زیرمجموعه‌های همین دسته باشد",
        ErrorCodes.INVALID_CATEGORY_PARENT,
      );
    }
  }

  const updated = await categoryRepository.update(id, input);

  return toCategoryResponseDTO({
    ...updated,
    imageUrl: input.imageUrl ?? null,
  });
}