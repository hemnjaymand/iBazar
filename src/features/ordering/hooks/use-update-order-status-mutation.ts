"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatusAction } from "../actions/update-order-status.action";

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { orderId: string; status: string }) => {
      const result = await updateOrderStatusAction(input);
      if (!result.success) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });
}
