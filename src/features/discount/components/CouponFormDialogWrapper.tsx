"use client";

import { useState } from "react";
import { CouponFormDialog } from "./coupon-form-dialog";
import { Button } from "@/shared/ui/button";

export function CouponFormDialogWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ کد تخفیف جدید</Button>
      {open && (
        <CouponFormDialog
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            window.location.reload(); // یا استفاده از router.refresh در کلاینت
          }}
        />
      )}
    </>
  );
}
