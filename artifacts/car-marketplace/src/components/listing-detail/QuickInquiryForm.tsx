"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function QuickInquiryForm({
  inquiryEmail,
  setInquiryEmail,
  inquiryPhone,
  setInquiryPhone,
  inquiryMessage,
  setInquiryMessage,
  isSubmitting,
  onSubmit,
}: {
  inquiryEmail: string;
  setInquiryEmail: (v: string) => void;
  inquiryPhone: string;
  setInquiryPhone: (v: string) => void;
  inquiryMessage: string;
  setInquiryMessage: (v: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
      <h3 className="font-display font-bold text-lg mb-4">Send Quick Inquiry</h3>
      <form onSubmit={onSubmit} className="space-y-3">
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
  );
}
