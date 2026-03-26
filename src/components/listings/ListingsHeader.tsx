"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ListingsHeader({
  title,
  subtitle,
  search,
  setSearch,
  onSearch,
  clearSearch,
  searchLabel,
  searchPlaceholder,
}: {
  title: string;
  subtitle: string;
  search: string;
  setSearch: (v: string) => void;
  onSearch: (e: React.FormEvent) => void;
  clearSearch: () => void;
  searchLabel: string;
  searchPlaceholder: string;
}) {
  return (
    <div className="bg-foreground text-white pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-display font-bold mb-1">{title}</h1>
        <p className="text-white/50 text-sm">{subtitle}</p>
        <form onSubmit={onSearch} className="mt-5 flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-9 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/35 text-sm focus:outline-none focus:border-primary focus:bg-white/15 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Button type="submit" size="sm" className="h-10 px-5 font-semibold">
            {searchLabel}
          </Button>
        </form>
      </div>
    </div>
  );
}
