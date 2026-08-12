"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "دشبورد" },
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

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  function closeSidebar() {
    setOpen(false);
  }

  return (
    <>
      {/* =========================================================
          MOBILE MENU BUTTON
      ========================================================= */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="باز کردن منوی مدیریت"
        aria-expanded={open}
        className="
          fixed left-4 top-4 z-40
          flex h-10 w-10
          items-center justify-center
          rounded-xl
          border border-[var(--color-border)]
          bg-[var(--color-card)]
          text-[var(--color-foreground)]
          shadow-sm
          transition-colors
          hover:bg-[var(--color-muted)]
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--color-primary)]
          lg:hidden
        "
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* =========================================================
          MOBILE OVERLAY
      ========================================================= */}
      {open && (
        <button
          type="button"
          aria-label="بستن منوی مدیریت"
          onClick={closeSidebar}
          className="
            fixed inset-0 z-40
            bg-black/40
            lg:hidden
          "
        />
      )}

      {/* =========================================================
          SIDEBAR
      ========================================================= */}
      <aside
        className={`
          fixed right-0 top-0 z-50
          flex h-screen w-64
          flex-col
          border-l border-[var(--color-border)]
          bg-[var(--color-card)]
          shadow-xl
          transition-transform duration-300
          lg:translate-x-0
          lg:shadow-none

          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* =======================================================
            SIDEBAR HEADER
        ======================================================= */}
        <div
          className="
            flex h-16
            shrink-0
            items-center
            justify-between
            border-b border-[var(--color-border)]
            px-4
          "
        >
          <div>
            <p className="text-sm font-bold text-[var(--color-foreground)]">
              پنل مدیریت
            </p>

            <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
              مدیریت فروشگاه
            </p>
          </div>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="بستن منوی مدیریت"
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              text-gray-500
              transition-colors
              hover:bg-[var(--color-muted)]
              hover:text-gray-900
              lg:hidden
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* =======================================================
            NAVIGATION
        ======================================================= */}
        <nav aria-label="منوی مدیریت" className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className="
                  block
                  rounded-[var(--radius)]
                  px-3 py-2.5
                  text-sm
                  text-[var(--color-foreground)]
                  transition-colors
                  hover:bg-[var(--color-muted)]
                  focus:bg-[var(--color-muted)]
                  focus:outline-none
                "
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
