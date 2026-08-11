import { prisma } from "../../../../lib/prisma";


export const categoryRepository = {
findAll() {
    return prisma.category.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { name: "asc" },
    }).then((categories) =>
      categories.map((category) => ({
        ...category,
        imageUrl: null, // ✅ اضافه کردن فیلد imageUrl با مقدار null
      }))
    );
  },

  /**
   * جستجوی دسته‌بندی بر اساس Slug یا ID (جلوگیری از ۴۰۴ در آدرس‌های جایگزین)
   */
  findBySlug(identifier: string) {
    return prisma.category.findFirst({
      where: {
        OR: [
          { slug: identifier },
          { id: identifier }
        ]
      }
    });
    
  },
   
  findById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  },

  create(data: { name: string; slug: string; parentId?: string | null;imageUrl?: string | null }) {
    return prisma.category.create({ data });
  },

  update(id: string, data: Partial<{ name: string; slug: string; parentId: string | null; isActive: boolean ;imageUrl?: string | null}>) {
    return prisma.category.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.category.delete({ where: { id } });
  },
  findAllForValidation() {
  return prisma.category.findMany({
    select: { id: true, parentId: true },
  });
}
};