"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Grid,
  ShoppingCart,
  User,
  X,
  ChevronLeft,
  ChevronDown, // اضافه شد
} from "lucide-react";
import { useCartQuery } from "@/features/shopping/hooks/use-cart-query";
import type { CategoryTreeNodeDTO } from "@/features/catalog/types/category.dto";
import { cn } from "@/shared/utils/cn";

/**
 * تابع کمکی برای تبدیل اعداد انگلیسی به فارسی (سبک دیجی‌کالا)
 */
function toPersianDigits(num: number | string): string {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

// پراپ دسته‌بندی‌ها اضافه شد
interface MobileNavProps {
  categories: CategoryTreeNodeDTO[];
}

export function MobileNav({ categories = [] }: MobileNavProps) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // استیت برای مدیریت باز و بسته بودن آکاردئون دسته‌بندی‌ها در موبایل
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null,
  );

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsDrawerOpen(false);
  }

  const isClient = useIsClient();
  const { data: cart } = useCartQuery();
  const itemCount = cart?.itemCount ?? 0;

  const navItems = [
    { label: "خانه", href: "/", icon: Home },
    {
      label: "دسته‌بندی‌ها",
      onClick: () => setIsDrawerOpen(true),
      icon: Grid,
      isButton: true,
    },
    { label: "سبد خرید", href: "/cart", icon: ShoppingCart, badge: itemCount },
    { label: "حساب من", href: "/profile", icon: User },
  ];

  // تابع تغییر وضعیت آکاردئون
  const toggleAccordion = (id: string) => {
    setExpandedCategoryId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* ================== نوار ناوبری پایین ================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-2 shadow-lg">
        <div className="flex items-center justify-around">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.href ? pathname === item.href : false;

            if (item.isButton) {
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center w-16 py-1 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={index}
                href={item.href!}
                className={cn(
                  "relative flex flex-col items-center justify-center w-16 py-1 transition-colors",
                  isActive
                    ? "text-red-500 font-bold"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 mb-1" />
                  {isClient && item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-extrabold text-white">
                      {item.badge > 99 ? "۹۹+" : toPersianDigits(item.badge)}
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ================== منوی کشویی دسته‌بندی‌ها ================== */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="relative w-[80%] max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* هدر کشو */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-bold text-gray-900 text-sm">
                منوی دسته‌بندی‌ها
              </span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* لینک‌های داخل کشو */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-24">
              <Link
                href="/products"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 text-gray-800 text-xs font-bold hover:bg-gray-100"
                onClick={() => setIsDrawerOpen(false)}
              >
                <span>همه محصولات</span>
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </Link>

              <div className="pt-3 pb-1 text-xs font-bold text-gray-400 px-1">
                دسته‌بندی‌های اصلی
              </div>

              {/* رندر داینامیک دسته‌بندی‌ها */}
              <div className="space-y-1">
                {categories.map((category) => {
                  const hasChildren =
                    category.children && category.children.length > 0;
                  const isExpanded = expandedCategoryId === category.id;

                  return (
                    <div
                      key={category.id}
                      className="rounded-lg overflow-hidden transition-colors"
                    >
                      {/* ردیف دسته‌بندی سطح ۱ */}
                      <div
                        className={cn(
                          "flex items-center justify-between px-3 py-2.5",
                          isExpanded ? "bg-red-50/50" : "hover:bg-gray-50",
                        )}
                      >
                        <Link
                          href={`/${category.slug}`}
                          className="flex-1 text-sm font-medium text-gray-700"
                          onClick={() => setIsDrawerOpen(false)}
                        >
                          {category.name}
                        </Link>

                        {/* دکمه باز و بسته کردن زیردسته‌ها */}
                        {hasChildren && (
                          <button
                            onClick={() => toggleAccordion(category.id)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <ChevronDown
                              className={cn(
                                "w-4 h-4 transition-transform duration-200",
                                isExpanded ? "rotate-180 text-red-500" : "",
                              )}
                            />
                          </button>
                        )}
                      </div>

                      {/* زیردسته‌ها (سطح ۲) */}
                      {hasChildren && isExpanded && (
                        <div className="bg-gray-50/50 px-4 py-2 border-l-2 border-red-200 ml-2 mr-2 mb-2 space-y-3 rounded-l-lg animate-in slide-in-from-top-2 fade-in duration-200">
                          {category.children?.map((subCategory) => (
                            <div
                              key={subCategory.id}
                              className="flex flex-col space-y-2"
                            >
                              <Link
                                href={`/${subCategory.slug}`}
                                className="text-xs font-bold text-gray-800 hover:text-red-500"
                                onClick={() => setIsDrawerOpen(false)}
                              >
                                {subCategory.name}
                              </Link>

                              {/* زیردسته‌ها (سطح ۳ - در صورت وجود) */}
                              {subCategory.children &&
                                subCategory.children.length > 0 && (
                                  <div className="flex flex-col space-y-2 pr-2 border-r border-gray-200 mr-1 mt-1">
                                    {subCategory.children.map((child) => (
                                      <Link
                                        key={child.id}
                                        href={`/${child.slug}`}
                                        className="text-[11px] text-gray-500 hover:text-red-500"
                                        onClick={() => setIsDrawerOpen(false)}
                                      >
                                        {child.name}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
