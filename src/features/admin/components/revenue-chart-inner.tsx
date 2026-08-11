"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface RevenueChartProps {
  data: { date: string; amount: number }[];
}

export function RevenueChartInner({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} width={40} />
        <Tooltip
          formatter={(value) => {
            const numericValue = typeof value === "number" ? value : Number(value ?? 0);
            return [`${numericValue.toLocaleString("fa-IR")} تومان`, "درآمد"];
          }}
          labelStyle={{ direction: "rtl" }}
        />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="var(--color-primary)"
          fill="url(#revenueColor)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}