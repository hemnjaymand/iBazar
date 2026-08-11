import type { CartDTO } from "@/features/shopping/types/cart.dto";

// فقط نمایش — محاسبه‌ی نهایی همیشه در سرور (createOrderService) دوباره
// انجام می‌شه؛ این‌جا فقط یک Preview برای کاربره، نه منبع حقیقت قیمت.
export function OrderReview({ cart, discount }: { cart: CartDTO; discount: number }) {
  const subtotal = parseFloat(cart.subtotal);
  const total = subtotal - discount;

  return (
    <div className="space-y-3">
      {cart.items.map((item) => (
        <div key={item.id} className="flex justify-between text-sm">
          <span>{item.productName} × {item.quantity.toLocaleString("fa-IR")}</span>
          <span className="num">{parseFloat(item.lineTotal).toLocaleString("fa-IR")}</span>
        </div>
      ))}

      <div className="border-t border-dashed border-[var(--color-border)] pt-3 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span>جمع جزء</span>
          <span className="num">{subtotal.toLocaleString("fa-IR")}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-[var(--color-destructive)]">
            <span>تخفیف</span>
            <span className="num">−{discount.toLocaleString("fa-IR")}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold pt-1">
          <span>مبلغ نهایی</span>
          <span className="num">{total.toLocaleString("fa-IR")} تومان</span>
        </div>
      </div>
    </div>
  );
}
