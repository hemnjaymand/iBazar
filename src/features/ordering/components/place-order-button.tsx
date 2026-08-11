"use client";

import { useRouter } from "next/navigation";
import { useCreateOrderMutation } from "../hooks/use-create-order-mutation";
import { Button } from "@/shared/ui/button";
import { FormError } from "@/shared/ui/form-error";
import type { ShippingAddressInput } from "../schemas/create-order.schema";

export function PlaceOrderButton({
  shippingAddress,
  couponCode,
}: {
  shippingAddress: ShippingAddressInput;
  couponCode?: string;
}) {
  const router = useRouter();
  const { mutate, isPending, error } = useCreateOrderMutation();

  function handleClick() {
    mutate(
      { shippingAddress, couponCode: couponCode || undefined },
      {
        onSuccess: (data) => {
          router.push(data.redirectUrl ?? "/orders/confirmation");
        },
      },
    );
  }

  return (
    <div>
      <Button className="w-full" onClick={handleClick} disabled={isPending}>
        {isPending ? "در حال ثبت سفارش…" : "پرداخت و ثبت نهایی سفارش"}
      </Button>
      <FormError message={error?.message} />
    </div>
  );
}
