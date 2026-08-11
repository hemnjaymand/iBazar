// src/features/shopping/hooks/use-update-cart-item-mutation.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartItemAction } from "../actions/cart-item.actions";
import type { CartDTO } from "../types/cart.dto";

export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { itemId: string; quantity: number }) => {
      const result = await updateCartItemAction(input);
      if (!result.success) throw new Error(result.error.message);
      return result.data;
    },

    onSuccess: (data, variables) => {
      const previousCart = queryClient.getQueryData<CartDTO>(["cart"]);

      if (previousCart) {
        const updatedItems = previousCart.items.map((item) =>
          item.id === variables.itemId
            ? { ...item, quantity: variables.quantity }
            : item
        );

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

    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}