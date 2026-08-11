"use client";

import { useMutation } from "@tanstack/react-query";
import { createOrderAction } from "../actions/order.actions";
import type { CreateOrderInput } from "../schemas/create-order.schema";

export function useCreateOrderMutation() {
  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const result = await createOrderAction(input);
      if (!result.success) throw new Error(result.error.message);
      return result.data;
    },
  });
}
