import { postgresSearchProvider } from "@/server/search/postgres-search-provider";
import { productRepository } from "../repositories/product.repository";
import { toProductListItemDTO } from "../mappers/product.mapper";

export async function searchProductsFulltextService(query: string) {
  const results = await postgresSearchProvider.search(query);
  if (results.length === 0) return [];

  const products = await productRepository.findManyByIds(
    results.map((r) => r.productId),
  );

  const rankMap = new Map(results.map((r) => [r.productId, r.rank]));
  return products
    .sort((a, b) => (rankMap.get(b.id) ?? 0) - (rankMap.get(a.id) ?? 0))
    .map(toProductListItemDTO);
}
