"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  shippingAddressSchema,
  type ShippingAddressInput,
} from "../schemas/create-order.schema";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormError } from "@/shared/ui/form-error";

// قدم اول Checkout — فقط آدرس رو می‌گیره و به قدم بعد پاس می‌ده
// (state واقعی سفارش هنوز ساخته نشده، فقط توی حافظه‌ی CheckoutFlow نگه داشته می‌شه)
export function AddressStep({
  onNext,
}: {
  onNext: (data: ShippingAddressInput) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddressInput>({
    resolver: zodResolver(shippingAddressSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(onNext)}
      noValidate
      className="space-y-4 max-w-md"
    >
      <div>
        <Label htmlFor="fullName">نام گیرنده</Label>
        <Input
          id="fullName"
          state={errors.fullName ? "error" : "default"}
          {...register("fullName")}
        />
        <FormError message={errors.fullName?.message} />
      </div>
      <div>
        <Label htmlFor="phone">شماره تماس</Label>
        <Input
          id="phone"
          state={errors.phone ? "error" : "default"}
          {...register("phone")}
        />
        <FormError message={errors.phone?.message} />
      </div>
      <div>
        <Label htmlFor="city">شهر</Label>
        <Input
          id="city"
          state={errors.city ? "error" : "default"}
          {...register("city")}
        />
        <FormError message={errors.city?.message} />
      </div>
      <div>
        <Label htmlFor="addressLine">آدرس کامل</Label>
        <Input
          id="addressLine"
          state={errors.addressLine ? "error" : "default"}
          {...register("addressLine")}
        />
        <FormError message={errors.addressLine?.message} />
      </div>
      <div>
        <Label htmlFor="postalCode">کد پستی</Label>
        <Input
          id="postalCode"
          state={errors.postalCode ? "error" : "default"}
          {...register("postalCode")}
        />
        <FormError message={errors.postalCode?.message} />
      </div>

      <Button type="submit" className="w-full">
        ادامه به بازبینی سفارش
      </Button>
    </form>
  );
}
