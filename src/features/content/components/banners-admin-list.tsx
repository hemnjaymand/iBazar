"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { deleteBannerAction } from "../actions/banner.actions";
import { BannerFormDialog } from "./banner-form-dialog";
import { Button } from "@/shared/ui/button";
import type { BannerDTO } from "../types/banner.dto";
import { toast } from "@/shared/lib/toast";
import { Plus, Trash2, Image as ImageIcon, Layers } from "lucide-react";

const PLACEMENT_LABELS: Record<string, string> = {
  HOMEPAGE_HERO: "اسلایدر اصلی",
  HOMEPAGE_PROMO: "نوار پروموشن",
  CATEGORY_SIDEBAR: "کنار دسته‌بندی",
};

export function BannersList({
  banners,
}: {
  banners: (BannerDTO & { placement: string })[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!window.confirm("آیا از حذف این بنر اطمینان دارید؟")) return;

    try {
      setDeletingId(id);
      const result = await deleteBannerAction(id);
      
      if (!result.success) {
        toast.error(result.error.message);
        return;
      }
      
      toast.success("بنر با موفقیت حذف شد");
      router.refresh();
    } catch {
      toast.error("خطایی در ارتباط با سرور رخ داد");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* هدر بخش لیست و دکمه افزودن */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-foreground)]">مدیریت بنرها</h2>
          <p className="text-xs text-[var(--color-muted-foreground)]">
            بنرهای تبلیغاتی و جایگاه‌های ویژه سایت را مدیریت کنید
          </p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)} className="h-10 px-4 font-medium">
          <Plus className="w-4 h-4 ml-1.5" />
          بنر جدید
        </Button>
      </div>

      {/* لیست بنرها */}
      <div className="grid gap-3">
        {banners.map((b) => {
          const isDeleting = deletingId === b.id;

          return (
            <div
              key={b.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* پیش‌نمایش تصویر بنر */}
                <div className="relative w-24 h-14 rounded-xl bg-[var(--color-muted)] overflow-hidden shrink-0 border border-[var(--color-border)] flex items-center justify-center">
                  {b.imageUrl ? (
                    <Image
                      src={b.imageUrl}
                      alt={b.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                {/* اطلاعات بنر */}
                <div className="flex flex-col min-w-0 gap-1">
                  <h3 className="text-sm font-semibold text-[var(--color-foreground)] truncate">
                    {b.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
                    <span className="inline-flex items-center gap-1 bg-[var(--color-muted)] px-2 py-0.5 rounded-md font-medium">
                      <Layers className="w-3 h-3" />
                      {PLACEMENT_LABELS[b.placement] ?? b.placement}
                    </span>
                    {b.sortOrder !== undefined && (
                      <span>ترتیب: {b.sortOrder.toLocaleString("fa-IR")}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* دکمه حذف */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(b.id)}
                disabled={isDeleting}
                className="text-[var(--color-destructive)] border-red-200 hover:bg-red-50 hover:text-red-600 h-9 px-3 shrink-0"
              >
                <Trash2 className="w-4 h-4 ml-1" />
                {isDeleting ? "در حال حذف..." : "حذف"}
              </Button>
            </div>
          );
        })}

        {/* حالت خالی */}
        {banners.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-card)]/50 text-center">
            <ImageIcon className="w-12 h-12 text-[var(--color-muted-foreground)] mb-3 opacity-40" />
            <h3 className="text-sm font-bold text-[var(--color-foreground)] mb-1">بنری ثبت نشده است</h3>
            <p className="text-xs text-[var(--color-muted-foreground)] max-w-xs mb-4">
              هنوز هیچ بنری برای جایگاه‌های مختلف سایت ایجاد نکرده‌اید.
            </p>
            <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
              افزودن اولین بنر
            </Button>
          </div>
        )}
      </div>

      {/* دیالوگ فرم ایجاد بنر */}
      {showForm && (
        <BannerFormDialog
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            toast.success("بنر با موفقیت ساخته شد");
            router.refresh();
          }}
        />
      )}
    </div>
  );
}