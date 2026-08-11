// features/shopping/schemas/cart.schema.ts
import { z } from "zod";

export const addToCartSchema = z.object({
  variantId: z.string().cuid(),
  quantity: z.coerce.number().int().min(1).max(99),
});
export type AddToCartInput = z.infer<typeof addToCartSchema>;

export const updateCartItemSchema = z.object({
  itemId: z.string().cuid(),
  quantity: z.coerce.number().int().min(1).max(99),
});