"use client";

import { useState } from "react";
import { applyCouponAction } from "../actions/coupon.actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FormError } from "@/shared/ui/form-error";

/**
 * وقتی کاربر کد رو تایید می‌کنه، مبلغ تخفیف رو به بالادست (CheckoutFlow)
 * از طریق onApplied پاس می‌دیم — این کامپوننت خودش state نهایی سفارش رو
 * نگه نمی‌داره، فقط "درخواست‌کننده"ی تخفیفه.
 */
export function CouponInput({
  subtotal,
  onApplied,
}: {
  subtotal: number;
  onApplied: (discount: number) => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleApply() {
    setError(null);
    setIsPending(true);
    const result = await applyCouponAction({ code }, subtotal);
    setIsPending(false);

    if (!result.success) {
      setError(result.error.message);
      setApplied(false);
      onApplied(0);
      return;
    }

    setApplied(true);
    onApplied(parseFloat(result.data.discount));
  }

  return (
    <div>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="کد تخفیف"
          disabled={applied}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleApply}
          disabled={isPending || applied || !code}
        >
          {applied ? "اعمال شد ✓" : isPending ? "در حال بررسی…" : "اعمال کد"}
        </Button>
      </div>
      <FormError message={error ?? undefined} />
    </div>
  );
}
