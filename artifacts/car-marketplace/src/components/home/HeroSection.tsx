"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Car as CarIcon, Bike, Truck, Bus, Ship, Caravan } from "lucide-react";
import type { Lang } from "@/lib/translations";

const QUICK_FILTER_TYPES = [
  { key: "car"        as const, icon: CarIcon, color: "bg-blue-50   text-blue-700   border-blue-200   hover:bg-blue-100"  },
  { key: "suv"        as const, icon: CarIcon, color: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100" },
  { key: "truck"      as const, icon: Truck,   color: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100" },
  { key: "motorcycle" as const, icon: Bike,    color: "bg-red-50    text-red-700    border-red-200    hover:bg-red-100"    },
  { key: "van"        as const, icon: Bus,     color: "bg-green-50  text-green-700  border-green-200  hover:bg-green-100"  },
  { key: "boat"       as const, icon: Ship,    color: "bg-cyan-50   text-cyan-700   border-cyan-200   hover:bg-cyan-100"   },
  { key: "rv"         as const, icon: Caravan, color: "bg-amber-50  text-amber-700  border-amber-200  hover:bg-amber-100"  },
];

export function HeroSection({
  searchMake,
  setSearchMake,
  onSearch,
  h,
  types,
}: {
  searchMake: string;
  setSearchMake: (v: string) => void;
  onSearch: (e: React.FormEvent) => void;
  h: { badge: string; heroLine1: string; heroLine2: string; heroLine3: string; subtext: string; searchPlaceholder: string; search: string };
  types: Record<string, string>;
}) {
  return (
    <section className="relative min-h-[88vh] flex items-center pt-20 pb-28 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.png"
          alt="Premium automotive background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2d1a00]/94 via-[#1a0e00]/80 to-[#1a0e00]/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-medium text-sm mb-6 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            {h.badge}
          </div>
          <h1 className="text-5xl lg:text-7xl font-display font-bold text-white tracking-tight leading-[1.08] mb-5 text-balance">
            {h.heroLine1}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#dfae2d] to-[#f1c85b]">
              {h.heroLine2}
            </span>{" "}
            {h.heroLine3}
          </h1>
          <p className="text-lg text-white/70 mb-8 text-balance">{h.subtext}</p>

          <div className="bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/15 max-w-xl shadow-2xl mb-6">
            <form onSubmit={onSearch} className="flex gap-2">
              <Input
                placeholder={h.searchPlaceholder}
                value={searchMake}
                onChange={(e) => setSearchMake(e.target.value)}
                className="bg-white text-foreground h-12 border-0 text-base placeholder:text-muted-foreground/70 flex-1"
                icon={<Search className="w-4 h-4" />}
              />
              <Button type="submit" size="lg" className="h-12 px-6 font-bold shadow-lg shadow-primary/30 shrink-0">
                {h.search}
              </Button>
            </form>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_FILTER_TYPES.map((f) => (
              <Link
                key={f.key}
                href={`/listings?vehicleType=${f.key}`}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold transition-all backdrop-blur-sm ${f.color} shadow-sm`}
              >
                <f.icon className="w-3.5 h-3.5" />
                {types[f.key]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
