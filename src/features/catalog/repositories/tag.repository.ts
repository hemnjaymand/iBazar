import { prisma } from "../../../../lib/prisma";


export const tagRepository = {
  findAll() {
    return prisma.tag.findMany({ orderBy: { name: "asc" } });
  },
  findBySlug(slug: string) {
    return prisma.tag.findUnique({ where: { slug } });
  },
  create(data: { name: string; slug: string }) {
    return prisma.tag.create({ data });
  },
  attachToProduct(productId: string, tagId: string) {
    return prisma.productTag.upsert({
      where: { productId_tagId: { productId, tagId } },
      update: {},
      create: { productId, tagId },
    });
  },
  detachFromProduct(productId: string, tagId: string) {
    return prisma.productTag.delete({ where: { productId_tagId: { productId, tagId } } });
  },
};