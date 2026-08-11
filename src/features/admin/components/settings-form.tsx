"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateAppSettingAction } from "../actions/app-setting.actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormError } from "@/shared/ui/form-error";

interface FormValues {
  site_name: string;
  support_email: string;
}

export function SettingsForm({
  initialValues,
}: {
  initialValues: Record<string, string>;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      site_name: initialValues.site_name ?? "",
      support_email: initialValues.support_email ?? "",
    },
  });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    setSuccess(false);

    const results = await Promise.all([
      updateAppSettingAction({ key: "site_name", value: data.site_name }),
      updateAppSettingAction({
        key: "support_email",
        value: data.support_email,
      }),
    ]);

    const failed = results.find((r) => !r.success);
    if (failed && !failed.success) {
      setServerError(failed.error.message);
      return;
    }
    setSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
      <div>
        <Label htmlFor="site_name">نام فروشگاه</Label>
        <Input id="site_name" {...register("site_name", { required: true })} />
      </div>
      <div>
        <Label htmlFor="support_email">ایمیل پشتیبانی</Label>
        <Input
          id="support_email"
          type="email"
          dir="ltr"
          {...register("support_email", { required: true })}
        />
      </div>

      <FormError message={serverError ?? undefined} />
      {success && (
        <p className="text-sm text-[var(--color-info)]">تنظیمات ذخیره شد ✓</p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "در حال ذخیره…" : "ذخیره تنظیمات"}
      </Button>
    </form>
  );
}
