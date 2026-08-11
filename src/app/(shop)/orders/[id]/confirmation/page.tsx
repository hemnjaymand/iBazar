import { CheckCircle2, Package, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { notFound } from "next/navigation";
import { updateOrderStatusService } from "@/features/ordering/services/update-order-status.service";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { id } = await params;
  
  // دریافت اطلاعات سفارش از سرویس مربوطه
  const order = await updateOrderStatusService(id, "PAID");

  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto py-16 px-4 max-w-2xl">
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-8 sm:p-10 shadow-sm space-y-8">
        
        {/* هدر موفقیت */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">سفارش شما با موفقیت ثبت شد</h1>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              از خرید شما از بازارچه مرزی سپاسگزاریم. سفارش شما در صف پردازش قرار گرفت.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-[var(--color-muted)]/60 px-4 py-2 rounded-xl text-xs font-medium border border-[var(--color-border)]/60 mt-2">
            <span>شماره سفارش:</span>
            <span className="num font-bold text-[var(--color-foreground)]">{order.orderNumber}</span>
          </div>
        </div>

        {/* جزئیات ارسال و وضعیت */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-2xl bg-[var(--color-muted)]/30 border border-[var(--color-border)]/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)] mb-1">
              <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
              <span>مکان ارسال</span>
            </div>
            <p className="font-medium text-[var(--color-foreground)]">{order.shippingAddress?.fullName}</p>
            <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-2">
              {order.shippingAddress?.city}، {order.shippingAddress?.addressLine}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--color-muted)]/30 border border-[var(--color-border)]/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)] mb-1">
              <Package className="w-4 h-4 text-[var(--color-primary)]" />
              <span>وضعیت فعلی</span>
            </div>
            <p className="font-medium text-[var(--color-foreground)]">{order.status}</p>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              تاریخ ثبت: {new Date(order.createdAt).toLocaleDateString("fa-IR")}
            </p>
          </div>
        </div>

        {/* لیست اقلام سفارش‌داده‌شده */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold border-b border-[var(--color-border)] pb-2">اقلام سفارش</h3>
          <div className="divide-y divide-[var(--color-border)]">
            {order.items.map((item) => (
              <div key={item.sku} className="py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.productName}</span>
                  <span className="text-xs text-[var(--color-muted-foreground)] num">× {item.quantity}</span>
                </div>
                <span className="num font-semibold">{parseFloat(item.lineTotal).toLocaleString("fa-IR")} تومان</span>
              </div>
            ))}
          </div>
        </div>

        {/* جمع کل مبلغ */}
        <div className="flex items-center justify-between pt-4 border-t border-dashed border-[var(--color-border)] font-bold text-base">
          <span>مبلغ پرداخت‌شده</span>
          <span className="num text-lg">{parseFloat(order.total).toLocaleString("fa-IR")} تومان</span>
        </div>

        {/* دکمه‌های هدایت بعدی */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button asChild className="flex-1 font-bold">
            <Link href="/products">ادامه خرید در بازارچه</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/" className="flex items-center justify-center gap-2">
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به صفحه اصلی</span>
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}