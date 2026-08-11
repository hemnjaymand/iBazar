// features/shopping/services/merge-guest-cart.service.ts
import { cartRepository } from "../repositories/cart.repository";

/**
 * ادغام سبد خرید مهمان به سبد خرید کاربر پس از لاگین
 */
export async function mergeGuestCartService(sessionToken: string, userId: string) {
  // ۱. پیدا کردن سبد خرید مهمان
  const guestCart = await cartRepository.findBySessionToken(sessionToken);
  if (!guestCart) return; // مهمان سبد خرید ندارد

  // ۲. پیدا کردن یا ایجاد سبد خرید کاربر
  let userCart = await cartRepository.findByUserId(userId);
  if (!userCart) {
    userCart = await cartRepository.createForUser(userId);
  }

  // ۳. ایمنی: اگر به هر دلیل userCart null بود، خطا بده
  if (!userCart) {
    throw new Error("Failed to get or create user cart");
  }

  // ۴. اگر سبد خرید یکی است، نیازی به ادغام نیست
  if (guestCart.id === userCart.id) return;

  // ۵. ادغام آیتم‌های سبد خرید مهمان به سبد خرید کاربر
  await cartRepository.mergeGuestCartIntoUserCart(guestCart.id, userCart.id);
}