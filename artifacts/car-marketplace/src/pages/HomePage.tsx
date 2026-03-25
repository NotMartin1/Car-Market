"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CarCard } from "@/components/car/CarCard";
import { getListings } from "@/lib/mock-api";
import {
  Search,
  ShieldCheck,
  Car as CarIcon,
  DollarSign,
  Bike,
  Truck,
  Bus,
  Ship,
  Caravan,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import type { MockListing } from "@/lib/mock-data";

/* ─── vehicle category config ─── */
const QUICK_FILTERS = [
  { label: "Cars",        type: "car",        icon: CarIcon,  color: "bg-blue-50   text-blue-700   border-blue-200   hover:bg-blue-100"  },
  { label: "SUVs",        type: "suv",        icon: CarIcon,  color: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100" },
  { label: "Trucks",      type: "truck",      icon: Truck,    color: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100" },
  { label: "Motorcycles", type: "motorcycle", icon: Bike,     color: "bg-red-50    text-red-700    border-red-200    hover:bg-red-100"    },
  { label: "Vans",        type: "van",        icon: Bus,      color: "bg-green-50  text-green-700  border-green-200  hover:bg-green-100"  },
  { label: "Boats",       type: "boat",       icon: Ship,     color: "bg-cyan-50   text-cyan-700   border-cyan-200   hover:bg-cyan-100"   },
  { label: "RVs",         type: "rv",         icon: Caravan,  color: "bg-amber-50  text-amber-700  border-amber-200  hover:bg-amber-100"  },
];

/* icon map used in the Browse-by-Category grid */
const CATEGORY_GRID = [
  { label: "Cars",        type: "car",        icon: CarIcon,  count: "800+" },
  { label: "SUVs",        type: "suv",        icon: CarIcon,  count: "600+" },
  { label: "Trucks",      type: "truck",      icon: Truck,    count: "320+" },
  { label: "Motorcycles", type: "motorcycle", icon: Bike,     count: "150+" },
  { label: "Vans",        type: "van",        icon: Bus,      count: "90+"  },
  { label: "Boats",       type: "boat",       icon: Ship,     count: "60+"  },
  { label: "RVs",         type: "rv",         icon: Caravan,  count: "45+"  },
  { label: "Other",       type: "other",      icon: CarIcon,  count: "200+" },
];

/* ─── horizontal scroll row ─── */
function ListingRow({
  title,
  subtitle,
  vehicleType,
  listings,
  loading,
}: {
  title: string;
  subtitle: string;
  vehicleType: string;
  listings: MockListing[];
  loading: boolean;
}) {
  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
          </div>
          <Link
            href={`/listings?vehicleType=${vehicleType}`}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors group"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[300px] bg-card animate-pulse rounded-2xl border border-border" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border border-dashed">
            <p className="text-muted-foreground text-sm">No {title.toLowerCase()} available right now.</p>
            <Link href="/post" className="mt-4 inline-block">
              <Button variant="outline" size="sm">Post one for sale</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {listings.slice(0, 4).map((listing) => (
                <CarCard key={listing.id} listing={listing} />
              ))}
            </div>
            <div className="mt-6 sm:hidden">
              <Link href={`/listings?vehicleType=${vehicleType}`}>
                <Button variant="outline" className="w-full gap-2">
                  View all {title} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ─── main page ─── */
export default function HomePage() {
  const router = useRouter();
  const [searchMake, setSearchMake] = useState("");

  const [cars, setCars]           = useState<MockListing[]>([]);
  const [trucks, setTrucks]       = useState<MockListing[]>([]);
  const [motos, setMotos]         = useState<MockListing[]>([]);
  const [loadingCars, setLoadingCars]     = useState(true);
  const [loadingTrucks, setLoadingTrucks] = useState(true);
  const [loadingMotos, setLoadingMotos]   = useState(true);

  useEffect(() => {
    getListings({ vehicleType: "car",        status: "active", limit: 4 })
      .then((r) => setCars(r.listings))
      .finally(() => setLoadingCars(false));

    getListings({ vehicleType: "truck",      status: "active", limit: 4 })
      .then((r) => setTrucks(r.listings))
      .finally(() => setLoadingTrucks(false));

    getListings({ vehicleType: "motorcycle", status: "active", limit: 4 })
      .then((r) => setMotos(r.listings))
      .finally(() => setLoadingMotos(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchMake.trim()) params.set("make", searchMake.trim());
    router.push(`/listings${params.toString() ? "?" + params.toString() : ""}`);
  };

  return (
    <AppLayout>

      {/* ─── HERO ─── */}
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
          {/* Headline */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-medium text-sm mb-6 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              Trusted by 10,000+ buyers
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-white tracking-tight leading-[1.08] mb-5 text-balance">
              Find Your Next{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#dfae2d] to-[#f1c85b]">
                Dream&nbsp;Vehicle
              </span>{" "}
              Today.
            </h1>
            <p className="text-lg text-white/70 mb-8 text-balance">
              Browse thousands of premium used vehicles — cars, trucks, motorcycles & more.
            </p>

            {/* Search bar */}
            <div className="bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/15 max-w-xl shadow-2xl mb-6">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Search make, model… e.g. Toyota Camry"
                  value={searchMake}
                  onChange={(e) => setSearchMake(e.target.value)}
                  className="bg-white text-foreground h-12 border-0 text-base placeholder:text-muted-foreground/70 flex-1"
                  icon={<Search className="w-4 h-4" />}
                />
                <Button type="submit" size="lg" className="h-12 px-6 font-bold shadow-lg shadow-primary/30 shrink-0">
                  Search
                </Button>
              </form>
            </div>

            {/* Quick filter pills */}
            <div className="flex flex-wrap gap-2">
              {QUICK_FILTERS.map((f) => (
                <Link
                  key={f.type}
                  href={`/listings?vehicleType=${f.type}`}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold transition-all backdrop-blur-sm ${f.color} shadow-sm`}
                >
                  <f.icon className="w-3.5 h-3.5" />
                  {f.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── BROWSE BY CATEGORY ─── */}
      <section className="py-16 bg-background relative z-20 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-foreground">Browse by Category</h2>
            <p className="text-muted-foreground mt-1 text-sm">Jump straight to what you're looking for.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORY_GRID.map((cat) => (
              <Link
                key={cat.type}
                href={`/listings?vehicleType=${cat.type}`}
                className="group flex flex-col items-center gap-2.5 p-4 bg-card rounded-2xl border border-border hover:border-primary/40 hover:shadow-md card-shadow transition-all text-center"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/8 group-hover:bg-primary/15 flex items-center justify-center transition-colors">
                  <cat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{cat.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CARS SECTION ─── */}
      <div className="bg-muted/40 border-t border-border/60">
        <ListingRow
          title="Cars & Sedans"
          subtitle="Classic city cars and luxury sedans ready to drive away."
          vehicleType="car"
          listings={cars}
          loading={loadingCars}
        />
      </div>

      {/* ─── TRUCKS SECTION ─── */}
      <div className="bg-background border-t border-border/60">
        <ListingRow
          title="Trucks & Pickups"
          subtitle="Work-ready pickups and heavy-duty trucks."
          vehicleType="truck"
          listings={trucks}
          loading={loadingTrucks}
        />
      </div>

      {/* ─── MOTORCYCLES SECTION ─── */}
      <div className="bg-muted/40 border-t border-border/60">
        <ListingRow
          title="Motorcycles"
          subtitle="Sportbikes, cruisers, and adventure bikes."
          vehicleType="motorcycle"
          listings={motos}
          loading={loadingMotos}
        />
      </div>

      {/* ─── TRUST FEATURES ─── */}
      <section className="py-20 bg-background border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground">Why AutoMarket?</h2>
            <p className="text-muted-foreground mt-2">Thousands of buyers and sellers trust us every day.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Verified Sellers",
                desc: "Every seller is authenticated to ensure a safe, scam-free buying experience.",
              },
              {
                icon: CarIcon,
                title: "Vast Selection",
                desc: "Cars, trucks, motorcycles, boats & more — new listings added every day.",
              },
              {
                icon: DollarSign,
                title: "No Hidden Fees",
                desc: "Negotiate directly with sellers. We never take a cut of the sale.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-card p-8 rounded-2xl border border-border card-shadow hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-5">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-display mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="bg-foreground py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to sell your vehicle?
          </h2>
          <p className="text-white/55 mb-8 text-lg">
            List it for free in under 5 minutes. Reach thousands of serious buyers today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/post">
              <Button size="lg" className="h-13 px-10 text-base font-bold shadow-xl shadow-primary/30">
                Post a Free Listing
              </Button>
            </Link>
            <Link href="/listings">
              <Button size="lg" variant="outline" className="h-13 px-10 text-base font-semibold border-white/20 text-white hover:bg-white/10 hover:border-white/40">
                Browse Vehicles
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </AppLayout>
  );
}
