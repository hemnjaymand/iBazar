'use client';

import Link from "next/link";

import type { WishlistItemDTO } from "@/features/shopping/types/wishlist.dto";
import { cn } from "@/shared/utils/cn";

interface WishlistGridProps {
  items: WishlistItemDTO[]; // ✅ تغییر نوع به WishlistItemDTO
  onRemove?: (id: string) => void;
  className?: string;
}

export function WishlistGrid({ items, onRemove, className = "" }: WishlistGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">لیست علاقه‌مندی‌های شما خالی است</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
        className
      )}
    >
      {items.map((item) => {
        const price = parseFloat(item.defaultVariantPrice);
        const formattedPrice = !isNaN(price)
          ? price.toLocaleString("fa-IR")
          : item.defaultVariantPrice;

        return (
          <div
            key={item.id}
            className="group relative rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md"
          >
            <Link href={`/products/${item.productSlug}`} className="block">
              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {item.productName}
              </h3>
              <div className="mt-2 text-sm font-bold text-foreground">
                {formattedPrice}
                <span className="text-xs font-normal text-muted-foreground mr-1">تومان</span>
              </div>
            </Link>

            <button
              onClick={() => onRemove?.(item.id)}
              className="absolute top-2 left-2 p-1.5 rounded-full bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 focus:opacity-100"
              aria-label="حذف از علاقه‌مندی‌ها"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}