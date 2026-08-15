"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { loginSchema, type LoginInput } from "../schemas/login.schema";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormError } from "@/shared/ui/form-error";
import { Link2 } from "lucide-react";
import Link from "next/link";

/**
 * این فایل "use client" داره — یعنی برخلاف AuthLayout، این‌جا کاربر
 * تایپ می‌کنه، دکمه می‌زنه، و state (مقدار فیلدها، خطاها) توی مرورگر
 * تغییر می‌کنه. برای همین باید Client Component باشه.
 *
 * مراحل کارکرد این فرم:
 *   ۱. useForm از react-hook-form فیلدها رو مدیریت می‌کنه.
 *      resolver: zodResolver(loginSchema) یعنی همون Zod schemaای که در
 *      Backend برای اعتبارسنجی استفاده کردیم، این‌جا هم استفاده می‌شه —
 *      یعنی قانون "ایمیل باید معتبر باشه" یک بار نوشته شده، دو جا استفاده می‌شه.
 *   ۲. وقتی کاربر Submit می‌کنه و ورودی‌ها معتبرن، onSubmit صدا زده می‌شه.
 *   ۳. داخل onSubmit، از signIn (تابع آماده‌ی next-auth) استفاده می‌کنیم —
 *      این خودش می‌ره سراغ Backend (همون authConfig که در فاز ۲ ساختیم)
 *      و رمز عبور رو چک می‌کنه.
 *   ۴. اگه خطا بود، پیامش رو در serverError نگه می‌داریم و به FormError می‌دیم.
 *   ۵. اگه موفق بود، کاربر رو به صفحه‌ی اصلی می‌فرستیم.
 */
export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@example.com", 
      password: "Admin@12345",
    },
   });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("ایمیل یا رمز عبور اشتباه است");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <Label htmlFor="email">ایمیل</Label>
        {/*
          نکته‌ی مهم: state={errors.email ? "error" : "default"}
          یعنی وقتی Zod روی این فیلد خطا داده باشه (errors.email موجود باشه)،
          به Input می‌گیم حالت "error" رو نشون بده (همون حاشیه‌ی قرمز که
          در فایل input.tsx با cva تعریف کردیم).
        */}
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          state={errors.email ? "error" : "default"}
          {...register("email")}
        />
        <FormError message={errors.email?.message} />
      </div>

      <div>
        <Label htmlFor="password">رمز عبور</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          state={errors.password ? "error" : "default"}
          {...register("password")}
        />
        <FormError message={errors.password?.message} />
      </div>

      <FormError message={serverError ?? undefined} />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "در حال ورود…" : "ورود"}
      </Button>

      <p className="text-center text-sm text-[var(--color-muted-foreground)]">
        حساب کاربری ندارید؟{" "}
        <Link href="/register" className="text-[var(--color-primary)] font-medium hover:underline">
          ثبت‌نام کنید
        </Link>
      </p>
    </form>
  );
}
