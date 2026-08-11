// src/features/shopping/hooks/use-add-to-cart-mutation.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCartAction } from "../actions/cart.actions";
import type { AddToCartInput } from "../schemas/cart.schema";

export function useAddToCartMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddToCartInput) => {
      const result = await addToCartAction(input);
      if (!result.success) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}