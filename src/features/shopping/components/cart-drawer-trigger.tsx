"use client";

import { ShoppingBag } from "lucide-react";
import { useCartDrawerStore } from "../lib/cart-drawer.store";
import { useCartQuery } from "../hooks/use-cart-query";

export function CartDrawerTrigger() {
  const { toggle } = useCartDrawerStore();
  const { data: cart } = useCartQuery();
  const itemCount = cart?.itemCount ?? 0;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`سبد خرید، ${itemCount} کالا`}
      className="group relative inline-flex items-center gap-2 p-2 rounded-xl text-gray-800 hover:text-[var(--color-primary)] hover:bg-gray-100/80 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 cursor-pointer select-none"
    >
      {/* محفظه آیکون و نشانگر تعداد */}
      <div className="relative flex items-center justify-center">
        <ShoppingBag className="w-5 h-5 text-gray-700 group-hover:text-[var(--color-primary)] transition-colors duration-200" />
        
        {/* نشانگر تعداد کالا (بج) با موقعیت‌دهی منطقی RTL */}
        {itemCount > 0 && (
          <span className="num absolute -top-2 -start-2.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-bold text-[var(--color-primary-foreground)] ring-2 ring-white shadow-xs transition-transform duration-200 group-hover:scale-110">
            {itemCount}
          </span>
        )}
      </div>

      {/* متن دکمه (در موبایل قابل مخفی‌سازی یا نمایش) */}
      <span className="text-sm font-bold hidden sm:inline-block">
        سبد خرید
      </span>
    </button>
  );
}