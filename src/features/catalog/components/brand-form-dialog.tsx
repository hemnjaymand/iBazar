"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { createBrandAction, updateBrandAction } from "../actions/brand.actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormError } from "@/shared/ui/form-error";
import type { BrandResponseDTO } from "../types/brand.dto";

interface FormValues {
  name: string;
  slug: string;
}

export function BrandFormDialog({
  editing,
  onClose,
  onSuccess,
}: {
  editing?: BrandResponseDTO;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({ defaultValues: { name: editing?.name ?? "", slug: editing?.slug ?? "" } });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    const result = editing ? await updateBrandAction(editing.id, data) : await createBrandAction(data);
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
        <div className="w-full max-w-sm bg-[var(--color-card)] rounded-[var(--radius)] p-6">
          <h2 className="font-bold mb-4">{editing ? "ویرایش برند" : "برند جدید"}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">نام برند</Label>
              <Input id="name" {...register("name", { required: true })} />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" dir="ltr" {...register("slug", { required: true })} />
            </div>
            <FormError message={serverError ?? undefined} />
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "در حال ذخیره…" : "ذخیره"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
