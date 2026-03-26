"use client";

import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { getUserById } from "@/lib/mock-api";
import { getListings } from "@/lib/mock-api";
import { CarCard } from "@/components/car/CarCard";
import { Button } from "@/components/ui/button";
import { Star, ShieldCheck, Calendar, MapPin, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { MockUser, MockListing } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-4 h-4 ${s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-border fill-border"}`}
          />
        ))}
      </div>
      <span className="font-bold text-foreground">{rating.toFixed(1)}</span>
      <span className="text-muted-foreground text-sm">({count} reviews)</span>
    </div>
  );
}

export default function SellerProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const [seller, setSeller] = useState<MockUser | null>(null);
  const [listings, setListings] = useState<MockListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getUserById(id);
    setSeller(user);
    if (user) {
      getListings({ status: "active", limit: 20 })
        .then((r) => setListings(r.listings.filter((l) => l.sellerId === id)))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [id]);

  if (!seller && !isLoading) {
    return (
      <AppLayout>
        <div className="max-w-xl mx-auto text-center pt-40 px-4">
          <h2 className="text-2xl font-bold mb-3">Seller not found</h2>
          <Link href="/listings"><Button>Browse Listings</Button></Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Hero */}
      <div className="bg-foreground pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-primary/15 border-4 border-primary/30 shrink-0">
              {seller?.profileImageUrl ? (
                <img src={seller.profileImageUrl} alt={seller.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary">
                  {seller?.firstName?.[0]}{seller?.lastName?.[0]}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-display font-bold text-white">
                  {seller?.firstName} {seller?.lastName}
                </h1>
                {seller?.verified && (
                  <ShieldCheck className="w-5 h-5 text-primary" title="Verified Seller" />
                )}
              </div>
              <p className="text-white/50 text-sm mb-2">@{seller?.username}</p>
              {seller?.rating != null && (
                <StarRating rating={seller.rating} count={seller.ratingCount ?? 0} />
              )}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/50">
                {seller?.memberSince && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Member since {new Date(seller.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {listings[0]?.location ?? "Unknown location"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            {seller?.bio && (
              <div className="bg-card border border-border rounded-2xl p-5 card-shadow">
                <h3 className="font-display font-bold text-sm mb-2">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{seller.bio}</p>
              </div>
            )}
            <div className="bg-card border border-border rounded-2xl p-5 card-shadow">
              <h3 className="font-display font-bold text-sm mb-3">Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active listings</span>
                  <span className="font-semibold">{listings.length}</span>
                </div>
                {seller?.ratingCount != null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reviews</span>
                    <span className="font-semibold">{seller.ratingCount}</span>
                  </div>
                )}
                {seller?.verified && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">Verified Seller</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Listings */}
          <div className="lg:col-span-3">
            <h2 className="font-display font-bold text-xl mb-5">
              Active Listings ({listings.length})
            </h2>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-card animate-pulse rounded-2xl border border-border" />)}
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {listings.map((l) => <CarCard key={l.id} listing={l} />)}
              </div>
            ) : (
              <div className="py-16 text-center bg-card rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground">No active listings from this seller.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
