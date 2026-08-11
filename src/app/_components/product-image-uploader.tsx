"use client";

import { useState } from "react";
import { toast } from "@/shared/lib/toast";

interface ProductImageUploaderProps {
  productId: string;
  onUploaded?: (url: string) => void;
}

export function ProductImageUploader({ productId, onUploaded }: ProductImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", productId);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در آپلود");

      toast.success("تصویر با موفقیت آپلود شد");
      onUploaded?.(data.url);
    } catch (error: unknown) {
      // ✨ بدون هرگونه any: بررسی می‌کنیم که آیا خطا از نوع استاندارد Error است یا خیر
      const message = error instanceof Error ? error.message : "خطا در آپلود";
      toast.error(message);
    } finally {
      setIsUploading(false);
      e.target.value = ""; // ریست کردن input
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {isUploading && <span className="mr-2 text-sm">در حال آپلود…</span>}
    </div>
  );
}