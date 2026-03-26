"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, ShieldCheck, Star, MessageSquare, DollarSign, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockUser, MockListing } from "@/lib/mock-data";

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

export function SellerCard({
  seller,
  listing,
  isOwner,
  isAuthenticated,
  saved,
  startingChat,
  onStartChat,
  onToggleSaved,
  onShowOffer,
  onLogin,
}: {
  seller: MockUser | null;
  listing: MockListing;
  isOwner: boolean;
  isAuthenticated: boolean;
  saved: boolean;
  startingChat: boolean;
  onStartChat: () => void;
  onToggleSaved: () => void;
  onShowOffer: () => void;
  onLogin: () => void;
}) {
  return (
    <div className="bg-card rounded-3xl p-6 border border-border shadow-md">
      <h3 className="font-display font-bold text-lg mb-4">About the Seller</h3>

      <Link
        href={`/sellers/${seller?.id}`}
        className="flex items-center gap-4 mb-4 pb-4 border-b border-border hover:bg-muted/50 -mx-2 px-2 py-2 rounded-2xl transition-colors"
      >
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
            {seller?.verified && <ShieldCheck className="w-4 h-4 text-primary shrink-0" aria-label="Verified Seller" />}
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
            onClick={onStartChat}
            disabled={startingChat}
          >
            <MessageSquare className="w-4 h-4" />
            {startingChat ? "Opening Chat…" : "Chat with Seller"}
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={onShowOffer}
          >
            <DollarSign className="w-4 h-4" />
            Make an Offer
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full gap-2 text-sm", saved ? "text-red-500 hover:text-red-600" : "text-muted-foreground")}
            onClick={onToggleSaved}
          >
            <Heart className={cn("w-4 h-4", saved && "fill-current")} />
            {saved ? "Saved — click to remove" : "Save this listing"}
          </Button>
        </div>
      ) : (
        <div className="bg-muted p-4 rounded-2xl text-center">
          <p className="text-sm text-muted-foreground mb-4">Sign in to message the seller or make an offer.</p>
          <Button onClick={onLogin} className="w-full">Sign In to Contact</Button>
        </div>
      )}
    </div>
  );
}
