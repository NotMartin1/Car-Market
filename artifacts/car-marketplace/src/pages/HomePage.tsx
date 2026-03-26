"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { getListings } from "@/lib/mock-api";
import { AppLayout } from "@/components/layout/AppLayout";
import { CarCard } from "@/components/car/CarCard";
import { useLanguage } from "@/contexts/language-context";
import type { MockListing } from "@/lib/mock-data";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ListingRow } from "@/components/home/ListingRow";
import { TrustFeatures } from "@/components/home/TrustFeatures";
import { CtaBanner } from "@/components/home/CtaBanner";

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
      <HeroSection
        searchMake={searchMake}
        setSearchMake={setSearchMake}
        onSearch={handleSearch}
        h={h}
        types={t.types}
      />

      <CategoryGrid title={h.browseByCategory} types={t.types} />

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

      <TrustFeatures />

      <CtaBanner
        title={h.ctaTitle}
        subtitle={h.ctaSub}
        postLabel={h.postFree}
        browseLabel={h.browseVehicles}
      />
    </AppLayout>
  );
}
