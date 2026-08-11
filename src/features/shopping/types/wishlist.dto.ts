import type  { ProductListItemDTO } from "@/features/catalog";

// features/shopping/types/wishlist.dto.ts
export interface WishlistItemDTO {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  defaultVariantPrice: string;
}
export interface WishlistItem {
  id: string;
  product: ProductListItemDTO;
  addedAt: Date;
}

export interface WishlistGridProps {
  items: WishlistItem[];
  onRemove?: (id: string) => void;
  className?: string;
}