"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/car/CarCard";
import type { MockListing } from "@/lib/mock-data";

export function ListingRow({
  title,
  subtitle,
  vehicleType,
  listings,
  loading,
  viewAll,
}: {
  title: string;
  subtitle: string;
  vehicleType: string;
  listings: MockListing[];
  loading: boolean;
  viewAll: string;
}) {
  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
          </div>
          <Link
            href={`/listings?vehicleType=${vehicleType}`}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors group"
          >
            {viewAll}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[300px] bg-card animate-pulse rounded-2xl border border-border" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border border-dashed">
            <p className="text-muted-foreground text-sm">No {title.toLowerCase()} available right now.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {listings.slice(0, 4).map((listing) => (
                <CarCard key={listing.id} listing={listing} />
              ))}
            </div>
            <div className="mt-6 sm:hidden">
              <Link href={`/listings?vehicleType=${vehicleType}`}>
                <Button variant="outline" className="w-full gap-2">
                  {viewAll} {title} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
