import { tagRepository } from "../repositories/tag.repository";

export async function attachTagToProductService(
  productId: string,
  tagId: string,
) {
  return tagRepository.attachToProduct(productId, tagId);
}
