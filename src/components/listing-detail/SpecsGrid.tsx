"use client";

import { Calendar, Gauge, Fuel, Settings, Palette, FileText } from "lucide-react";
import { formatMileage } from "@/lib/utils";
import type { MockListing } from "@/lib/mock-data";

function SpecItem({
  icon: Icon, label, value, className,
}: { icon: React.ElementType; label: string; value: string | number; className?: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-muted-foreground mb-1 text-sm">
        <Icon className="w-4 h-4" /> {label}
      </div>
      <div className={`font-semibold text-foreground text-lg ${className || ""}`}>{value}</div>
    </div>
  );
}

export function SpecsGrid({ listing }: { listing: MockListing }) {
  return (
    <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm">
      <h3 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6 text-accent" /> Specifications
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <SpecItem icon={Calendar} label="Year"         value={listing.year} />
        <SpecItem icon={Gauge}    label="Mileage"      value={formatMileage(listing.mileage)} />
        <SpecItem icon={Fuel}     label="Fuel Type"    value={listing.fuelType || "N/A"} className="capitalize" />
        <SpecItem icon={Settings} label="Transmission" value={listing.transmission || "N/A"} className="capitalize" />
        <SpecItem icon={Palette}  label="Color"        value={listing.color || "N/A"} />
        <SpecItem icon={FileText} label="VIN"          value={listing.vin || "N/A"} />
      </div>
    </div>
  );
}
