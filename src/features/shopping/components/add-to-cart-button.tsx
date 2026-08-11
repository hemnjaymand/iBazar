"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ShoppingBag, Check, Loader2, AlertCircle } from "lucide-react";
import { useAddToCartMutation } from "../hooks/use-add-to-cart-mutation";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/cn";
import { toast } from "@/shared/lib/toast";

interface AddToCartButtonProps {
  variantId: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
  showIcon?: boolean;
}

export function AddToCartButton({
  variantId,
  quantity = 1,
  disabled = false,
  className,
  size = "default",
  showIcon = true,
}: AddToCartButtonProps) {
  const { mutate, isPending } = useAddToCartMutation();
  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (isPending || justAdded || disabled) return;

      setError(null);
      mutate(
        { variantId, quantity },
        {
          onSuccess: () => {
            setJustAdded(true);
            toast.success("محصول به سبد خرید اضافه شد");
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setJustAdded(false), 2000);
          },
          onError: (err) => {
            const message = err instanceof Error ? err.message : "خطا در افزودن به سبد خرید";
            setError(message);
            toast.error(message);
          },
        }
      );
    },
    [variantId, quantity, isPending, justAdded, disabled, mutate]
  );

  const isDisabled = disabled || isPending || justAdded;

  return (
    <div className="space-y-1.5 w-full">
      <Button
        type="button"
        size={size}
        disabled={isDisabled}
        onClick={handleClick}
        className={cn(
          "w-full transition-all duration-200 font-bold select-none gap-2",
          justAdded && "!bg-[var(--color-info)] !text-[var(--color-info-foreground)]",
          error && "!border-[var(--color-destructive)] !bg-[var(--color-destructive)]/10 !text-[var(--color-destructive)]",
          className
        )}
        aria-label={justAdded ? "افزوده شد" : "افزودن به سبد خرید"}
      >
        {isPending ? (
          <>
            {showIcon && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
            <span>در حال افزودن…</span>
          </>
        ) : justAdded ? (
          <>
            {showIcon && <Check className="h-4 w-4 shrink-0" />}
            <span>افزوده شد</span>
          </>
        ) : error ? (
          <>
            {showIcon && <AlertCircle className="h-4 w-4 shrink-0" />}
            <span>تلاش مجدد</span>
          </>
        ) : (
          <>
            {showIcon && <ShoppingBag className="h-4 w-4 shrink-0" />}
            <span>افزودن به سبد</span>
          </>
        )}
      </Button>

      {error && <p className="text-xs text-[var(--color-destructive)] font-medium px-1">{error}</p>}
    </div>
  );
}