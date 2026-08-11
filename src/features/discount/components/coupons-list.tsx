"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCouponAction } from "../actions/coupon-mutation.actions";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { CouponFormDialog } from "./coupon-form-dialog";
import { CouponDTO } from "../types";

export function CouponsList({ coupons }: { coupons: CouponDTO[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  async function handleDelete(id: string) {
    if (!confirm("این کد تخفیف حذف شود؟")) return;
    const result = await deleteCouponAction(id);
    if (!result.success) {
      alert(result.error.message);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setShowForm(true)}>
          + کد تخفیف جدید
        </Button>
      </div>

      <div className="rounded-[var(--radius)] border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between px-4 py-3"
          >
            <div>
              <p className="num text-sm font-medium">{c.code}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">
                {c.type === "PERCENTAGE"
                  ? `${parseFloat(c.value).toLocaleString("fa-IR")}٪`
                  : `${parseFloat(c.value).toLocaleString("fa-IR")} تومان`}
                {" — "}
                <span className="num">
                  {c.usedCount.toLocaleString("fa-IR")}
                </span>{" "}
                استفاده‌شده
                {c.maxUsageCount ? ` از ${c.maxUsageCount}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {c.isActive ? (
                <Badge variant="new">فعال</Badge>
              ) : (
                <Badge variant="outOfStock">غیرفعال</Badge>
              )}
              <button
                onClick={() => handleDelete(c.id)}
                className="text-xs text-[var(--color-destructive)]"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
        {coupons.length === 0 && (
          <p className="text-center text-sm text-[var(--color-muted-foreground)] py-6">
            کد تخفیفی ثبت نشده است
          </p>
        )}
      </div>

      {showForm && (
        <CouponFormDialog
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
