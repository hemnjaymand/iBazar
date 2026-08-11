"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft, Menu } from "lucide-react";
import type { CategoryTreeNodeDTO } from "../types";
import { cn } from "@/shared/utils/cn";

interface CategoryDropdownProps {
  categories: CategoryTreeNodeDTO[];
}

export function CategoryDropdown({ categories }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    categories[0]?.id || null
  );

  if (categories.length === 0) {
    return null;
  }

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  return (
    <div
      className="relative group hidden lg:block h-full"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* دکمه اصلی دسته‌بندی‌ها */}
      <button
        className="relative flex items-center gap-2 h-full text-gray-800 font-bold hover:text-primary transition-colors py-3 px-2 cursor-pointer select-none"
        aria-expanded={isOpen}
      >
        <Menu className="h-5 w-5 text-gray-800 group-hover:text-primary transition-colors" />
        <span className="text-sm">دسته‌بندی کالاها</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:text-primary",
            isOpen && "rotate-180"
          )}
        />

        {/* انیمیشن خط پایینی متحرک با هاور */}
        <span className="absolute bottom-0 right-0 w-0 h-[3px] bg-primary transition-all duration-300 group-hover:w-full rounded-t-full" />
      </button>

      {/* مگامنو دسکتاپ - کامل و راست‌چین */}
      <div
        className={cn(
          "absolute top-full right-[-24px] xl:right-[-32px] w-[calc(100vw-48px)] xl:w-[calc(100vw-64px)] max-w-[1400px] h-[520px] bg-white border border-gray-100 rounded-b-2xl shadow-2xl z-50 flex transition-all duration-200 origin-top-right",
          isOpen
            ? "visible opacity-100 translate-y-0"
            : "invisible opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        {/* بخش سمت راست: لیست دسته‌بندی‌های اصلی (سطح یک) */}
        <div className="w-[260px] shrink-0 border-e border-gray-100 bg-gray-50/60 py-3 overflow-y-auto scrollbar-thin">
          {categories.map((category) => {
            const isActive = activeCategoryId === category.id;
            return (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => setActiveCategoryId(category.id)}
              >
                <Link
                  href={`/${category.slug}`}
                  className={cn(
                    "flex items-center justify-between px-5 py-3.5 text-sm font-medium transition-all duration-150 rounded-s-xl my-0.5 ms-2",
                    isActive
                      ? "bg-white text-primary font-bold shadow-xs"
                      : "text-gray-700 hover:text-gray-950 hover:bg-gray-100/80"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {/* هایلایتر قرمز سمت راست (RTL Start) */}
                  <span
                    className={cn(
                      "absolute right-0 top-1 bottom-1 w-[3.5px] bg-primary transition-all rounded-l-full",
                      isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50"
                    )}
                  />

                  <span className="truncate">{category.name}</span>

                  {/* فلش اشاره به چپ در حالت RTL */}
                  <ChevronLeft
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-gray-300"
                    )}
                  />
                </Link>
              </div>
            );
          })}
        </div>

        {/* بخش سمت چپ: زیر‌دسته‌ها (سطح دو و سه) */}
        <div className="flex-1 p-7 overflow-y-auto">
          {activeCategory && (
            <div>
              {/* لینک مشاهده همه محصولات دسته فعال */}
              <Link
                href={`/${activeCategory.slug}`}
                className="inline-flex items-center gap-1.5 text-primary text-xs sm:text-sm font-bold mb-6 hover:underline group/link"
                onClick={() => setIsOpen(false)}
              >
                <span>همه دسته‌بندی‌های {activeCategory.name}</span>
                <ChevronLeft className="h-4 w-4 transition-transform group-hover/link:-translate-x-1" />
              </Link>

              {/* گرید زیر‌دسته‌ها */}
              <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-7">
                {activeCategory.children?.map((subCategory) => (
                  <div key={subCategory.id} className="space-y-3">
                    {/* دسته‌بندی سطح دو (عنوان پررنگ با خط عمودی راست) */}
                    <Link
                      href={`/${subCategory.slug}`}
                      className="block text-sm font-bold text-gray-900 border-r-2 border-primary ps-2.5 py-0.5 hover:text-primary transition-colors truncate"
                      onClick={() => setIsOpen(false)}
                    >
                      {subCategory.name}
                    </Link>

                    {/* دسته‌بندی سطح سه (لیست گزینه‌ها) */}
                    <div className="space-y-2 ps-2.5">
                      {subCategory.children?.map((child) => (
                        <Link
                          key={child.id}
                          href={`/${child.slug}`}
                          className="block text-xs text-gray-600 hover:text-primary transition-colors truncate leading-relaxed"
                          onClick={() => setIsOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}