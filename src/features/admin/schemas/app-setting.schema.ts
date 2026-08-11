// import { z } from "zod";

// export const updateAppSettingSchema = z.object({
//   key: z.string().min(1).max(100),
//   value: z.string().max(2000),
// });
// export type UpdateAppSettingInput = z.infer<typeof updateAppSettingSchema>;


// export const usefulLinkSchema = z.object({
//   label: z.string().min(1, "عنوان لینک الزامی است"),
//   href: z.string().min(1, "آدرس لینک الزامی است"),
// });
// export type UsefulLink = z.infer<typeof usefulLinkSchema>;

// export const featureSchema = z.object({
//   id: z.string(),
//   title: z.string(),
//   description: z.string(),
//   icon: z.string().optional(),
// });
// export type Feature = z.infer<typeof featureSchema>;



// export const serviceTagSchema = z.object({
//   id: z.string(),
//   label: z.string(),
//   href: z.string(),
// });
// export type ServiceTag = z.infer<typeof serviceTagSchema>;

// export const showcaseCaseSchema = z.object({
//   id: z.string(),
//   name: z.string(),
//   service: z.string(),
//   beforeImage: z.string(),
//   afterImage: z.string(),
// });
// export type ShowcaseCase = z.infer<typeof showcaseCaseSchema>;

// export const pageBannerSchema = z.object({
//   enabled: z.boolean().optional(),
//   title: z.string().optional(),
//   subtitle: z.string().optional(),
//   imageUrl: z.string().optional().or(z.literal("")),
//   ctaLabel: z.string().optional(),
//   ctaHref: z.string().optional(),
// });
// export type PageBanner = z.infer<typeof pageBannerSchema>;

// export const PAGE_BANNER_KEYS = [
//   "about",
//   "services",
//   "gallery",
//   "blog",
//   "contact",
// ] as const;
// export type PageBannerKey = (typeof PAGE_BANNER_KEYS)[number];

// export const PAGE_BANNER_LABELS: Record<PageBannerKey, string> = {
//   about: "درباره ما",
//   services: "خدمات",
//   gallery: "گالری",
//   blog: "مقالات",
//   contact: "تماس با ما",
// };

// export const pageBannersSchema = z.object({
//   about: pageBannerSchema.optional(),
//   services: pageBannerSchema.optional(),
//   gallery: pageBannerSchema.optional(),
//   blog: pageBannerSchema.optional(),
//   contact: pageBannerSchema.optional(),
// });
// export type PageBanners = z.infer<typeof pageBannersSchema>;


// export const brandSchema = z.object({
//   id: z.string(),
//   name: z.string().min(1, "نام برند الزامی است"),
//   // بدون .url() — همان دلیل بالا
//   imageUrl: z.string().optional().or(z.literal("")),
// });
// export type Brand = z.infer<typeof brandSchema>;

// // اسکیمای فرم تنظیمات پایه — توجه: serviceDetail عمداً اینجا نیست،
// // چون فقط باید توسط HomeContentForm/updateHomeContentAction مدیریت شود (نه اینجا هم)
// export const basicSettingsSchema = z.object({
//   siteName: z.string().min(2, "نام کلینیک باید حداقل ۲ کاراکتر باشد"),
//   phone: z.string().min(8, "شماره تماس معتبر نیست"),
//   address: z.string().optional(),
//   instagram: z.string().optional(),
//   supportEmail: z.string().email("ایمیل معتبر نیست").optional().or(z.literal("")),
//   workingHours: z.string().optional(),
//   aboutText: z.string().optional(),
//   heroImageUrl: z.string().optional().or(z.literal("")),
//   bannerImages: z.array(z.string()).optional(),
//   licenseText: z.string().optional(),
//   usefulLinks: z.array(usefulLinkSchema).optional(),
//   latitude: z.string().optional(),
//   longitude: z.string().optional(),
//   mapZoom: z.number().min(1).max(22),
//   featuresBackgroundImage: z.string().optional().or(z.literal("")),
//   brands: z.array(brandSchema).optional(),
//   brandsBackgroundImage: z.string().optional().or(z.literal("")),
// });
// export type BasicSettingsInput = z.infer<typeof basicSettingsSchema>;

// export const siteSettingsSchema = basicSettingsSchema.extend({
//   features: z.array(featureSchema).optional(),
//   recentShowcaseCases: z.array(showcaseCaseSchema).optional(),
// });
// export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

// export const homeContentSchema = z.object({
//   features: z.array(featureSchema).optional(),
//   recentShowcaseCases: z.array(showcaseCaseSchema).optional(),
// });
// export type HomeContentInput = z.infer<typeof homeContentSchema>;
import { z } from "zod";

export const updateAppSettingSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string().max(2000),
});
export type UpdateAppSettingInput = z.infer<typeof updateAppSettingSchema>;