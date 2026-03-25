"use client";

import { useState, useEffect, Suspense } from "react";
import { createPortal } from "react-dom";
import { getListings } from "@/lib/mock-api";
import type { MockListing } from "@/lib/mock-data";
import { AppLayout } from "@/components/layout/AppLayout";
import { CarCard } from "@/components/car/CarCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SlidersHorizontal, X, Search, Car, Bike, Truck, Bus, Ship, Caravan, RotateCcw,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

type VehicleType = "car" | "suv" | "truck" | "motorcycle" | "van" | "rv" | "boat" | "other" | "";
type Condition = "excellent" | "good" | "fair" | "poor" | "";

const VEHICLE_TYPE_OPTIONS: { value: VehicleType; icon: React.ElementType }[] = [
  { value: "car",        icon: Car     },
  { value: "suv",        icon: Car     },
  { value: "truck",      icon: Truck   },
  { value: "motorcycle", icon: Bike    },
  { value: "van",        icon: Bus     },
  { value: "rv",         icon: Caravan },
  { value: "boat",       icon: Ship    },
];

const PRICE_PRESETS = [
  { label: "< $5K",     min: 0,     max: 5000   },
  { label: "$5K–$15K",  min: 5000,  max: 15000  },
  { label: "$15K–$30K", min: 15000, max: 30000  },
  { label: "$30K–$50K", min: 30000, max: 50000  },
  { label: "> $50K",    min: 50000, max: 999999 },
];

const CONDITION_OPTIONS: { value: Condition; activeClass: string }[] = [
  { value: "excellent", activeClass: "bg-emerald-500 text-white border-emerald-500" },
  { value: "good",      activeClass: "bg-blue-500    text-white border-blue-500"    },
  { value: "fair",      activeClass: "bg-amber-500   text-white border-amber-500"   },
  { value: "poor",      activeClass: "bg-red-500     text-white border-red-500"     },
];

function FilterLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{children}</p>;
}
function Divider() {
  return <div className="h-px bg-border" />;
}

