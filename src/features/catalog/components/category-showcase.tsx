import Link from "next/link";
import Image from "next/image";
import type { Category } from "@prisma/client";
import { getCategoryUrl } from "@/shared/utils/category-url";

type CategoryWithOptionalImage = Category & {
  imageUrl?: string | null;
  icon?: string | null;
};

interface CategoryShowcaseProps {
  categories: CategoryWithOptionalImage[];
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-4">
      {/* در موبایل: اسکرول افقی / در دسکتاپ: گرید انعطاف‌پذیر و مرتب */}
      <div className="flex items-start gap-4 md:gap-6 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth snap-x md:grid md:grid-cols-6 lg:grid-cols-8 md:overflow-visible md:justify-items-center">
        {categories.map((category) => {
          const hasImage = category.imageUrl && category.imageUrl.trim() !== "";

          return (
            <Link
              key={category.id}
              href={getCategoryUrl(category)}
              className="group flex flex-col items-center shrink-0 w-20 sm:w-24 md:w-full snap-start transition-transform active:scale-95"
            >
              {/* دایره تصویر/آیکون دسته‌بندی با افکت Hover دیجی‌کالایی */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center mb-2 shadow-xs group-hover:shadow-md group-hover:ring-2 group-hover:ring-red-500/20 transition-all duration-300 border border-gray-100">
                {hasImage ? (
                  <Image
                    src={category.imageUrl!}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 80px, 96px"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  /* Fallback گرافیکی در صورت عدم وجود تصویر */
                  <div className="w-full h-full bg-gradient-to-br from-red-50 via-rose-50 to-red-100 flex items-center justify-center text-red-600 font-black text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300 select-none">
                    {category.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* عنوان دسته‌بندی */}
              <span className="text-[11px] sm:text-xs font-semibold text-gray-700 text-center line-clamp-2 leading-tight group-hover:text-red-600 transition-colors max-w-[85px] sm:max-w-[100px]">
                {category.name}
              </span>
            </Link>
          );
        })}
        <div>
          <Link
            href="/search"
            className="group flex flex-col items-center justify-center text-center cursor-pointer select-none"
          >
            {/* دایره آیکون */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2 shadow-xs group-hover:shadow-md group-hover:ring-2 group-hover:ring-red-500/20 transition-all duration-300 border border-gray-100">
              {/* <ArrowLeft className="w-5 h-5 text-red-600 transition-transform duration-300 group-hover:-translate-x-1" /> */}
                  <span className="font-extrabold text-gray-600">...</span>
            </div>
            {/* متن بیشتر */}
            <span className="text-xs sm:text-sm font-bold text-gray-700 group-hover:text-red-600 transition-colors">
              بیشتر
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
