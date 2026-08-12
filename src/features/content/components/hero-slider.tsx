import { bannerRepository } from "@/features/content/repositories/banner.repository";
import type { Slide } from "../types/slide.dto";
import SliderClients from "./SliderClient";

/**
 * HeroSlider - Server Component
 */
export async function HeroSlider() {
  const banners = await bannerRepository.findActiveByPlacement("HOMEPAGE_HERO");

  let slides: Slide[] = banners.map((banner) => ({
    id: banner.id,
    imageUrl: banner.imageUrl,
    title: banner.title || undefined,
    ctaText: "مشاهده کالاها",
    ctaLink: banner.linkUrl || "/products",
  }));

  // اگر بنری در دیتابیس نبود، تصویر fallback شفاف و استاندارد قرار می‌دهیم
  if (slides.length === 0) {
    slides = [
      {
        id: "default-fallback-slide",
        // تصویر پیش‌فرض از پوشه public یا لینک دائم Supabase
        imageUrl: "/images/hero-fallback.jpg",
        title: "به فروشگاه اینترنتی ROOKALA خوش آمدید",
        subtitle: "جدیدترین محصولات و پیشنهادهای شگفت‌انگیز روز",
        ctaText: "فروشگاه محصولات",
        ctaLink: "/products",
      },
    ];
  }

  return (
    <div
     className="
    relative
    left-1/2
    right-1/2
    -mx-[50vw]
    w-screen
    overflow-hidden
  "
    >
      <SliderClients slides={slides} />
    </div>
  );
}
// left-1/2 right-1/2 -mx-[50vw] w-screen
