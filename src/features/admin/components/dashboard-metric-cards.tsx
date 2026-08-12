
import type { DashboardSummaryDTO } from "../types/dashboard-summary.dto";

export function DashboardMetricCards({
  summary,
}: {
  summary: DashboardSummaryDTO;
}) {
  const cards = [
    {
      label: "درآمد این ماه",
      value: `${parseFloat(summary.revenueThisMonth).toLocaleString("fa-IR")} تومان`,
      icon: "₮",
    },
    {
      label: "تعداد سفارش این ماه",
      value: summary.orderCountThisMonth.toLocaleString("fa-IR"),
      icon: "↗",
    },
    {
      label: "کالای کم‌موجود",
      value: summary.lowStockCount.toLocaleString("fa-IR"),
      icon: "!",
      warn: summary.lowStockCount > 0,
    },
    {
      label: "محصولات منتشرشده",
      value: summary.publishedProductCount.toLocaleString("fa-IR"),
      icon: "✓",
    },
  ];

  return (
    <section aria-label="آمار کلی">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.label}
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border border-[var(--color-border)]
              bg-[var(--color-card)]
              p-4
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-md
              sm:p-5
            "
          >
            {/* Decorative background */}
            <div
              className="
                pointer-events-none
                absolute
                -left-8
                -top-8
                h-20
                w-20
                rounded-full
                bg-[var(--color-primary)]/5
                transition-transform
                duration-300
                group-hover:scale-150
              "
            />

            <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <p
                  className="
                    text-xs
                    font-medium
                    leading-5
                    text-[var(--color-muted-foreground)]
                  "
                >
                  {card.label}
                </p>

                <span
                  className={`
                    flex h-8 w-8 shrink-0
                    items-center justify-center
                    rounded-xl
                    text-xs font-bold
                    ${
                      card.warn
                        ? "bg-[var(--color-destructive)]/10 text-[var(--color-destructive)]"
                        : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    }
                  `}
                >
                  {card.icon}
                </span>
              </div>

              {/* Value */}
              <p
                className={`
                  num
                  mt-4
                  truncate
                  text-lg
                  font-bold
                  tracking-tight
                  sm:text-xl
                  ${
                    card.warn
                      ? "text-[var(--color-destructive)]"
                      : "text-[var(--color-foreground)]"
                  }
                `}
              >
                {card.value}
              </p>

              {/* Bottom indicator */}
              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`
                    h-1
                    w-8
                    rounded-full
                    ${
                      card.warn
                        ? "bg-[var(--color-destructive)]"
                        : "bg-[var(--color-primary)]"
                    }
                  `}
                />

                <span className="text-[10px] text-[var(--color-muted-foreground)]">
                  وضعیت فعلی
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
