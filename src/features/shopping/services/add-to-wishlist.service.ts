import { wishlistRepository } from "../repositories/wishlist.repository";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import type { AddToWishlistInput } from "../schemas/wishlist.schema";
import { prisma } from "../../../../lib/prisma";

export async function addToWishlistService(input: AddToWishlistInput, userId: string) {
  const product = await prisma.product.findUnique({ where: { id: input.productId } });
  if (!product) {
    throw new BusinessError("محصول یافت نشد", ErrorCodes.PRODUCT_NOT_FOUND);
  }

  let wishlist = await wishlistRepository.findByUserId(userId);
  if (!wishlist) {
    wishlist = await wishlistRepository.createForUser(userId);
  }

  await wishlistRepository.addItem(wishlist.id, input.productId);
}
