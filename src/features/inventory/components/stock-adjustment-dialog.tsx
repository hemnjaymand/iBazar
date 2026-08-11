"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adjustStockSchema, type AdjustStockOutput } from "../schemas/adjust-stock.schema";
import { adjustStockAction } from "../actions/adjust-stock.action";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormError } from "@/shared/ui/form-error";

export function StockAdjustmentDialog({
  variantId,
  currentStock,
  onClose,
  onSuccess,
}: {
  variantId: string;
  currentStock: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);

  // ✅ برداشتن ژنریک صریح از useForm برای استنتاج خودکار تایپ‌ها
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: { variantId, type: "ADJUSTMENT" as const },
  });

  // ✅ تایپ data برابر با AdjustStockOutput (مقداری که parse و تبدیل شده) است
  async function onSubmit(data: AdjustStockOutput) {
    setServerError(null);
    const result = await adjustStockAction(data);
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
          <h2 className="font-bold mb-1">اصلاح موجودی</h2>
          <p className="text-xs text-[var(--color-muted-foreground)] mb-4 num">
            موجودی فعلی: {currentStock.toLocaleString("fa-IR")}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <input type="hidden" {...register("variantId")} />

            <div>
              <Label htmlFor="type">نوع تغییر</Label>
              <select
                id="type"
                className="w-full h-11 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm"
                {...register("type")}
              >
                <option value="PURCHASE_RECEIVED">دریافت از تأمین‌کننده</option>
                <option value="ADJUSTMENT">اصلاح دستی</option>
                <option value="DAMAGED">مرجوعی/آسیب‌دیده</option>
                <option value="RETURN">بازگشت از مشتری</option>
              </select>
            </div>

            <div>
              <Label htmlFor="quantity">مقدار (مثبت = افزایش، منفی = کاهش)</Label>
              <Input
                id="quantity"
                type="number"
                state={errors.quantity ? "error" : "default"}
                {...register("quantity")}
              />
              <FormError message={errors.quantity?.message} />
            </div>

            <div>
              <Label htmlFor="reason">دلیل (اختیاری)</Label>
              <Input id="reason" {...register("reason")} />
            </div>

            <FormError message={serverError ?? undefined} />

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "در حال ثبت…" : "ثبت تغییر"}
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