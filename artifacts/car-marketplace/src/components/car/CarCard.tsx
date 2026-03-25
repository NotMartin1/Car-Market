"use client";

import type { MockListing } from "@/lib/mock-data";
import Link from "next/link";
import { MapPin, Fuel, Gauge, CheckCircle2, Car, Bike, Truck, Bus, Ship, Calendar } from "lucide-react";
import { formatPrice, formatMileage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const vehicleTypeIcon: Record<string, React.ReactNode> = {
  motorcycle: <Bike className="w-3.5 h-3.5" />,
  truck: <Truck className="w-3.5 h-3.5" />,
  van: <Bus className="w-3.5 h-3.5" />,
  suv: <Car className="w-3.5 h-3.5" />,
  rv: <Truck className="w-3.5 h-3.5" />,
  boat: <Ship className="w-3.5 h-3.5" />,
  car: <Car className="w-3.5 h-3.5" />,
  other: <Car className="w-3.5 h-3.5" />,
};

const vehicleTypeLabel: Record<string, string> = {
  motorcycle: "Motorcycle",
  truck: "Truck",
  van: "Van",
  suv: "SUV",
  rv: "RV",
  boat: "Boat",
  car: "Car",
  other: "Other",
};

const conditionColor: Record<string, string> = {
  excellent: "bg-emerald-500/90 text-white",
  good: "bg-blue-500/90 text-white",
  fair: "bg-amber-500/90 text-white",
  poor: "bg-red-500/90 text-white",
};

export function CarCard({ listing }: { listing: MockListing }) {
  const mainImage = listing.images?.[0] || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80";
  const vType = listing.vehicleType ?? "car";

  return (
    <Link href={`/listings/${listing.id}`} className="block group">
      <div className="bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-0.5 group-hover:border-primary/30 h-full flex flex-col card-shadow">

        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={mainImage}
            alt={`${listing.year} ${listing.make} ${listing.model}`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Status badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {listing.status === "sold" && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/95 text-white shadow-lg backdrop-blur-sm">
                SOLD
              </span>
            )}
            {listing.status !== "sold" && listing.condition && (
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg backdrop-blur-sm flex items-center gap-1 ${conditionColor[listing.condition] ?? "bg-white/90 text-foreground"}`}>
                {listing.condition === "excellent" && <CheckCircle2 className="w-3 h-3" />}
                {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}
              </span>
            )}
          </div>

          {/* Vehicle type */}
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-foreground text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-sm">
              {vehicleTypeIcon[vType]}
              {vehicleTypeLabel[vType] ?? vType}
            </span>
          </div>

          {/* Price pill */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-primary px-3 py-1.5 rounded-xl shadow-lg">
              <p className="font-display font-bold text-base text-primary-foreground leading-none">
                {formatPrice(listing.price)}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-display font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors leading-tight">
            {listing.year} {listing.make} {listing.model}
          </h3>

          <div className="flex items-center text-muted-foreground mt-1 text-sm gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="line-clamp-1">{listing.location}</span>
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/60 text-sm text-muted-foreground mt-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{listing.year}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5" />
              <span>{formatMileage(listing.mileage)}</span>
            </div>
            {listing.fuelType && (
              <div className="flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5" />
                <span className="capitalize">{listing.fuelType}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
