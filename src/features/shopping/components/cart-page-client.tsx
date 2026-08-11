"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCartQuery } from "../hooks/use-cart-query";
import { CartItemRow } from "./cart-item-row";
import { CartSummary } from "./cart-summary";
import { Button } from "@/shared/ui/button";
import type { CartDTO, CartItemDTO } from "../types/cart.dto";

export function CartPageClient({ initialData }: { initialData: CartDTO }) {
  // استفاده از داده‌های Server Component به عنوان کش اولیه
  const { data: cart } = useCartQuery(initialData);

  // حالت سبد خرید خالی
  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-sm animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-300 stroke-1" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          سبد خرید شما خالی است
        </h2>
        <p className="text-sm text-[var(--color-muted-foreground)] mb-8 max-w-md leading-relaxed">
          ظاهراً هنوز محصولی به سبد خرید خود اضافه نکرده‌اید. برای مشاهده و خرید محصولات به فروشگاه سر بزنید.
        </p>
        <Link href="/">
          <Button className="flex items-center gap-2 font-medium px-6 py-5">
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به فروشگاه</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* عنوان صفحه */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          سبد خرید شما
        </h1>
        <span className="text-sm font-medium text-[var(--color-muted-foreground)] bg-gray-100 px-3 py-1 rounded-full">
          {cart.items.length} کالا
        </span>
      </div>

      {/* ساختار گرید اصلی صفحه */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* لیست محصولات (سمت راست در RTL) */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4 sm:p-6 shadow-sm">
            {cart.items.map((item: CartItemDTO) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* فاکتور و پرداخت (سمت چپ در RTL - چسبان) */}
        <aside className="lg:col-span-4 sticky top-24">
          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-5 sm:p-6 shadow-sm space-y-6">
            <CartSummary cart={cart} />
            
            <Link href="/checkout" className="block">
              <Button className="w-full font-bold py-6 text-base shadow-md hover:shadow-lg transition-all">
                تکمیل خرید و ثبت سفارش
              </Button>
            </Link>
          </div>
        </aside>

      </div>
    </div>
  );
}