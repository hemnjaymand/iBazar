"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deletePageAction } from "../actions/page.actions";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import type { PageDTO } from "../types/page.dto";

export function PagesAdminList({ pages }: { pages: PageDTO[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(slug: string) {
    if (!confirm("این صفحه حذف شود؟")) return;
    setDeleting(slug);
    const result = await deletePageAction(slug);
    setDeleting(null);
    if (!result.success) {
      alert(result.error.message);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link href="/admin/content/pages/new">
          <Button size="sm">+ صفحه جدید</Button>
        </Link>
      </div>

      <div className="rounded-[var(--radius)] border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
        {pages.map((page) => (
          <div key={page.slug} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium">{page.title}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]" dir="ltr">
                /{page.slug}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {page.isPublished ? <Badge variant="new">منتشر شده</Badge> : <Badge variant="outOfStock">پیش‌نویس</Badge>}
              <Link href={"/admin/content/pages/"}>
                <button className="text-xs text-[var(--color-primary)]">ویرایش</button>
              </Link>
              <button
                onClick={() => handleDelete(page.slug)}
                disabled={deleting === page.slug}
                className="text-xs text-[var(--color-destructive)] disabled:opacity-50"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
        {pages.length === 0 && (
          <p className="text-center text-sm text-[var(--color-muted-foreground)] py-6">صفحه‌ای ثبت نشده است</p>
        )}
      </div>
    </div>
  );
}
