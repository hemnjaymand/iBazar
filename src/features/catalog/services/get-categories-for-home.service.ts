import type { Category } from '@prisma/client/client';
import { prisma } from '../../../../lib/prisma';

export async function getCategoriesForHomeService(
  // limit: number = 6,
): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    where: {
      parentId: null, // فقط دسته‌بندی‌های سطح اول (بدون والد)
    },
    orderBy: {
      name: 'asc',
    },
    // take: limit,
  });

  // console.log('CHECK DATABASE CATEGORIES:', categories);
  return categories;
}
