import Link from "next/link";
import type { CartDTO } from "../types/cart.dto";
import { Button } from "@/shared/ui/button";
import { ArrowLeft, ShieldCheck, Receipt } from "lucide-react";

export function CartSummary({ cart }: { cart: CartDTO }) {
  // آماده‌سازی داده‌ها در بالا برای تمیزی بخش رندر
  const formattedSubtotal = parseFloat(cart.subtotal).toLocaleString("fa-IR");
  const formattedItemCount = cart.itemCount.toLocaleString("fa-IR");

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 space-y-6">
      
      {/* هدر بخش */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-4">
        <Receipt className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="font-bold text-lg text-[var(--color-foreground)]">
          خلاصه سفارش
        </h3>
      </div>

      {/* جزئیات قیمت‌ها */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-[var(--color-muted-foreground)]">
          <span>مجموع اقلام ({formattedItemCount} کالا):</span>
          <span className="num font-medium text-[var(--color-foreground)]">
            {formattedSubtotal} تومان
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-[var(--color-muted-foreground)]">
          <span>هزینه ارسال:</span>
          <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-md">
            وابسته به آدرس
          </span>
        </div>
      </div>

      {/* مبلغ کل قابل پرداخت */}
      <div className="border-t border-dashed border-[var(--color-border)] pt-5">
        <div className="flex items-center justify-between">
          <span className="font-black text-base text-[var(--color-foreground)]">مبلغ قابل پرداخت:</span>
          <div className="flex items-baseline gap-1.5">
            <span className="num text-2xl font-black text-[var(--color-primary)]">
              {formattedSubtotal}
            </span>
            <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
              تومان
            </span>
          </div>
        </div>
      </div>

      {/* دکمه اقدام به خرید (CTA) */}
      <Button asChild size="lg" className="w-full font-bold text-base h-12 shadow-md hover:shadow-lg transition-all">
        <Link href="/checkout" className="flex items-center justify-center gap-2">
          <span>تایید و ادامه خرید</span>
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </Button>

      {/* نشان اعتماد و گارانتی */}
      <div className="flex items-center justify-center gap-2 text-xs text-[var(--color-muted-foreground)] bg-[var(--color-muted)]/40 p-3 rounded-xl border border-[var(--color-border)]/50">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <span className="font-medium leading-relaxed">
          تضمین سلامت و اصالت کالاهای وارداتی
        </span>
      </div>
      
    </div>
  );
}