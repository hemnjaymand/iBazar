import { z } from "zod";

export const addToWishlistSchema = z.object({
  productId: z.string().cuid(),
});
export type AddToWishlistInput = z.infer<typeof addToWishlistSchema>;

export const removeFromWishlistSchema = z.object({
  itemId: z.string().cuid(),
});
export type RemoveFromWishlistInput = z.infer<typeof removeFromWishlistSchema>;
