import { productRepository } from "../repositories/product.repository";
import { toProductListItemDTO } from "../mappers/product.mapper";
import type { ProductListItemDTO } from "../types/product.dto";

export async function getAdminProductsService(): Promise<ProductListItemDTO[]> {
  const products = await productRepository.findAllForAdmin({
    skip: 0,
    take: 100,
  });
  return products.map((p) => ({
    ...toProductListItemDTO({ ...p, variants: p.variants }),
    categoryName: p.category?.name ?? "—",
  }));
}
 