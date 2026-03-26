"use client";

import { SlidersHorizontal, X, RotateCcw, Car, Bike, Truck, Bus, Ship, Caravan } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setMake, setModel, setYearMin, setYearMax,
  setPriceMin, setPriceMax, setLocation,
  setCondition, setVehicleType, clearFilters,
  type VehicleType, type Condition,
} from "@/store/slices/filtersSlice";
import { useLanguage } from "@/contexts/language-context";

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

export function FilterPanel() {
  const dispatch = useAppDispatch();
  const filters  = useAppSelector((s) => s.filters);
  const { t }    = useLanguage();
  const fx       = t.filters;

  const { make, model, yearMin, yearMax, priceMin, priceMax, location, condition, vehicleType } = filters;

  const activeCount = [make, model, yearMin, yearMax, priceMin, priceMax, location, condition, vehicleType].filter(Boolean).length;

  const getVehicleLabel = (v: VehicleType) => {
    if (!v) return "";
    const key = v as keyof typeof t.types;
    return t.types[key] || v;
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

  const activePricePreset = PRICE_PRESETS.find(
    (p) => priceMin === String(p.min) && priceMax === String(p.max),
  );

  const togglePreset = (p: typeof PRICE_PRESETS[number]) => {
    if (activePricePreset?.label === p.label) {
      dispatch(setPriceMin("")); dispatch(setPriceMax(""));
    } else {
      dispatch(setPriceMin(String(p.min))); dispatch(setPriceMax(String(p.max)));
    }
  };

  return (
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
            onClick={() => dispatch(clearFilters())}
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
            return (
              <button
                key={vt.value}
                onClick={() => dispatch(setVehicleType(active ? "" : vt.value))}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-semibold transition-all",
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-foreground/70 border-border hover:border-primary/40 hover:bg-muted",
                )}
              >
                <vt.icon className="w-4 h-4" />
                {getVehicleLabel(vt.value)}
              </button>
            );
          })}
          <button
            onClick={() => dispatch(setVehicleType(""))}
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
          {PRICE_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => togglePreset(p)}
              className={cn(
                "px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all",
                activePricePreset?.label === p.label
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground/70 border-border hover:border-primary/40 hover:bg-muted",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <Input type="number" placeholder="Min $" value={priceMin} onChange={(e) => dispatch(setPriceMin(e.target.value))} className="h-9 text-sm" />
          <span className="text-muted-foreground text-sm shrink-0">–</span>
          <Input type="number" placeholder="Max $" value={priceMax} onChange={(e) => dispatch(setPriceMax(e.target.value))} className="h-9 text-sm" />
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
                onClick={() => dispatch(setCondition(active ? "" : c.value))}
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
          <Input placeholder={fx.makePlaceholder} value={make} onChange={(e) => dispatch(setMake(e.target.value))} className="h-9 text-sm pr-7" />
          {make && (
            <button onClick={() => dispatch(setMake(""))} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="relative">
          <Input placeholder={fx.modelPlaceholder} value={model} onChange={(e) => dispatch(setModel(e.target.value))} className="h-9 text-sm pr-7" />
          {model && (
            <button onClick={() => dispatch(setModel(""))} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
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
          <Input type="number" placeholder={fx.from} value={yearMin} onChange={(e) => dispatch(setYearMin(e.target.value))} className="h-9 text-sm" />
          <span className="text-muted-foreground text-sm shrink-0">–</span>
          <Input type="number" placeholder={fx.to}   value={yearMax} onChange={(e) => dispatch(setYearMax(e.target.value))} className="h-9 text-sm" />
        </div>
      </div>

      <Divider />

      {/* Location */}
      <div>
        <FilterLabel>{fx.location}</FilterLabel>
        <div className="relative">
          <Input placeholder={fx.locationPlaceholder} value={location} onChange={(e) => dispatch(setLocation(e.target.value))} className="h-9 text-sm pr-7" />
          {location && (
            <button onClick={() => dispatch(setLocation(""))} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
