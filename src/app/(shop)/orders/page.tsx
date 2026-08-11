import { requireUser } from "@/server/auth/guards";
import { orderRepository } from "@/features/ordering/repositories/order.repository";
import { toOrderDTO } from "@/features/ordering/mappers/order.mapper";
import { OrdersTable } from "@/features/ordering/components/orders-table";

export default async function OrdersPage() {
  // ۱. بررسی احراز هویت کاربر (اگر لاگین نیست، به لاگین هدایت می‌شود)
  const user = await requireUser();

  // ۲. دریافت سفارشات کاربر از دیتابیس
  const orders = await orderRepository.findByUser(user.id);

  // ۳. تبدیل به DTO برای نمایش
  const orderDTOs = orders.map(toOrderDTO);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">سفارشات من</h1>
      {orderDTOs.length === 0 ? (
        <p className="text-muted-foreground">هیچ سفارشی ثبت نکرده‌اید.</p>
      ) : (
        <OrdersTable orders={orderDTOs} />
      )}
    </div>
  );
}
