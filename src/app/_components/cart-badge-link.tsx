"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartQuery } from "@/features/shopping/hooks/use-cart-query";

/**
 * تابع کمکی برای تبدیل اعداد انگلیسی به فارسی (سبک دیجی‌کالا)
 */
function toPersianDigits(num: number | string): string {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num
    .toString()
    .replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}

// هوک اختصاصی و استاندارد برای تشخیص امن کلاینت (جلوگیری از Cascading Render و Hydration Error)
const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,  // مقدار در کلاینت
    () => false  // مقدار در سرور (SSR)
  );
}
 
/**
 * کامپوننت آیکون سبد خرید به همراه بج قرمز رنگ مطابق استایل دیجی‌کالا
 */
export function CartBadgeLink() {
  const { data: cart } = useCartQuery();
  const itemCount = cart?.itemCount ?? 0;
  
  // جایگزین هوشمند useState و useEffect برای رندر کلاینت
  const isClient = useIsClient();

  const displayCount = itemCount > 99 ? "۹۹+" : toPersianDigits(itemCount);

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95 group shrink-0"
      aria-label={`سبد خرید، ${itemCount} کالا در سبد شما قرار دارد`}
    >
      {/* آیکون سبد خرید */}
      <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-gray-900 transition-colors stroke-[1.75]" />

      {/* بج قرمز تعداد آیتم‌ها */}
      {isClient && itemCount > 0 && (
        <span
          key={itemCount}
          className="absolute -bottom-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 border-2 border-white px-1 text-[10px] font-bold text-white shadow-xs leading-none select-none animate-in zoom-in-50 duration-200"
        >
          {displayCount}
        </span>
      )}
    </Link>
  );
}