"use client";

import { useState } from "react";
import { AddressStep } from "./address-step";
import { CouponInput } from "../../discount/components/coupon-input";
import { OrderReview } from "./order-review";
import { PlaceOrderButton } from "./place-order-button";
import type { ShippingAddressInput } from "../schemas/create-order.schema";
import type { CartDTO } from "@/features/shopping/types/cart.dto";

/**
 * currentStep یک state کاملاً محلیه — فقط همین کامپوننت و بچه‌هاش بهش
 * نیاز دارن، پس نیازی به Zustand نیست (برخلاف Cart Drawer که چون از چند
 * جای غیرمرتبط صفحه باید در دسترس باشه، Zustand گرفت).
 *
 * shippingAddress هم همین‌جا نگه داشته می‌شه تا وقتی کاربر از قدم ۲
 * برگشت به قدم ۱، دوباره مجبور به تایپ نباشه (این رفتار رو بعداً می‌شه
 * اضافه کرد؛ فعلاً حداقلی نگه داشتیم).
 */
export function CheckoutFlow({ cart }: { cart: CartDTO }) {
  const [step, setStep] = useState<"address" | "review">("address");
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddressInput | null>(null);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState<string>();

  if (step === "address") {
    return (
      <AddressStep
        onNext={(data) => {
          setShippingAddress(data);
          setStep("review");
        }}
      />
    );
  }

  // TypeScript نمی‌دونه ولی منطقاً این‌جا shippingAddress همیشه پر شده،
  // چون فقط از طریق onNext بالا به این step می‌رسیم
  if (!shippingAddress) return null;

  return (
    <div className="max-w-md space-y-6">
      <button
        type="button"
        onClick={() => setStep("address")}
        className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)]"
      >
        ← بازگشت و ویرایش آدرس
      </button>

      <div className="rounded-[var(--radius)] border border-[var(--color-border)] p-4 bg-[var(--color-card)]">
        <p className="text-xs text-[var(--color-muted-foreground)] mb-1">
          ارسال به
        </p>
        <p className="text-sm">
          {shippingAddress.fullName} — {shippingAddress.city}،{" "}
          {shippingAddress.addressLine}
        </p>
      </div>

      <CouponInput
        subtotal={parseFloat(cart.subtotal)}
        onApplied={(d) => {
          setDiscount(d);
        }}
      />

      <OrderReview cart={cart} discount={discount} />

      <PlaceOrderButton
        shippingAddress={shippingAddress}
        couponCode={couponCode}
      />
    </div>
  );
}
