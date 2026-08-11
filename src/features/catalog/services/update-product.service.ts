// features/catalog/services/update-product.service.ts — نسخه‌ی تکمیل‌شده
import { productRepository } from "../repositories/product.repository";
import { categoryRepository } from "../repositories/category.repository";
import { toProductDetailDTO } from "../mappers/product.mapper";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";

export interface UpdateProductInput {
  name?: string;
  slug?: string;
  description?: string;
  categoryId?: string;
  brandId?: string | null;
  isPublished?: boolean;
}

export async function updateProductService(id: string, input: UpdateProductInput) {
  const existing = await productRepository.findById(id);
  if (!existing) {
    throw new BusinessError("محصول یافت نشد", ErrorCodes.PRODUCT_NOT_FOUND);
  }

  if (input.slug && input.slug !== existing.slug) {
    const slugTaken = await productRepository.findBySlug(input.slug);
    if (slugTaken) {
      throw new BusinessError("این slug قبلاً استفاده شده است", ErrorCodes.SLUG_ALREADY_EXISTS);
    }
  }

  if (input.categoryId) {
    const category = await categoryRepository.findById(input.categoryId);
    if (!category) {
      throw new BusinessError("دسته‌بندی یافت نشد", ErrorCodes.CATEGORY_NOT_FOUND);
    }
  }

  const updated = await productRepository.update(id, {
    ...(input.name ? { name: input.name } : {}),
    ...(input.slug ? { slug: input.slug } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.isPublished !== undefined ? { isPublished: input.isPublished } : {}),
    ...(input.categoryId ? { category: { connect: { id: input.categoryId } } } : {}),
    ...(input.brandId !== undefined
      ? input.brandId
        ? { brand: { connect: { id: input.brandId } } }
        : { brand: { disconnect: true } }
      : {}),
  });

  return toProductDetailDTO(updated);
}