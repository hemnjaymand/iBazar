import { z } from "zod";

import type { SearchProvider } from "./search-provider";
import { prisma } from "../../../lib/prisma";

// تعریف اسکیما برای خروجی کوئری
const SearchResultSchema = z.object({
  id: z.string(),
  rank: z.number(),
});
const SearchResultsSchema = z.array(SearchResultSchema);

export const postgresSearchProvider: SearchProvider = {
  async search(query, limit = 20) {
    const results = await prisma.$queryRaw`
      SELECT id, ts_rank(search_vector, plainto_tsquery('simple', ${query})) as rank
      FROM products
      WHERE search_vector @@ plainto_tsquery('simple', ${query})
        AND "isPublished" = true
      ORDER BY rank DESC
      LIMIT ${limit}
    `;

   
    const validated = SearchResultsSchema.parse(results);

    return validated.map((r) => ({
      productId: r.id,
      rank: r.rank,
    }));
  },
};