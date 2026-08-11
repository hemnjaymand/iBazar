import type { DashboardSummaryDTO } from "../types/dashboard-summary.dto";

export function DashboardMetricCards({ summary }: { summary: DashboardSummaryDTO }) {
  const cards = [
    { label: "درآمد این ماه", value: `${parseFloat(summary.revenueThisMonth).toLocaleString("fa-IR")} تومان` },
    { label: "تعداد سفارش این ماه", value: summary.orderCountThisMonth.toLocaleString("fa-IR") },
    { label: "کالای کم‌موجود", value: summary.lowStockCount.toLocaleString("fa-IR"), warn: summary.lowStockCount > 0 },
    { label: "محصولات منتشرشده", value: summary.publishedProductCount.toLocaleString("fa-IR") },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <p className="text-xs text-[var(--color-muted-foreground)] mb-1.5">{card.label}</p>
          <p className={`num text-xl font-bold ${card.warn ? "text-[var(--color-destructive)]" : ""}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}