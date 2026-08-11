import type { ProductImage } from "@prisma/client";
import type { ProductImageDTO } from "../types/product-image.dto";

export function toProductImageDTO(image: ProductImage): ProductImageDTO {
  return {
    id: image.id,
    productId: image.productId,
    url: image.url,
    altText: image.altText,
    sortOrder: image.sortOrder,
  };
}

export function toProductImageDTOList(images: ProductImage[]): ProductImageDTO[] {
  return images.map(toProductImageDTO);
}