import Link from "next/link";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "داشبورد" },
  { href: "/admin/users", label: "کاربران" },
  { href: "/admin/products", label: "محصولات" },
  { href: "/admin/categories", label: "دسته‌بندی‌ها" },
  { href: "/admin/brands", label: "برندها" },
  { href: "/admin/attributes", label: "ویژگی‌ها" },
  { href: "/admin/inventory", label: "موجودی" },
  { href: "/admin/orders", label: "سفارش‌ها" },
  { href: "/admin/coupons", label: "کدهای تخفیف" },
  { href: "/admin/content/banners", label: "بنرها" },
  { href: "/admin/content/pages", label: "صفحات ثابت" },
  { href: "/admin/settings", label: "تنظیمات" },
  { href: "/admin/settings/logo", label: "لوگو" },
];

/**
 * این کامپوننت Server است — هیچ تعاملی نداره جز لینک‌های ساده. فعال بودن
 * لینک جاری هم بدون هیچ Client State قابل انجامه (در فاز بعد اگه خواستید
 * highlight کردن مسیر فعال رو هم اضافه می‌کنیم؛ فعلاً برای سادگی نداره).
 */
export function AdminSidebar() {
  return (
    <nav className="w-56 shrink-0 space-y-1 p-4 border-l border-[var(--color-border)]">
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
