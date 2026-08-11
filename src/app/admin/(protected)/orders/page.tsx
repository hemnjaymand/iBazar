import { RecentOrdersTable } from "@/features/admin/components/recent-orders-table";
import { listOrdersAction } from "@/features/ordering/actions"; // ایمپورت اکشن درست

interface AdminOrdersPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  // دریافت شماره صفحه از Query String (در صورت عدم وجود، صفحه ۱ لحاظ می‌شود)
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // ۱. فراخوانی اکشن درست با ارسال پارامتر اجباری page
  const response = await listOrdersAction({ page: currentPage });

  // ۲. بررسی و مدیریت خطای اکشن
  if (!response.success) {
    return (
      <div className="p-4 text-[var(--color-destructive)] border border-current rounded-md">
        خطا در دریافت لیست سفارش‌ها: {response.error.message}
      </div>
    );
  }

  // ۳. استخراج آرایه سفارش‌ها از پاسخ
  // نکته: اگر سرویس شما { items, totalPages } برمی‌گرداند از response.data.items استفاده کنید.
  // اگر سرویس مستقیماً آرایه OrderDTO[] برمی‌گرداند، خود response.data را پاس دهید.
  const orders = Array.isArray(response.data) ? response.data : response.data;

  return <RecentOrdersTable orders={orders} />;
}
