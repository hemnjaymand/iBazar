import { prisma } from "../../../../lib/prisma";


export async function getPublishedProductCountService(): Promise<number> {
  return prisma.product.count({ where: { isPublished: true } });
}
 