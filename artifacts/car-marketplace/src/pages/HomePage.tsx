"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CarCard } from "@/components/car/CarCard";
import { getListings } from "@/lib/mock-api";
import { Search, ChevronRight, ShieldCheck, Car as CarIcon, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import type { MockListing } from "@/lib/mock-data";

export default function HomePage() {
  const router = useRouter();
  const [searchMake, setSearchMake] = useState("");
  const [listings, setListings] = useState<MockListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getListings({ limit: 6, status: "active" })
      .then((res) => setListings(res.listings))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMake.trim()) {
      router.push(`/listings?make=${encodeURIComponent(searchMake.trim())}`);
    } else {
      router.push("/listings");
    }
  };

  return (
    <AppLayout>
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-bg.png"
            alt="Premium automotive background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2d1a00]/92 via-[#1a0e00]/78 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent-foreground font-medium text-sm mb-6 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
              Trusted by 10,000+ buyers
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-white tracking-tight leading-tight mb-6 text-balance">
              Find Your Next{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#dfae2d] to-[#f1c85b]">
                Dream Vehicle
              </span>{" "}
              Today.
            </h1>
            <p className="text-lg text-white/75 max-w-2xl mx-auto lg:mx-0 mb-10 text-balance">
              Browse thousands of premium used vehicles — cars, trucks, motorcycles & more. No hidden fees, just honest
              deals.
            </p>

            <div className="bg-background/10 backdrop-blur-xl p-3 rounded-2xl border border-white/10 max-w-xl mx-auto lg:mx-0 shadow-2xl">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Search makes (e.g. Toyota, BMW)..."
                  value={searchMake}
                  onChange={(e) => setSearchMake(e.target.value)}
                  className="bg-background text-foreground h-14 border-0 text-lg placeholder:text-muted-foreground/70"
                  icon={<Search className="w-5 h-5" />}
                />
                <Button type="submit" size="lg" className="h-14 px-8 text-lg font-bold shadow-lg shadow-accent/25">
                  Search
                </Button>
              </form>
            </div>
          </div>

          <div className="flex-1 hidden lg:block relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-background relative z-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Verified Sellers",
                desc: "Every seller is authenticated to ensure a safe buying experience.",
              },
              {
                icon: CarIcon,
                title: "Vast Selection",
                desc: "Cars, trucks, motorcycles, boats & more — added weekly across all price ranges.",
              },
              {
                icon: DollarSign,
                title: "No Hidden Fees",
                desc: "Negotiate directly with sellers. We don't take a cut of the sale.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT LISTINGS */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Recently Added</h2>
              <p className="text-muted-foreground mt-2">Discover the latest arrivals to our marketplace.</p>
            </div>
            <Link href="/listings">
              <Button variant="ghost" className="hidden sm:flex items-center gap-2 group text-primary">
                View all <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[400px] bg-card animate-pulse rounded-2xl border border-border" />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((listing) => (
                <CarCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-3xl border border-border">
              <CarIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No listings found</h3>
              <p className="text-muted-foreground">Be the first to post a car for sale!</p>
              <Link href="/post" className="mt-6 inline-block">
                <Button>Post a Listing</Button>
              </Link>
            </div>
          )}

          <div className="mt-10 sm:hidden text-center">
            <Link href="/listings">
              <Button variant="outline" className="w-full">
                View All Cars
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
