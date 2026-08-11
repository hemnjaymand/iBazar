"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerSchema, type RegisterInput } from "../schemas/register.schema";
import { registerAction } from "../actions/register.action";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormError } from "@/shared/ui/form-error";
import Link from "next/link";

/**
 * تفاوت این فرم با LoginForm: این‌جا به‌جای signIn مستقیم، اول
 * registerAction رو صدا می‌زنیم (همون Server Action که در features/identity/actions
 * ساختیم — کاربر جدید رو در دیتابیس می‌سازه). بعد از ساخت موفق، خودمون
 * signIn رو هم صدا می‌زنیم تا کاربر مجبور نباشه دوباره فرم ورود رو پر کنه.
 *
 * result = await registerAction(data) چی برمی‌گردونه؟
 * یادتونه در Backend گفتیم هر Server Action یک Result<T> برمی‌گردونه:
 *   { success: true, data: ... }  یا  { success: false, error: {...} }
 * این‌جا دقیقاً همون الگو رو چک می‌کنیم: if (!result.success) یعنی خطا داشتیم.
 */
export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    setServerError(null);
    const result = await registerAction(data);

    if (!result.success) {
      setServerError(result.error.message);
      return;
    }

    const signInResult = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (signInResult?.error) {
      router.push("/login");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <Label htmlFor="name">نام کامل</Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          state={errors.name ? "error" : "default"}
          {...register("name")}
        />
        <FormError message={errors.name?.message} />
      </div>

      <div>
        <Label htmlFor="email">ایمیل</Label>
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
          autoComplete="new-password"
          state={errors.password ? "error" : "default"}
          {...register("password")}
        />
        <FormError message={errors.password?.message} />
      </div>

      <FormError message={serverError ?? undefined} />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "در حال ثبت‌نام…" : "ثبت‌نام"}
      </Button>

      <p className="text-center text-sm text-[var(--color-muted-foreground)]">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link href="/login" className="text-[var(--color-primary)] font-medium hover:underline">
          وارد شوید
        </Link>
      </p>
    </form>
  );
}
