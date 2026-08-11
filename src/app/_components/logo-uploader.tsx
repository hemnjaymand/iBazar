"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { toast } from "@/shared/lib/toast";
// در صورت استفاده از lucide-react می‌توانید آیکون‌ها را فعال کنید
// import { UploadCloud, X, Check, Trash2 } from "lucide-react"; 

interface LogoUploaderProps {
  currentLogo?: string | null;
}

export function LogoUploader({ currentLogo }: LogoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentLogo || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // پاک‌سازی URL موقت برای جلوگیری از نشت حافظه مرورگر
  useEffect(() => {
    return () => {
      if (selectedFile && preview && preview !== currentLogo) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [selectedFile, preview, currentLogo]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("حجم فایل باید کمتر از ۲ مگابایت باشد");
      return;
    }

    // ایجاد پیش‌نمایش محلی بدون آپلود
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    e.target.value = ""; // ریست کردن اینپوت برای انتخاب مجدد همان فایل
  }

  function handleCancelSelect() {
    setSelectedFile(null);
    setPreview(currentLogo || null);
  }

  async function handleUpload() {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("productId", "logo");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // ذخیره آدرس در دیتابیس
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "logo_url", value: data.url }),
      });

      toast.success("لوگو با موفقیت آپلود شد");
      setSelectedFile(null); // خروج از حالت "انتخاب‌شده"
      setPreview(data.url);
      window.location.reload(); 
    } catch (error) {
      toast.error("خطا در آپلود لوگو");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDeleteLogo() {
    if (!confirm("آیا از حذف لوگوی فعلی مطمئن هستید؟")) return;
    
    setIsUploading(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "logo_url", value: "" }),
      });
      setPreview(null);
      toast.success("لوگو با موفقیت حذف شد");
      window.location.reload();
    } catch (error) {
      toast.error("خطا در حذف لوگو");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="text-center space-y-1 text-sm">
        <h3 className="font-semibold text-gray-900">لوگوی فروشگاه</h3>
        <p className="text-gray-500">فرمت‌های PNG، JPG و SVG (حداکثر ۲ مگابایت)</p>
      </div>

      <label className={`
        relative flex flex-col items-center justify-center w-full h-48 
        border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
        ${selectedFile ? 'border-primary/50 bg-primary/5' : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'}
        ${isUploading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      `}>
        {preview ? (
          <div className="relative w-3/4 h-3/4">
            <Image
              src={preview}
              alt="پیش‌نمایش لوگو"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
            {/* <UploadCloud className="w-10 h-10 mb-3 text-gray-400" /> */}
            <span className="text-sm font-medium">برای انتخاب فایل کلیک کنید</span>
          </div>
        )}
        <input
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          className="hidden"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
      </label>

      {/* نمایش کنترل‌ها بر اساس وضعیت */}
      <div className="flex items-center justify-center gap-3">
        {selectedFile ? (
          // حالت ۱: فایلی انتخاب شده اما هنوز آپلود نشده است
          <>
            <Button 
              onClick={handleUpload} 
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? "در حال آپلود..." : "آپلود و ذخیره"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancelSelect}
              disabled={isUploading}
              className="w-full"
            >
              لغو
            </Button>
          </>
        ) : (
          // حالت ۲: فایلی انتخاب نشده است (نمایش دکمه حذف در صورت وجود لوگو در سرور)
          preview && currentLogo && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDeleteLogo}
              disabled={isUploading}
            >
              حذف لوگوی فعلی
            </Button>
          )
        )}
      </div>
    </div>
  );
}