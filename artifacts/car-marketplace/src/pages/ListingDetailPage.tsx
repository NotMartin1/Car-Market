"use client";

import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGetListing, useCreateInquiry } from "@workspace/api-client-react";
import { useAuth } from "@workspace/replit-auth-web";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatMileage } from "@/lib/utils";
import { MapPin, Calendar, Gauge, Fuel, Settings, Palette, FileText, CheckCircle2, User, Send, ShieldCheck, Tag } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: listing, isLoading, error } = useGetListing(id);
  const { isAuthenticated, user, login } = useAuth();
  const { toast } = useToast();
  
  const [activeImage, setActiveImage] = useState(0);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: sendInquiry } = useCreateInquiry();

  const isOwner = isAuthenticated && user?.id === listing?.sellerId;

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return login();
    if (!inquiryMessage.trim()) return;

    try {
      setIsSubmitting(true);
      await sendInquiry({
        id,
        data: {
          message: inquiryMessage,
          contactPhone: inquiryPhone,
          contactEmail: inquiryEmail,
        }
      });
      toast({ title: "Inquiry sent successfully!", description: "The seller will be notified." });
      setInquiryMessage("");
      setInquiryPhone("");
      setInquiryEmail("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Failed to send", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
          <div className="h-10 bg-muted rounded-xl w-1/3 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-[16/9] bg-muted rounded-3xl" />
              <div className="flex gap-4"><div className="w-24 h-16 bg-muted rounded-xl" /><div className="w-24 h-16 bg-muted rounded-xl" /></div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-card rounded-3xl" />
              <div className="h-64 bg-card rounded-3xl" />
            </div>
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

  return (
    <AppLayout>
      <div className="bg-muted/30 pb-20">
        
        {/* Title Header */}
        <div className="bg-background border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {listing.status === 'sold' && <Badge variant="destructive">Sold</Badge>}
                  {listing.condition === 'excellent' && <Badge variant="success"><CheckCircle2 className="w-3 h-3 mr-1" /> Excellent Condition</Badge>}
                  <Badge variant="outline" className="text-muted-foreground capitalize">{listing.condition}</Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
                  {listing.year} {listing.make} {listing.model}
                </h1>
                <div className="flex items-center text-muted-foreground mt-3 font-medium">
                  <MapPin className="w-4 h-4 mr-1 text-accent" /> {listing.location}
                  <span className="mx-3 text-border">•</span>
                  <Tag className="w-4 h-4 mr-1 text-accent" /> Ref: #{listing.id.slice(0,6)}
                </div>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-muted-foreground font-medium mb-1">Asking Price</p>
                <div className="text-4xl md:text-5xl font-display font-bold text-primary">
                  {formatPrice(listing.price)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column - Gallery & Details */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Gallery */}
              <div className="bg-card p-2 rounded-3xl border border-border/50 shadow-sm">
                <div className="aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden mb-2 relative bg-muted">
                  <img 
                    src={images[activeImage]} 
                    alt="Car" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <div className="flex overflow-x-auto gap-2 p-2 no-scrollbar">
                    {images.map((img, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveImage(i)}
                        className={`relative w-24 h-16 shrink-0 rounded-xl overflow-hidden transition-all ${activeImage === i ? 'ring-2 ring-accent ring-offset-2 scale-95' : 'opacity-70 hover:opacity-100'}`}
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
                  <SpecItem icon={Calendar} label="Year" value={listing.year} />
                  <SpecItem icon={Gauge} label="Mileage" value={formatMileage(listing.mileage)} />
                  <SpecItem icon={Fuel} label="Fuel Type" value={listing.fuelType || "N/A"} className="capitalize" />
                  <SpecItem icon={Settings} label="Transmission" value={listing.transmission || "N/A"} className="capitalize" />
                  <SpecItem icon={Palette} label="Color" value={listing.color || "N/A"} className="capitalize" />
                  <SpecItem icon={FileText} label="VIN" value={listing.vin || "N/A"} />
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

            {/* Right Column - Seller & Actions */}
            <div className="space-y-6">
              
              {/* Seller Card */}
              <div className="bg-card rounded-3xl p-6 border border-border shadow-md">
                <h3 className="font-display font-bold text-lg mb-4 text-foreground">About the Seller</h3>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <div className="w-16 h-16 rounded-full bg-secondary overflow-hidden border-2 border-background shadow-sm">
                    {listing.sellerProfileImageUrl ? (
                      <img src={listing.sellerProfileImageUrl} alt="Seller" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground">{listing.sellerFirstName} {listing.sellerLastName}</p>
                    <p className="text-muted-foreground text-sm">@{listing.sellerUsername}</p>
                    <div className="flex items-center mt-1 text-xs text-green-600 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Identity Verified
                    </div>
                  </div>
                </div>

                {isOwner ? (
                  <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                    <p className="text-sm font-medium mb-3">This is your listing.</p>
                    <div className="flex flex-col gap-2">
                      <Link href="/my-listings">
                        <Button className="w-full" variant="outline">Manage Listing</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Send className="w-4 h-4 text-accent" /> Contact Seller
                    </h4>
                    {!isAuthenticated ? (
                      <div className="bg-muted p-4 rounded-2xl text-center">
                        <p className="text-sm text-muted-foreground mb-4">Please log in to send a message to the seller.</p>
                        <Button onClick={login} className="w-full">Sign In to Message</Button>
                      </div>
                    ) : (
                      <form onSubmit={handleInquiry} className="space-y-4">
                        <textarea
                          placeholder="I'm interested in this car..."
                          className="w-full min-h-[120px] rounded-xl border-2 border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
                          required
                          value={inquiryMessage}
                          onChange={(e) => setInquiryMessage(e.target.value)}
                        />
                        <Input
                          placeholder="Your Email Address"
                          type="email"
                          required
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                        />
                        <Input 
                          placeholder="Your Phone Number (Optional)"
                          type="tel"
                          value={inquiryPhone}
                          onChange={(e) => setInquiryPhone(e.target.value)}
                        />
                        <Button 
                          type="submit" 
                          className="w-full shadow-lg shadow-primary/20" 
                          size="lg"
                          disabled={isSubmitting || listing.status === 'sold'}
                        >
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                        {listing.status === 'sold' && (
                          <p className="text-xs text-center text-destructive font-medium">This car has been sold.</p>
                        )}
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Safety banner */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-3xl p-5">
                <h4 className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5" /> Safety Tips
                </h4>
                <ul className="text-sm text-blue-800/80 dark:text-blue-200/80 space-y-2 list-disc pl-5 marker:text-blue-400">
                  <li>Never pay in advance</li>
                  <li>Meet in a public place</li>
                  <li>Test drive before buying</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function SpecItem({ icon: Icon, label, value, className }: { icon: React.ElementType, label: string, value: string | number, className?: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-muted-foreground mb-1 text-sm">
        <Icon className="w-4 h-4" /> {label}
      </div>
      <div className={`font-semibold text-foreground text-lg ${className || ""}`}>
        {value}
      </div>
    </div>
  );
}
