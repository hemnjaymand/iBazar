"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandFormDialog } from "./brand-form-dialog";
import { Button } from "@/shared/ui/button";
import type { BrandResponseDTO } from "../types/brand.dto";

export function BrandsList({ brands }: { brands: BrandResponseDTO[] }) {
  const router = useRouter();
  const [dialogState, setDialogState] = useState<"create" | BrandResponseDTO | null>(null);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setDialogState("create")}>+ برند جدید</Button>
      </div>

      <div className="rounded-[var(--radius)] border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
        {brands.map((brand) => (
          <div key={brand.id} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm">{brand.name}</span>
            <button onClick={() => setDialogState(brand)} className="text-xs text-[var(--color-primary)]">
              ویرایش
            </button>
          </div>
        ))}
        {brands.length === 0 && (
          <p className="text-center text-sm text-[var(--color-muted-foreground)] py-6">برندی ثبت نشده است</p>
        )}
      </div>

      {dialogState && (
        <BrandFormDialog
          editing={dialogState === "create" ? undefined : dialogState}
          onClose={() => setDialogState(null)}
          onSuccess={() => {
            setDialogState(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
