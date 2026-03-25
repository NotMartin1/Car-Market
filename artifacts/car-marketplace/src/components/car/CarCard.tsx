import type { Listing } from "@workspace/api-client-react";
import { Link } from "wouter";
import { MapPin, Fuel, Gauge, CheckCircle2, Car, Bike, Truck, Bus, Ship } from "lucide-react";
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

export function CarCard({ listing }: { listing: Listing }) {
  const mainImage = listing.images?.[0] || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80";
  const vType = listing.vehicleType ?? "car";

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="group bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col h-full cursor-pointer">

        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <div className="absolute inset-0 bg-gradient-to-tr from-muted to-secondary" />
          <img
            src={mainImage}
            alt={`${listing.year} ${listing.make} ${listing.model}`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {listing.status === "sold" && (
              <Badge variant="destructive" className="shadow-lg backdrop-blur-md bg-destructive/90">Sold</Badge>
            )}
            {listing.condition === "excellent" && listing.status !== "sold" && (
              <Badge variant="success" className="shadow-lg backdrop-blur-md bg-green-500/90 text-white flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Great Deal
              </Badge>
            )}
          </div>

          {/* Vehicle type badge */}
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 bg-background/90 backdrop-blur-md text-foreground text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow">
              {vehicleTypeIcon[vType]}
              {vehicleTypeLabel[vType] ?? vType}
            </span>
          </div>

          <div className="absolute bottom-3 right-3 bg-primary/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg">
            <p className="font-display font-bold text-lg text-primary-foreground">{formatPrice(listing.price)}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-display font-bold text-xl text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                {listing.year} {listing.make} {listing.model}
              </h3>
              <div className="flex items-center text-muted-foreground mt-1 text-sm">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                <span className="line-clamp-1">{listing.location}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-foreground/50" />
              <span>{formatMileage(listing.mileage)}</span>
            </div>
            {listing.fuelType && (
              <div className="flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-foreground/50" />
                <span className="capitalize">{listing.fuelType}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
