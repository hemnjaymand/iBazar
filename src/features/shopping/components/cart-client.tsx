"use client";

import { useState } from "react";
import type { CartDTO } from "../types/cart.dto";
import { CartItemRow } from "./cart-item-row";
import { CartSummary } from "./cart-summary";

export function CartClient({ initialCart }: { initialCart: CartDTO }) {
  // دیتا سرور را می‌گیریم و تبدیل به استیت کلاینت می‌کنیم
  const [cart, setCart] = useState<CartDTO>(initialCart);

  // این لاجیک جادویی است که بدون رفرش، جمع کل را حساب می‌کند
  const handleOptimisticUpdate = (itemId: string, newQuantity: number) => {
    setCart((prevCart) => {
      // ۱. آپدیت کردن تعداد آیتم تغییر یافته
      const updatedItems = prevCart.items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );

      // ۲. محاسبه مجدد تعداد کل کالاها
      const newTotalItems = updatedItems.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      // ۳. محاسبه مجدد قیمت کل (فرض شده نام پراپرتی قیمت، price است)
      const newSubtotal = updatedItems.reduce(
        (acc, item) => acc + (Number(item.price) * item.quantity),
        0
      );

      // خروجی دادن سبد خرید جدید به استیت
      return {
        ...prevCart,
        items: updatedItems,
        itemCount: newTotalItems,
        subtotal: newSubtotal.toString(),
      };
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm space-y-6 divide-y divide-[var(--color-border)]/50">
        {cart.items.map((item) => (
          <div key={item.id} className="pt-6 first:pt-0">
            {/* پاس دادن تابع آپدیت به هر سطر */}
            <CartItemRow 
              item={item} 
              onLocalUpdate={handleOptimisticUpdate} 
            />
          </div>
        ))}
      </div>

      <div className="lg:sticky lg:top-8">
        <CartSummary cart={cart} />
      </div>
    </div>
  );
}