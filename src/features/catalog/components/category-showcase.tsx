import Link from 'next/link';
import Image from 'next/image';

import { getCategoryUrl } from '@/shared/utils/category-url';
import { Category } from '@prisma/client/client';

type CategoryWithOptionalImage = Category & {
  imageUrl?: string | null;
  icon?: string | null;
};

interface CategoryShowcaseProps {
  categories: CategoryWithOptionalImage[];
}
// console.log(Cate);
export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  // console.log('Categories Data in UI:', JSON.stringify(categories, null, 2));
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-4">
      <div
        className="
          flex
          flex-nowrap
          items-start
          gap-4
          overflow-x-auto
          pb-3
          pt-1
          no-scrollbar
          scroll-smooth
          snap-x
    
        "
      >
        {categories.map((category) => {
          const hasImage = category.imageUrl && category.imageUrl.trim() !== '';

          return (
            <Link
              key={category.id}
              href={getCategoryUrl(category)}
              className="
                group
                flex
                w-20
                shrink-0
                flex-col
                items-center
                snap-start
                transition-transform
                active:scale-95

                sm:w-24
              "
            >
              <div
                className="
                  relative
                  mb-2
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  border
                  border-gray-100
                  bg-gray-50
                  shadow-xs
                  transition-all
                  duration-300
                  group-hover:shadow-md
                  group-hover:ring-2
                  group-hover:ring-red-500/20

                  sm:h-20
                  sm:w-20
                "
              >
                {hasImage ? (
                  <Image
                    src={category.imageUrl!}
                    alt={category.name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 80px, 96px"
                    className="
                      object-cover
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      w-full
                      flex-col
                      items-center
                      justify-center
                      bg-gradient-to-br
                      from-red-50
                      via-rose-50
                      to-red-100
                      text-center
                      text-[10px]
                      font-bold
                      text-red-600
                      transition-transform
                      duration-300
                      group-hover:scale-110
                      px-1
                      leading-tight
                      sm:text-xs
                    "
                  >
                    {category.name}
                  </div>
                )}
              </div>

              <span
                className="
                  max-w-[85px]
                  text-center
                  text-[11px]
                  font-semibold
                  leading-tight
                  text-gray-700
                  transition-colors
                  line-clamp-2
                  group-hover:text-red-600

                  sm:max-w-[100px]
                  sm:text-xs
                "
              >
                {category.name}
              </span>
            </Link>
          );
        })}

        {/* دکمه بیشتر */}
        <div className="shrink-0">
          <Link
            href="/search"
            className="
              group
              flex
              w-20
              cursor-pointer
              select-none
              flex-col
              items-center
              justify-center
              text-center
              sm:w-24
            "
          >
            <div
              className="
                mb-2
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                border
                border-gray-100
                bg-gray-200
                shadow-xs
                transition-all
                duration-300
                group-hover:shadow-md
                group-hover:ring-2
                group-hover:ring-red-500/20

                sm:h-20
                sm:w-20
              "
            >
              <span className="font-extrabold text-gray-600">...</span>
            </div>

            <span
              className="
                text-xs
                font-bold
                text-gray-700
                transition-colors
                group-hover:text-red-600

                sm:text-sm
              "
            >
              بیشتر
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
