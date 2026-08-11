type CategoryUrlInput = {
  slug?: string | null;
  id: string;
};

/**
 * تابع متمرکز ساخت آدرس دسته‌بندی — این آدرس باید دقیقاً با مسیر واقعی
 * صفحه (app/(shop)/[categorySlug]/page.tsx) یکی باشه. اون صفحه هیچ
 * پیشوندی مثل "/category" نداره، پس این‌جا هم نباید اضافه بشه.
 */
export function getCategoryUrl(category: CategoryUrlInput): string {
  const target = category.slug?.trim() || category.id;
  return `/${target}`;
}