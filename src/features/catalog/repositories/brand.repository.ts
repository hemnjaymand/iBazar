import { prisma } from "../../../../lib/prisma";


export const brandRepository = {
  findAll() {
    return prisma.brand.findMany({ orderBy: { name: "asc" } });
  },
  findBySlug(slug: string) {
    return prisma.brand.findUnique({ where: { slug } });
  },
  findById(id: string) {
    return prisma.brand.findUnique({ where: { id } });
  },
  create(data: { name: string; slug: string; logoUrl?: string | null }) {
    return prisma.brand.create({ data });
  },
  update(id: string, data: Partial<{ name: string; slug: string; logoUrl: string | null; isActive: boolean }>) {
    return prisma.brand.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.brand.delete({ where: { id } });
  },
};