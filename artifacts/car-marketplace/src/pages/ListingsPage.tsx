import { useState, useEffect } from "react";
import { useListListings, ListListingsCondition, ListListingsVehicleType } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CarCard } from "@/components/car/CarCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, SlidersHorizontal, X, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function ListingsPage() {
  const searchParams = new URLSearchParams(window.location.search);

  const [make, setMake] = useState(searchParams.get("make") || "");
  const [model, setModel] = useState(searchParams.get("model") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "");
  const [condition, setCondition] = useState<ListListingsCondition | "">(
    (searchParams.get("condition") as ListListingsCondition) || ""
  );
  const [vehicleType, setVehicleType] = useState<ListListingsVehicleType | "">(
    (searchParams.get("vehicleType") as ListListingsVehicleType) || ""
  );

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [debouncedFilters, setDebouncedFilters] = useState({
    make,
    model,
    priceMax: priceMax ? Number(priceMax) : undefined,
    condition: condition || undefined,
    vehicleType: vehicleType || undefined,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters({
        make: make.trim(),
        model: model.trim(),
        priceMax: priceMax ? Number(priceMax) : undefined,
        condition: condition || undefined,
        vehicleType: vehicleType || undefined,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [make, model, priceMax, condition, vehicleType]);

  const { data, isLoading } = useListListings({
    ...debouncedFilters,
    status: "active",
    limit: 50,
  });

  const clearFilters = () => {
    setMake("");
    setModel("");
    setPriceMax("");
    setCondition("");
    setVehicleType("");
  };

  const selectClass = "w-full h-12 rounded-xl border-2 border-border bg-background px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none";

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
            onChange={(e) => setVehicleType(e.target.value as ListListingsVehicleType | "")}
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
          <label className="text-sm font-medium text-foreground">Make</label>
          <Input
            placeholder="e.g. Honda"
            value={make}
            onChange={(e) => setMake(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Model</label>
          <Input
            placeholder="e.g. Civic"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Max Price ($)</label>
          <Input
            type="number"
            placeholder="e.g. 25000"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Condition</label>
          <select
            className={selectClass}
            value={condition}
            onChange={(e) => setCondition(e.target.value as ListListingsCondition | "")}
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
          <span className="font-medium text-foreground">{data?.total || 0} results found</span>
          <Button variant="outline" onClick={() => setIsMobileFiltersOpen(true)} className="gap-2">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </Button>
        </div>

        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-28 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <FilterContent />
        </aside>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {isMobileFiltersOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm"
                onClick={() => setIsMobileFiltersOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-full max-w-sm bg-background p-6 z-50 shadow-2xl lg:hidden overflow-y-auto"
              >
                <div className="flex justify-end mb-6">
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileFiltersOpen(false)}>
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <FilterContent />
                <Button className="w-full mt-8" onClick={() => setIsMobileFiltersOpen(false)}>
                  Show Results
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Results Grid */}
        <div className="flex-1 w-full">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[380px] bg-card animate-pulse rounded-2xl border border-border" />
              ))}
            </div>
          ) : data?.listings && data.listings.length > 0 ? (
            <>
              <div className="hidden lg:block mb-6 text-muted-foreground font-medium">
                Showing {data.total} vehicles
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.listings.map((listing) => (
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
                We couldn't find any vehicles matching your current filters. Try adjusting or clearing your filters.
              </p>
              <Button onClick={clearFilters} variant="outline" size="lg">Clear All Filters</Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
