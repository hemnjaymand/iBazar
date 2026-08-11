"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { addVariantAction } from "../actions/variant.actions";
import { assignVariantAttributesAction } from "../actions/attribute.actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormError } from "@/shared/ui/form-error";
import type { AttributeDTO } from "../types/attribute.dto";

interface FormValues {
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
}

/**
 * این فرم دو مرحله رو پشت‌سرهم انجام می‌ده (نه یک Action واحد):
 * ۱. addVariantAction → خود Variant رو با اطلاعات تجاری (قیمت/موجودی) می‌سازه
 * ۲. assignVariantAttributesAction → مقادیر انتخاب‌شده (رنگ/سایز) رو بهش وصل می‌کنه
 * چون این دو مرحله در Backend هم دو Service جدا هستن (طبق اصل Single
 * Responsibility هر Service فقط یک Use Case)، UI هم همون تفکیک رو منعکس می‌کنه.
 */
export function AddVariantForm({
  productId,
  attributes,
  onSuccess,
}: {
  productId: string;
  attributes: AttributeDTO[];
  onSuccess: () => void;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>();

  async function onSubmit(data: FormValues) {
    setServerError(null);

    const variantResult = await addVariantAction({ productId, ...data });
    if (!variantResult.success) {
      setServerError(variantResult.error.message);
      return;
    }

    const attributeValueIds = Object.values(selectedValues).filter(Boolean);
    if (attributeValueIds.length > 0) {
      const assignResult = await assignVariantAttributesAction({
        variantId: variantResult.data.id,
        attributeValueIds,
      });
      if (!assignResult.success) {
        setServerError(assignResult.error.message);
        return;
      }
    }

    onSuccess();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-[var(--radius)] border border-[var(--color-border)] p-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" dir="ltr" {...register("sku", { required: true })} />
        </div>
        <div>
          <Label htmlFor="price">قیمت</Label>
          <Input id="price" type="number" {...register("price", { required: true })} />
        </div>
        <div>
          <Label htmlFor="stock">موجودی</Label>
          <Input id="stock" type="number" {...register("stock")} />
        </div>
      </div>

      {attributes.map((attr) => (
        <div key={attr.id}>
          <Label>{attr.name}</Label>
          <div className="flex flex-wrap gap-2">
            {attr.values.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() =>
                  setSelectedValues((prev) => ({
                    ...prev,
                    [attr.id]: prev[attr.id] === v.id ? "" : v.id, // کلیک دوباره = لغو انتخاب
                  }))
                }
                className={`h-9 px-3 rounded-[var(--radius)] border text-xs ${
                  selectedValues[attr.id] === v.id
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                    : "border-[var(--color-border)]"
                }`}
              >
                {v.value}
              </button>
            ))}
          </div>
        </div>
      ))}

      <FormError message={serverError ?? undefined} />

      <Button type="submit" disabled={isSubmitting} size="sm">
        {isSubmitting ? "در حال ساخت…" : "افزودن Variant"}
      </Button>
    </form>
  );
}