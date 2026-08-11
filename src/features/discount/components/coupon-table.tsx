"use client";

import { useRouter } from "next/navigation";
import { deleteCouponAction } from "../actions/coupon-mutation.actions";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { CouponDTO } from "../types";

interface CouponTableProps {
  coupons: CouponDTO[];
}

export function CouponTable({ coupons }: CouponTableProps) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("آیا این کد تخفیف حذف شود؟")) return;
    const result = await deleteCouponAction(id);
    if (!result.success) {
      alert(result.error.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-gray-200 overflow-x-auto">
      <table className="w-full text-sm text-right">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 font-medium">کد</th>
            <th className="px-4 py-3 font-medium">نوع</th>
            <th className="px-4 py-3 font-medium">مقدار</th>
            <th className="px-4 py-3 font-medium">حداقل سفارش</th>
            <th className="px-4 py-3 font-medium">استفاده‌شده</th>
            <th className="px-4 py-3 font-medium">انقضا</th>
            <th className="px-4 py-3 font-medium">وضعیت</th>
            <th className="px-4 py-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {coupons.map((coupon) => (
            <tr key={coupon.id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-mono text-sm">{coupon.code}</td>
              <td className="px-4 py-3">
                {coupon.type === "PERCENTAGE" ? "درصدی" : "مبلغ ثابت"}
              </td>
              <td className="px-4 py-3 num">
                {coupon.type === "PERCENTAGE"
                  ? `${parseFloat(coupon.value).toLocaleString("fa-IR")}%`
                  : `${parseFloat(coupon.value).toLocaleString("fa-IR")} تومان`}
              </td>
              <td className="px-4 py-3 num">
                {coupon.minOrderAmount
                  ? `${parseFloat(coupon.minOrderAmount).toLocaleString("fa-IR")} تومان`
                  : "—"}
              </td>
              <td className="px-4 py-3 num">
                {coupon.usedCount.toLocaleString("fa-IR")}
                {coupon.maxUsageCount ? ` / ${coupon.maxUsageCount}` : ""}
              </td>
              <td className="px-4 py-3">
                {coupon.expiresAt
                  ? new Date(coupon.expiresAt).toLocaleDateString("fa-IR")
                  : "—"}
              </td>
              <td className="px-4 py-3">
                {coupon.isActive ? (
                  <Badge variant="new">فعال</Badge>
                ) : (
                  <Badge variant="outOfStock">غیرفعال</Badge>
                )}
              </td>
              <td className="px-4 py-3">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(coupon.id)}
                >
                  حذف
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {coupons.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          کد تخفیفی ثبت نشده است
        </div>
      )}
    </div>
  );
}
