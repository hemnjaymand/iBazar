"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordInput } from "../schemas/change-password.schema";
import { changePasswordAction } from "../actions/change-password.action";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormError } from "@/shared/ui/form-error";
import { toast } from "@/shared/lib/toast";

export function ChangePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({ resolver: zodResolver(changePasswordSchema) });

  async function onSubmit(data: ChangePasswordInput) {
    setServerError(null);
    const result = await changePasswordAction(data);
    if (!result.success) {
      setServerError(result.error.message);
      return;
    }
    toast.success("رمز عبور با موفقیت تغییر کرد");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 max-w-sm">
      <div>
        <Label htmlFor="currentPassword">رمز عبور فعلی</Label>
        <Input id="currentPassword" type="password" state={errors.currentPassword ? "error" : "default"} {...register("currentPassword")} />
        <FormError message={errors.currentPassword?.message} />
      </div>
      <div>
        <Label htmlFor="newPassword">رمز عبور جدید</Label>
        <Input id="newPassword" type="password" state={errors.newPassword ? "error" : "default"} {...register("newPassword")} />
        <FormError message={errors.newPassword?.message} />
      </div>
      <div>
        <Label htmlFor="confirmPassword">تکرار رمز عبور جدید</Label>
        <Input id="confirmPassword" type="password" state={errors.confirmPassword ? "error" : "default"} {...register("confirmPassword")} />
        <FormError message={errors.confirmPassword?.message} />
      </div>

      <FormError message={serverError ?? undefined} />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "در حال تغییر…" : "تغییر رمز عبور"}
      </Button>
    </form>
  );
}