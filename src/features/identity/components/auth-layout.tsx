// app/(auth)/layout.tsx (یا کامپوننت AuthLayout)
import type { ReactNode } from "react";
import { AppConfig } from "@/config/app";

/**
 * این کامپوننت یک "Server Component" است.
 * بدون نیاز به جاوااسکریپت کلاینت‌ساید، این پوسته رندر می‌شود.
 * ستون سمت راست برای فرم تعاملی (توسط children) پر می‌شود 
 * و ستون تزئینی نمایانگر هویت بازارچه مرزی شماست.
 */
export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[var(--color-background)]">
      
      {/* ستون تزئینی — سفارشی‌سازی شده برای هویت فروشگاه شما */}
      <section className="hidden lg:flex flex-col justify-between bg-[var(--color-primary)] text-[var(--color-primary-foreground)] p-12">
        <div className="text-xl font-bold tracking-tight">{AppConfig.name}</div>

        <div>
          <h1 className="text-3xl font-bold leading-relaxed mb-4">
            کالای اصل خارجی،
            <br />
            با قیمت واقعی مرز.
          </h1>
          <p className="text-base opacity-90 max-w-sm leading-7">
            از شکلات‌های اورجینال تا لوازم شخصی؛ فاکتور خرید شما در {AppConfig.name} همیشه شفاف و قابل پیگیری است.
          </p>
        </div>

        {/* فاکتور تزئینی با محصولات واقعی بازارچه */}
        <div className="rounded-2xl border border-white/20 bg-white/10 p-6 max-w-sm shadow-xl backdrop-blur-md">
          <div className="flex justify-between text-xs opacity-70 mb-4 num font-medium">
            <span>#ORD-2026-00892</span>
            <span>۱۴۰۵/۰۵/۱۷</span>
          </div>
          <div className="border-t border-dashed border-white/30 my-4" />
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="opacity-90">شکلات نوتلا آلمانی (۸۲۵ گرم)</span>
              <span className="num font-medium">۴۵۰,۰۰۰</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-90">ماشین اصلاح فیلیپس اصلی</span>
              <span className="num font-medium">۳,۲۰۰,۰۰۰</span>
            </div>
             <div className="flex justify-between items-center">
              <span className="opacity-90">ست لباس زیر ترک</span>
              <span className="num font-medium">۶۸۰,۰۰۰</span>
            </div>
          </div>
          <div className="border-t border-dashed border-white/30 my-4" />
          <div className="flex justify-between items-center text-base font-bold">
            <span>جمع کل</span>
            <span className="num">۴,۳۳۰,۰۰۰ تومان</span>
          </div>
        </div>
      </section>

      {/* ستون فرم — محلی برای قرارگیری فرم‌های لاگین و ثبت‌نام */}
      <section className="flex items-center justify-center p-6 sm:p-10">
        {/* استفاده از animate-in برای ورود نرم فرم به صفحه */}
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-10 lg:hidden text-2xl font-bold text-[var(--color-primary)] tracking-tight">
            {AppConfig.name}
          </div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-sm text-[var(--color-muted-foreground)] mb-8">{subtitle}</p>
          
          {/* فرم اصلی اینجا تزریق می‌شود */}
          {children}
        </div>
      </section>
      
    </div>
  );
}