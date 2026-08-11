// src/features/shopping/hooks/use-remove-cart-item-mutation.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCartItemAction } from "../actions/cart-item.actions";
import type { CartDTO } from "../types/cart.dto";

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const result = await removeCartItemAction(itemId);
      if (!result.success) throw new Error(result.error.message);
      return result.data;
    },

    // ✅ به‌روزرسانی دستی کش (فقط یک آیتم حذف می‌شود)
    onSuccess: (data, itemId) => {
      const previousCart = queryClient.getQueryData<CartDTO>(["cart"]);

      if (previousCart) {
        // فیلتر کردن آیتم حذف‌شده
        const updatedItems = previousCart.items.filter((item) => item.id !== itemId);
        const updatedCart: CartDTO = {
          ...previousCart,
          items: updatedItems,
          itemCount: updatedItems.length,
          subtotal: updatedItems.reduce(
            (sum, item) => sum + parseFloat(item.lineTotal),
            0
          ).toFixed(0),
        };
        queryClient.setQueryData(["cart"], updatedCart);
      } else {
        queryClient.setQueryData(["cart"], data);
      }
    },

    // در صورت خطا، کش را invalidate کن
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}