import { cva } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";

const badge = cva("inline-flex items-center rounded-[calc(var(--radius)*0.6)] px-2 py-0.5 text-xs font-bold", {
  variants: {
    role: {
      ADMIN: "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]",
      CUSTOMER: "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
    },
  },
});

export function UserRoleBadge({ role, className }: { role: "ADMIN" | "CUSTOMER"; className?: string }) {
  return <span className={cn(badge({ role }), className)}>{role === "ADMIN" ? "ادمین" : "مشتری"}</span>;
}