"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  savedAddressSchema,
  type SavedAddressInput,
} from "../schemas/saved-address.schema";
import {
  createSavedAddressAction,
  updateSavedAddressAction,
} from "../actions/saved-address.actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormError } from "@/shared/ui/form-error";
import type { SavedAddressDTO } from "../types/saved-address.dto";

export function AddressFormDialog({
  editing,
  onClose,
  onSuccess,
}: {
  editing?: SavedAddressDTO;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SavedAddressInput>({
    resolver: zodResolver(savedAddressSchema) as any,
    defaultValues: (editing ?? {
      label: "",
      fullName: "",
      phone: "",
      addressLine: "",
      city: "",
      postalCode: "",
      isDefault: false,
    }) as SavedAddressInput,
  });

  // ✨ تعیین صریح تایپ SavedAddressInput برای پارامتر data
  async function onSubmit(data: SavedAddressInput) {
    setServerError(null);
    const result = editing
      ? await updateSavedAddressAction(editing.id, data)
      : await createSavedAddressAction(data);

    if (!result.success) {
      setServerError(result.error.message);
      return;
    }
    onSuccess();
  }
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[var(--color-card)] rounded-[var(--radius)] p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="font-bold mb-4">
            {editing ? "ویرایش آدرس" : "آدرس جدید"}
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            <div>
              <Label htmlFor="label">عنوان آدرس (مثلاً خانه)</Label>
              <Input id="label" {...register("label")} />
              <FormError message={errors.label?.message} />
            </div>
            <div>
              <Label htmlFor="fullName">نام گیرنده</Label>
              <Input id="fullName" {...register("fullName")} />
              <FormError message={errors.fullName?.message} />
            </div>
            <div>
              <Label htmlFor="phone">شماره تماس</Label>
              <Input id="phone" {...register("phone")} />
              <FormError message={errors.phone?.message} />
            </div>
            <div>
              <Label htmlFor="city">شهر</Label>
              <Input id="city" {...register("city")} />
              <FormError message={errors.city?.message} />
            </div>
            <div>
              <Label htmlFor="addressLine">آدرس کامل</Label>
              <Input id="addressLine" {...register("addressLine")} />
              <FormError message={errors.addressLine?.message} />
            </div>
            <div>
              <Label htmlFor="postalCode">کد پستی</Label>
              <Input id="postalCode" {...register("postalCode")} />
              <FormError message={errors.postalCode?.message} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("isDefault")} />
              آدرس پیش‌فرض باشد
            </label>

            <FormError message={serverError ?? undefined} />

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "در حال ذخیره…" : "ذخیره"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                انصراف
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
