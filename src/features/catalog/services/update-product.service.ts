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

  defaultVariant?: {
    id: string;
    sku?: string;
    price?: number;
    compareAtPrice?: number | null;
    stock?: number;
  };
}

export async function updateProductService(
  id: string,
  input: UpdateProductInput,
) {
  // ----------------------------------------
  // 1. بررسی وجود محصول
  // ----------------------------------------

  const existing = await productRepository.findById(id);

  if (!existing) {
    throw new BusinessError(
      "محصول یافت نشد",
      ErrorCodes.PRODUCT_NOT_FOUND,
    );
  }

  // ----------------------------------------
  // 2. بررسی Slug
  // ----------------------------------------

  if (input.slug !== undefined && input.slug !== existing.slug) {
    const slugTaken = await productRepository.findBySlug(input.slug);

    if (slugTaken) {
      throw new BusinessError(
        "این slug قبلاً استفاده شده است",
        ErrorCodes.SLUG_ALREADY_EXISTS,
      );
    }
  }

  // ----------------------------------------
  // 3. بررسی Category
  // ----------------------------------------

  if (input.categoryId !== undefined) {
    const category = await categoryRepository.findById(
      input.categoryId,
    );

    if (!category) {
      throw new BusinessError(
        "دسته‌بندی یافت نشد",
        ErrorCodes.CATEGORY_NOT_FOUND,
      );
    }
  }

  // ----------------------------------------
  // 4. بروزرسانی Product
  // ----------------------------------------

  await productRepository.update(id, {
    ...(input.name !== undefined
      ? {
          name: input.name,
        }
      : {}),

    ...(input.slug !== undefined
      ? {
          slug: input.slug,
        }
      : {}),

    ...(input.description !== undefined
      ? {
          description: input.description,
        }
      : {}),

    ...(input.isPublished !== undefined
      ? {
          isPublished: input.isPublished,
        }
      : {}),

    ...(input.categoryId !== undefined
      ? {
          category: {
            connect: {
              id: input.categoryId,
            },
          },
        }
      : {}),

    ...(input.brandId !== undefined
      ? input.brandId
        ? {
            brand: {
              connect: {
                id: input.brandId,
              },
            },
          }
        : {
            brand: {
              disconnect: true,
            },
          }
      : {}),
  });

  // ----------------------------------------
  // 5. بروزرسانی Default Variant
  // ----------------------------------------

  const variant = input.defaultVariant;

  if (variant) {
    await productRepository.updateVariant(variant.id, {
      ...(variant.sku !== undefined
        ? {
            sku: variant.sku,
          }
        : {}),

      ...(variant.price !== undefined
        ? {
            price: variant.price,
          }
        : {}),

      ...(variant.compareAtPrice !== undefined
        ? {
            compareAtPrice: variant.compareAtPrice,
          }
        : {}),

      ...(variant.stock !== undefined
        ? {
            stock: variant.stock,
          }
        : {}),
    });
  }

  // ----------------------------------------
  // 6. دریافت نسخه نهایی Product
  // ----------------------------------------

  const finalProduct = await productRepository.findById(id);

  if (!finalProduct) {
    throw new BusinessError(
      "محصول پس از ویرایش یافت نشد",
      ErrorCodes.PRODUCT_NOT_FOUND,
    );
  }

  // ----------------------------------------
  // 7. تبدیل به DTO
  // ----------------------------------------

  return toProductDetailDTO(finalProduct);
}