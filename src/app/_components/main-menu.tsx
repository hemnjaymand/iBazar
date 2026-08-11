"use client";

import Link from "next/link";
import { Percent, ShoppingBag, Coins, Flame, Store } from "lucide-react";
import { CategoryDropdown } from "@/features/catalog/components/category-dropdown";
import type { CategoryTreeNodeDTO } from "@/features/catalog";


interface MainMenuProps {
  categories: CategoryTreeNodeDTO[];
}
 
export function MainMenu({ categories }: MainMenuProps) {
  return (
    <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-xs xl:text-sm text-gray-600 font-medium whitespace-nowrap h-full">
      <div className="flex items-center h-full">
        <CategoryDropdown categories={categories} />
      </div>

      <span className="h-4 w-[1px] bg-gray-200 shrink-0" />

      <Link
        href="/products?sort=amazing"
        className="relative flex items-center gap-1.5 py-3 hover:text-gray-900 transition-colors group"
      >
        <Percent className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
        <span>شگفت‌انگیزها</span>
        <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-red-500 transition-all duration-200 group-hover:w-full" />
      </Link>

      <Link
        href="/products?category=supermarket"
        className="relative flex items-center gap-1.5 py-3 hover:text-gray-900 transition-colors group"
      >
        <ShoppingBag className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
        <span>بهترین گجت ها</span>
        <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-emerald-500 transition-all duration-200 group-hover:w-full" />
      </Link>

      <Link
        href="/products?category=digital-gold"
        className="relative flex items-center gap-1.5 py-3 hover:text-gray-900 transition-colors group"
      >
        <Coins className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
        <span>خرید بدون واسطه کالا</span>
        <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-amber-500 transition-all duration-200 group-hover:w-full" />
      </Link>

      <Link
        href="/products?sort=top-rated"
        className="relative flex items-center gap-1.5 py-3 hover:text-gray-900 transition-colors group"
      >
        <Flame className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
        <span>پرفروش‌ترین‌ها</span>
        <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-orange-500 transition-all duration-200 group-hover:w-full" />
      </Link>
        
         <Link
        href="/products?sort=top-rated"
        className="relative flex items-center gap-1.5 py-3 hover:text-gray-900 transition-colors group"
      >
        <Store className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
        <span>چرا از آی بازار خرید کنم !؟</span>
        <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-yellow-600 transition-all duration-200 group-hover:w-full" />
      </Link>

    
    </nav>
  );
}