"use client";

import { useQuery } from "@tanstack/react-query";
import { getSearchSuggestionsAction } from "../actions/search.actions";

export function useSearchSuggestionsQuery(query: string) {
  return useQuery({
    queryKey: ["search-suggestions", query],
    queryFn: async () => {
      const result = await getSearchSuggestionsAction({ query });
      if (!result.success) throw new Error(result.error.message);
      return result.data;
    },
    enabled: query.trim().length > 1, // از جست‌وجوی رشته‌ی خیلی کوتاه/خالی جلوگیری می‌کند
    staleTime: 10_000,
  });
}
