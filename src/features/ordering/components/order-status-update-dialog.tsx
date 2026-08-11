"use client";

import { useState } from "react";
import { useUpdateOrderStatusMutation } from "../hooks/use-update-order-status-mutation";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { FormError } from "@/shared/ui/form-error";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "در انتظار پرداخت" },
  { value: "PAID", label: "پرداخت‌شده" },
  { value: "PROCESSING", label: "در حال پردازش" },
  { value: "SHIPPED", label: "ارسال‌شده" },
  { value: "DELIVERED", label: "تحویل‌داده‌شده" },
  { value: "CANCELLED", label: "لغوشده" },
  { value: "REFUNDED", label: "بازپرداخت‌شده" },
];

/**
 * نکته‌ی مهم: این Dialog هر انتقالی رو به کاربر پیشنهاد می‌ده، ولی قانون
 * واقعی "کدوم انتقال مجاز است" در updateOrderStatusService (Backend، فاز ۶)
 * چک می‌شه — یعنی حتی اگه UI اجازه‌ی انتخاب یک وضعیت نامعتبر رو بده،
 * سرور با BusinessError جلوش رو می‌گیره. این دقیقاً همون اصل "منطق
 * کسب‌وکاری فقط در Service" است.
 */
export function OrderStatusUpdateDialog({
  orderId,
  currentStatus,
  onClose,
  onSuccess,
}: {
  orderId: string;
  currentStatus: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [status, setStatus] = useState(currentStatus);
  const { mutate, isPending, error } = useUpdateOrderStatusMutation();

  function handleSubmit() {
    mutate({ orderId, status }, { onSuccess });
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[var(--color-card)] rounded-[var(--radius)] p-6">
          <h2 className="font-bold mb-4">تغییر وضعیت سفارش</h2>

          <Label htmlFor="status">وضعیت جدید</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full h-11 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm mb-4"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <FormError message={error?.message} />

          <div className="flex gap-2 mt-2">
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex-1"
            >
              {isPending ? "در حال ثبت…" : "ثبت تغییر"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              انصراف
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
