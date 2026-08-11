"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAttributeAction } from "../actions/attribute.actions";
import { AttributeFormDialog } from "./attribute-form-dialog";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import type { AttributeDTO } from "../types/attribute.dto";

export function AttributesList({ attributes }: { attributes: AttributeDTO[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  async function handleDelete(id: string) {
    if (!confirm("این ویژگی حذف شود؟")) return;
    const result = await deleteAttributeAction(id);
    if (!result.success) {
      alert(result.error.message);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setShowForm(true)}>
          + ویژگی جدید
        </Button>
      </div>

      <div className="space-y-3">
        {attributes.map((attr) => (
          <div
            key={attr.id}
            className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">{attr.name}</span>
              <button
                onClick={() => handleDelete(attr.id)}
                className="text-xs text-[var(--color-destructive)]"
              >
                حذف
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {attr.values.map((v) => (
                <Badge key={v.id} variant="new">
                  {v.value}
                </Badge>
              ))}
            </div>
          </div>
        ))}
        {attributes.length === 0 && (
          <p className="text-center text-sm text-[var(--color-muted-foreground)] py-6">
            ویژگی‌ای ثبت نشده است
          </p>
        )}
      </div>

      {showForm && (
        <AttributeFormDialog
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
