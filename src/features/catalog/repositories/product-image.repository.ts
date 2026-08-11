import { prisma } from "../../../../lib/prisma";


export const productImageRepository = {
  // متد موجود برای ایجاد تصویر جدید
  create(data: {
    productId: string;
    variantId?: string;
    url: string;
    altText?: string;
    sortOrder: number;
  }) {
    return prisma.productImage.create({ data });
  },

  // متد موجود برای دریافت تصاویر یک محصول
  findByProduct(productId: string) {
    return prisma.productImage.findMany({
      where: { productId },
      orderBy: { sortOrder: "asc" },
    });
  },

  // متد جدید برای یافتن تصویر بر اساس شناسه
  findById(id: string) {
    return prisma.productImage.findUnique({ where: { id } });
  },

  // متد جدید برای به‌روزرسانی تصویر
  update(
    id: string,
    data: { altText?: string; sortOrder?: number; isDefault?: boolean },
  ) {
    return prisma.productImage.update({ where: { id }, data });
    // حذف تصویر بر اساس شناسه
  },
  delete(id: string) {
    return prisma.productImage.delete({ where: { id } });
  },
};
