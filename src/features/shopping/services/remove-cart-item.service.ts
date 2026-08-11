import { cartRepository } from "../repositories/cart.repository";
import { toCartDTO } from "../mappers/cart.mapper";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import { prisma } from "../../../../lib/prisma";

export async function removeCartItemService(
  itemId: string,
  identity: { userId?: string; sessionToken?: string },
) {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });
  if (!item) {
    throw new BusinessError(
      "آیتم سبد خرید یافت نشد",
      ErrorCodes.CART_ITEM_NOT_FOUND,
    );
  }
  const owns =
    (identity.userId && item.cart.userId === identity.userId) ||
    (identity.sessionToken && item.cart.sessionToken === identity.sessionToken);
  if (!owns) {
    throw new BusinessError("دسترسی غیرمجاز", ErrorCodes.FORBIDDEN);
  }

  await cartRepository.removeItem(itemId);

  const refreshed = identity.userId
    ? await cartRepository.findByUserId(identity.userId)
    : identity.sessionToken
      ? await cartRepository.findBySessionToken(identity.sessionToken)
      : null;

  return refreshed
    ? toCartDTO(refreshed)
    : { id: "", items: [], subtotal: "0.00", itemCount: 0 };
}
