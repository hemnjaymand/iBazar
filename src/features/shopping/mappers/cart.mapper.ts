import type { Cart, CartItem, Variant, Product, ProductImage } from "@prisma/client/client";;
import type { CartDTO, CartItemDTO } from "../types/cart.dto";

type CartItemWithRelations = CartItem & {
  variant: Variant & {
    product: Product & {
      images: ProductImage[];
    };
  };
};

function toCartItemDTO(item: CartItemWithRelations): CartItemDTO {
  const lineTotal = item.priceAtAdd.toNumber() * item.quantity;
  return {
    id: item.id,
    variantId: item.variantId,
    productName: item.variant.product.name,
    sku: item.variant.sku,
    quantity: item.quantity,
    price: item.priceAtAdd.toString(),
    priceAtAdd: item.priceAtAdd.toString(),
    lineTotal: lineTotal.toFixed(2),
  };
}

export function toCartDTO(
  cart: Cart & { items: CartItemWithRelations[] },
): CartDTO {
  const items = cart.items.map(toCartItemDTO);
  const subtotal = items.reduce((sum, i) => sum + parseFloat(i.lineTotal), 0);

  // استخراج تصویر از اولین آیتم اصلی (نه از آیتم‌های نگاشت‌شده)
  const firstItem = cart.items[0];
  const imageUrl = firstItem?.variant?.product?.images?.[0]?.url ?? "";

  return {
    id: cart.id,
    items,
    subtotal: subtotal.toFixed(2),
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    imageUrl,
  };
}