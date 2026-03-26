"use client";

import { useEffect, Suspense } from "react";
import { createPortal } from "react-dom";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { getListings } from "@/lib/mock-api";
import type { MockListing } from "@/lib/mock-data";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { FilterPanel } from "@/components/listings/FilterPanel";
import { FilterChip } from "@/components/listings/FilterChip";
import { ListingsHeader } from "@/components/listings/ListingsHeader";
import { ListingsGrid } from "@/components/listings/ListingsGrid";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setMake, setModel, setYearMin, setYearMax,
  setPriceMin, setPriceMax, setLocation,
  setCondition, setVehicleType, setSearch,
  clearFilters, initFromUrl,
  type VehicleType, type Condition,
} from "@/store/slices/filtersSlice";

const PRICE_PRESETS = [
  { label: "< $5K",     min: 0,     max: 5000   },
  { label: "$5K–$15K",  min: 5000,  max: 15000  },
  { label: "$15K–$30K", min: 15000, max: 30000  },
  { label: "$30K–$50K", min: 30000, max: 50000  },
  { label: "> $50K",    min: 50000, max: 999999 },
];

function ListingsPageInner() {
  const rawSearchParams = useSearchParams();
  const searchParams = rawSearchParams ?? new URLSearchParams();
  const { t } = useLanguage();
  const lx = t.listings;
  const fx = t.filters;

  const dispatch = useAppDispatch();
  const filters  = useAppSelector((s) => s.filters);
  const {
    make, model, yearMin, yearMax,
    priceMin, priceMax, location,
    condition, vehicleType, search,
  } = filters;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mounted,      setMounted]      = useState(false);
  const [listings,     setListings]     = useState<MockListing[]>([]);
  const [isLoading,    setIsLoading]    = useState(true);

  useEffect(() => setMounted(true), []);

  // Seed filters from URL params on first mount
  useEffect(() => {
    const urlMake = searchParams.get("make") || "";
    const urlVehicleType = searchParams.get("vehicleType") || "";
    if (urlMake || urlVehicleType) {
      dispatch(initFromUrl({
        make:        urlMake,
        model:       searchParams.get("model") || "",
        vehicleType: urlVehicleType as VehicleType,
        search:      urlMake ? `${urlMake} ${searchParams.get("model") || ""}`.trim() : "",
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = search.trim().split(/\s+/);
    dispatch(setMake(parts[0] || ""));
    dispatch(setModel(parts.slice(1).join(" ") || ""));
  };

  const activePricePreset = PRICE_PRESETS.find(
    (p) => priceMin === String(p.min) && priceMax === String(p.max),
  );

  const getVehicleLabel = (v: VehicleType) => {
    if (!v) return "";
    const key = v as keyof typeof t.types;
    return t.types[key] || v;
  };

  const getConditionLabel = (v: Condition) => {
    const map: Record<string, string> = {
      excellent: fx.excellent, good: fx.good, fair: fx.fair, poor: fx.poor,
    };
    return map[v] || v;
  };

  return (
    <AppLayout>
      <ListingsHeader
        title={lx.title}
        subtitle={lx.subtitle}
        search={search}
        setSearch={(v) => dispatch(setSearch(v))}
        onSearch={handleSearch}
        clearSearch={() => { dispatch(setSearch("")); dispatch(setMake("")); dispatch(setModel("")); }}
        searchLabel={lx.search}
        searchPlaceholder={lx.searchPlaceholder}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar row */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm font-semibold text-foreground shrink-0">
            {isLoading
              ? lx.loading
              : `${listings.length} ${listings.length !== 1 ? lx.foundPlural : lx.found} ${lx.foundSuffix}`}
          </span>

          {vehicleType && (
            <FilterChip label={getVehicleLabel(vehicleType)} onRemove={() => dispatch(setVehicleType(""))} />
          )}
          {condition && (
            <FilterChip label={getConditionLabel(condition)} onRemove={() => dispatch(setCondition(""))} />
          )}
          {(priceMin || priceMax) && (
            <FilterChip
              label={activePricePreset ? activePricePreset.label : `$${priceMin || "0"} – $${priceMax || "∞"}`}
              onRemove={() => { dispatch(setPriceMin("")); dispatch(setPriceMax("")); }}
            />
          )}
          {make  && <FilterChip label={`${fx.makePlaceholder.split(" ")[0]}: ${make}`}  onRemove={() => dispatch(setMake(""))}  />}
          {model && <FilterChip label={`${fx.modelPlaceholder.split(" ")[0]}: ${model}`} onRemove={() => dispatch(setModel(""))} />}
          {(yearMin || yearMax) && (
            <FilterChip label={`${yearMin || "Any"} – ${yearMax || "Any"}`} onRemove={() => { dispatch(setYearMin("")); dispatch(setYearMax("")); }} />
          )}
          {location && <FilterChip label={location} onRemove={() => dispatch(setLocation(""))} />}

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

        <ListingsGrid
          listings={listings}
          isLoading={isLoading}
          onClearFilters={() => dispatch(clearFilters())}
          noResults={lx.noResults}
          noResultsText={lx.noResultsText}
          clearAllLabel={lx.clearAll}
        />
      </div>

      {/* Filter drawer portal */}
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
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto styled-scrollbar px-5 py-5">
              <FilterPanel />
            </div>
            <div className="px-5 py-4 border-t border-border shrink-0 flex gap-3">
              {activeCount > 0 && (
                <Button variant="outline" onClick={() => dispatch(clearFilters())} className="gap-1.5 flex-1">
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

export default function ListingsPage() {
  return (
    <Suspense>
      <ListingsPageInner />
    </Suspense>
  );
}
