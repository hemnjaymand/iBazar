"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormError } from "@/shared/ui/form-error";
import type { UserResponseDTO } from "../types/user-response.dto";
import { toast } from "@/shared/lib/toast";
import { updateProfileSchema, type UpdateProfileInput } from "../schemas/update-profile.schema";
import { updateProfileAction } from "../actions/update-profile.action";

/**
 * چرا ایمیل غیرقابل‌ویرایشه؟
 * چون تغییر ایمیل معمولاً نیاز به یک فرآیند تأیید جدا (ارسال لینک تأیید
 * به ایمیل جدید) داره که هنوز نساختیم — بازکردنش بدون تأیید، هم یک
 * ریسک امنیتیه (کسی می‌تونه ایمیل حساب رو به چیزی که کنترل می‌کنه عوض
 * کنه) هم می‌تونه Auth.js (که ایمیل رو به‌عنوان شناسه‌ی اصلی لاگین
 * استفاده می‌کنه) رو دچار مشکل کنه.
 */
export function ProfileForm({ user }: { user: UserResponseDTO }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user.name ?? "" },
  });

  async function onSubmit(data: UpdateProfileInput) {
    setServerError(null);
    const result = await updateProfileAction(data);

    if (!result.success) {
      setServerError(result.error.message);
      return;
    }

    toast.success("تغییرات ذخیره شد");
    // تا اسم جدید در Session/Header (که اسم کاربر رو جایی نشون می‌ده) هم به‌روز بشه
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 max-w-sm">
      <div>
        <Label>ایمیل</Label>
        <Input value={user.email} disabled dir="ltr" />
      </div>

      <div>
        <Label htmlFor="name">نام کامل</Label>
        <Input id="name" state={errors.name ? "error" : "default"} {...register("name")} />
        <FormError message={errors.name?.message} />
      </div>

      <FormError message={serverError ?? undefined} />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "در حال ذخیره…" : "ذخیره تغییرات"}
      </Button>
    </form>
  );
}