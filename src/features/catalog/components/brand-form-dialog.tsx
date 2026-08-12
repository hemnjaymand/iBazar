'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { ImagePlus, Loader2, X } from 'lucide-react';

import { createBrandAction, updateBrandAction } from '../actions/brand.actions';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { FormError } from '@/shared/ui/form-error';

import type { BrandResponseDTO } from '../types/brand.dto';

interface FormValues {
  name: string;
  slug: string;
}

interface BrandFormDialogProps {
  editing?: BrandResponseDTO;
  onClose: () => void;
  onSuccess: () => void;
}

export function BrandFormDialog({
  editing,
  onClose,
  onSuccess,
}: BrandFormDialogProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    editing?.logoUrl ?? null,
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: editing?.name ?? '',
      slug: editing?.slug ?? '',
    },
  });

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setServerError('فقط فایل تصویر مجاز است.');
      return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
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
    setPreviewUrl(editing?.logoUrl ?? null);
  }

  async function uploadImage(file: File) {
    const formData = new FormData();

    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('آپلود لوگو انجام نشد.');
    }

    const data: { url?: string } = await response.json();

    if (!data.url) {
      throw new Error('آدرس تصویر از سرور دریافت نشد.');
    }

    return data.url;
  }

  async function onSubmit(data: FormValues) {
    setServerError(null);

    try {
      let logoUrl = editing?.logoUrl ?? null;

      if (imageFile) {
        logoUrl = await uploadImage(imageFile);
      }

      const payload = {
        ...data,
        logoUrl,
      };

      const result = editing
        ? await updateBrandAction(editing.id, payload)
        : await createBrandAction(payload);

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
      <div
        className="
          fixed
          inset-0
          z-40
          bg-black/40
          backdrop-blur-[2px]
        "
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="
            w-full
            max-w-md
            rounded-2xl
            border
            border-[var(--color-border)]
            bg-[var(--color-card)]
            p-6
            shadow-2xl
          "
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--color-foreground)]">
                {editing ? 'ویرایش برند' : 'برند جدید'}
              </h2>

              <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                اطلاعات برند را وارد کنید.
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              aria-label="بستن"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="name" className="mb-1.5 block">
                نام برند
              </Label>

              <Input
                id="name"
                state={errors.name ? 'error' : 'default'}
                disabled={isSubmitting}
                {...register('name', {
                  required: 'نام برند الزامی است.',
                })}
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
                disabled={isSubmitting}
                {...register('slug', {
                  required: 'Slug الزامی است.',
                })}
              />

              <FormError message={errors.slug?.message} />
            </div>

            <div>
              <Label htmlFor="brand-logo" className="mb-1.5 block">
                لوگوی برند
              </Label>

              <label
                htmlFor="brand-logo"
                className="
                  flex
                  min-h-36
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border-2
                  border-dashed
                  border-[var(--color-border)]
                  bg-[var(--color-background)]
                  p-4
                  transition
                  hover:border-[var(--color-primary)]
                  hover:bg-[var(--color-muted)]/30
                "
              >
                {previewUrl ? (
                  <div
                    className="
                      relative
                      h-28
                      w-28
                      overflow-hidden
                      rounded-xl
                      border
                      border-[var(--color-border)]
                      bg-white
                    "
                  >
                    <Image
                      src={previewUrl}
                      alt={editing?.name ?? 'لوگوی برند'}
                      fill
                      sizes="112px"
                      className="object-contain p-2"
                    />
                  </div>
                ) : (
                  <>
                    <div
                      className="
                        mb-3
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-[var(--color-primary)]/10
                        text-[var(--color-primary)]
                      "
                    >
                      <ImagePlus className="h-6 w-6" />
                    </div>

                    <span className="text-sm font-semibold">انتخاب لوگو</span>

                    <span className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                      PNG، JPG یا WEBP
                    </span>

                    <span className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                      حداکثر ۲ مگابایت
                    </span>
                  </>
                )}

                <input
                  id="brand-logo"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                  className="hidden"
                />
              </label>

              {previewUrl && (
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={isSubmitting}
                  className="
                    mt-2
                    text-xs
                    text-red-600
                    transition
                    hover:text-red-700
                    hover:underline
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  حذف لوگو
                </button>
              )}
            </div>

            <FormError message={serverError ?? undefined} />

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting && (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                )}

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
