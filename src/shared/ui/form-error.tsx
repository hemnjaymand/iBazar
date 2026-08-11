import { cn } from "@/shared/utils/cn";

// این کامپوننت زیر هر Input قرار می‌گیرد. اگر پیام خطا نداشته باشد (undefined)،
// اصلاً چیزی رندر نمی‌کند — همین یک شرط ساده به‌جای پیچیدگی اضافه کافی است.
export function FormError({ message, className }: { message?: string; className?: string }) {
  if (!message) return null;
  return (
    <p className={cn("mt-1.5 text-xs text-[var(--color-destructive)]", className)} role="alert">
      {message}
    </p>
  );
}
