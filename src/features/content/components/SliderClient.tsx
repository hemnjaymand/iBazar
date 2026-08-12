'use client';

import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react';
import type { Slide } from '../types/slide.dto';
import { cn } from '@/shared/utils/cn';

export default function SliderClients({ slides }: { slides: Slide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: slides.length > 1,
    duration: 25,
    skipSnaps: false,
    direction: 'rtl',
    align: 'center',
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  const handleImageError = useCallback((slideId: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [slideId]: true,
    }));
  }, []);

  const hasValidImage = (slide: Slide) => {
    if (imageErrors[slide.id]) return false;
    if (!slide.imageUrl) return false;
    if (typeof slide.imageUrl !== 'string') return false;
    if (slide.imageUrl.trim() === '') return false;

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

    emblaApi.on('init', onInit);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onInit);

    let autoplay: ReturnType<typeof setInterval> | null = null;

    if (slides.length > 1) {
      const startAutoplay = () => {
        if (autoplay) {
          clearInterval(autoplay);
        }

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
        sliderElement.addEventListener('mouseenter', stopAutoplay);
        sliderElement.addEventListener('mouseleave', startAutoplay);
      }

      return () => {
        if (autoplay) {
          clearInterval(autoplay);
        }

        emblaApi.off('init', onInit);
        emblaApi.off('select', onSelect);
        emblaApi.off('reInit', onInit);

        if (sliderElement) {
          sliderElement.removeEventListener('mouseenter', stopAutoplay);
          sliderElement.removeEventListener('mouseleave', startAutoplay);
        }
      };
    }

    return () => {
      emblaApi.off('init', onInit);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onInit);
    };
  }, [emblaApi, slides.length]);

  return (
    <div className="group relative w-full overflow-visible md:overflow-hidden md:rounded-none">
      {/* Slider viewport */}
      <div
        className="overflow-hidden px-4 sm:px-6 md:px-8 lg:px-0"
        ref={emblaRef}
      >
        <div className="flex gap-1 md:gap-4">
          {slides.map((slide, index) => {
            const hasImage = hasValidImage(slide);

            const isSvg =
              slide.imageUrl?.includes('svg') ||
              slide.imageUrl?.includes('placehold.co');

            return (
              <div
                key={slide.id}
                className="
                 relative
                 h-52
                 sm:h-72
                 md:h-[420px]
                 min-w-0
                 shrink-0
                 basis-[92%]
                 sm:basis-[90%]
                 md:basis-[94%]
                 lg:basis-full
                 px-1.5
                 sm:px-2
                 md:px-2
                                lg:px-0
               "
              >
                <div
                  className="
                     relative
                     h-full
                     w-full
                     overflow-hidden
                     rounded-2xl
                     lg:rounded-none
                     bg-[var(--color-muted)]
                   "
                >
                  {hasImage ? (
                    <>
                      <Image
                        src={slide.imageUrl!}
                        alt={slide.title || 'بنر فروشگاه'}
                        fill
                        sizes="100vw"
                        priority={index === 0}
                        unoptimized={isSvg}
                        className="
                          object-cover
                          object-center
                        "
                        onError={() => handleImageError(slide.id)}
                      />

                      {/* Overlay */}
                      {(slide.title || slide.subtitle || slide.ctaLink) && (
                        <div
                          className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-black/70
                            via-black/15
                            to-transparent
                          "
                        />
                      )}

                      {/* Content */}
                      {(slide.title || slide.subtitle || slide.ctaLink) && (
                        <div
                          className="
                            absolute
                            inset-x-0
                            bottom-0
                            z-10
                            max-w-2xl
                            p-4
                            sm:p-6
                            md:p-8
                            lg:p-10
                            xl:p-12
                            text-white
                          "
                        >
                          {slide.title && (
                            <h2
                              className="
                                max-w-[90%]
                                text-lg
                                font-extrabold
                                leading-tight
                                drop-shadow-md
                                sm:text-2xl
                                md:text-3xl
                                lg:text-4xl
                                xl:text-4xl
                              "
                            >
                              {slide.title}
                            </h2>
                          )}

                          {slide.subtitle && (
                            <p
                              className="
                                mt-1.5
                                max-w-[90%]
                                line-clamp-2
                                text-[11px]
                                leading-5
                                text-white/90
                                drop-shadow
                                sm:mt-2
                                sm:text-xs
                                md:text-sm
                                lg:text-base
                              "
                            >
                              {slide.subtitle}
                            </p>
                          )}

                          {slide.ctaLink && (
                            <div
                              className="
                                mt-2
                                sm:mt-3
                                md:mt-4
                              "
                            >
                              <Link
                                href={slide.ctaLink}
                                className="
                                  inline-flex
                                  items-center
                                  gap-1.5
                                  rounded-lg
                                  bg-primary
                                  px-3
                                  py-2
                                  text-[11px]
                                  font-bold
                                  text-white
                                  shadow-lg
                                  transition-all
                                  hover:scale-105
                                  hover:bg-primary/90
                                  active:scale-95
                                  sm:gap-2
                                  sm:px-4
                                  sm:py-2
                                  sm:text-xs
                                  md:px-5
                                  md:py-2.5
                                  md:text-sm
                                "
                              >
                                <span>{slide.ctaText || 'مشاهده کالاها'}</span>

                                <ArrowLeft
                                  className="
                                    h-3.5
                                    w-3.5
                                    sm:h-4
                                    sm:w-4
                                  "
                                />
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    /* Fallback */
                    <div
                      className="
                        relative
                        flex
                        h-full
                        w-full
                        items-center
                        justify-between
                        overflow-hidden
                        bg-gradient-to-r
                        from-blue-600
                        via-indigo-500
                        to-purple-600
                        px-5
                        sm:px-8
                        md:px-12
                        lg:px-16
                      "
                    >
                      <div
                        className="
                          pointer-events-none
                          absolute
                          -right-10
                          -bottom-10
                          h-40
                          w-40
                          rounded-full
                          bg-white/10
                          blur-2xl
                          sm:h-60
                          sm:w-60
                          md:h-80
                          md:w-80
                        "
                      />

                      <div
                        className="
                          pointer-events-none
                          absolute
                          left-1/3
                          -top-10
                          h-28
                          w-28
                          rounded-full
                          bg-white/5
                          blur-xl
                          sm:h-40
                          sm:w-40
                          md:-top-20
                          md:h-40
                          md:w-40
                        "
                      />

                      <div
                        className="
                          relative
                          z-10
                          max-w-[70%]
                          space-y-1
                          text-white
                          sm:max-w-xl
                          sm:space-y-2
                          md:space-y-4
                        "
                      >
                        <span
                          className="
                            inline-block
                            rounded-full
                            bg-white/20
                            px-2
                            py-0.5
                            text-[9px]
                            font-bold
                            backdrop-blur-md
                            sm:px-3
                            sm:py-1
                            sm:text-[10px]
                            md:text-xs
                          "
                        >
                          پیشنهاد ویژه
                        </span>

                        <h2
                          className="
                            text-base
                            font-extrabold
                            leading-tight
                            sm:text-2xl
                            md:text-3xl
                            lg:text-4xl
                          "
                        >
                          {slide.title || 'پیشنهادهای شگفت‌انگیز روز'}
                        </h2>

                        {slide.subtitle && (
                          <p
                            className="
                              text-[10px]
                              leading-4
                              text-white/90
                              sm:text-xs
                              md:text-sm
                              lg:text-base
                            "
                          >
                            {slide.subtitle}
                          </p>
                        )}

                        {slide.ctaLink && (
                          <div className="pt-1 sm:pt-2">
                            <Link
                              href={slide.ctaLink}
                              className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-lg
                                bg-white
                                px-3
                                py-2
                                text-[10px]
                                font-bold
                                text-indigo-600
                                shadow-lg
                                transition-all
                                hover:scale-105
                                hover:bg-gray-50
                                active:scale-95
                                sm:px-4
                                sm:py-2.5
                                sm:text-xs
                                md:px-5
                                md:text-sm
                              "
                            >
                              <span>{slide.ctaText || 'مشاهده کالاها'}</span>

                              <ArrowLeft
                                className="
                                  h-3.5
                                  w-3.5
                                  sm:h-4
                                  sm:w-4
                                "
                              />
                            </Link>
                          </div>
                        )}
                      </div>

                      <div
                        className="
                          relative
                          z-10
                          hidden
                          items-center
                          justify-center
                          rounded-2xl
                          border
                          border-white/20
                          bg-white/10
                          shadow-inner
                          backdrop-blur-md
                          sm:flex
                          sm:h-24
                          sm:w-24
                          md:h-36
                          md:w-36
                          lg:h-44
                          lg:w-44
                        "
                      >
                        <ShoppingBag
                          className="
                            h-10
                            w-10
                            text-white/80
                            md:h-16
                            md:w-16
                            lg:h-20
                            lg:w-20
                          "
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            className="
              absolute
              left-3
              top-1/2
              z-20
              hidden
              -translate-y-1/2
              rounded-full
              border
              border-white/20
              bg-white/90
              p-2.5
              text-gray-700
              opacity-0
              shadow-lg
              backdrop-blur-sm
              transition-all
              hover:scale-110
              hover:bg-white
              focus:outline-none
              focus:ring-2
              focus:ring-white/50
              lg:flex
              lg:group-hover:opacity-100
            "
            aria-label="اسلاید قبلی"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={scrollNext}
            className="
              absolute
              right-3
              top-1/2
              z-20
              hidden
              -translate-y-1/2
              rounded-full
              border
              border-white/20
              bg-white/90
              p-2.5
              text-gray-700
              opacity-0
              shadow-lg
              backdrop-blur-sm
              transition-all
              hover:scale-110
              hover:bg-white
              focus:outline-none
              focus:ring-2
              focus:ring-white/50
              lg:flex
              lg:group-hover:opacity-100
            "
            aria-label="اسلاید بعدی"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div
          className="
            absolute
            bottom-2
            left-1/2
            z-20
            flex
            -translate-x-1/2
            items-center
            gap-1
            rounded-full
            bg-black/30
            px-2
            py-1
            backdrop-blur-sm
            sm:bottom-3
            sm:gap-1.5
            sm:px-3
            sm:py-1.5
          "
        >
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              className={cn(
                'rounded-full transition-all duration-300',
                index === selectedIndex
                  ? 'h-1.5 w-5 bg-white sm:h-2 sm:w-6'
                  : 'h-1.5 w-1.5 bg-white/50 hover:bg-white/80 sm:h-2 sm:w-2',
              )}
              aria-label={`رفتن به اسلاید ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
