"use client";

import { useState } from "react";
import type { BannerDTO } from "../types/banner.dto";

export function HeroCarousel({ banners }: { banners: BannerDTO[] }) {
  const [index, setIndex] = useState(0);

  if (banners.length === 0) return null;
  const active = banners[index];

  return (
    <div className="relative rounded-[var(--radius)] overflow-hidden aspect-[21/9] sm:aspect-[3/1] bg-[var(--color-muted)]">
      <a href={active.linkUrl ?? "#"} className="block w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={active.imageUrl} alt={active.title} className="w-full h-full object-cover" />
      </a>

      {banners.length > 1 && (
        <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
          {banners.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setIndex(i)}
              aria-label={`اسلاید ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}