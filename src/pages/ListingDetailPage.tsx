"use client";

import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { getListing, startConversation } from "@/lib/mock-api";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { useSaved } from "@/contexts/saved-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { MapPin, Tag, Star, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import type { MockListing, MockUser } from "@/lib/mock-data";
import { ImageGallery } from "@/components/listing-detail/ImageGallery";
import { SpecsGrid } from "@/components/listing-detail/SpecsGrid";
import { SellerCard } from "@/components/listing-detail/SellerCard";
import { MakeOfferPanel } from "@/components/listing-detail/MakeOfferPanel";
import { QuickInquiryForm } from "@/components/listing-detail/QuickInquiryForm";
import { SafetyBanner } from "@/components/listing-detail/SafetyBanner";

type ListingWithSeller = MockListing & { seller: MockUser | null };

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const router = useRouter();
  const { isAuthenticated, user, login } = useMockAuth();
  const { toggle: toggleSaved, isSaved } = useSaved();
  const { toast } = useToast();

  const [listing,       setListing]       = useState<ListingWithSeller | null>(null);
  const [isLoading,     setIsLoading]     = useState(true);
  const [error,         setError]         = useState(false);
  const [activeImage,   setActiveImage]   = useState(0);
  const [startingChat,  setStartingChat]  = useState(false);
  const [showOfferPanel, setShowOfferPanel] = useState(false);
  const [offerPanelKey,  setOfferPanelKey]  = useState(0);

  useEffect(() => {
    getListing(id)
      .then((data) => {
        setListing(data as ListingWithSeller);
        try {
          const key = "automarket_recent";
          const raw = localStorage.getItem(key);
          const arr: string[] = raw ? JSON.parse(raw) : [];
          const next = [id, ...arr.filter((x) => x !== id)].slice(0, 8);
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleStartChat = async () => {
    if (!listing) return;
    setStartingChat(true);
    try {
      const { conversationId } = await startConversation(listing.id);
      router.push(`/messages/${conversationId}`);
    } catch {
      toast({ title: "Error", description: "Could not start conversation.", variant: "destructive" });
    } finally {
      setStartingChat(false);
    }
  };

  const isOwner = isAuthenticated && user?.id === listing?.sellerId;
  const saved   = isSaved(id);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
          <div className="h-10 bg-muted rounded-xl w-1/3 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4"><div className="aspect-[16/9] bg-muted rounded-3xl" /></div>
            <div className="space-y-6"><div className="h-64 bg-card rounded-3xl" /></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !listing) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h2 className="text-3xl font-bold">Listing not found</h2>
          <p className="text-muted-foreground mt-4 mb-8">The car you're looking for may have been removed or sold.</p>
          <Link href="/listings"><Button>Back to Listings</Button></Link>
        </div>
      </AppLayout>
    );
  }

  const images = listing.images?.length > 0
    ? listing.images
    : ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80"];
  const seller = listing.seller;
  const priceReduced = !!listing.originalPrice && Number(listing.originalPrice) > Number(listing.price);
  const priceSaving  = priceReduced ? Number(listing.originalPrice) - Number(listing.price) : 0;

  return (
    <AppLayout>
      <div className="bg-muted/30 pb-20">
        {/* Title Header */}
        <div className="bg-background border-b border-border py-8 pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {listing.status === "sold" && <Badge variant="destructive">Sold</Badge>}
                  {listing.featured && (
                    <Badge className="bg-amber-500/20 text-amber-700 border-amber-300 dark:text-amber-400">
                      <Star className="w-3 h-3 mr-1 fill-current" /> Featured
                    </Badge>
                  )}
                  {priceReduced && (
                    <Badge className="bg-blue-500/10 text-blue-700 border-blue-300 dark:text-blue-400">
                      <TrendingDown className="w-3 h-3 mr-1" /> Price Reduced
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-muted-foreground capitalize">
                    {listing.condition}
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
                  {listing.year} {listing.make} {listing.model}
                </h1>
                <div className="flex items-center text-muted-foreground mt-3 font-medium gap-3 flex-wrap">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-accent" />{listing.location}</span>
                  <span className="text-border">•</span>
                  <span className="flex items-center gap-1"><Tag className="w-4 h-4 text-accent" />Ref: #{listing.id.slice(0, 7)}</span>
                </div>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-muted-foreground font-medium mb-1">Asking Price</p>
                <div className="text-4xl md:text-5xl font-display font-bold text-primary">
                  {formatPrice(listing.price)}
                </div>
                {priceReduced && listing.originalPrice && (
                  <div className="flex md:justify-end items-center gap-2 mt-1">
                    <span className="text-muted-foreground line-through text-sm">{formatPrice(listing.originalPrice)}</span>
                    <span className="text-emerald-600 text-sm font-semibold">Save {formatPrice(String(priceSaving))}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <ImageGallery
                images={images}
                activeImage={activeImage}
                setActiveImage={setActiveImage}
                saved={saved}
                onToggleSaved={() => toggleSaved(id)}
              />

              <SpecsGrid listing={listing} />

              <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm">
                <h3 className="text-2xl font-display font-bold mb-6">Seller's Description</h3>
                <div className="prose prose-slate max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
                  {listing.description || "No description provided by the seller."}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <SellerCard
                seller={seller}
                listing={listing}
                isOwner={isOwner}
                isAuthenticated={isAuthenticated}
                saved={saved}
                startingChat={startingChat}
                onStartChat={handleStartChat}
                onToggleSaved={() => toggleSaved(id)}
                onShowOffer={() => {
                  setOfferPanelKey((k) => k + 1);
                  setShowOfferPanel((v) => !v);
                }}
                onLogin={login}
              />

              {showOfferPanel && !isOwner && listing.status !== "sold" && (
                <MakeOfferPanel
                  key={offerPanelKey}
                  listingPrice={listing.price}
                  onClose={() => setShowOfferPanel(false)}
                  isAuthenticated={isAuthenticated}
                  onLogin={login}
                />
              )}

              {!isOwner && listing.status !== "sold" && (
                <QuickInquiryForm
                  listingId={id}
                  defaultEmail={user?.email}
                  isAuthenticated={isAuthenticated}
                  onLogin={login}
                />
              )}

              <SafetyBanner />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
