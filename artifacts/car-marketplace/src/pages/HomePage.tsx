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
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLanguage } from "@/contexts/language-context";
import type { MockListing } from "@/lib/mock-data";

const QUICK_FILTER_TYPES = [
  { key: "car"        as const, icon: CarIcon, color: "bg-blue-50   text-blue-700   border-blue-200   hover:bg-blue-100"  },
  { key: "suv"        as const, icon: CarIcon, color: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100" },
  { key: "truck"      as const, icon: Truck,   color: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100" },
  { key: "motorcycle" as const, icon: Bike,    color: "bg-red-50    text-red-700    border-red-200    hover:bg-red-100"    },
  { key: "van"        as const, icon: Bus,     color: "bg-green-50  text-green-700  border-green-200  hover:bg-green-100"  },
  { key: "boat"       as const, icon: Ship,    color: "bg-cyan-50   text-cyan-700   border-cyan-200   hover:bg-cyan-100"   },
  { key: "rv"         as const, icon: Caravan, color: "bg-amber-50  text-amber-700  border-amber-200  hover:bg-amber-100"  },
];

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

function ListingRow({
  title,
  subtitle,
  vehicleType,
  listings,
  loading,
  viewAll,
}: {
  title: string;
  subtitle: string;
  vehicleType: string;
  listings: MockListing[];
  loading: boolean;
  viewAll: string;
}) {
  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
          </div>
          <Link
            href={`/listings?vehicleType=${vehicleType}`}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors group"
          >
            {viewAll}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[300px] bg-card animate-pulse rounded-2xl border border-border" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border border-dashed">
            <p className="text-muted-foreground text-sm">No {title.toLowerCase()} available right now.</p>
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
                  {viewAll} {title} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const h = t.home;
  const [searchMake, setSearchMake] = useState("");

  const [cars,   setCars]   = useState<MockListing[]>([]);
  const [trucks, setTrucks] = useState<MockListing[]>([]);
  const [motos,  setMotos]  = useState<MockListing[]>([]);
  const [loadingCars,   setLoadingCars]   = useState(true);
  const [loadingTrucks, setLoadingTrucks] = useState(true);
  const [loadingMotos,  setLoadingMotos]  = useState(true);

  const [recentListings, setRecentListings] = useState<MockListing[]>([]);

  useEffect(() => {
    getListings({ vehicleType: "car",        status: "active", limit: 4 })
      .then((r) => setCars(r.listings)).finally(() => setLoadingCars(false));
    getListings({ vehicleType: "truck",      status: "active", limit: 4 })
      .then((r) => setTrucks(r.listings)).finally(() => setLoadingTrucks(false));
    getListings({ vehicleType: "motorcycle", status: "active", limit: 4 })
      .then((r) => setMotos(r.listings)).finally(() => setLoadingMotos(false));

    // Load recently viewed from localStorage
    try {
      const raw = localStorage.getItem("automarket_recent");
      if (raw) {
        const ids: string[] = JSON.parse(raw);
        if (ids.length > 0) {
          getListings({ limit: 100 }).then((r) => {
            const byId = Object.fromEntries(r.listings.map((l) => [l.id, l]));
            setRecentListings(ids.map((id) => byId[id]).filter(Boolean).slice(0, 4));
          });
        }
      }
    } catch {}
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
              <form onSubmit={handleSearch} className="flex gap-2">
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
                  {t.types[f.key]}
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
            <h2 className="text-2xl font-display font-bold text-foreground">{h.browseByCategory}</h2>
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
                    {t.types[cat.key]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LISTING ROWS ─── */}
      <div className="bg-muted/40 border-t border-border/60">
        <ListingRow
          title={h.carsSection}
          subtitle={h.carsSub}
          vehicleType="car"
          listings={cars}
          loading={loadingCars}
          viewAll={h.viewAll}
        />
      </div>

      <div className="bg-background border-t border-border/60">
        <ListingRow
          title={h.trucksSection}
          subtitle={h.trucksSub}
          vehicleType="truck"
          listings={trucks}
          loading={loadingTrucks}
          viewAll={h.viewAll}
        />
      </div>

      <div className="bg-muted/40 border-t border-border/60">
        <ListingRow
          title={h.motoSection}
          subtitle={h.motoSub}
          vehicleType="motorcycle"
          listings={motos}
          loading={loadingMotos}
          viewAll={h.viewAll}
        />
      </div>

      {/* ─── RECENTLY VIEWED ─── */}
      {recentListings.length > 0 && (
        <div className="bg-background border-t border-border/60">
          <section className="py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Recently Viewed</h2>
                  </div>
                  <p className="text-muted-foreground text-sm">Pick up where you left off</p>
                </div>
                <Link href="/listings" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors group">
                  Browse all <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {recentListings.map((listing) => <CarCard key={listing.id} listing={listing} />)}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ─── TRUST FEATURES ─── */}
      <section className="py-20 bg-background border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground">Why AutoMarket?</h2>
            <p className="text-muted-foreground mt-2">Thousands of buyers and sellers trust us every day.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: "Verified Sellers",  desc: "Every seller is authenticated to ensure a safe, scam-free buying experience." },
              { icon: CarIcon,     title: "Vast Selection",    desc: "Cars, trucks, motorcycles, boats & more — new listings added every day."     },
              { icon: DollarSign,  title: "No Hidden Fees",    desc: "Negotiate directly with sellers. We never take a cut of the sale."           },
            ].map((feature, i) => (
              <div key={i} className="bg-card p-8 rounded-2xl border border-border card-shadow hover:shadow-lg transition-shadow">
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
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">{h.ctaTitle}</h2>
          <p className="text-white/55 mb-8 text-lg">{h.ctaSub}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/post">
              <Button size="lg" className="h-13 px-10 text-base font-bold shadow-xl shadow-primary/30">
                {h.postFree}
              </Button>
            </Link>
            <Link href="/listings">
              <Button size="lg" variant="outline" className="h-13 px-10 text-base font-semibold border-white/20 text-white hover:bg-white/10 hover:border-white/40">
                {h.browseVehicles}
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </AppLayout>
  );
}
