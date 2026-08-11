import { getCartAction } from "@/features/shopping/actions/cart.actions";
import { CartClient } from "@/features/shopping/components/cart-client";
import type { CartDTO } from "@/features/shopping/types/cart.dto";
import { ShoppingBag, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";

export default async function CartPage() {
  // ۱. دریافت نتیجه از اکشن
  const result = await getCartAction();

  // ۲. مدیریت حالت خطا
  if (!result.success) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">سبد خرید</h1>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center gap-4 text-red-600 dark:text-red-400 shadow-sm">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <p className="text-sm font-medium">
            خطا در دریافت سبد خرید: {result.error.message}
          </p>
        </div>
      </div>
    );
  }

  const cart: CartDTO = result.data;

  // ۳. مدیریت سبد خرید خالی
  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto py-20 px-4 max-w-2xl text-center">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center space-y-5">
          <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              سبد خرید شما خالی است
            </h1>
            <p className="text-sm text-[var(--color-muted-foreground)] max-w-sm mx-auto leading-6">
              هنوز کالایی به سبد خرید خود اضافه نکرده‌اید. از کالاهای اصل و
              نایاب آی بازار دیدن کنید.
            </p>
          </div>
          <Button asChild size="lg" className="mt-2 font-bold px-8">
            <Link href="/" className="flex items-center gap-2">
              <span>مشاهده محصولات </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // ۴. رندر کامپوننت کلاینت (پاس دادن دیتا برای مدیریت آنی)
  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <CartClient initialCart={cart} />
    </div>
  );
}