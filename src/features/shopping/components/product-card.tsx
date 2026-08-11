import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/shared/ui/badge";
import { AddToCartButton } from "@/features/shopping/components/add-to-cart-button";
import type { ProductListItemDTO } from "@/features/catalog/types/product.dto";

export function ProductCard({ product }: { product: ProductListItemDTO }) {
  const { defaultVariant } = product;

  // اگر واریانت پیش‌فرضی وجود نداشت، کارت رندر نمی‌شود
  if (!defaultVariant) {
    return null;
  }

  const price = defaultVariant.price;
  const compareAtPrice = defaultVariant.compareAtPrice;
  const discountPercent =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const isOutOfStock = defaultVariant.inventory <= 0;
  const imageUrl = product.imageUrl || defaultVariant.imageUrl;
  console.log("PRODUCT IMAGE:", {
    productImage: product.imageUrl,
    variantImage: defaultVariant.imageUrl,
    finalImage: imageUrl,
  });
  return (
    <article className="group flex flex-col h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[var(--color-primary)]/40 hover:-translate-y-1.5">
      {/* لینک اصلی محصول (تصویر و عنوان) */}
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col flex-1 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-t-2xl"
        title={product.name}
      >
        {/* بخش تصویر محصول با افکت زوم نرم */}
        <div className="aspect-square rounded-xl bg-[var(--color-muted)]/50 border border-[var(--color-border)]/60 relative flex items-center justify-center overflow-hidden mb-4 shrink-0 shadow-inner">
          {/* لیبل ناموجود با افکت شیشه‌ای */}
          {isOutOfStock && (
            <div className="absolute top-2.5 right-2.5 z-10">
              <Badge
                variant="outOfStock"
                className="bg-background/80 backdrop-blur-md text-[var(--color-muted-foreground)] border border-[var(--color-border)] text-[11px] font-bold px-2.5 py-1 shadow-sm"
              >
                ناموجود
              </Badge>
            </div>
          )}

          {/* بج تخفیف روی تصویر */}
          {!isOutOfStock && discountPercent && (
            <div className="absolute top-2.5 right-2.5 z-10">
              <span className="num bg-red-600 text-white font-bold text-xs px-2 py-0.5 rounded-lg shadow-md">
                {discountPercent.toLocaleString("fa-IR")}٪-
              </span>
            </div>
          )}

          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <span className="text-xs text-[var(--color-muted-foreground)] font-medium select-none">
              بدون تصویر
            </span>
          )}
        </div>

        {/* بخش اطلاعات و عنوان محصول */}
        <div className="flex flex-col flex-1 space-y-2">
          <h3 className="text-sm font-semibold leading-6 text-[var(--color-foreground)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
            {product.name}
          </h3>

          {/* بخش قیمت‌ها (چسبیده به پایین کارت) */}
          <div className="mt-auto pt-3 flex flex-col gap-1">
            {isOutOfStock ? (
              <div className="flex items-center justify-between h-[46px] px-2 bg-[var(--color-muted)]/40 rounded-xl">
                <span className="text-xs text-[var(--color-muted-foreground)] font-medium">
                  وضعیت
                </span>
                <span className="text-xs font-bold text-[var(--color-muted-foreground)]">
                  به زودی...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-end gap-1 bg-[var(--color-background)]/60 p-2.5 rounded-xl border border-[var(--color-border)]/40">
                {/* ردیف قیمت خط‌خورده */}
                <div className="flex items-center justify-between w-full min-h-[20px]">
                  <span className="text-[10px] text-[var(--color-muted-foreground)] font-medium">
                    قیمت مصرف‌کننده
                  </span>
                  {compareAtPrice && compareAtPrice > price ? (
                    <span className="num text-xs text-[var(--color-muted-foreground)] line-through decoration-red-500/60">
                      {compareAtPrice.toLocaleString("fa-IR")}
                    </span>
                  ) : (
                    <span className="text-[10px] text-transparent select-none">
                      -
                    </span>
                  )}
                </div>

                {/* ردیف قیمت نهایی */}
                <div className="flex items-baseline justify-between w-full">
                  <span className="text-[10px] text-[var(--color-muted-foreground)]">
                    قیمت آی بازار:
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="num text-base font-bold text-[var(--color-foreground)]">
                      {price.toLocaleString("fa-IR")}
                    </span>
                    <span className="text-[10px] text-[var(--color-muted-foreground)] font-medium">
                      تومان
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* بخش دکمه افزودن به سبد خرید (ایزوله از لینک اصلی) */}
      <div className="p-4 pt-0 mt-auto relative z-10">
        <AddToCartButton
          variantId={defaultVariant.id}
          disabled={isOutOfStock}
          className="w-full font-bold shadow-sm transition-all active:scale-95"
        />
      </div>
    </article>
  );
}
