import Link from "next/link";

const NAV_ITEMS = [
  { href: "/profile", label: "نمای کلی" },
  { href: "/profile/edit", label: "اطلاعات شخصی" },
  { href: "/profile/addresses", label: "آدرس‌های من" },
  { href: "/profile/change-password", label: "تغییر رمز عبور" },
  { href: "/orders", label: "سفارش‌های من" },
  { href: "/wishlist", label: "علاقه‌مندی‌ها" },
];

export function ProfileSidebar() {
  return (
    <nav className="w-56 shrink-0 space-y-1">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block px-3 py-2 rounded-[var(--radius)] text-sm hover:bg-[var(--color-muted)] transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}