"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categoryFormSchema,
  type CategoryFormInput,
} from "../schemas/category.schema";
import { createCategoryAction } from "../actions/category.actions";
import { updateCategoryAction } from "../actions/category-mutation.actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormError } from "@/shared/ui/form-error";
import type { CategoryResponseDTO } from "../types/category.dto";

export function CategoryFormDialog({
  allCategories,
  editing,
  onClose,
  onSuccess,
}: {
  allCategories: CategoryResponseDTO[];
  editing?: CategoryResponseDTO;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: editing?.name ?? "",
      slug: editing?.slug ?? "",
      parentId: editing?.parentId ?? undefined,
    },
  });

  async function onSubmit(data: CategoryFormInput) {
    setServerError(null);

    // اگر اکشن‌ها فقط FormData می‌پذیرند، داده را تبدیل کنید:
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    if (data.parentId) formData.append("parentId", data.parentId);

    const result = editing
      ? await updateCategoryAction({ id: editing.id, ...data }) // اگر اکشن آبجکت می‌پذیرد
      : await createCategoryAction(formData); // یا data

    // اگر اکشن‌ها آبجکت می‌پذیرند، از همین روش استفاده کنید:
    // const payload = editing ? { id: editing.id, ...data } : data;
    // const result = editing
    //   ? await updateCategoryAction(payload)
    //   : await createCategoryAction(payload);

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
          <h2 className="font-bold mb-4">
            {editing ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">نام</Label>
              <Input
                id="name"
                state={errors.name ? "error" : "default"}
                {...register("name")}
              />
              <FormError message={errors.name?.message} />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                dir="ltr"
                state={errors.slug ? "error" : "default"}
                {...register("slug")}
              />
              <FormError message={errors.slug?.message} />
            </div>

            <div>
              <Label htmlFor="parentId">دسته‌ی والد (اختیاری)</Label>
              <select
                id="parentId"
                className="w-full h-11 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm"
                {...register("parentId")}
              >
                <option value="">بدون والد</option>
                {allCategories
                  .filter((c) => c.id !== editing?.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                س
              </select>
            </div>

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
