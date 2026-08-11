import { getCartAction } from "@/features/shopping/actions/cart.actions";
import { ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { CheckoutFlow } from "@/features/ordering/components/checkout-flow";

export default async function CheckoutPage() {
  const result = await getCartAction();

  if (!result.success || result.data.items.length === 0) {
    return (
      <div className="container mx-auto py-20 px-4 max-w-2xl text-center">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center space-y-5">
          <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">امکان ورود به صفحه پرداخت نیست</h1>
            <p className="text-sm text-[var(--color-muted-foreground)] max-w-sm mx-auto leading-6">
              سبد خرید شما خالی است یا خطایی در دریافت اطلاعات رخ داده است. ابتدا کالاهای مورد نظر را به سبد اضافه کنید.
            </p>
          </div>
          <Button asChild size="lg" className="mt-2 font-bold px-8">
            <Link href="/products">بازگشت به فروشگاه</Link>
          </Button>
        </div>
      </div>
    );
  }

  const cart = result.data;

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      {/* هدر صفحه تسویه حساب */}
      <div className="mb-8 border-b border-[var(--color-border)] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">تکمیل فرآیند خرید</h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            اطلاعات ارسال و بازبینی نهایی سفارش از بازارچه مرزی
          </p>
        </div>
        
        {/* ویژگی‌های امنیتی و ارسال */}
        <div className="flex items-center gap-4 text-xs text-[var(--color-muted-foreground)] bg-[var(--color-muted)]/50 px-4 py-2.5 rounded-2xl border border-[var(--color-border)]/60">
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[var(--color-primary)]" />
            <span>ارسال پستی سراسری</span>
          </div>
          <div className="w-px h-4 bg-[var(--color-border)]" />
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>تضمین اصالت کالا</span>
          </div>
        </div>
      </div>

      {/* محتوای اصلی جریان پرداخت */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-10 shadow-sm">
        <CheckoutFlow cart={cart} />
      </div>
    </div>
  );
}