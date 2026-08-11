// features/shopping/repositories/cart.repository.ts
import { prisma } from "../../../../lib/prisma";

const cartInclude = {
  items: {
    include: {
      variant: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  },
} as const;

export const cartRepository = {
  findByUserId(userId?: string) {
    if (!userId) return null;
    return prisma.cart.findUnique({ where: { userId }, include: cartInclude });
  },
  findBySessionToken(sessionToken?: string) {
    if (!sessionToken) return null;
    return prisma.cart.findUnique({
      where: { sessionToken },
      include: cartInclude,
    });
  },
  createForUser(userId?: string) {
    if (!userId) return null;
    return prisma.cart.create({ data: { userId }, include: cartInclude });
  },
  createForGuest(sessionToken?: string) {
    if (!sessionToken) return null;
    return prisma.cart.create({ data: { sessionToken }, include: cartInclude });
  },
  upsertItem(
    cartId: string,
    variantId: string,
    quantity: number,
    priceAtAdd: number,
  ) {
    return prisma.cartItem.upsert({
      where: { cartId_variantId: { cartId, variantId } },
      update: { quantity: { increment: quantity } },
      create: { cartId, variantId, quantity, priceAtAdd },
    });
  },
  updateItemQuantity(itemId: string, quantity: number) {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  },
  removeItem(itemId: string) {
    return prisma.cartItem.delete({ where: { id: itemId } });
  },
  mergeGuestCartIntoUserCart(guestCartId: string, userCartId: string) {
    return prisma.$transaction(async (tx) => {
      const guestItems = await tx.cartItem.findMany({
        where: { cartId: guestCartId },
      });
      for (const item of guestItems) {
        await tx.cartItem.upsert({
          where: {
            cartId_variantId: { cartId: userCartId, variantId: item.variantId },
          },
          update: { quantity: { increment: item.quantity } },
          create: {
            cartId: userCartId,
            variantId: item.variantId,
            quantity: item.quantity,
            priceAtAdd: item.priceAtAdd,
          },
        });
      }
      await tx.cart.delete({ where: { id: guestCartId } });
    });
  },
};
