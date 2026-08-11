// features/catalog/services/get-discounted-products.service.ts (فایل جدید)
import { productRepository } from "../repositories/product.repository";
import { toProductListItemDTO } from "../mappers/product.mapper";

export async function getDiscountedProductsService(limit = 10) {
  const products = await productRepository.findDiscounted(limit);
  return products.map(toProductListItemDTO);
}