"use client";

import { useQuery } from "@tanstack/react-query";
import { getWishlistAction } from "../actions/wishlist.actions";

export function useWishlistQuery() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const result = await getWishlistAction();
      if (!result.success) throw new Error(result.error.message);
      return result.data;
    },
  });
}
