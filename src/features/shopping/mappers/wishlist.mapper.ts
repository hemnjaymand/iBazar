import type { WishlistItem, Product, Variant } from "@prisma/client/client";;
import type { WishlistItemDTO } from "../types/wishlist.dto";

type WishlistItemWithRelations = WishlistItem & { product: Product & { variants: Variant[] } };

export function toWishlistItemDTO(item: WishlistItemWithRelations): WishlistItemDTO {
  const defaultVariant = item.product.variants.find((v) => v.isDefault) ?? item.product.variants[0];
  return {
    id: item.id,
    productId: item.productId,
    productName: item.product.name,
    productSlug: item.product.slug,
    defaultVariantPrice: defaultVariant ? defaultVariant.price.toString() : "0.00",
  };
}
