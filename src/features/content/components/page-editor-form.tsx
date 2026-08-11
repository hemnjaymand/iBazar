"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { upsertPageSchema, type UpsertPageInput, type UpsertPageOutput } from "../schemas/page.schema";
import { upsertPageAction } from "../actions/page.actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormError } from "@/shared/ui/form-error";
import { Textarea } from "@/shared/ui/textarea";

export function PageEditorForm({ existing }: { existing?: UpsertPageInput }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  // ✅ ژنریک <UpsertPageInput> از اینجا حذف شد
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(upsertPageSchema),
    defaultValues: existing ?? { isPublished: false },
  });

  // ✅ تایپ پارامتر ورودی به UpsertPageOutput تغییر یافت (چون از فیلتر Zod رد شده است)
  async function onSubmit(data: UpsertPageOutput) {
    setServerError(null);
    const result = await upsertPageAction(data);
    if (!result.success) {
      setServerError(result.error.message);
      return;
    }
    router.push("/admin/content/pages");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 max-w-xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">عنوان صفحه</Label>
          <Input id="title" state={errors.title ? "error" : "default"} {...register("title")} />
          <FormError message={errors.title?.message} />
        </div>
        <div>
          <Label htmlFor="slug">Slug (آدرس)</Label>
          <Input
            id="slug"
            dir="ltr"
            placeholder="about-us"
            disabled={!!existing}
            state={errors.slug ? "error" : "default"}
            {...register("slug")}
          />
          <FormError message={errors.slug?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="htmlContent">محتوا (HTML)</Label>
        <Textarea
          id="htmlContent"
          rows={10}
          className="font-mono text-sm"
          state={errors.htmlContent ? "error" : "default"}
          {...register("htmlContent")}
        />
        <FormError message={errors.htmlContent?.message} />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="isPublished" {...register("isPublished")} />
        <Label htmlFor="isPublished">منتشر شود (قابل مشاهده برای عموم)</Label>
      </div>

      <FormError message={serverError ?? undefined} />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "در حال ذخیره…" : "ذخیره صفحه"}
      </Button>
    </form>
  );
}