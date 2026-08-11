"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Tooltip سفارشی
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-3 shadow-md dir-rtl text-right min-w-[120px]">
        <p className="text-xs text-[var(--color-muted-foreground)] mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold text-[var(--color-info)]">
          {Number(payload[0].value).toLocaleString("fa-IR")} سفارش
        </p>
      </div>
    );
  }
  return null;
};

export function OrdersBarChartInner({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="var(--color-border)"
          opacity={0.5}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          dy={10}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
          width={40}
          allowDecimals={false}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "var(--color-muted)", opacity: 0.2 }}
          content={<CustomTooltip />}
        />
        <Bar
          dataKey="count"
          fill="var(--color-info)"
          radius={[6, 6, 0, 0]} // گرد کردن گوشه‌های بالایی
          barSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
