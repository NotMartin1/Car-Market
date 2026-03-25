"use client";

import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { getListing, createInquiry, startConversation } from "@/lib/mock-api";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { useSaved } from "@/contexts/saved-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatMileage } from "@/lib/utils";
import {
  MapPin, Calendar, Gauge, Fuel, Settings, Palette, FileText,
  CheckCircle2, User, ShieldCheck, Tag, MessageSquare, Heart,
  Star, TrendingDown, DollarSign, X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import type { MockListing, MockUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type ListingWithSeller = MockListing & { seller: MockUser | null };

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-border fill-border"}`}
          />
        ))}
      </div>
      <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
      <span className="text-muted-foreground text-xs">({count})</span>
    </div>
  );
}

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const router = useRouter();
  const { isAuthenticated, user, login } = useMockAuth();
  const { toggle: toggleSaved, isSaved } = useSaved();
  const { toast } = useToast();

  const [listing, setListing]           = useState<ListingWithSeller | null>(null);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState(false);
  const [activeImage, setActiveImage]   = useState(0);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryPhone, setInquiryPhone]     = useState("");
  const [inquiryEmail, setInquiryEmail]     = useState(user?.email ?? "");
  const [isSubmitting, setIsSubmitting]     = useState(false);
  const [startingChat, setStartingChat]     = useState(false);

  // Make an Offer
  const [showOfferPanel, setShowOfferPanel] = useState(false);
  const [offerAmount, setOfferAmount]       = useState("");
  const [offerMessage, setOfferMessage]     = useState("");
  const [offerSent, setOfferSent]           = useState(false);
  const [sendingOffer, setSendingOffer]      = useState(false);

  useEffect(() => {
    getListing(id)
      .then((data) => {
        setListing(data as ListingWithSeller);
        // Track recently viewed
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

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return login();
    if (!inquiryMessage.trim()) return;
    try {
      setIsSubmitting(true);
      await createInquiry(id, {
        message: inquiryMessage,
        contactEmail: inquiryEmail,
        contactPhone: inquiryPhone || undefined,
      });
      toast({ title: "Inquiry sent!", description: "The seller will be notified." });
      setInquiryMessage("");
      setInquiryPhone("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Failed to send", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return login();
    if (!offerAmount.trim()) return;
    setSendingOffer(true);
    await new Promise((r) => setTimeout(r, 800));
    setSendingOffer(false);
    setOfferSent(true);
    toast({ title: "Offer submitted!", description: `Your offer of ${formatPrice(offerAmount)} has been sent to the seller.` });
  };

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

  const images = listing.images?.length > 0 ? listing.images : ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80"];
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
              {/* Gallery */}
              <div className="bg-card p-2 rounded-3xl border border-border/50 shadow-sm">
                <div className="aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden mb-2 relative bg-muted">
                  <img src={images[activeImage]} alt="Car" className="w-full h-full object-cover" />
                  {/* Save button overlay */}
                  <button
                    onClick={() => toggleSaved(id)}
                    className={cn(
                      "absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border transition-colors",
                      saved ? "bg-red-500 border-red-500 text-white" : "bg-white/90 border-white/60 text-foreground/70 hover:text-red-500",
                    )}
                  >
                    <Heart className={cn("w-5 h-5", saved && "fill-current")} />
                  </button>
                </div>
                {images.length > 1 && (
                  <div className="flex overflow-x-auto gap-2 p-2 no-scrollbar">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`relative w-24 h-16 shrink-0 rounded-xl overflow-hidden transition-all ${activeImage === i ? "ring-2 ring-accent ring-offset-2 scale-95" : "opacity-70 hover:opacity-100"}`}
                      >
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Specs Grid */}
              <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm">
                <h3 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-accent" /> Specifications
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <SpecItem icon={Calendar}  label="Year"         value={listing.year} />
                  <SpecItem icon={Gauge}     label="Mileage"      value={formatMileage(listing.mileage)} />
                  <SpecItem icon={Fuel}      label="Fuel Type"    value={listing.fuelType || "N/A"} className="capitalize" />
                  <SpecItem icon={Settings}  label="Transmission" value={listing.transmission || "N/A"} className="capitalize" />
                  <SpecItem icon={Palette}   label="Color"        value={listing.color || "N/A"} />
                  <SpecItem icon={FileText}  label="VIN"          value={listing.vin || "N/A"} />
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm">
                <h3 className="text-2xl font-display font-bold mb-6">Seller's Description</h3>
                <div className="prose prose-slate max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
                  {listing.description || "No description provided by the seller."}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Seller Card */}
              <div className="bg-card rounded-3xl p-6 border border-border shadow-md">
                <h3 className="font-display font-bold text-lg mb-4">About the Seller</h3>
                <Link href={`/sellers/${seller?.id}`} className="flex items-center gap-4 mb-4 pb-4 border-b border-border hover:bg-muted/50 -mx-2 px-2 py-2 rounded-2xl transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-secondary overflow-hidden border-2 border-background shadow-sm shrink-0">
                    {seller?.profileImageUrl ? (
                      <img src={seller.profileImageUrl} alt="Seller" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <User className="w-7 h-7" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-foreground">{seller?.firstName} {seller?.lastName}</p>
                      {seller?.verified && <ShieldCheck className="w-4 h-4 text-primary shrink-0" title="Verified Seller" />}
                    </div>
                    <p className="text-muted-foreground text-xs">@{seller?.username}</p>
                    {seller?.rating != null && (
                      <div className="mt-1">
                        <StarRating rating={seller.rating} count={seller.ratingCount ?? 0} />
                      </div>
                    )}
                  </div>
                </Link>

                {seller?.verified && (
                  <div className="flex items-center gap-2 mb-4 text-xs text-primary font-semibold bg-primary/8 px-3 py-2 rounded-xl border border-primary/15">
                    <ShieldCheck className="w-4 h-4" /> Verified Seller — Identity confirmed
                  </div>
                )}

                {isOwner ? (
                  <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                    <p className="text-sm font-medium mb-3">This is your listing.</p>
                    <Link href="/my-listings">
                      <Button className="w-full" variant="outline">Manage Listing</Button>
                    </Link>
                  </div>
                ) : listing.status === "sold" ? (
                  <p className="text-sm text-center text-destructive font-medium bg-destructive/10 py-3 px-4 rounded-xl">
                    This vehicle has been sold.
                  </p>
                ) : isAuthenticated ? (
                  <div className="space-y-2">
                    <Button
                      className="w-full shadow-lg shadow-primary/20 gap-2"
                      size="lg"
                      onClick={handleStartChat}
                      disabled={startingChat}
                    >
                      <MessageSquare className="w-4 h-4" />
                      {startingChat ? "Opening Chat…" : "Chat with Seller"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => { setShowOfferPanel((v) => !v); setOfferSent(false); }}
                    >
                      <DollarSign className="w-4 h-4" />
                      Make an Offer
                    </Button>
                    <Button
                      variant="ghost"
                      className={cn("w-full gap-2 text-sm", saved ? "text-red-500 hover:text-red-600" : "text-muted-foreground")}
                      onClick={() => toggleSaved(id)}
                    >
                      <Heart className={cn("w-4 h-4", saved && "fill-current")} />
                      {saved ? "Saved — click to remove" : "Save this listing"}
                    </Button>
                  </div>
                ) : (
                  <div className="bg-muted p-4 rounded-2xl text-center">
                    <p className="text-sm text-muted-foreground mb-4">Sign in to message the seller or make an offer.</p>
                    <Button onClick={login} className="w-full">Sign In to Contact</Button>
                  </div>
                )}
              </div>

              {/* Make an Offer Panel */}
              {showOfferPanel && !isOwner && listing.status !== "sold" && (
                <div className="bg-card rounded-3xl p-6 border border-primary/20 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" /> Make an Offer
                    </h3>
                    <button onClick={() => setShowOfferPanel(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {offerSent ? (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <p className="font-semibold text-foreground">Offer Submitted!</p>
                      <p className="text-sm text-muted-foreground mt-1">The seller will review your offer and respond.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitOffer} className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">Your Offer Amount</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder={String(Math.round(Number(listing.price) * 0.95))}
                            value={offerAmount}
                            onChange={(e) => setOfferAmount(e.target.value)}
                            className="pl-8"
                            min="1"
                            required
                          />
                        </div>
                        {offerAmount && Number(offerAmount) < Number(listing.price) && (
                          <p className="text-xs text-muted-foreground mt-1">
                            That's {formatPrice(String(Number(listing.price) - Number(offerAmount)))} below asking price.
                          </p>
                        )}
                      </div>
                      <textarea
                        placeholder="Add a message to your offer (optional)"
                        value={offerMessage}
                        onChange={(e) => setOfferMessage(e.target.value)}
                        className="w-full min-h-[80px] rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
                      />
                      <Button type="submit" className="w-full gap-2" disabled={sendingOffer}>
                        {sendingOffer ? "Sending…" : "Submit Offer"}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        The seller will see your offer and can accept, decline, or counter.
                      </p>
                    </form>
                  )}
                </div>
              )}

              {/* Quick Inquiry Form */}
              {!isOwner && listing.status !== "sold" && (
                <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
                  <h3 className="font-display font-bold text-lg mb-4">Send Quick Inquiry</h3>
                  <form onSubmit={handleInquiry} className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      required
                    />
                    <Input
                      placeholder="Phone (optional)"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                    />
                    <textarea
                      required
                      placeholder="Your message to the seller..."
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      className="w-full min-h-[100px] rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-y"
                    />
                    <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                      {isSubmitting ? "Sending…" : "Send Inquiry"}
                    </Button>
                  </form>
                </div>
              )}

              {/* Safety banner */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-3xl p-5">
                <h4 className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5" /> Safety Tips
                </h4>
                <ul className="text-sm text-blue-800/80 dark:text-blue-200/80 space-y-1.5 list-disc pl-5 marker:text-blue-400">
                  <li>Never pay in advance</li>
                  <li>Meet in a public place</li>
                  <li>Test drive before buying</li>
                  <li>Verify VIN before purchase</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function SpecItem({
  icon: Icon, label, value, className,
}: { icon: React.ElementType; label: string; value: string | number; className?: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-muted-foreground mb-1 text-sm"><Icon className="w-4 h-4" /> {label}</div>
      <div className={`font-semibold text-foreground text-lg ${className || ""}`}>{value}</div>
    </div>
  );
}
