"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Loader2, Save, Package } from "lucide-react";



import type { ProductEditDTO } from "../types/product-edit.dto";
import type { CategoryResponseDTO } from "../types/category.dto";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { FormError } from "@/shared/ui/form-error";
import { BrandSelectDTO } from "../types/brand-select.dto";
import { updateProductSchema } from "../schemas";

type FormValues = z.input<typeof updateProductSchema>;
interface ProductEditFormProps {
  product: ProductEditDTO;
  categories: CategoryResponseDTO[];
  brands: BrandSelectDTO[];
}
export function ProductEditForm({
  product,
  categories,
  brands,
}: ProductEditFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const defaultVariant = product.defaultVariant;

const {
  register,
  handleSubmit,
  formState: {
    errors,
    isSubmitting,
  },
} = useForm<FormValues>({
  resolver: zodResolver(updateProductSchema),

  defaultValues: {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    categoryId: product.categoryId,
    brandId: product.brandId ?? undefined,
    isPublished: product.isPublished,

    defaultVariant: {
      id: defaultVariant.id,
      sku: defaultVariant.sku,
      price: defaultVariant.price,
      compareAtPrice:
        defaultVariant.compareAtPrice ?? undefined,
      stock: defaultVariant.stock,
    },
  },
});
  /* * اگر محصول Variant نداشته باشد، * اینجا بعد از Hook تصمیم می‌گیریم چه چیزی نمایش داده شود. * * توجه: * این شرط بعد از useForm است و بنابراین * قوانین React Hooks نقض نمی‌شود. */ if (
    !defaultVariant
  ) {
    return (
      <div className="rounded-lg border p-6">
        {" "}
        <p className="text-sm text-muted-foreground">
          {" "}
          این محصول Variant پیش‌فرض ندارد.{" "}
        </p>{" "}
      </div>
    );
  }
  async function onSubmit(values: FormValues) {
    setServerError(null); /* * submit logic */
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl space-y-6 pb-12"
    >
      {/* اطلاعات اصلی */}

      <section className="space-y-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-4">
          <Package className="h-5 w-5 text-[var(--color-primary)]" />

          <h2 className="font-semibold">اطلاعات محصول</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <Label htmlFor="name" className="mb-1.5 block">
              نام محصول
            </Label>

            <Input
              id="name"
              {...register("name")}
              state={errors.name ? "error" : "default"}
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
              {...register("slug")}
              state={errors.slug ? "error" : "default"}
            />

            <FormError message={errors.slug?.message} />
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="mb-1.5 block">
            توضیحات
          </Label>

          <Textarea id="description" rows={5} {...register("description")} />

          <FormError message={errors.description?.message} />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <Label htmlFor="categoryId" className="mb-1.5 block">
              دسته‌بندی
            </Label>

            <select
              id="categoryId"
              {...register("categoryId")}
              className="h-11 w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm"
            >
              <option value="">— انتخاب دسته —</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <FormError message={errors.categoryId?.message} />
          </div>

          <div>
            <Label htmlFor="brandId" className="mb-1.5 block">
              برند
            </Label>

            <select
              id="brandId"
              {...register("brandId")}
              className="h-11 w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm"
            >
              <option value="">— بدون برند —</option>

              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>

            <FormError message={errors.brandId?.message} />
          </div>
        </div>
      </section>

      {/* Variant */}

      <section className="space-y-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
        <div className="border-b border-[var(--color-border)] pb-4">
          <h2 className="font-semibold">قیمت و موجودی</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="defaultVariant.sku" className="mb-1.5 block">
              SKU
            </Label>

            <Input
              id="defaultVariant.sku"
              dir="ltr"
              {...register("defaultVariant.sku")}
            />

            <FormError message={errors.defaultVariant?.sku?.message} />
          </div>

          <div>
            <Label htmlFor="defaultVariant.price" className="mb-1.5 block">
              قیمت
            </Label>

            <Input
              id="defaultVariant.price"
              type="number"
              {...register("defaultVariant.price")}
            />

            <FormError message={errors.defaultVariant?.price?.message} />
          </div>

          <div>
            <Label
              htmlFor="defaultVariant.compareAtPrice"
              className="mb-1.5 block"
            >
              قیمت قبلی
            </Label>

            <Input
              id="defaultVariant.compareAtPrice"
              type="number"
              {...register("defaultVariant.compareAtPrice", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
            />
          </div>

          <div>
            <Label htmlFor="defaultVariant.stock" className="mb-1.5 block">
              موجودی
            </Label>

            <Input
              id="defaultVariant.stock"
              type="number"
              {...register("defaultVariant.stock")}
            />

            <FormError message={errors.defaultVariant?.stock?.message} />
          </div>
        </div>
      </section>

      {/* وضعیت */}

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            {...register("isPublished")}
            className="h-4 w-4"
          />

          <span className="text-sm font-medium">محصول منتشر شده باشد</span>
        </label>
      </section>

      {/* خطا */}

      {serverError && <FormError message={serverError} />}

      {/* Submit */}

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="px-8"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              در حال ذخیره...
            </>
          ) : (
            <>
              <Save className="ml-2 h-4 w-4" />
              ذخیره تغییرات
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
