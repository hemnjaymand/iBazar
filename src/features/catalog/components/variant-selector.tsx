"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/shared/ui/badge";
import { AddToCartButton } from "@/features/shopping/components/add-to-cart-button";
import type { VariantResponseDTO } from "../types/variant.dto";

/**
 * منطق این کامپوننت:
 * ۱. از روی همه‌ی Variantهای محصول، لیست یکتای هر Attribute (مثلاً "رنگ")
 *    و مقادیرش (قرمز/آبی/مشکی) رو استخراج می‌کنیم.
 * ۲. کاربر برای هر Attribute یک مقدار انتخاب می‌کنه (state محلی، چون فقط
 *    همین کامپوننت و AddToCartButton زیرش بهش نیاز دارن — نیازی به Zustand نیست).
 * ۳. با ترکیب انتخاب‌های کاربر، Variant متناظر رو پیدا می‌کنیم و قیمت/موجودی
 *    رو بر همون اساس نشون می‌دیم.
 */
export function VariantSelector({ variants }: { variants: VariantResponseDTO[] }) {
  const defaultVariant = variants.find((v) => v.isDefault) ?? variants[0];

  // استخراج Attributeهای یکتا از روی همه‌ی Variantها
  const attributeGroups = useMemo(() => {
    const map = new Map<string, Map<string, string>>(); // attributeName -> (valueId -> value)
    for (const variant of variants) {
      for (const attr of variant.attributes) {
        if (!map.has(attr.attributeName)) map.set(attr.attributeName, new Map());
        map.get(attr.attributeName)!.set(attr.valueId, attr.value);
      }
    }
    return Array.from(map.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values.entries()).map(([valueId, value]) => ({ valueId, value })),
    }));
  }, [variants]);

  // انتخاب اولیه: مقادیر همون Default Variant
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const attr of defaultVariant.attributes) {
      initial[attr.attributeName] = attr.valueId;
    }
    return initial;
  });

  // پیدا کردن Variantی که دقیقاً با تمام انتخاب‌های فعلی کاربر مطابقت داره
  const selectedVariant = useMemo(() => {
    return (
      variants.find((v) =>
        v.attributes.every((attr) => selected[attr.attributeName] === attr.valueId)
      ) ?? defaultVariant
    );
  }, [variants, selected, defaultVariant]);

  const price = parseFloat(selectedVariant.price);
  const compareAtPrice = selectedVariant.compareAtPrice ? parseFloat(selectedVariant.compareAtPrice) : null;
  const isOutOfStock = selectedVariant.stock <= 0;

  // اگر محصول اصلاً Attribute نداره (محصول ساده با فقط Default Variant)،
  // نیازی به نمایش دکمه‌های انتخاب نیست
  if (attributeGroups.length === 0) {
    return (
      <div className="space-y-4">
        <PriceDisplay price={price} compareAtPrice={compareAtPrice} />
        <AddToCartButton variantId={selectedVariant.id} disabled={isOutOfStock} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {attributeGroups.map((group) => (
        <div key={group.name}>
          <p className="text-sm font-medium mb-2">{group.name}</p>
          <div className="flex flex-wrap gap-2">
            {group.values.map((v) => {
              const isActive = selected[group.name] === v.valueId;
              return (
                <button
                  key={v.valueId}
                  type="button"
                  onClick={() => setSelected((prev) => ({ ...prev, [group.name]: v.valueId }))}
                  aria-pressed={isActive}
                  aria-label={`${group.name}: ${v.value}`}
                  className={`h-10 min-w-[3rem] px-3 rounded-[var(--radius)] border text-sm transition-colors ${
                    isActive
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                      : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)]"
                  }`}
                >
                  {v.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <PriceDisplay price={price} compareAtPrice={compareAtPrice} />

      {isOutOfStock ? (
        <Badge variant="outOfStock">این ترکیب فعلاً ناموجود است</Badge>
      ) : (
        <AddToCartButton variantId={selectedVariant.id} />
      )}
    </div>
  );
}

function PriceDisplay({ price, compareAtPrice }: { price: number; compareAtPrice: number | null }) {
  return (
    <div className="flex items-baseline gap-2">
      {compareAtPrice && (
        <span className="num text-sm text-[var(--color-muted-foreground)] line-through">
          {compareAtPrice?.toLocaleString("fa-IR")}
        </span>
      )}
      <span className="num text-2xl font-bold">
        {price.toLocaleString("fa-IR")} <span className="text-sm font-normal">تومان</span>
      </span>
    </div>
  );
}