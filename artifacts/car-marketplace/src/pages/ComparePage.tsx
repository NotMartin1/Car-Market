"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useCompare } from "@/contexts/compare-context";
import { getListings } from "@/lib/mock-api";
import { Button } from "@/components/ui/button";
import { formatPrice, formatMileage } from "@/lib/utils";
import { GitCompare, X, Plus, Check, Minus, Star } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { MockListing } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SPECS: { label: string; key: keyof MockListing; format?: (v: unknown) => string }[] = [
  { label: "Price",        key: "price",        format: (v) => formatPrice(String(v)) },
  { label: "Year",         key: "year",         format: (v) => String(v) },
  { label: "Mileage",      key: "mileage",      format: (v) => formatMileage(Number(v)) },
  { label: "Condition",    key: "condition",    format: (v) => String(v).charAt(0).toUpperCase() + String(v).slice(1) },
  { label: "Vehicle Type", key: "vehicleType",  format: (v) => String(v).toUpperCase() },
  { label: "Fuel Type",    key: "fuelType",     format: (v) => v ? String(v).charAt(0).toUpperCase() + String(v).slice(1) : "—" },
  { label: "Transmission", key: "transmission", format: (v) => v ? String(v).charAt(0).toUpperCase() + String(v).slice(1) : "—" },
  { label: "Color",        key: "color",        format: (v) => v ? String(v) : "—" },
  { label: "Body Type",    key: "bodyType",     format: (v) => v ? String(v) : "—" },
  { label: "Location",     key: "location" },
];

const conditionScore: Record<string, number> = { excellent: 4, good: 3, fair: 2, poor: 1 };

export default function ComparePage() {
  const { ids, remove, clear } = useCompare();
  const [listings, setListings] = useState<MockListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getListings({ limit: 100 })
      .then((r) => setListings(r.listings.filter((l) => ids.includes(l.id)).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))))
      .finally(() => setIsLoading(false));
  }, [ids]);

  const empty = ids.length === 0;

  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-foreground text-white pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <GitCompare className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-display font-bold">Compare Vehicles</h1>
            </div>
            <p className="text-white/50 text-sm">Compare up to 3 vehicles side by side.</p>
          </div>
          {ids.length > 0 && (
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10" onClick={clear}>
              Clear all
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {empty ? (
          <div className="text-center py-24 bg-card rounded-2xl border border-dashed border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-5">
              <GitCompare className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Nothing to compare yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
              Browse listings and click the compare icon on cards to add them here.
            </p>
            <Link href="/listings">
              <Button className="gap-2"><Plus className="w-4 h-4" /> Browse Vehicles</Button>
            </Link>
          </div>
        ) : isLoading ? (
          <div className="h-64 bg-card animate-pulse rounded-2xl border border-border" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-x-3">
              <thead>
                <tr>
                  <td className="w-36 py-2" />
                  {listings.map((l) => (
                    <td key={l.id} className="pb-4 align-top">
                      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                        <div className="relative aspect-[4/3]">
                          <img
                            src={l.images?.[0] || ""}
                            alt={`${l.year} ${l.make} ${l.model}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => remove(l.id)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          {l.featured && (
                            <div className="absolute top-2 left-2">
                              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500 text-white flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-current" /> Featured
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="font-display font-bold text-sm text-foreground leading-tight">
                            {l.year} {l.make} {l.model}
                          </h3>
                          <p className="font-display font-bold text-primary text-lg mt-1">{formatPrice(l.price)}</p>
                          <Link href={`/listings/${l.id}`} className="mt-2 block">
                            <Button size="sm" className="w-full text-xs h-8">View Listing</Button>
                          </Link>
                        </div>
                      </div>
                    </td>
                  ))}
                  {/* Empty slot */}
                  {ids.length < 3 && (
                    <td className="pb-4 align-top">
                      <Link href="/listings" className="block h-full">
                        <div className="bg-card rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors cursor-pointer" style={{ minHeight: 220 }}>
                          <Plus className="w-8 h-8" />
                          <span className="text-sm font-medium">Add vehicle</span>
                        </div>
                      </Link>
                    </td>
                  )}
                </tr>
              </thead>
              <tbody>
                {SPECS.map((spec) => {
                  const values = listings.map((l) => spec.format ? spec.format(l[spec.key]) : String(l[spec.key] ?? "—"));
                  const isPrice = spec.key === "price";
                  const isCondition = spec.key === "condition";

                  return (
                    <tr key={spec.key} className="group">
                      <td className="py-3 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider align-middle whitespace-nowrap">
                        {spec.label}
                      </td>
                      {values.map((val, i) => {
                        const listing = listings[i];
                        let highlight = false;
                        if (isPrice && values.length > 1) {
                          const nums = values.map((v) => Number(v.replace(/[^0-9]/g, "")));
                          highlight = nums[i] === Math.min(...nums);
                        }
                        if (isCondition && values.length > 1) {
                          const scores = values.map((v) => conditionScore[v.toLowerCase()] ?? 0);
                          highlight = scores[i] === Math.max(...scores);
                        }
                        const isLowest = isPrice && highlight;
                        const isBest = isCondition && highlight;

                        return (
                          <td key={listing.id} className="py-3">
                            <div className={cn(
                              "px-3 py-2 rounded-xl text-sm font-medium border transition-colors",
                              isLowest ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold" :
                              isBest   ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold" :
                              "bg-muted/50 border-border text-foreground",
                            )}>
                              <div className="flex items-center gap-1.5">
                                {(isLowest || isBest) && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                                {val}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                      {ids.length < 3 && <td />}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
