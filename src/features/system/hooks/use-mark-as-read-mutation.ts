"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsReadAction } from "../actions/notification.actions";

export function useMarkAsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const result = await markNotificationAsReadAction({ notificationId });
      if (!result.success) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
