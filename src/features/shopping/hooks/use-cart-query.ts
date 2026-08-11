// features/shopping/hooks/use-cart-query.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getCartAction } from "../actions/cart.actions";
import type { CartDTO } from "../types/cart.dto";

export function useCartQuery(initialData?: CartDTO) {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const result = await getCartAction();
      if (!result.success) throw new Error(result.error.message);
      return result.data;
    },
    initialData,
    staleTime: 30_000,
  });
}
