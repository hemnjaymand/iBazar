"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

/**
 * این فایل چیه و چرا لازمه؟
 *
 * Next.js به‌صورت پیش‌فرض همه‌چیز رو "Server Component" می‌سازه — یعنی
 * روی سرور اجرا می‌شه، نه توی مرورگر. ولی دو تا کتابخونه که استفاده می‌کنیم
 * (React Query و next-auth) باید توی مرورگر (Client) کار کنن، چون هرکدوم
 * یک "حافظه‌ی زنده" نگه می‌دارن که با تعامل کاربر عوض می‌شه:
 *
 *   - QueryClientProvider: حافظه‌ای که React Query توش نتیجه‌ی
 *     درخواست‌ها (مثل محتوای سبد خرید) رو نگه می‌داره تا نیازی نباشه
 *     هر بار از سرور دوباره بخونه.
 *
 *   - SessionProvider: اطلاعات "کاربر لاگین‌شده" رو در کل صفحه در دسترس
 *     همه‌ی کامپوننت‌ها می‌ذاره (مثلاً برای نشون دادن اسم کاربر در هدر).
 *
 * چون این دو، خودشون State نگه می‌دارن، باید Client Component باشن
 * (به همین خاطر بالای فایل "use client" نوشته شده). و چون کل سایت به این دو
 * "Provider" نیاز داره، این فایل باید همه‌ی صفحات رو "دربر بگیره" — دقیقاً
 * همون کاری که در فایل بعدی (layout.tsx) انجام می‌شه.
 *
 * useState اینجا فقط برای اینه که QueryClient فقط یک بار ساخته بشه،
 * نه در هر رندر مجدد (این یک الگوی رسمی خود React Query است).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
