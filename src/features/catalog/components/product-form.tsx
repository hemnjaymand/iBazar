"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import Image from "next/image";
import {
  X,
  Upload,
  Loader2,
  PackagePlus,
  ImagePlus,
  DollarSign,
} from "lucide-react";
import { createProductSchema } from "../schemas/product.schema";
import { createProductAction } from "../actions/product.actions";
import { addProductImageAction } from "../actions/product-image.actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { FormError } from "@/shared/ui/form-error";
import type { CategoryResponseDTO } from "../types/category.dto";
import type { BrandResponseDTO } from "../types/brand.dto";

interface ProductFormProps {
  categories: CategoryResponseDTO[];
  brands: BrandResponseDTO[];
}

type FormValues = z.input<typeof createProductSchema>;

interface ImageUpload {
  id: string;
  url: string; // در اینجا لینک پیش‌نمایش موقت (Blob URL) ذخیره می‌شود
  altText?: string;
  file?: File; // فایل اصلی برای آپلود نهایی
}

export function ProductForm({ categories, brands }: ProductFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [images, setImages] = useState<ImageUpload[]>([]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      categoryId: "",
      brandId: "",
      defaultVariant: {
        sku: "",
        price: 0,
        compareAtPrice: undefined,
        stock: 0,
        // shouldUnregister: true,
      },
    },
  });

  // ۱. تغییر بزرگ: فقط ایجاد پیش‌نمایش محلی و ذخیره فایل در State
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setServerError(null);

    const newImages = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file), // ساخت لینک موقت برای نمایش فوری
      altText: file.name,
      file: file, // نگهداری فایل برای آپلود در زمان سابمیت فرم
    }));

    setImages((prev) => [...prev, ...newImages]);

    // پاک کردن مقدار اینپوت تا کاربر بتواند در صورت نیاز همان فایل را دوباره انتخاب کند
    e.target.value = "";
  }

  // ۲. مدیریت صحیح حذف تصویر و آزادسازی حافظه مرورگر
  function removeImage(id: string) {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove?.url) {
        URL.revokeObjectURL(imageToRemove.url); // جلوگیری از نشت حافظه
      }
      return prev.filter((img) => img.id !== id);
    });
  }

  // ۳. انتقال آپلود واقعی به زمان ثبت نهایی فرم
  async function onSubmit(data: FormValues) {
    setServerError(null);

    // ساخت محصول در دیتابیس
    const result = await createProductAction({
      ...data,
      brandId: data.brandId ? data.brandId : undefined,
    });

    if (!result.success) {
      setServerError(result.error.message);
      return;
    }

    const productId = result.data.id;

    // آپلود تصاویرِ باقی‌مانده در State به سرور
    if (images.length > 0) {
      try {
        for (const image of images) {
          if (!image.file) continue;

          const formData = new FormData();
          formData.append("file", image.file);

          // ✨ خط اضافه شده: ارسال شناسه محصول به بک‌اند
          formData.append("productId", productId);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`خطا در آپلود تصویر: ${image.altText}`);
          }

          const uploadData = await response.json();

          // اتصال تصویر آپلود شده به محصول در دیتابیس (Supabase)
          await addProductImageAction({
            productId,
            url: uploadData.url,
            altText: image.altText,
            sortOrder: 0,
          });
        }
      } catch (error) {
        setServerError((error as Error).message);

        // اگر هنوز صفحه edit را نساخته‌اید، موقتاً کاربر را به لیست محصولات برگردانید
        // router.push(`/admin/products/${productId}/edit`);
        router.push("/admin/products");
        return;
      }
    }
    // پاکسازی لینک‌های موقت پس از اتمام موفقیت‌آمیز
    images.forEach((img) => URL.revokeObjectURL(img.url));

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 max-w-4xl pb-12"
    >
      {/* ====== کارت اول: اطلاعات پایه محصول ====== */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-4">
          <PackagePlus className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-base font-semibold">اطلاعات اصلی محصول</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="name" className="mb-1.5 block font-medium">
              نام محصول
            </Label>
            <Input
              id="name"
              placeholder="مثلاً: شکلات نوتلا اصل آلمان ۸۲۵ گرمی"
              state={errors.name ? "error" : "default"}
              {...register("name")}
            />
            <FormError message={errors.name?.message} />
          </div>

          <div>
            <Label htmlFor="slug" className="mb-1.5 block font-medium">
              Slug (لینک یکتا)
            </Label>
            <Input
              id="slug"
              dir="ltr"
              placeholder="nutella-825g-original"
              state={errors.slug ? "error" : "default"}
              {...register("slug")}
            />
            <FormError message={errors.slug?.message} />
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="mb-1.5 block font-medium">
            توضیحات تکمیلی
          </Label>
          <Textarea
            id="description"
            rows={4}
            placeholder="ویژگی‌ها، اصالت کالا و جزئیات مهم..."
            {...register("description")}
          />
          <FormError message={errors.description?.message} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div>
            <Label htmlFor="categoryId" className="mb-1.5 block font-medium">
              دسته‌بندی
            </Label>
            <select
              id="categoryId"
              {...register("categoryId")}
              className="w-full h-11 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="">— انتخاب دسته —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <FormError message={errors.categoryId?.message} />
          </div>

          <div>
            <Label htmlFor="brandId" className="mb-1.5 block font-medium">
              برند (اختیاری)
            </Label>
            <select
              id="brandId"
              {...register("brandId")}
              className="w-full h-11 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="">— بدون برند —</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <FormError message={errors.brandId?.message} />
          </div>
        </div>
      </div>

      {/* ====== کارت دوم: گالری تصاویر ====== */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div className="flex items-center gap-2">
            <ImagePlus className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="text-base font-semibold">تصاویر محصول</h3>
          </div>
          <span className="text-xs bg-[var(--color-muted)] px-2.5 py-1 rounded-full text-[var(--color-muted-foreground)] num">
            {images.length} تصویر انتخاب شده
          </span>
        </div>

        {/* ناحیه آپلود */}
        <label
          className={`flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-xl p-8 cursor-pointer transition group ${isSubmitting ? "opacity-50 pointer-events-none" : "bg-[var(--color-background)]/50 hover:bg-[var(--color-muted)]/40"}`}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>
            <p className="text-sm font-semibold mb-1">
              {isSubmitting
                ? "در حال آپلود تصاویر به سرور..."
                : "برای انتخاب تصویر کلیک کنید یا عکس‌ها را اینجا رها کنید"}
            </p>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              پشتیبانی از فرمت‌های PNG, JPG, WEBP
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={isSubmitting}
            className="hidden"
          />
        </label>

        {/* گالری تصاویر انتخاب شده */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative group aspect-square rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm"
              >
                <Image
                  src={img.url}
                  alt={img.altText || "تصویر محصول"}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  disabled={isSubmitting}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition shadow-md disabled:opacity-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ====== کارت سوم: مشخصات مالی و انبارداری (Variant) ====== */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-4">
          <DollarSign className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-base font-semibold">
            مشخصات قیمت‌گذاری و انبار (Variant پیش‌فرض)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <Label
              htmlFor="defaultVariant.sku"
              className="mb-1.5 block font-medium"
            >
              کد کالا (SKU)
            </Label>
            <Input
              id="defaultVariant.sku"
              dir="ltr"
              placeholder="NUT-825"
              {...register("defaultVariant.sku")}
            />
            <FormError message={errors.defaultVariant?.sku?.message} />
          </div>

          <div>
            <Label
              htmlFor="defaultVariant.price"
              className="mb-1.5 block font-medium"
            >
              قیمت فروش (تومان)
            </Label>
            <Input
              id="defaultVariant.price"
              type="number"
              placeholder="450000"
              {...register("defaultVariant.price")}
            />
            <FormError message={errors.defaultVariant?.price?.message} />
          </div>

          <div>
            <Label
              htmlFor="defaultVariant.compareAtPrice"
              className="mb-1.5 block font-medium"
            >
              قیمت خط‌خورده (تخفیف)
            </Label>
            <Input
              id="defaultVariant.compareAtPrice"
              type="number"
              placeholder="500000"
              {...register("defaultVariant.compareAtPrice", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
          </div>

          <div>
            <Label
              htmlFor="defaultVariant.stock"
              className="mb-1.5 block font-medium"
            >
              موجودی انبار
            </Label>
            <Input
              id="defaultVariant.stock"
              type="number"
              placeholder="15"
              {...register("defaultVariant.stock")}
            />
          </div>
        </div>
      </div>

      {/* دکمه ارسال نهایی و خطاها */}
      <div className="space-y-4 pt-2">
        <FormError message={serverError ?? undefined} />

        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto px-8 font-bold"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            {isSubmitting ? "در حال ذخیره‌سازی..." : "ثبت و انتشار محصول"}
          </Button>
        </div>
      </div>
    </form>
  );
}
