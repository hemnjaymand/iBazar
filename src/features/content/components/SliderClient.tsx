"use client";

import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import type { Slide } from "../types/slide.dto";
import { cn } from "@/shared/utils/cn";

export default function SliderClients({ slides }: { slides: Slide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: slides.length > 1,
    duration: 25,
    skipSnaps: false,
    direction: "rtl",
    align: "start",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const handleImageError = useCallback((slideId: string) => {
    setImageErrors((prev) => ({ ...prev, [slideId]: true }));
  }, []);

  const hasValidImage = (slide: Slide) => {
    if (imageErrors[slide.id]) return false;
    if (!slide.imageUrl) return false;
    if (typeof slide.imageUrl !== "string") return false;
    if (slide.imageUrl.trim() === "") return false;
    return true;
  };

  useEffect(() => {
    if (!emblaApi) return;

    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("init", onInit);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onInit);

    let autoplay: NodeJS.Timeout | null = null;

    if (slides.length > 1) {
      const startAutoplay = () => {
        if (autoplay) clearInterval(autoplay);
        autoplay = setInterval(() => {
          emblaApi.scrollNext();
        }, 5500);
      };
      const stopAutoplay = () => {
        if (autoplay) {
          clearInterval(autoplay);
          autoplay = null;
        }
      };

      startAutoplay();

      const sliderElement = emblaApi.containerNode()?.parentElement;
      if (sliderElement) {
        sliderElement.addEventListener("mouseenter", stopAutoplay);
        sliderElement.addEventListener("mouseleave", startAutoplay);
      }

      return () => {
        if (autoplay) clearInterval(autoplay);
        emblaApi.off("init", onInit);
        emblaApi.off("select", onSelect);
        emblaApi.off("reInit", onInit);
        if (sliderElement) {
          sliderElement.removeEventListener("mouseenter", stopAutoplay);
          sliderElement.removeEventListener("mouseleave", startAutoplay);
        }
      };
    }
  }, [emblaApi, slides.length]);

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl shadow-md bg-gray-100">
      {/* کانتینر اصلی اسلایدر */}
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => {
            const hasImage = hasValidImage(slide);
            const isSvg =
              slide.imageUrl?.includes("svg") ||
              slide.imageUrl?.includes("placehold.co");

            return (
              <div
                key={slide.id}
                className="
    relative
    h-52
    sm:h-72
    md:h-[420px]
    min-w-0
    flex-[0_0_100%]
    w-full
    shrink-0
    bg-[var(--color-muted)]
  "
              >
                <div className="absolute inset-0 flex h-full w-full items-center justify-center">
                  {hasImage ? (
                    <>
                      <Image
                        src={slide.imageUrl!}
                        alt={slide.title || "بنر فروشگاه"}
                        fill
                        sizes="100vw"
                        priority={index === 0}
                        unoptimized={isSvg}
                        className="object-contain object-center"
                        onError={() => handleImageError(slide.id)}
                      />

                      {/* Overlay فقط در صورت وجود متن */}
                      {(slide.title || slide.subtitle || slide.ctaLink) && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                      )}

                      {(slide.title || slide.subtitle || slide.ctaLink) && (
                        <div
                          className="
              absolute
              inset-x-0
              bottom-0
              z-10
              max-w-2xl
              p-5
              sm:p-7
              md:p-12
              text-white
            "
                        >
                          {slide.title && (
                            <h2 className="text-xl font-extrabold leading-tight drop-shadow-md sm:text-3xl md:text-4xl">
                              {slide.title}
                            </h2>
                          )}

                          {slide.subtitle && (
                            <p className="mt-2 line-clamp-2 text-xs text-white/90 drop-shadow sm:text-sm md:text-base">
                              {slide.subtitle}
                            </p>
                          )}

                          {slide.ctaLink && (
                            <div className="mt-4">
                              <Link
                                href={slide.ctaLink}
                                className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-primary
                    px-5
                    py-2.5
                    text-xs
                    font-bold
                    text-white
                    shadow-lg
                    transition-all
                    hover:scale-105
                    hover:bg-primary/90
                    active:scale-95
                    md:text-sm
                  "
                              >
                                <span>{slide.ctaText || "مشاهده کالاها"}</span>
                                <ArrowLeft className="h-4 w-4" />
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    /* حالت Fallback گرادینت */
                    <div className="relative w-full h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-between px-8 md:px-16 overflow-hidden">
                      <div className="absolute -right-10 -bottom-10 w-60 h-60 md:w-96 md:h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="absolute left-1/3 -top-20 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none" />

                      <div className="relative z-10 max-w-xl text-white space-y-2 md:space-y-4">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-[10px] md:text-xs font-bold rounded-full">
                          پیشنهاد ویژه
                        </span>
                        <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
                          {slide.title || "پیشنهادهای شگفت‌انگیز روز"}
                        </h2>
                        {slide.subtitle && (
                          <p className="text-xs sm:text-sm md:text-base text-white/90">
                            {slide.subtitle}
                          </p>
                        )}
                        {slide.ctaLink && (
                          <div className="pt-2">
                            <Link
                              href={slide.ctaLink}
                              className="inline-flex items-center gap-2 bg-white text-indigo-600 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold shadow-lg hover:bg-gray-50 transition-all hover:scale-105 active:scale-95"
                            >
                              <span>{slide.ctaText || "مشاهده کالاها"}</span>
                              <ArrowLeft className="w-4 h-4" />
                            </Link>
                          </div>
                        )}
                      </div>

                      <div className="hidden sm:flex relative z-10 items-center justify-center w-28 h-28 md:w-44 md:h-44 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-inner">
                        <ShoppingBag className="w-14 h-14 md:w-20 md:h-20 text-white/80" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* دکمه‌های ناوبری چپ و راست */}
      {slides.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-sm p-2.5 text-gray-700 shadow-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 z-20"
            aria-label="اسلاید قبلی"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-sm p-2.5 text-gray-700 shadow-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 z-20"
            aria-label="اسلاید بعدی"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* نشانگرهای پایین (Dots) */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 z-20 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "transition-all duration-300 rounded-full",
                index === selectedIndex
                  ? "h-2 w-6 bg-white"
                  : "h-2 w-2 bg-white/50 hover:bg-white/80",
              )}
              aria-label={`رفتن به اسلاید ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
