import type { Metadata } from "next";
import { AuthLayout } from "@/features/identity/components/auth-layout";
import { LoginForm } from "@/features/identity/components/login-form";

/**
 * این فایل، به‌خاطر مسیرش، دقیقاً آدرس yoursite.com/login می‌شه.
 * (پوشه‌ی "(auth)" با پرانتز یعنی "Route Group" — فقط برای سازمان‌دهی
 * فایل‌هاست، خودش وارد آدرس نهایی نمی‌شه.)
 *
 * این صفحه خودش هیچ منطقی نداره — فقط AuthLayout رو با محتوای LoginForm
 * پر می‌کنه. این جداسازی (صفحه ساده / کامپوننت پیچیده جدا) باعث می‌شه
 * بعداً بشه همین LoginForm رو جای دیگه هم (مثلاً در یک Modal) استفاده کرد.
 */
export const metadata: Metadata = { title: "ورود به حساب کاربری" };

export default function LoginPage() {
  return (
    <AuthLayout title="ورود" subtitle="برای مشاهده‌ی سفارش‌ها و سبد خرید خود وارد شوید">
      <LoginForm />
    </AuthLayout>
  );
}
