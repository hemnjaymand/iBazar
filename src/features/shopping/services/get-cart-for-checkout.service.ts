// این سرویس خروجی خامی می‌دهد که Ordering (فاز ۶) از طریق index.ts مصرف می‌کند —
// برخلاف toCartDTO که برای UI است، این یکی فیلدهای خام لازم برای ساخت Order را نگه می‌دارد.
import { cartRepository } from "../repositories/cart.repository";

export interface CheckoutCartItem {
  variantId: string;
  productName: string;
  sku: string;
  quantity: number;
  priceAtAdd: number;
}

export interface CheckoutCart {
  items: CheckoutCartItem[];
  subtotal: string;
}

export async function getCartForCheckoutService(identity: {
  userId?: string;
  sessionToken?: string;
}): Promise<CheckoutCart | null> {
  const cart = identity.userId
    ? await cartRepository.findByUserId(identity.userId)
    : identity.sessionToken
      ? await cartRepository.findBySessionToken(identity.sessionToken)
      : null;

  if (!cart || cart.items.length === 0) return null;

  const items = cart.items.map((item) => ({
    variantId: item.variantId,
    productName: item.variant.product.name,
    sku: item.variant.sku,
    quantity: item.quantity,
    priceAtAdd: item.priceAtAdd.toNumber(),
  }));

  const subtotal = items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);

  return { items, subtotal: subtotal.toFixed(2) };
}
