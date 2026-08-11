import { listCouponsAction } from "@/features/discount/actions/coupon.actions";
import { CouponTable } from "@/features/discount/components/coupon-table";
import { CouponFormDialogWrapper } from "@/features/discount/components/CouponFormDialogWrapper";

export default async function CouponsPage() {
  // ✅ استفاده از اکشن لیست کردن
  const result = await listCouponsAction();
  const coupons = result.success ? result.data : [];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت کدهای تخفیف</h1>
        <CouponFormDialogWrapper />
      </div>

      <CouponTable coupons={coupons} />
    </div>
  );
}
