import type { StockMovementDTO } from "../types/stock-movement.dto";

const typeLabels: Record<string, string> = {
  PURCHASE_RECEIVED: "دریافت از تأمین‌کننده",
  SALE: "فروش",
  RETURN: "بازگشت از مشتری",
  ADJUSTMENT: "اصلاح دستی",
  DAMAGED: "مرجوعی/آسیب‌دیده",
};

export function StockMovementTimeline({
  movements,
}: {
  movements: StockMovementDTO[];
}) {
  if (movements.length === 0) {
    return (
      <p className="text-sm text-[var(--color-muted-foreground)] py-8 text-center">
        تاریخچه‌ای ثبت نشده است.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {movements.map((m) => (
        <div
          key={m.id}
          className="flex items-center justify-between rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] p-3"
        >
          <div>
            <p className="text-sm">{typeLabels[m.type] ?? m.type}</p>
            {m.reason && (
              <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                {m.reason}
              </p>
            )}
          </div>
          <div className="text-left">
            <p className="text-sm font-bold">
              {m.quantity > 0 ? "+" : ""}
              {m.quantity.toLocaleString("fa-IR")}
            </p>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              {new Date(m.createdAt).toLocaleDateString("fa-IR")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
