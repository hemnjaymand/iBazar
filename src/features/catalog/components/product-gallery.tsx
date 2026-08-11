"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImageDTO } from "../types/product-image.dto";

interface ProductGalleryProps {
  images?: ProductImageDTO[];
}

export function ProductGallery({ images = [] }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // بررسی عدم وجود عکس یا خالی بودن آرایه
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-[var(--radius)] bg-[var(--color-muted)] flex items-center justify-center">
        <span className="text-sm text-[var(--color-muted-foreground)]">بدون تصویر</span>
      </div>
    );
  }

  const active = images[activeIndex] ?? images[0];

  return (
    <div>
      {/* عکس اصلی محصول - دارای priority برای بهبود LCP */}
      <div className="relative aspect-square rounded-[var(--radius)] bg-[var(--color-muted)] overflow-hidden mb-3">
        <Image
          src={active.url}
          alt={active.altText ?? "تصویر محصول"}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* گالری بندانگشتی (Thumbnails) */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id ?? i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-pressed={i === activeIndex}
              className={`relative w-16 h-16 shrink-0 rounded-[calc(var(--radius)*0.6)] overflow-hidden border-2 transition-colors ${
                i === activeIndex
                  ? "border-[var(--color-primary)]"
                  : "border-transparent hover:border-[var(--color-muted-foreground)]"
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText ?? ""}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}