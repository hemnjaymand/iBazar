// features/shopping/types/cart.dto.ts
export interface CartItemDTO {
  id: string;
  variantId: string;
  productName: string;
  price: string;
  quantity: number;
  sku: string;
  priceAtAdd: string;
  lineTotal: string;
  image?: string | null;
}

export interface CartDTO {
  id: string;
  items: CartItemDTO[];
  subtotal: string;
  itemCount: number;
  imageUrl?: string | null;
}
