
import { prisma } from "../../../../lib/prisma";


export const variantRepository = {
  create(data: { productId: string; sku: string; price: number; compareAtPrice?: number; stock: number }) {
    return prisma.variant.create({ data: { ...data, isDefault: false } });
  },
};