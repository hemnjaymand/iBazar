"use client";

import dynamic from "next/dynamic";

export function ChartSkeleton() {
  return (
    <div
      className="
        flex h-[260px]
        w-full
        items-center justify-center
        rounded-xl
        bg-[var(--color-muted)]/30
        text-sm
        text-[var(--color-muted-foreground)]
      "
      role="status"
      aria-label="در حال بارگذاری نمودار"
    >
      <div className="flex items-center gap-2">
        <span
          className="
            h-4 w-4
            animate-spin
            rounded-full
            border-2
            border-[var(--color-border)]
            border-t-[var(--color-primary)]
          "
        />

        <span>در حال بارگذاری نمودار…</span>
      </div>
    </div>
  );
}

export const RevenueChart = dynamic(
  () =>
    import("./revenue-chart-inner").then((module) => module.RevenueChartInner),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);
