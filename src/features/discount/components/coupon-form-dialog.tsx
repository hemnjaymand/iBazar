"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCouponSchema,
  type CreateCouponInput,
} from "../schemas/create-coupon.schema";
import { createCouponAction } from "../actions/coupon-mutation.actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormError } from "@/shared/ui/form-error";

export function CouponFormDialog({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);

  // ✅ پاس دادن CreateCouponInput به useForm
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCouponInput>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      type: "PERCENTAGE",
      value: 1,
      minOrderAmount: undefined,
      maxUsageCount: undefined,
      expiresAt: "",
    },
  });

  // ✅ برداشته شدن تایپ صریح :CreateCouponInput از data
  // تایپ data به صورت خودکار و ایمن توسط handleSubmit استخراج می‌شود
  async function onSubmit(data: CreateCouponInput) {
    setServerError(null);
    const result = await createCouponAction(data);
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
        <div className="w-full max-w-sm bg-white rounded-lg p-6 shadow-lg">
          <h2 className="font-bold mb-4">کد تخفیف جدید</h2>
          <form
            onSubmit={handleSubmit((data) => onSubmit(data))} // ✅ فراخوانی inline جهت تطبیق کامل تایپ‌ها
            noValidate
            className="space-y-4"
          >
            <div>
              <Label htmlFor="code">کد (حروف بزرگ انگلیسی و عدد)</Label>
              <Input
                id="code"
                dir="ltr"
                placeholder="WELCOME10"
                {...register("code")}
              />
              <FormError message={errors.code?.message} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="type">نوع</Label>
                <select
                  id="type"
                  className="w-full h-11 rounded border border-gray-300 bg-white px-3 text-sm"
                  {...register("type")}
                >
                  <option value="PERCENTAGE">درصدی</option>
                  <option value="FIXED_AMOUNT">مبلغ ثابت</option>
                </select>
              </div>
              <div>
                <Label htmlFor="value">مقدار</Label>
                <Input
                  id="value"
                  type="number"
                  {...register("value", { valueAsNumber: true })} // ✅ تبدیل اتوماتیک به number
                />
                <FormError message={errors.value?.message} />
              </div>
            </div>

            <div>
              <Label htmlFor="minOrderAmount">حداقل مبلغ سفارش (اختیاری)</Label>
              <Input
                id="minOrderAmount"
                type="number"
                {...register("minOrderAmount", { valueAsNumber: true })} // ✅
              />
              <FormError message={errors.minOrderAmount?.message} />
            </div>
            <div>
              <Label htmlFor="maxUsageCount">سقف تعداد استفاده (اختیاری)</Label>
              <Input
                id="maxUsageCount"
                type="number"
                {...register("maxUsageCount", { valueAsNumber: true })} // ✅
              />
              <FormError message={errors.maxUsageCount?.message} />
            </div>
            <div>
              <Label htmlFor="expiresAt">تاریخ انقضا (اختیاری)</Label>
              <Input id="expiresAt" type="date" {...register("expiresAt")} />
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