function ListingsPageInner() {
  const rawSearchParams = useSearchParams();
  const searchParams = rawSearchParams ?? new URLSearchParams();
  const { t } = useLanguage();
  const lx = t.listings;
  const fx = t.filters;

  const [make,        setMake]        = useState(searchParams.get("make") || "");
  const [model,       setModel]       = useState(searchParams.get("model") || "");
  const [yearMin,     setYearMin]     = useState(searchParams.get("yearMin") || "");
  const [yearMax,     setYearMax]     = useState(searchParams.get("yearMax") || "");
  const [priceMin,    setPriceMin]    = useState(searchParams.get("priceMin") || "");
  const [priceMax,    setPriceMax]    = useState(searchParams.get("priceMax") || "");
  const [location,    setLocation]    = useState(searchParams.get("location") || "");
  const [condition,   setCondition]   = useState<Condition>((searchParams.get("condition") as Condition) || "");
  const [vehicleType, setVehicleType] = useState<VehicleType>(
    (searchParams.get("vehicleType") as VehicleType) || "",
  );
  const [search, setSearch] = useState(
    searchParams.get("make") ? `${searchParams.get("make") || ""} ${searchParams.get("model") || ""}`.trim() : "",
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mounted,      setMounted]      = useState(false);
  const [listings,     setListings]     = useState<MockListing[]>([]);
  const [isLoading,    setIsLoading]    = useState(true);

  useEffect(() => setMounted(true), []);

  const activeCount = [make, model, yearMin, yearMax, priceMin, priceMax, location, condition, vehicleType].filter(Boolean).length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
      getListings({
        make:        make.trim() || undefined,
        model:       model.trim() || undefined,
        yearMin:     yearMin  ? Number(yearMin)  : undefined,
        yearMax:     yearMax  ? Number(yearMax)  : undefined,
        minPrice:    priceMin ? Number(priceMin) : undefined,
        maxPrice:    priceMax ? Number(priceMax) : undefined,
        location:    location.trim() || undefined,
        condition:   condition   || undefined,
        vehicleType: vehicleType || undefined,
        status: "active",
        limit: 50,
      })
        .then((res) => setListings(res.listings))
        .finally(() => setIsLoading(false));
    }, 350);
    return () => clearTimeout(timer);
  }, [make, model, yearMin, yearMax, priceMin, priceMax, location, condition, vehicleType]);

  const clearFilters = () => {
    setMake(""); setModel(""); setYearMin(""); setYearMax("");
    setPriceMin(""); setPriceMax(""); setLocation("");
    setCondition(""); setVehicleType(""); setSearch("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = search.trim().split(/\s+/);
    setMake(parts[0] || "");
    setModel(parts.slice(1).join(" ") || "");
  };

  const activePricePreset = PRICE_PRESETS.find(
    (p) => priceMin === String(p.min) && priceMax === String(p.max),
  );

  const setPreset = (p: typeof PRICE_PRESETS[number]) => {
    if (activePricePreset?.label === p.label) {
      setPriceMin(""); setPriceMax("");
    } else {
      setPriceMin(String(p.min)); setPriceMax(String(p.max));
    }
  };

  const getConditionLabel = (v: Condition) => {
    const map: Record<string, string> = {
      excellent: fx.excellent,
      good:      fx.good,
      fair:      fx.fair,
      poor:      fx.poor,
    };
    return map[v] || v;
  };

  const getVehicleLabel = (v: VehicleType) => {
    if (!v) return "";
    const key = v as keyof typeof t.types;
    return t.types[key] || v;
  };

  /* ─── filter panel content ─── */
  const FilterPanel = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-base flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          {fx.title}
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> {fx.reset}
          </button>
        )}
      </div>

      <Divider />

      {/* Vehicle type */}
      <div>
        <FilterLabel>{fx.vehicleType}</FilterLabel>
        <div className="grid grid-cols-4 gap-1.5">
          {VEHICLE_TYPE_OPTIONS.map((vt) => {
            const active = vehicleType === vt.value;
            const label  = getVehicleLabel(vt.value);
            return (
              <button
                key={vt.value}
                onClick={() => setVehicleType(active ? "" : vt.value)}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-semibold transition-all",
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-foreground/70 border-border hover:border-primary/40 hover:bg-muted",
                )}
              >
                <vt.icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
          <button
            onClick={() => setVehicleType("")}
            className={cn(
              "flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-semibold transition-all",
              vehicleType === ""
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background text-foreground/70 border-border hover:border-primary/40 hover:bg-muted",
            )}
          >
            <span className="text-base leading-none font-bold">·</span>
            {fx.all}
          </button>
        </div>
      </div>

      <Divider />

      {/* Price range */}
      <div>
        <FilterLabel>{fx.priceRange}</FilterLabel>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {PRICE_PRESETS.map((p) => {
            const active = activePricePreset?.label === p.label;
            return (
              <button
                key={p.label}
                onClick={() => setPreset(p)}
                className={cn(
                  "px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all",
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground/70 border-border hover:border-primary/40 hover:bg-muted",
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 items-center">
          <Input type="number" placeholder="Min $" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="h-9 text-sm" />
          <span className="text-muted-foreground text-sm shrink-0">–</span>
          <Input type="number" placeholder="Max $" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="h-9 text-sm" />
        </div>
      </div>

      <Divider />

      {/* Condition */}
      <div>
        <FilterLabel>{fx.condition}</FilterLabel>
        <div className="flex flex-wrap gap-1.5">
          {CONDITION_OPTIONS.map((c) => {
            const active = condition === c.value;
            return (
              <button
                key={c.value}
                onClick={() => setCondition(active ? "" : c.value)}
                className={cn(
                  "px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all",
                  active
                    ? c.activeClass
                    : "bg-background text-foreground/70 border-border hover:border-primary/40 hover:bg-muted",
                )}
              >
                {getConditionLabel(c.value)}
              </button>
            );
          })}
        </div>
      </div>

      <Divider />

      {/* Make / Model */}
      <div className="space-y-2">
        <FilterLabel>{fx.makeModel}</FilterLabel>
        <div className="relative">
          <Input placeholder={fx.makePlaceholder} value={make} onChange={(e) => setMake(e.target.value)} className="h-9 text-sm pr-7" />
          {make && (
            <button onClick={() => setMake("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="relative">
          <Input placeholder={fx.modelPlaceholder} value={model} onChange={(e) => setModel(e.target.value)} className="h-9 text-sm pr-7" />
          {model && (
            <button onClick={() => setModel("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <Divider />

      {/* Year */}
      <div>
        <FilterLabel>{fx.yearRange}</FilterLabel>
        <div className="flex gap-2 items-center">
          <Input type="number" placeholder={fx.from} value={yearMin} onChange={(e) => setYearMin(e.target.value)} className="h-9 text-sm" />
          <span className="text-muted-foreground text-sm shrink-0">–</span>
          <Input type="number" placeholder={fx.to}   value={yearMax} onChange={(e) => setYearMax(e.target.value)} className="h-9 text-sm" />
        </div>
      </div>

      <Divider />

      {/* Location */}
      <div>
        <FilterLabel>{fx.location}</FilterLabel>
        <div className="relative">
          <Input placeholder={fx.locationPlaceholder} value={location} onChange={(e) => setLocation(e.target.value)} className="h-9 text-sm pr-7" />
          {location && (
            <button onClick={() => setLocation("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout>
      {/* ─── page header ─── */}
      <div className="bg-foreground text-white pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-display font-bold mb-1">{lx.title}</h1>
          <p className="text-white/50 text-sm">{lx.subtitle}</p>
          <form onSubmit={handleSearch} className="mt-5 flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder={lx.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-9 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/35 text-sm focus:outline-none focus:border-primary focus:bg-white/15 transition-all"
              />
              {search && (
                <button type="button" onClick={() => { setSearch(""); setMake(""); setModel(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <Button type="submit" size="sm" className="h-10 px-5 font-semibold">{lx.search}</Button>
          </form>
        </div>
      </div>

      {/* ─── results area ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* toolbar */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm font-semibold text-foreground shrink-0">
            {isLoading
              ? lx.loading
              : `${listings.length} ${listings.length !== 1 ? lx.foundPlural : lx.found} ${lx.foundSuffix}`}
          </span>

          {vehicleType && (
            <Chip label={getVehicleLabel(vehicleType)} onRemove={() => setVehicleType("")} />
          )}
          {condition && (
            <Chip label={getConditionLabel(condition)} onRemove={() => setCondition("")} />
          )}
          {(priceMin || priceMax) && (
            <Chip
              label={activePricePreset ? activePricePreset.label : `$${priceMin || "0"} – $${priceMax || "∞"}`}
              onRemove={() => { setPriceMin(""); setPriceMax(""); }}
            />
          )}
          {make  && <Chip label={`${fx.makePlaceholder.split(" ")[0]}: ${make}`}  onRemove={() => setMake("")}  />}
          {model && <Chip label={`${fx.modelPlaceholder.split(" ")[0]}: ${model}`} onRemove={() => setModel("")} />}
          {(yearMin || yearMax) && (
            <Chip label={`${yearMin || "Any"} – ${yearMax || "Any"}`} onRemove={() => { setYearMin(""); setYearMax(""); }} />
          )}
          {location && <Chip label={location} onRemove={() => setLocation("")} />}

          <div className="flex-1" />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(true)}
            className="gap-2 shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {lx.filters}
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                {activeCount}
              </span>
            )}
          </Button>
        </div>

        {/* results grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[340px] bg-card animate-pulse rounded-2xl border border-border" />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((listing) => (
              <CarCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card rounded-2xl border border-dashed border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-5">
              <Search className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{lx.noResults}</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">{lx.noResultsText}</p>
            <Button onClick={clearFilters} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" /> {lx.clearAll}
            </Button>
          </div>
        )}
      </div>

      {/* ─── filter drawer portal ─── */}
      {mounted && isFilterOpen && createPortal(
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-background z-[9999] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <h2 className="font-display font-bold text-lg">{fx.title}</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto styled-scrollbar px-5 py-5">
              <FilterPanel />
            </div>
            <div className="px-5 py-4 border-t border-border shrink-0 flex gap-3">
              {activeCount > 0 && (
                <Button variant="outline" onClick={clearFilters} className="gap-1.5 flex-1">
                  <RotateCcw className="w-3.5 h-3.5" /> {fx.reset}
                </Button>
              )}
              <Button onClick={() => setIsFilterOpen(false)} className={activeCount > 0 ? "flex-1" : "w-full"}>
                {fx.showResults} {isLoading ? "…" : listings.length} {fx.results}
              </Button>
            </div>
          </div>
        </>,
        document.body,
      )}
    </AppLayout>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
      {label}
      <button onClick={onRemove} className="hover:text-destructive transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

export default function ListingsPage() {
  return (
    <Suspense>
      <ListingsPageInner />
    </Suspense>
  );
}
