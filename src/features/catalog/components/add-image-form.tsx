"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProductImageAction } from "../actions/product-image.actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormError } from "@/shared/ui/form-error";

/**
 * محدودیت آگاهانه: این فرم فقط یک "آدرس تصویر" می‌گیره، نه آپلود فایل
 * واقعی — چون سرویس آپلود (UploadThing/Cloudinary، طبق تصمیم فاز ۳c)
 * هنوز به پروژه وصل نشده. وقتی وصل شد، این Input با یک File Picker
 * جایگزین می‌شه که بعد از آپلود موفق، url نهایی رو همین‌جا پر می‌کنه.
 */
export function AddImageForm({ productId, onSuccess }: { productId: string; onSuccess: () => void }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    const result = await addProductImageAction({ productId, url, sortOrder: 0 });
    setIsPending(false);

    if (!result.success) {
      setError(result.error.message);
      return;
    }
    setUrl("");
    onSuccess();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1">
        <Label htmlFor="imageUrl">آدرس تصویر</Label>
        <Input id="imageUrl" dir="ltr" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
        <FormError message={error ?? undefined} />
      </div>
      <Button type="submit" disabled={isPending || !url} className="self-end">
        {isPending ? "در حال افزودن…" : "افزودن"}
      </Button>
    </form>
  );
}