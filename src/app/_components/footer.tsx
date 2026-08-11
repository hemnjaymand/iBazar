

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Camera,
  //   Twitter,
  //   Linkedin,
  Send,
  Truck,
  CreditCard,
  HeadphonesIcon,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { AppConfig } from "@/config/app";
import { getLogoUrl } from "@/features/settings/services/get-store-settings.service";
import { ScrollToTopButton } from "./scroll-to-top-button";

export async  function Footer() {
  const logoUrl = await getLogoUrl();


  return (
    <footer
      className="bg-[var(--color-background)] border-t border-[var(--color-border)] text-[var(--color-foreground)]"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* بخش اول: لوگو و دکمه بازگشت به بالا */}
        <div className="flex justify-between items-center pb-6 border-b border-[var(--color-border)]">
          <div className="flex items-center">
            {/* کامپوننت Image برای لوگو */}
            <Image
              src={logoUrl}
              alt={AppConfig.name}
              width={200}
              height={150}
              className="align-middle"
              priority
              unoptimized
            />
          </div >
          
          <ScrollToTopButton />
        </div>

        {/* بخش دوم: اطلاعات تماس (استایل فلکس رو) */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4 py-6 text-sm text-[var(--color-muted-foreground)]">
          <span className="font-medium text-base text-[var(--color-foreground)]">
            تلفن پشتیبانی ۶۱۹۳۰۰۰۰ - ۰۲۱
          </span>
          <span className="hidden md:inline-block">|</span>
          <span>۰۲۱-۹۱۰۰۰۱۰۰</span>
          <span className="hidden md:inline-block">|</span>
          <span>۷ روز هفته، ۲۴ ساعته پاسخگوی شما هستیم</span>
        </div>

        {/* بخش سوم: ویژگی‌های فروشگاه با آیکون‌های لوسید */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 py-10 border-b border-[var(--color-border)]">
          <div className="flex flex-col items-center gap-3">
            <Truck
              size={40}
              strokeWidth={1.5}
              className="text-[var(--color-primary)]"
            />
            <span className="text-xs font-medium">امکان تحویل اکسپرس</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <CreditCard
              size={40}
              strokeWidth={1.5}
              className="text-[var(--color-primary)]"
            />
            <span className="text-xs font-medium">امکان پرداخت در محل</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <HeadphonesIcon
              size={40}
              strokeWidth={1.5}
              className="text-[var(--color-primary)]"
            />
            <span className="text-xs font-medium">۷ روز هفته، ۲۴ ساعته</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <RotateCcw
              size={40}
              strokeWidth={1.5}
              className="text-[var(--color-primary)]"
            />
            <span className="text-xs font-medium">
              هفت روز ضمانت بازگشت کالا
            </span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <ShieldCheck
              size={40}
              strokeWidth={1.5}
              className="text-[var(--color-primary)]"
            />
            <span className="text-xs font-medium">ضمانت اصل بودن کالا</span>
          </div>
        </div>

        {/* بخش چهارم: لینک‌های فوتر، شبکه‌های اجتماعی و خبرنامه */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          {/* ستون اول */}
          <div>
            <h3 className="text-base font-bold mb-5 text-[var(--color-foreground)]">
              با آی بازار
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  اتاق خبر آی بازار
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  فروش در آی بازار
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  فرصت‌های شغلی
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  گزارش تخلف در آی بازار
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  تماس با آی بازار
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  درباره آی بازار
                </Link>
              </li>
            </ul>
          </div>

          {/* ستون دوم */}
          <div>
            <h3 className="text-base font-bold mb-5 text-[var(--color-foreground)]">
              خدمات مشتریان
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  پاسخ به پرسش‌های متداول
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  رویه‌های بازگرداندن کالا
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  شرایط استفاده
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  حریم خصوصی
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  گزارش باگ
                </Link>
              </li>
            </ul>
          </div>

          {/* ستون سوم */}
          <div>
            <h3 className="text-base font-bold mb-5 text-[var(--color-foreground)]">
              راهنمای خرید از آی بازار
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  نحوه ثبت سفارش
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  رویه ارسال سفارش
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  شیوه‌های پرداخت
                </Link>
              </li>
            </ul>
          </div>

          {/* ستون چهارم: شبکه‌های اجتماعی و ثبت نام */}
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-base font-bold mb-5 text-[var(--color-foreground)]">
                همراه ما باشید!
              </h3>
              <div className="flex items-center gap-6 text-[var(--color-muted-foreground)]">
                <Link
                  href="#"
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  <Camera size={28} strokeWidth={1.5} />
                </Link>
                <Link
                  href="#"
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  <Camera size={28} strokeWidth={1.5} />
                </Link>
                <Link
                  href="#"
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  <Camera size={28} strokeWidth={1.5} />
                </Link>
                <Link
                  href="#"
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  <Send size={28} strokeWidth={1.5} />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold mb-4 text-[var(--color-foreground)]">
                با ثبت ایمیل، از جدیدترین تخفیف‌ها باخبر شوید
              </h3>
              <form className="flex gap-2 w-full">
                <Input
                  type="email"
                  placeholder="ایمیل شما"
                  className="flex-1 bg-[var(--color-background)]"
                />
                <Button type="submit" variant="primary" className="px-6">
                  ثبت
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
