// features/shopping/services/add-to-cart.service.ts
import { cartRepository } from "../repositories/cart.repository";
import { toCartDTO } from "../mappers/cart.mapper";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import type { AddToCartInput } from "../schemas/cart.schema";
import { prisma } from "../../../../lib/prisma";

export async function addToCartService(
  input: AddToCartInput,
  identity: { userId?: string; sessionToken?: string },
) {
  const variant = await prisma.variant.findUnique({
    where: { id: input.variantId },
  });
  if (!variant || !variant.isActive) {
    throw new BusinessError(
      "این کالا موجود نیست",
      ErrorCodes.VARIANT_NOT_FOUND,
    );
  }
  if (variant.stock < input.quantity) {
    throw new BusinessError("موجودی کافی نیست", ErrorCodes.OUT_OF_STOCK);
  }

  let cart = identity.userId
    ? await cartRepository.findByUserId(identity.userId)
    : identity.sessionToken
      ? await cartRepository.findBySessionToken(identity.sessionToken)
      : null;

  if (!cart) {
    cart = identity.userId
      ? await cartRepository.createForUser(identity.userId)
      : identity.sessionToken
        ? await cartRepository.createForGuest(identity.sessionToken)
        : null;
  }

  if (!cart) {
    throw new BusinessError(
      "برای افزودن به سبد خرید، هویت کاربر یا جلسه مهمان لازم است",
      ErrorCodes.INTERNAL_ERROR,
    );
  }

  await cartRepository.upsertItem(
    cart.id,
    input.variantId,
    input.quantity,
    variant.price.toNumber(),
  );

  const refreshed = identity.userId
    ? await cartRepository.findByUserId(identity.userId)
    : identity.sessionToken
      ? await cartRepository.findBySessionToken(identity.sessionToken)
      : null;

  return toCartDTO(refreshed!);
}
