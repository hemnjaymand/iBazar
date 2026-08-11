<<<<<<< HEAD
# فایل‌های جا افتاده + زیرساخت پایه‌ی پروژه فروشگاه

این پکیج نتیجه‌ی «سرچ عمیق» روی کل ۱۱ فاز طراحی‌شده در مکالمه است — یعنی هر
تکه‌کدی که در طول فازها **نام برده شد ولی هرگز واقعاً نوشته نشد** (Wishlist،
Brand کامل، Tag، Aggregation Services، Update Order Status، AppSetting،
Notification/Search Actions، requirePermission Guard) این‌جا ساخته شده.

علاوه بر آن‌ها، برای این‌که این فایل‌های جدید واقعاً کامپایل و اجرا شوند،
زیرساخت پایه‌ای که در فازهای ۰ تا ۸ طراحی شده بود هم بازسازی شده (Prisma
Client، Result Type، Error Hierarchy، Config‌ها، Auth.js، Repository/Mapper/DTO
پایه‌ی هر دامنه).

## چه‌چیزی این‌جا نیست
- کامپوننت‌های UI (چون در مکالمه فقط به‌صورت درخت/طراحی توضیح داده شدند، نه
  کد کامل JSX) — این‌ها را باید طبق الگوی «فایل‌های الگو» بخش ۸ جزوه بسازید.
- تست‌ها (فاز ۹) و تنظیمات Deployment (فاز ۱۰) — این‌ها در جزوه‌ی
  `architecture-study-guide.md` به‌صورت کامل کد شده‌اند.
- `shared/ui/*` (کامپوننت‌های shadcn) — با `npx shadcn@latest init` تولید می‌شوند.

## نحوه‌ی استفاده
1. این پوشه را داخل یک پروژه‌ی Next.js 16 تازه (`create-next-app`) کپی کنید.
2. `npm install` بزنید (لیست دقیق در `package.json`).
3. `.env` را از روی `.env.example` بسازید.
4. `npx prisma migrate dev --name init` را اجرا کنید.
5. برای جست‌وجوی متنی (`server/search/postgres-search-provider.ts`)، migration دستی
   زیر را هم روی جدول `products` اجرا کنید:
   ```sql
   ALTER TABLE products ADD COLUMN search_vector tsvector
     GENERATED ALWAYS AS (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(description,''))) STORED;
   CREATE INDEX products_search_idx ON products USING GIN (search_vector);
   ```

## نقشه‌ی راه کامل
برای مرور کامل معماری، تصمیمات هر فاز، و کامپوننت‌های UI، به فایل
`architecture-study-guide.md` (که قبلاً برایتان ساخته شده) مراجعه کنید.
=======
# iBazar
>>>>>>> ac3a1c85ba37c8df8ba83d7317a5ece74e89e391
