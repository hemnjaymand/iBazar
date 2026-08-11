import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Flame } from "lucide-react";
import type { ProductListItemDTO } from "@/features/catalog/types/product.dto";

interface BestSellersGridProps {
  products: ProductListItemDTO[];
}

// این کامپوننت "use client" نداره — طبق قانون Server-First، چون هیچ
// تعاملی نداره (فقط لینک‌های ساده)، همون‌طور Server می‌مونه؛ نسخه‌ی قبلی
// شما هم همین‌طور بود، فقط تایپش عوض شد.
export function BestSellersGrid({ products }: BestSellersGridProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl p-4 md:p-6 shadow-xs border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          <h2 className="text-base md:text-lg font-bold text-gray-900">پرفروش‌ترین کالاها</h2>
        </div>
        <Link
          href="/search?sort=bestselling"
          className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
        >
          <span>مشاهده همه</span>
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-rows-3 grid-flow-col auto-cols-[260px] md:auto-cols-[300px] gap-x-6 gap-y-4 overflow-x-auto no-scrollbar pb-2">
        {products.map((product, index) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <span className="num text-lg font-extrabold text-red-500 min-w-[20px] text-center">
              {(index + 1).toLocaleString("fa-IR")}
            </span>

            <div className="relative w-16 h-16 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="64px"
                  className="object-contain group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400">بدون تصویر</div>
              )}
            </div>

            <h3 className="text-xs font-medium text-gray-800 line-clamp-2 leading-relaxed border-b border-gray-100 pb-2 w-full">
              {product.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}