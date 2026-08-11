"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { createBannerAction } from "../actions/banner.actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormError } from "@/shared/ui/form-error";
import { toast } from "@/shared/lib/toast";
import { X, Loader2, UploadCloud, Trash2 } from "lucide-react";

// تایپ جایگاه‌های معتبر بنر
export type BannerPlacement =
  "HOMEPAGE_HERO" | "HOMEPAGE_PROMO" | "CATEGORY_SIDEBAR";

// عناوین فارسی جایگاه‌ها با تایپ‌دهی سخت‌گیرانه
const PLACEMENT_LABELS: Record<BannerPlacement, string> = {
  HOMEPAGE_HERO: "اسلایدر اصلی صفحه‌ی اول",
  HOMEPAGE_PROMO: "نوار پروموشن صفحه‌ی اول",
  CATEGORY_SIDEBAR: "کنار نوار دسته‌بندی",
} as const;

// تایپ مقادیر فرم
export interface BannerFormValues {
  title: string;
  imageUrl: string;
  linkUrl?: string;
  placement: BannerPlacement;
  sortOrder: number;
}

// تایپ Props کامپوننت
export interface BannerFormDialogProps {
  onClose: () => void;
  onSuccess: () => void;
}

// تایپ خروجی API آپلود
interface UploadApiResponse {
  url?: string;
  error?: string;
}

export function BannerFormDialog({
  onClose,
  onSuccess,
}: BannerFormDialogProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<BannerFormValues>({
    defaultValues: {
      title: "",
      placement: "HOMEPAGE_HERO",
      sortOrder: 0,
      imageUrl: "",
      linkUrl: "",
    },
  });

  const imageUrlValue = watch("imageUrl");

  // بستن دیالوگ با کلید ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // هندلر آپلود فایل به سرور
  async function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    const file = e.target.files?.[0];
    if (!file) return;

    // بررسی حجم (حداکثر ۵ مگابایت برای بنرها)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم فایل بنر نباید بیشتر از ۵ مگابایت باشد");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data: UploadApiResponse = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "خطا در آپلود فایل");
      }

      // مقداردهی فیلد imageUrl در فرم
      setValue("imageUrl", data.url, { shouldValidate: true });
      toast.success("تصویر بنر با موفقیت آپلود شد");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "خطا در آپلود تصویر";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  // حذف تصویر انتخاب شده
  function handleRemoveImage(): void {
    setValue("imageUrl", "", { shouldValidate: true });
  }

  async function onSubmit(data: BannerFormValues): Promise<void> {
    setServerError(null);
    const result = await createBannerAction({
      ...data,
      linkUrl: data.linkUrl ? data.linkUrl : undefined,
    });

    if (!result.success) {
      const message =
        typeof result.error === "string"
          ? result.error
          : result.error?.message || "خطا در ثبت بنر";
      setServerError(message);
      return;
    }

    toast.success("بنر جدید با موفقیت ایجاد شد");
    onSuccess();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* پس‌زمینه تیره با انیمیشن محو شدن */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-200"
        onClick={onClose}
      />

      {/* باکس اصلی دیالوگ */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200">
        {/* هدر دیالوگ */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-bold text-[var(--color-foreground)]">
            افزودن بنر جدید
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* فرم */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">عنوان بنر</Label>
            <Input
              id="title"
              placeholder="مثال: جشنواره تابستانه"
              {...register("title", { required: "وارد کردن عنوان الزامی است" })}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* بخش آپلود فایل و پیش‌نمایش تصویر */}
          <div className="space-y-2">
            <Label>تصویر بنر</Label>

            {imageUrlValue ? (
              /* باکس پیش‌نمایش عکس */
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-[var(--color-border)] bg-gray-50 group">
                <Image
                  src={imageUrlValue}
                  alt="پیش‌نمایش بنر"
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف تصویر
                  </Button>
                </div>
              </div>
            ) : (
              /* باکس انتخاب فایل / آپلود */
              <label
                className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  isUploading
                    ? "opacity-50 cursor-not-allowed bg-gray-50"
                    : "border-gray-300 hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="text-xs font-medium">
                      در حال آپلود فایل...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                    <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm font-medium mb-1">
                      کلیک کنید یا فایل را اینجا رها کنید
                    </p>
                    <p className="text-xs text-gray-400">
                      فرمت‌های PNG، JPG، WEBP (حداکثر ۵ مگابایت)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            )}

            {/* ورودی URL جایگزین */}
            <div className="pt-1">
              <span className="text-xs text-gray-400 block mb-1">
                یا آدرس اینترنتی (URL) عکس را وارد کنید:
              </span>
              <Input
                id="imageUrl"
                dir="ltr"
                placeholder="https://example.com/banner.jpg"
                {...register("imageUrl", { required: "تصویر بنر الزامی است" })}
              />
              {errors.imageUrl && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="linkUrl">لینک مقصد (اختیاری)</Label>
            <Input
              id="linkUrl"
              dir="ltr"
              placeholder="https://example.com/products"
              {...register("linkUrl")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="placement">جایگاه نمایش</Label>
            <select
              id="placement"
              className="w-full h-11 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              {...register("placement")}
            >
              {Object.entries(PLACEMENT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sortOrder">ترتیب نمایش (اولویت)</Label>
            <Input
              id="sortOrder"
              type="number"
              {...register("sortOrder", { valueAsNumber: true })}
            />
          </div>

          <FormError message={serverError ?? undefined} />

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 h-11 font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  در حال ذخیره...
                </>
              ) : (
                "ذخیره بنر"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting || isUploading}
              className="h-11 px-5"
            >
              انصراف
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
