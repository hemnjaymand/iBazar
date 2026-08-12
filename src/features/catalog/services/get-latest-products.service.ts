
import { prisma } from "../../../../lib/prisma";
import type { ProductListItemDTO } from "../types/product-list-item.dto";

/**
 * دریافت آخرین محصولات ثبت‌شده
 * @param limit - تعداد محصولات مورد نظر (پیش‌فرض: ۶)
 * @returns آرایه‌ای از ProductListItemDTO
 */
export async function getLatestProductsService(limit: number = 6): Promise<ProductListItemDTO[]> {
  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      // isActive: true, // در صورت وجود این فیلد در اسکیما، اضافه کنید
    },
    include: {
      variants: { 
        where: { isDefault: true },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    isPublished: product.isPublished,
    price: product.variants[0]?.price?.toString() ?? "0",
    stock: product.variants[0]?.stock ?? 0,
    createdAt: product.createdAt.toISOString(),
       // اضافه کردن فیلدهای جدید در صورت نیاز
    // description: product.description ?? undefined,
    // categoryId: product.categoryId,
    // brandId: product.brandId,
  }));
}