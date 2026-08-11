import { wishlistRepository } from "../repositories/wishlist.repository";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import type { RemoveFromWishlistInput } from "../schemas/wishlist.schema";

export async function removeFromWishlistService(input: RemoveFromWishlistInput, userId: string) {
  const result = await wishlistRepository.removeItem(input.itemId, userId);
  if (result.count === 0) {
    // یا آیتم وجود نداشت یا متعلق به کاربر دیگری بود — هر دو حالت یک پیام امن برمی‌گردانند
    throw new BusinessError("آیتم یافت نشد", ErrorCodes.WISHLIST_ITEM_NOT_FOUND);
  }
}
