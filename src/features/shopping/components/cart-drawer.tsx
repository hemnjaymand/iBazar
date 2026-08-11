"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, ShoppingBag, Loader2, ArrowLeft } from "lucide-react";
import { useCartDrawerStore } from "../lib/cart-drawer.store";
import { useCartQuery } from "../hooks/use-cart-query";
import { CartItemRow } from "./cart-item-row";
import { CartSummary } from "./cart-summary";
import { Button } from "@/shared/ui/button";
import type { CartItemDTO } from "../types/cart.dto";

export function CartDrawer() {
  const { isOpen, close } = useCartDrawerStore();
  const { data: cart, isLoading } = useCartQuery();

  // کنترل اسکرول صفحه و کلید Escape هنگام باز بودن کشو
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const hasItems = cart?.items && cart.items.length > 0;

  return (
    <>
      {/* پس‌زمینه‌ی تیره‌ی پشت کشو با افکت Fade-in */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity animate-in fade-in duration-200 cursor-pointer"
        onClick={close}
        aria-hidden="true"
      />

      {/* کشوی سبد خرید - باز شدن از سمت راست در محیط RTL */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="سبد خرید"
        className="fixed top-0 bottom-0 right-0 w-full sm:w-96 bg-[var(--color-card)] z-50 flex flex-col shadow-2xl border-s border-[var(--color-border)] animate-in slide-in-from-right duration-300 ease-out"
      >
        {/* هدر کشو */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-gray-50/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="font-bold text-gray-900 text-base">سبد خرید</h2>
            {hasItems && (
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                {cart.items.length}
              </span>
            )}
          </div>
          <button
            onClick={close}
            aria-label="بستن کشو"
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200/60 transition-colors cursor-pointer select-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* بدنه و لیست آیتم‌ها */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
              <p className="text-sm font-medium">در حال دریافت سبد خرید…</p>
            </div>
          )}

          {!isLoading && !hasItems && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-3 text-gray-500">
              <div className="p-4 rounded-full bg-gray-100">
                <ShoppingBag className="w-10 h-10 text-gray-400 stroke-1" />
              </div>
              <p className="text-sm font-bold text-gray-800">سبد خرید شما خالی است</p>
              <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed">
                می‌توانید برای مشاهده محصولات به بخش فروشگاه مراجعه کنید.
              </p>
              <Link
                href="/products"
                onClick={close}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline"
              >
                <span>مشاهده فروشگاه</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {cart?.items?.map((item: CartItemDTO) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>

        {/* فوتر و دکمه تکمیل خرید */}
        {hasItems && (
          <div className="p-4 border-t border-[var(--color-border)] bg-gray-50/30 space-y-3">
            <CartSummary cart={cart} />
            <Link href="/checkout" onClick={close} className="block">
              <Button className="w-full font-bold py-2.5">
                تکمیل خرید و ثبت سفارش
              </Button>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}