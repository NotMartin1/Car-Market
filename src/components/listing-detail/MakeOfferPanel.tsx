"use client";

import { DollarSign, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

export function MakeOfferPanel({
  listingPrice,
  offerAmount,
  setOfferAmount,
  offerMessage,
  setOfferMessage,
  offerSent,
  sendingOffer,
  onSubmit,
  onClose,
}: {
  listingPrice: string | number;
  offerAmount: string;
  setOfferAmount: (v: string) => void;
  offerMessage: string;
  setOfferMessage: (v: string) => void;
  offerSent: boolean;
  sendingOffer: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}) {
  return (
    <div className="bg-card rounded-3xl p-6 border border-primary/20 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" /> Make an Offer
        </h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
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
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Your Offer Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder={String(Math.round(Number(listingPrice) * 0.95))}
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="pl-8"
                min="1"
                required
              />
            </div>
            {offerAmount && Number(offerAmount) < Number(listingPrice) && (
              <p className="text-xs text-muted-foreground mt-1">
                That's {formatPrice(String(Number(listingPrice) - Number(offerAmount)))} below asking price.
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
  );
}
