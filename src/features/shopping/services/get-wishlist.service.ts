import { toWishlistItemDTO } from "../mappers/wishlist.mapper";
import { wishlistRepository } from "../repositories/wishlist.repository";

export async function getWishlistService(userId: string) {
  let wishlist = await wishlistRepository.findByUserId(userId);
  if (!wishlist) {
    wishlist = await wishlistRepository.createForUser(userId);
  }
  return wishlist.items.map(toWishlistItemDTO);
}
