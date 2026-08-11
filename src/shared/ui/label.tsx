import * as React from "react";
import { cn } from "@/shared/utils/cn";

// این کامپوننت فقط یک <label> استایل‌دهی‌شده است — چون فقط یک شکل ظاهری دارد،
// نیازی به cva (که برای چند حالت مختلف است) نیست.
export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-sm font-medium text-[var(--color-foreground)]", className)}
      {...props}
    />
  );
}
