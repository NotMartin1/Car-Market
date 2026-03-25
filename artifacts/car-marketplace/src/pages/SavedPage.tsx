"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useSaved } from "@/contexts/saved-context";
import { getListings } from "@/lib/mock-api";
import { CarCard } from "@/components/car/CarCard";
import { Button } from "@/components/ui/button";
import { Heart, Search } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { MockListing } from "@/lib/mock-data";

export default function SavedPage() {
  const { savedIds, toggle } = useSaved();
  const [listings, setListings] = useState<MockListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getListings({ limit: 100 })
      .then((r) => setListings(r.listings.filter((l) => savedIds.has(l.id))))
      .finally(() => setIsLoading(false));
  }, [savedIds]);

  const total = savedIds.size;

  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-foreground text-white pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <Heart className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-display font-bold">Saved Vehicles</h1>
          </div>
          <p className="text-white/50 text-sm">
            {total === 0 ? "No saved vehicles yet." : `${total} vehicle${total !== 1 ? "s" : ""} saved`}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[340px] bg-card animate-pulse rounded-2xl border border-border" />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {listings.map((l) => <CarCard key={l.id} listing={l} />)}
            </div>
          </>
        ) : (
          <div className="text-center py-24 bg-card rounded-2xl border border-dashed border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-5">
              <Heart className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No saved vehicles yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
              Browse listings and click the heart icon to save vehicles you like.
            </p>
            <Link href="/listings">
              <Button className="gap-2"><Search className="w-4 h-4" /> Browse Vehicles</Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
