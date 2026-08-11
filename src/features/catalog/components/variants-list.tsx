import type { VariantResponseDTO } from "../types/variant.dto";

export function VariantsList({ variants }: { variants: VariantResponseDTO[] }) {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
      {variants.map((v) => (
        <div key={v.id} className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="num text-sm">{v.sku}{v.isDefault ? " (پیش‌فرض)" : ""}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {v.attributes.map((a) => (
                <span key={a.valueId} className="text-xs text-[var(--color-muted-foreground)]">
                  {a.attributeName}: {a.value}
                </span>
              ))}
            </div>
          </div>
          <div className="text-left">
            <p className="num text-sm font-bold">{parseFloat(v.price).toLocaleString("fa-IR")}</p>
            <p className="num text-xs text-[var(--color-muted-foreground)]">موجودی: {v.stock.toLocaleString("fa-IR")}</p>
          </div>
        </div>
      ))}
    </div>
  );
}