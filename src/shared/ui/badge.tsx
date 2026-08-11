import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";

/**
 * در دیجی‌کالا روی هر کارت محصول معمولاً یک برچسب کوچیک می‌بینید:
 * "٪۲۰ تخفیف" (قرمز)، "جدید" (آبی)، یا "ناموجود" (خاکستری).
 * این‌جا دقیقاً همون سه حالت رو با cva تعریف می‌کنیم.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-[calc(var(--radius)*0.6)] px-2 py-0.5 text-xs font-bold num",
  {
    variants: {
      variant: {
        discount: "bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)]",
        new: "bg-[var(--color-info)] text-[var(--color-info-foreground)]",
        outOfStock: "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
      },
    },
    defaultVariants: { variant: "discount" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
