import { prisma } from "../../../../lib/prisma";


export async function saveProductImage(productId: string, url: string) {
  return prisma.productImage.create({
    data: {
      productId,
      url,
    },
  });
} 