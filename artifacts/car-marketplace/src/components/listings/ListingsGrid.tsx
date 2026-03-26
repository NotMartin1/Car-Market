"use client";

import { Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/car/CarCard";
import type { MockListing } from "@/lib/mock-data";

export function ListingsGrid({
  listings,
  isLoading,
  onClearFilters,
  noResults,
  noResultsText,
  clearAllLabel,
}: {
  listings: MockListing[];
  isLoading: boolean;
  onClearFilters: () => void;
  noResults: string;
  noResultsText: string;
  clearAllLabel: string;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-[340px] bg-card animate-pulse rounded-2xl border border-border" />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-24 bg-card rounded-2xl border border-dashed border-border">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-5">
          <Search className="w-7 h-7 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{noResults}</h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">{noResultsText}</p>
        <Button onClick={onClearFilters} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" /> {clearAllLabel}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {listings.map((listing) => (
        <CarCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
