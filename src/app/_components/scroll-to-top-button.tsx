"use client";

import { ChevronUp } from "lucide-react";
// import { Button } from "@/shared/ui/button";

export function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
       className="flex items-center border p-2 rounded-xl gap-2  text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
          
      aria-label="بازگشت به بالای صفحه"
    >
      <ChevronUp className="h-5 w-5" />
      بازگشت به بالای صفحه
    </button>
  );
}