import type { Metadata } from "next";
import { Providers } from "@/shared/providers";
import { AppConfig } from "@/config/app";
import "./globals.css";

/**
 * قالب اصلی (Root Layout) کل اپلیکیشن
 * 
 * تغییرات بهینه‌سازی:
 * 1. اضافه شدن pb-16 در موبایل جهت رزرو فضا برای MobileNav تا محتوای سایت زیر منو پنهان نشود.
 * 2. تنظیم pb-0 در دسکتاپ (md) برای حذف فضای اضافی.
 * 3. اضافه شدن کلاس‌های استایل پایداری بدنه (antialiased و bg-gray-50/50).
 */
export const metadata: Metadata = {
  title: { default: AppConfig.name, template: `%s | ${AppConfig.name}` },
  description: "فروشگاه اینترنتی آی بازار",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
  <html lang="fa" dir="rtl" className="h-full scroll-smooth" data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col bg-gray-50/50 text-gray-900 antialiased selection:bg-red-500 selection:text-white">
        <Providers>
          {/* کانتینر اصلی محتوا همراه با پدینگ رزرو برای منوی موبایل */}
          <div className="flex-1 pb-16 md:pb-0">
            {children}
          </div>

          {/* منوی ناوبری شناور پایین (فقط در موبایل) */}
           
        </Providers>
      </body>
    </html>
  );
}