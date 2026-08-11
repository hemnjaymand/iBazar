"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFromWishlistAction } from "../actions/wishlist.actions";

export function useRemoveWishlistItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      const result = await removeFromWishlistAction({ itemId });
      if (!result.success) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}
