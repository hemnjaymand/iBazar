import type { Category } from "@prisma/client";
import { prisma } from "../../../../lib/prisma";

export async function getCategoriesForHomeService(
  limit: number = 6,
): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    where: {
      parentId: null, // فقط دسته‌بندی‌های سطح اول (بدون والد)
    },
    orderBy: {
      name: "asc",
    },
    take: limit,
  });

  // ✅ اضافه کردن imageUrl به هر دسته‌بندی (بدون as any)
  return categories.map((category) => ({
    ...category,
    imageUrl: null, // اگر فیلد در دیتابیس موجود نباشد، مقدار null قرار می‌دهیم
  })) as Category[];
}
