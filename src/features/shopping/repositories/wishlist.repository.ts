import { prisma } from "../../../../lib/prisma";

const wishlistInclude = {
  items: { include: { product: { include: { variants: true } } } },
} as const;

export const wishlistRepository = {
  findByUserId(userId: string) {
    return prisma.wishlist.findUnique({ where: { userId }, include: wishlistInclude });
  },
  createForUser(userId: string) {
    return prisma.wishlist.create({ data: { userId }, include: wishlistInclude });
  },
  addItem(wishlistId: string, productId: string) {
    return prisma.wishlistItem.upsert({
      where: { wishlistId_productId: { wishlistId, productId } },
      update: {},
      create: { wishlistId, productId },
    });
  },
  removeItem(itemId: string, userId: string) {
    return prisma.wishlistItem.deleteMany({
      where: { id: itemId, wishlist: { userId } },
    });
  },
};
