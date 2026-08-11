// app/_components/search-bar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";
import type { FormEvent } from "react";
export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }
 
  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="search"
        placeholder="جستجو در آی بازار..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-3xl focus:ring-2 focus:ring-primary/20 "
      />
    </form>
  );
}