// features/system/hooks/use-notifications-query.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotificationsAction } from "../actions/notification.actions";

export function useNotificationsQuery() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const result = await getNotificationsAction();
      if (!result.success) throw new Error(result.error.message);
      return result.data;
    },
    refetchInterval: 30_000,
  });
}