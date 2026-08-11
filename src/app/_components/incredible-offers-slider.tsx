"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Percent } from "lucide-react";
import type { ProductListItemDTO } from "@/features/catalog/types/product.dto";

interface IncredibleOffersSliderProps {
  title?: string;
  products: ProductListItemDTO[];
  bgColor?: string;
  href?: string;
}

/**
 * چرا از ProductListItemDTO استفاده می‌کنیم، نه Product خام Prisma؟
 * چون این یک Client Component است و طبق قانون DTO/Mapper پروژه، مدل خام
 * دیتابیس هرگز نباید به Client برسه — همون DTOای که در صفحه‌ی اصلی و
 * ProductCard هم استفاده می‌شه، این‌جا هم استفاده می‌کنیم.
 */
export function IncredibleOffersSlider({
  title = "شگفت‌انگیز",
  products,
  bgColor = "bg-red-600",
  href = "/products",
}: IncredibleOffersSliderProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 30, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (num: number) => num.toString().padStart(2, "0");

  if (!products || products.length === 0) return null;

  return (
    <div className={`${bgColor} rounded-2xl p-3 md:p-4 text-white flex flex-col md:flex-row items-stretch gap-3 overflow-hidden shadow-sm`}>
      <div className="flex md:flex-col items-center justify-between md:justify-center p-2 md:w-44 shrink-0 text-center gap-2">
        <div className="flex flex-col items-center gap-1">
          <Percent className="w-10 h-10 md:w-12 md:h-12 stroke-[2.5]" />
          <h3 className="text-lg md:text-xl font-black tracking-tight">{title}</h3>
        </div>

        <div className="flex items-center gap-1 dir-ltr text-xs md:text-sm font-bold my-1">
          <span className="bg-white/20 backdrop-blur-xs px-2 py-1 rounded-md">{formatNum(timeLeft.hours)}</span>:
          <span className="bg-white/20 backdrop-blur-xs px-2 py-1 rounded-md">{formatNum(timeLeft.minutes)}</span>:
          <span className="bg-white/20 backdrop-blur-xs px-2 py-1 rounded-md">{formatNum(timeLeft.seconds)}</span>
        </div>

        <Link
          href={href}
          className="flex items-center gap-1 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
        >
          <span>مشاهده همه</span>
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1 snap-x">
        {products.map((product) => {
          const variant = product.defaultVariant;
          if (!variant) return null; // محصول بدون Variant قابل‌فروش، در این اسلایدر نمایش داده نمی‌شه

          const discountPercent = variant.compareAtPrice
            ? Math.round(((variant.compareAtPrice - variant.price) / variant.compareAtPrice) * 100)
            : 0;

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="bg-white text-gray-900 rounded-xl p-3 w-38 md:w-44 shrink-0 flex flex-col justify-between h-64 snap-start hover:shadow-lg transition-all"
            >
              <div className="relative w-full h-28 mb-2 bg-gray-50 rounded-lg overflow-hidden">
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.name} fill sizes="160px" className="object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">بدون تصویر</div>
                )}
              </div>

              <h4 className="text-xs font-medium text-gray-800 line-clamp-2 leading-relaxed mb-2">
                {product.name}
              </h4>

              <div className="mt-auto">
                <div className="flex items-center justify-between mb-1">
                  {discountPercent > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                      {discountPercent.toLocaleString("fa-IR")}٪
                    </span>
                  )}
                  {variant.compareAtPrice && (
                    <span className="num text-[11px] text-gray-400 line-through mr-auto">
                      {variant.compareAtPrice.toLocaleString("fa-IR")}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-1 font-bold text-gray-900 text-sm">
                  <span className="num">{variant.price.toLocaleString("fa-IR")}</span>
                  <span className="text-[10px] text-gray-500 font-normal">تومان</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}