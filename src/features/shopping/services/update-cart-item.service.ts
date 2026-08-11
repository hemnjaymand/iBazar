import { cartRepository } from "../repositories/cart.repository";
import { toCartDTO } from "../mappers/cart.mapper";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import { prisma } from "../../../../lib/prisma";

export async function updateCartItemService(
  itemId: string,
  quantity: number,
  identity: { userId?: string; sessionToken?: string },
) {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { variant: true, cart: true },
  });
  if (!item) {
    throw new BusinessError(
      "آیتم سبد خرید یافت نشد",
      ErrorCodes.CART_ITEM_NOT_FOUND,
    );
  }
  // چک مالکیت: این آیتم باید متعلق به همین کاربر/مهمان باشد
  const owns =
    (identity.userId && item.cart.userId === identity.userId) ||
    (identity.sessionToken && item.cart.sessionToken === identity.sessionToken);
  if (!owns) {
    throw new BusinessError("دسترسی غیرمجاز", ErrorCodes.FORBIDDEN);
  }
  if (item.variant.stock < quantity) {
    throw new BusinessError("موجودی کافی نیست", ErrorCodes.OUT_OF_STOCK);
  }

  await cartRepository.updateItemQuantity(itemId, quantity);

  const refreshed = identity.userId
    ? await cartRepository.findByUserId(identity.userId)
    : identity.sessionToken
      ? await cartRepository.findBySessionToken(identity.sessionToken)
      : null;

  return toCartDTO(refreshed!);
}
