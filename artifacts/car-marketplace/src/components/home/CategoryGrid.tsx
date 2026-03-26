"use client";

import Link from "next/link";
import { Car as CarIcon, Bike, Truck, Bus, Ship, Caravan } from "lucide-react";

const CATEGORY_GRID_TYPES = [
  { key: "car"        as const, icon: CarIcon,  count: "800+" },
  { key: "suv"        as const, icon: CarIcon,  count: "600+" },
  { key: "truck"      as const, icon: Truck,    count: "320+" },
  { key: "motorcycle" as const, icon: Bike,     count: "150+" },
  { key: "van"        as const, icon: Bus,      count: "90+"  },
  { key: "boat"       as const, icon: Ship,     count: "60+"  },
  { key: "rv"         as const, icon: Caravan,  count: "45+"  },
  { key: "other"      as const, icon: CarIcon,  count: "200+" },
];

export function CategoryGrid({
  title,
  types,
}: {
  title: string;
  types: Record<string, string>;
}) {
  return (
    <section className="py-16 bg-background relative z-20 -mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-foreground">{title}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORY_GRID_TYPES.map((cat) => (
            <Link
              key={cat.key}
              href={`/listings?vehicleType=${cat.key}`}
              className="group flex flex-col items-center gap-2.5 p-4 bg-card rounded-2xl border border-border hover:border-primary/40 hover:shadow-md card-shadow transition-all text-center"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/8 group-hover:bg-primary/15 flex items-center justify-center transition-colors">
                <cat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {types[cat.key]}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
