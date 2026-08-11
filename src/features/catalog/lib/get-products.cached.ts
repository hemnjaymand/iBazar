// features/catalog/lib/get-products.cached.ts
import { unstable_cache } from "next/cache";
import { searchProductsService } from "../services/search-products.service";

export const getCachedProducts = unstable_cache(
  (params: { page?: number; categoryId?: string }) => searchProductsService(params),
  ["products-list"],
  { tags: ["products"], revalidate: 3600 }
);