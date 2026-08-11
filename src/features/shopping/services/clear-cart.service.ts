import { prisma } from "../../../../lib/prisma";
import { cartRepository } from "../repositories/cart.repository";

export async function clearCartService(identity: {
  userId?: string;
  sessionToken?: string;
}) {
  const cart = identity.userId
    ? await cartRepository.findByUserId(identity.userId)
    : identity.sessionToken
      ? await cartRepository.findBySessionToken(identity.sessionToken)
      : null;

  if (!cart) return;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}
