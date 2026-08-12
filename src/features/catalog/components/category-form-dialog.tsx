'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { ImagePlus, X } from 'lucide-react';

import {
  categoryFormSchema,
  type CategoryFormInput,
} from '../schemas/category.schema';

import { createCategoryAction } from '../actions/category.actions';
import { updateCategoryAction } from '../actions/category-mutation.actions';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { FormError } from '@/shared/ui/form-error';

import type { CategoryResponseDTO } from '../types/category.dto';

export function CategoryFormDialog({
  allCategories,
  editing,
  onClose,
  onSuccess,
}: {
  allCategories: CategoryResponseDTO[];
  editing?: CategoryResponseDTO;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    editing?.imageUrl ?? null,
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: editing?.name ?? '',
      slug: editing?.slug ?? '',
      parentId: editing?.parentId ?? undefined,
    },
  });

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setServerError('فقط فایل تصویر مجاز است.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setServerError('حجم تصویر نباید بیشتر از ۲ مگابایت باشد.');
      return;
    }

    setServerError(null);

    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    const url = URL.createObjectURL(file);
    setImageFile(file);
    setPreviewUrl(url);
    event.target.value = '';
  }

  function removeImage() {
    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(editing?.imageUrl ?? null);
  }

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('آپلود تصویر انجام نشد.');
    }

    const data = await response.json();
    if (!data.url) {
      throw new Error('آدرس تصویر از سرور دریافت نشد.');
    }
    return data.url;
  }
async function onSubmit(data: CategoryFormInput) {
    setServerError(null);

    try {
      let imageUrl = editing?.imageUrl ?? null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // ساخت یک فرم‌دیتا جدید برای ارسال به سرور
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('slug', data.slug);
      
      if (data.parentId) {
        formData.append('parentId', data.parentId);
      }
      
      if (imageUrl) {
        formData.append('imageUrl', imageUrl);
      }

      // ارسال به اکشن مربوطه بر اساس وضعیت (ویرایش یا ساخت)
      let result;
      if (editing) {
        formData.append('id', editing.id); // ارسال شناسه برای آپدیت
        result = await updateCategoryAction(formData);
      } else {
        result = await createCategoryAction(formData);
      }

      if (!result.success) {
        setServerError(result.error.message);
        return;
      }

      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }

      onSuccess();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'خطای غیرمنتظره');
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-[var(--radius)] bg-[var(--color-card)] p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="mb-4 font-bold">
            {editing ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید'}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* بخش آپلود تصویر */}
            <div>
              <Label className="mb-1.5 block">تصویر دسته‌بندی</Label>

              <div className="flex items-center gap-4">
                <label
                  htmlFor="category-image"
                  className="
                    relative
                    flex
                    h-20
                    w-20
                    cursor-pointer
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-lg
                    border-2
                    border-dashed
                    border-[var(--color-border)]
                    bg-[var(--color-card)]
                    transition-all
                    hover:border-[var(--color-primary)]
                    hover:bg-[var(--color-muted)]
                  "
                >
                  {previewUrl ? (
                    <>
                      <Image
                        src={previewUrl}
                        alt="تصویر دسته‌بندی"
                        fill
                        className="object-cover"
                        unoptimized={previewUrl.startsWith('blob:')}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          removeImage();
                        }}
                        className="
                          absolute
                          -right-1
                          -top-1
                          rounded-full
                          bg-red-500
                          p-0.5
                          text-white
                          shadow-sm
                          hover:bg-red-600
                        "
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-[var(--color-muted-foreground)]">
                      <ImagePlus className="h-6 w-6" />
                      <span className="text-[10px]">آپلود</span>
                    </div>
                  )}
                </label>

                <input
                  id="category-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />

                <div className="text-xs text-[var(--color-muted-foreground)]">
                  <p>فرمت‌های مجاز: PNG, JPG, WebP, SVG</p>
                  <p>حداکثر حجم: ۲ مگابایت</p>
                  {editing?.imageUrl && !imageFile && (
                    <p className="text-green-600">تصویر فعلی</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="name" className="mb-1.5 block">
                نام
              </Label>
              <Input
                id="name"
                state={errors.name ? 'error' : 'default'}
                {...register('name')}
              />
              <FormError message={errors.name?.message} />
            </div>

            <div>
              <Label htmlFor="slug" className="mb-1.5 block">
                Slug
              </Label>
              <Input
                id="slug"
                dir="ltr"
                state={errors.slug ? 'error' : 'default'}
                {...register('slug')}
              />
              <FormError message={errors.slug?.message} />
            </div>

            <div>
              <Label htmlFor="parentId" className="mb-1.5 block">
                دسته‌ی والد (اختیاری)
              </Label>

              <select
                id="parentId"
                className="
                  h-11
                  w-full
                  rounded-[var(--radius)]
                  border
                  border-[var(--color-border)]
                  bg-[var(--color-card)]
                  px-3
                  text-sm
                "
                {...register('parentId')}
              >
                <option value="">بدون والد</option>
                {allCategories
                  .filter((category) => category.id !== editing?.id)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>

              <FormError message={errors.parentId?.message} />
            </div>

            <FormError message={serverError ?? undefined} />

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'در حال ذخیره…' : 'ذخیره'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                انصراف
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
