import "server-only";

import { prisma } from "../../../../lib/prisma";
import { variantInclude } from "../prisma/product.include";

export const variantRepository = {
  create(data: {
    productId: string;
    sku: string;
    price: number;
    compareAtPrice?: number | null;
    stock: number;
  }) {
    return prisma.variant.create({
      data,
      include: variantInclude,
    });
  },
};