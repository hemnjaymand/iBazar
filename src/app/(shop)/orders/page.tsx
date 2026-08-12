
import { requireUser } from "@/server/auth/guards";
import { orderRepository } from "@/features/ordering/repositories/order.repository";
import { toOrderDTO } from "@/features/ordering/mappers/order.mapper";
import { OrdersTable } from "@/features/ordering/components/orders-table";

export default async function OrdersPage() {
  // احراز هویت کاربر
  const user = await requireUser();

  // دریافت سفارشات کاربر
  const orders = await orderRepository.findByUser(user.id);

  // تبدیل به DTO
  const orderDTOs = orders.map(toOrderDTO);

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <div className="mb-8">
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-3xl">
                سفارش‌های من
              </h1>

              <p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)]">
                در این بخش می‌توانید سفارش‌های ثبت‌شده خود را مشاهده و
                پیگیری کنید.
              </p>
            </div>

            {/* تعداد سفارش‌ها */}
            {orderDTOs.length > 0 && (
              <div className="flex items-center">
                <span
                  className="
                    inline-flex items-center
                    rounded-full
                    bg-[var(--color-muted)]
                    px-3 py-1
                    text-xs font-medium
                    text-[var(--color-muted-foreground)]
                  "
                >
                  {orderDTOs.length} سفارش
                </span>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ====================================================== */}
        {orderDTOs.length === 0 ? (
          /* ===================================================
             EMPTY STATE
          ==================================================== */
          <section
            className="
              flex min-h-[320px]
              flex-col items-center justify-center
              rounded-2xl
              border border-[var(--color-border)]
              bg-[var(--color-card)]
              px-6 py-12
              text-center
              shadow-sm
            "
          >
            {/* Icon */}
            <div
              className="
                mb-5
                flex h-14 w-14
                items-center justify-center
                rounded-full
                bg-[var(--color-muted)]
                text-[var(--color-muted-foreground)]
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 2h12v4H6V2Zm0 6h12v14H6V8Zm3 3h6m-6 4h6m-6 4h3"
                />
              </svg>
            </div>

            <h2 className="text-base font-semibold text-[var(--color-foreground)]">
              هنوز سفارشی ثبت نکرده‌اید
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--color-muted-foreground)]">
              سفارش‌های شما پس از ثبت در این بخش نمایش داده خواهند شد.
            </p>
          </section>
        ) : (
          /* ===================================================
             ORDERS
          ==================================================== */
          <section
            className="
              overflow-hidden
              rounded-2xl
              border border-[var(--color-border)]
              bg-[var(--color-card)]
              shadow-sm
            "
          >
            {/* Table Header */}
            <div
              className="
                flex flex-col gap-2
                border-b border-[var(--color-border)]
                px-5 py-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <h2 className="text-sm font-semibold text-[var(--color-foreground)]">
                  تاریخچه سفارش‌ها
                </h2>

                <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                  فهرست سفارش‌های ثبت‌شده شما
                </p>
              </div>

              <span className="text-xs text-[var(--color-muted-foreground)]">
                {orderDTOs.length} مورد
              </span>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <OrdersTable orders={orderDTOs} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

