import Link from "next/link";
import type { ProfileOverviewDTO } from "../types/profile-overview.dto";

export function ProfileOverviewCards({ overview }: { overview: ProfileOverviewDTO }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold">{overview.name ?? "کاربر فروشگاه"}</h2>
        <p className="text-sm text-[var(--color-muted-foreground)]" dir="ltr">{overview.email}</p>
        <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
          عضویت از {new Date(overview.memberSince).toLocaleDateString("fa-IR")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/orders" className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] p-4 hover:border-[var(--color-primary)] transition-colors">
          <p className="num text-2xl font-bold">{overview.orderCount.toLocaleString("fa-IR")}</p>
          <p className="text-xs text-[var(--color-muted-foreground)] mt-1">سفارش ثبت‌شده</p>
        </Link>
        <Link href="/wishlist" className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] p-4 hover:border-[var(--color-primary)] transition-colors">
          <p className="num text-2xl font-bold">{overview.wishlistCount.toLocaleString("fa-IR")}</p>
          <p className="text-xs text-[var(--color-muted-foreground)] mt-1">مورد علاقه‌مندی</p>
        </Link>
      </div>
    </div>
  );
}