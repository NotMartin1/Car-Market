"use client";

import { useState, useEffect, Suspense } from "react";
import { getListings } from "@/lib/mock-api";
import type { MockListing } from "@/lib/mock-data";
import { AppLayout } from "@/components/layout/AppLayout";
import { CarCard } from "@/components/car/CarCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, SlidersHorizontal, X, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

type VehicleType = "car" | "suv" | "truck" | "motorcycle" | "van" | "rv" | "boat" | "other" | "";
type Condition = "excellent" | "good" | "fair" | "poor" | "";

function ListingsPageInner() {
  const rawSearchParams = useSearchParams();
  const searchParams = rawSearchParams ?? new URLSearchParams();

  const [make, setMake] = useState(searchParams.get("make") || "");
  const [model, setModel] = useState(searchParams.get("model") || "");
  const [yearMin, setYearMin] = useState(searchParams.get("yearMin") || "");
  const [yearMax, setYearMax] = useState(searchParams.get("yearMax") || "");
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [condition, setCondition] = useState<Condition>((searchParams.get("condition") as Condition) || "");
  const [vehicleType, setVehicleType] = useState<VehicleType>(
    (searchParams.get("vehicleType") as VehicleType) || "",
  );

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [listings, setListings] = useState<MockListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
      getListings({
        make: make.trim() || undefined,
        model: model.trim() || undefined,
        yearMin: yearMin ? Number(yearMin) : undefined,
        yearMax: yearMax ? Number(yearMax) : undefined,
        minPrice: priceMin ? Number(priceMin) : undefined,
        maxPrice: priceMax ? Number(priceMax) : undefined,
        location: location.trim() || undefined,
        condition: condition || undefined,
        vehicleType: vehicleType || undefined,
        status: "active",
        limit: 50,
      })
        .then((res) => setListings(res.listings))
        .finally(() => setIsLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [make, model, yearMin, yearMax, priceMin, priceMax, location, condition, vehicleType]);

  const clearFilters = () => {
    setMake("");
    setModel("");
    setYearMin("");
    setYearMax("");
    setPriceMin("");
    setPriceMax("");
    setLocation("");
    setCondition("");
    setVehicleType("");
  };

  const selectClass =
    "w-full h-12 rounded-xl border-2 border-border bg-background px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none";

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" /> Filters
        </h3>
        <button onClick={clearFilters} className="text-sm text-muted-foreground hover:text-foreground">
          Clear all
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Vehicle Type</label>
          <select
            className={selectClass}
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value as VehicleType)}
          >
            <option value="">All Types</option>
            <option value="car">Car</option>
            <option value="suv">SUV</option>
            <option value="truck">Truck</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="van">Van</option>
            <option value="rv">RV</option>
            <option value="boat">Boat</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Location</label>
          <Input placeholder="e.g. Denver, CO" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Make</label>
          <Input placeholder="e.g. Honda" value={make} onChange={(e) => setMake(e.target.value)} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Model</label>
          <Input placeholder="e.g. Civic" value={model} onChange={(e) => setModel(e.target.value)} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Year Range</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min year"
              value={yearMin}
              onChange={(e) => setYearMin(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max year"
              value={yearMax}
              onChange={(e) => setYearMax(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Price Range ($)</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Condition</label>
          <select
            className={selectClass}
            value={condition}
            onChange={(e) => setCondition(e.target.value as Condition)}
          >
            <option value="">Any Condition</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="bg-primary text-primary-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-4">Browse Vehicles</h1>
          <p className="text-primary-foreground/80 max-w-2xl text-lg">
            Find the perfect vehicle from our extensive inventory. Use the filters to narrow down your search.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8 items-start">
        {/* Mobile Filter Button */}
        <div className="w-full lg:hidden flex justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm">
          <span className="font-medium text-foreground">{listings.length} results found</span>
          <Button variant="outline" onClick={() => setIsMobileFiltersOpen(true)} className="gap-2">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </Button>
        </div>

        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-28 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <FilterContent />
        </aside>

        {/* Mobile Filter Drawer */}
        {isMobileFiltersOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background p-6 z-50 shadow-2xl lg:hidden overflow-y-auto">
              <div className="flex justify-end mb-6">
                <Button variant="ghost" size="icon" onClick={() => setIsMobileFiltersOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <FilterContent />
              <Button className="w-full mt-8" onClick={() => setIsMobileFiltersOpen(false)}>
                Show Results
              </Button>
            </div>
          </>
        )}

        {/* Results Grid */}
        <div className="flex-1 w-full">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[380px] bg-card animate-pulse rounded-2xl border border-border" />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <>
              <div className="hidden lg:block mb-6 text-muted-foreground font-medium">
                Showing {listings.length} vehicles
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <CarCard key={listing.id} listing={listing} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-24 bg-card rounded-3xl border border-border border-dashed">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                We couldn't find any vehicles matching your filters. Try adjusting or clearing them.
              </p>
              <Button onClick={clearFilters} variant="outline" size="lg">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default function ListingsPage() {
  return (
    <Suspense>
      <ListingsPageInner />
    </Suspense>
  );
}
