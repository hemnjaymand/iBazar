import * as React from "react";
import { cn } from "@/shared/utils/cn";

// یک جعبه‌ی سفید با سایه و گوشه‌ی گرد — پوسته‌ی بصری اکثر باکس‌های پروژه
// (فرم ورود، کارت محصول، دیالوگ‌های ادمین و ...)
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[calc(var(--radius)*1.5)] border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_1px_2px_rgba(20,32,28,0.04),0_8px_24px_rgba(20,32,28,0.04)]",
        className
      )}
      {...props}
    />
  );
}

// فاصله‌ی بالای کارت (جایی که معمولاً عنوان قرار می‌گیرد)
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-8 pb-4", className)} {...props} />;
}

// بدنه‌ی اصلی کارت
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-8 pt-0", className)} {...props} />;
}
