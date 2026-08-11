
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Minus, Trash2, Loader2 } from "lucide-react";
import { useUpdateCartItemMutation } from "../hooks/use-update-cart-item-mutation";
import { useRemoveCartItemMutation } from "../hooks/use-remove-cart-item-mutation";
import type { CartItemDTO } from "../types/cart.dto";

export function CartItemRow({
  item,
  onLocalUpdate,
}: {
  item: CartItemDTO;
  onLocalUpdate?: (itemId: string, newQuantity: number) => void;
}) {


  
  // ============================================================
  //  State محلی با همگام‌سازی هوشمند
  // ============================================================
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const isUpdatingRef = useRef(false);

  // همگام‌سازی با props فقط وقتی که Mutation در حال اجرا نیست
  useEffect(() => {
    if (!isUpdatingRef.current && localQuantity !== item.quantity) {
      setLocalQuantity(item.quantity);
    }
  }, [item.quantity, localQuantity]);

  // ============================================================
  //  Mutations
  // ============================================================
  const updateItem = useUpdateCartItemMutation();
  const removeItem = useRemoveCartItemMutation();

  const isUpdating = updateItem.isPending;
  const isRemoving = removeItem.isPending;
  const isDisabled = isUpdating || isRemoving;

  // ============================================================
  //  هندلرها
  // ============================================================
  function handleQuantityChange(newQuantity: number) {
    // if (newQuantity < 1 || isDisabled) return;

    // // ۱. به‌روزرسانی فوری UI
    // isUpdatingRef.current = true;
    // setLocalQuantity(newQuantity);

    // // ۲. ارسال درخواست به سرور
    // updateItem.mutate(
    //   { itemId: item.id, quantity: newQuantity },
    //   {
    //     onSuccess: () => {
    //       // بعد از موفقیت، ref را false می‌کنیم تا useEffect بتواند همگام‌سازی کند
    //       isUpdatingRef.current = false;
    //     },
    //     onError: () => {
    //       // در صورت خطا، مقدار را به مقدار اصلی برگردان
    //       setLocalQuantity(item.quantity);
    //       isUpdatingRef.current = false;
    //     },
    //   },
    // );
    if (newQuantity < 1 || isDisabled) return;

    // ۲. اجرای آپدیت آنی و بدون رفرش (Optimistic Update)
    if (onLocalUpdate) {
      onLocalUpdate(item.id, newQuantity);
    }
    
    setLocalQuantity(newQuantity);
    isUpdatingRef.current = true;

    // ارسال درخواست به بک‌اند (در پس زمینه انجام میشود)
    updateItem.mutate(
      { itemId: item.id, quantity: newQuantity },
      {
        onSuccess: () => {
          isUpdatingRef.current = false;
          // دیگر نیازی به router.refresh() الزامی نیست!
        },
  }
 )}
  function handleRemove() {
    if (isDisabled) return;
    removeItem.mutate(item.id);
  }

  // ============================================================
  //  محاسبه قیمت کل بر اساس localQuantity
  // ============================================================
  const unitPrice = parseFloat(item.lineTotal) / item.quantity;
  const optimisticLineTotal = (unitPrice * localQuantity).toFixed(0);

  // ============================================================
  //  رندر
  // ============================================================
  return (
    <div
      className={`flex gap-4 py-4 border-b border-gray-100 last:border-0 transition-opacity duration-200 ${
        isRemoving ? "opacity-40 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* ===== تصویر محصول ===== */}
      <div className="relative w-20 h-20 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.productName}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-medium select-none bg-gray-100">
            بدون تصویر
          </div>
        )}
      </div>

      {/* ===== جزئیات محصول ===== */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {/* نام و دکمه حذف */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight"
            title={item.productName}
          >
            {item.productName}
          </h3>

          <button
            type="button"
            disabled={isDisabled}
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
            aria-label="حذف از سبد خرید"
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* SKU */}
        {item.sku && (
          <p className="num text-xs text-gray-400 font-medium mt-0.5">
            کد: {item.sku}
          </p>
        )}

        {/* ===== ردیف پایین: کنترل تعداد + قیمت ===== */}
        <div className="flex items-center justify-between mt-3">
          {/* شمارنده */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-xl border border-gray-200 p-1">
            <button
              type="button"
              disabled={localQuantity <= 1 || isDisabled}
              onClick={() => handleQuantityChange(localQuantity - 1)}
              className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed shadow-sm"
              aria-label="کاهش تعداد"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="num text-sm font-bold w-8 text-center text-gray-800">
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto text-gray-400" />
              ) : (
                localQuantity.toLocaleString("fa-IR")
              )}
            </span>

            <button
              type="button"
              disabled={isDisabled}
              onClick={() => handleQuantityChange(localQuantity + 1)}
              className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed shadow-sm"
              aria-label="افزایش تعداد"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* قیمت کل */}
          <div className="text-left">
            <span className="num text-sm font-bold text-gray-900">
              {/* اصلاح شد: استفاده از optimisticLineTotal */}
              {parseFloat(optimisticLineTotal).toLocaleString("fa-IR")}
            </span>
            <span className="text-xs font-medium text-gray-500 mr-1">
              تومان
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
