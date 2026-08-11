import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";

/**
 * این‌جا هم از cva استفاده کردیم، ولی فقط برای یک محور: "state"
 * یعنی آیا این ورودی خطا داره یا نه (state: "error" وقتی Zod روش خطا داده).
 * وقتی state خطا باشه، حاشیه‌ی قرمز می‌گیره تا کاربر بلافاصله بفهمه.
 */
const inputVariants = cva(
  "flex h-11 w-full rounded-[var(--radius)] border bg-[var(--color-card)] px-3.5 py-2 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      state: {
        default: "border-[var(--color-border)] focus-visible:ring-[var(--color-ring)]",
        error: "border-[var(--color-destructive)] focus-visible:ring-[var(--color-destructive)]",
      },
    },
    defaultVariants: { state: "default" },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, type, ...props }, ref) => {
    return (
      <input type={type} ref={ref} className={cn(inputVariants({ state }), className)} {...props} />
    );
  }
);
Input.displayName = "Input";
