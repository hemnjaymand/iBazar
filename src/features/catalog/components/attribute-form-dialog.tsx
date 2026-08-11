"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { createAttributeAction } from "../actions/attribute.actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormError } from "@/shared/ui/form-error";

interface FormValues {
  name: string;
  slug: string;
  values: { value: string; slug: string }[];
}

export function AttributeFormDialog({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: "", slug: "", values: [{ value: "", slug: "" }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "values" });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    const result = await createAttributeAction(data);
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
        <div className="w-full max-w-md bg-[var(--color-card)] rounded-[var(--radius)] p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="font-bold mb-4">ویژگی جدید (مثلاً رنگ یا سایز)</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="name">نام ویژگی</Label>
                <Input
                  id="name"
                  placeholder="رنگ"
                  {...register("name", { required: true })}
                />
              </div>
              <div>
                <Label htmlFor="attr-slug">Slug</Label>
                <Input
                  id="attr-slug"
                  dir="ltr"
                  placeholder="color"
                  {...register("slug", { required: true })}
                />
              </div>
            </div>

            <div>
              <Label>مقادیر</Label>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      placeholder="قرمز"
                      {...register(`values.${index}.value`, { required: true })}
                    />
                    <Input
                      dir="ltr"
                      placeholder="red"
                      {...register(`values.${index}.slug`, { required: true })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ value: "", slug: "" })}
              >
                + افزودن مقدار
              </Button>
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
