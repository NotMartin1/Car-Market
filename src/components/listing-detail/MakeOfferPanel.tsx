"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DollarSign, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  offerAmount:  z.string().min(1, "Enter an offer amount."),
  offerMessage: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function MakeOfferPanel({
  listingPrice,
  onClose,
  isAuthenticated,
  onLogin,
}: {
  listingPrice: string | number;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogin: () => void;
}) {
  const { toast } = useToast();
  const [offerSent, setOfferSent] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const offerAmount = watch("offerAmount") ?? "";

  const onSubmit = async (data: FormValues) => {
    if (!isAuthenticated) { onLogin(); return; }
    await new Promise((r) => setTimeout(r, 800));
    setOfferSent(true);
    toast({
      title: "Offer submitted!",
      description: `Your offer of ${formatPrice(data.offerAmount)} has been sent to the seller.`,
    });
  };

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Your Offer Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder={String(Math.round(Number(listingPrice) * 0.95))}
                className={`pl-8 ${errors.offerAmount ? "border-destructive" : ""}`}
                min="1"
                {...register("offerAmount")}
              />
            </div>
            {errors.offerAmount && <p className="text-xs text-destructive mt-1">{errors.offerAmount.message}</p>}
            {offerAmount && Number(offerAmount) < Number(listingPrice) && (
              <p className="text-xs text-muted-foreground mt-1">
                That's {formatPrice(String(Number(listingPrice) - Number(offerAmount)))} below asking price.
              </p>
            )}
          </div>

          <textarea
            placeholder="Add a message to your offer (optional)"
            className="w-full min-h-[80px] rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
            {...register("offerMessage")}
          />

          <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Submit Offer"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            The seller will see your offer and can accept, decline, or counter.
          </p>
        </form>
      )}
    </div>
  );
}
