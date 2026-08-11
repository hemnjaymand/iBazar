"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteSavedAddressAction } from "../actions/saved-address.actions";
import { AddressFormDialog } from "./address-form-dialog";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import type { SavedAddressDTO } from "../types/saved-address.dto";
import { toast } from "@/shared/lib/toast";

export function AddressesList({ addresses }: { addresses: SavedAddressDTO[] }) {
  const router = useRouter();
  const [dialogState, setDialogState] = useState<"create" | SavedAddressDTO | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("این آدرس حذف شود؟")) return;
    const result = await deleteSavedAddressAction(id);
    if (!result.success) {
      toast.error(result.error.message);
      return;
    }
    toast.success("آدرس حذف شد");
    router.refresh();
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setDialogState("create")}>+ آدرس جدید</Button>
      </div>

      <div className="space-y-3">
        {addresses.map((addr) => (
          <div key={addr.id} className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{addr.label}</span>
                {addr.isDefault && <Badge variant="new">پیش‌فرض</Badge>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDialogState(addr)} className="text-xs text-[var(--color-primary)]">ویرایش</button>
                <button onClick={() => handleDelete(addr.id)} className="text-xs text-[var(--color-destructive)]">حذف</button>
              </div>
            </div>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              {addr.fullName} — {addr.city}، {addr.addressLine}
            </p>
            <p className="num text-xs text-[var(--color-muted-foreground)] mt-1">{addr.phone}</p>
          </div>
        ))}
        {addresses.length === 0 && (
          <p className="text-center text-sm text-[var(--color-muted-foreground)] py-6">آدرسی ثبت نشده است</p>
        )}
      </div>

      {dialogState && (
        <AddressFormDialog
          editing={dialogState === "create" ? undefined : dialogState}
          onClose={() => setDialogState(null)}
          onSuccess={() => {
            setDialogState(null);
            toast.success(dialogState === "create" ? "آدرس اضافه شد" : "آدرس ویرایش شد");
            router.refresh();
          }}
        />
      )}
    </div>
  );
}