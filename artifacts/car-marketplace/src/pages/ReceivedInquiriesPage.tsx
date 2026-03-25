"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { getListing, getListingInquiries } from "@/lib/mock-api";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Phone, ArrowLeft, User, MessageSquare } from "lucide-react";
import type { MockListing } from "@/lib/mock-data";

interface EnrichedInquiry {
  id: string;
  listingId: string;
  senderId: string;
  senderFirstName: string | null;
  senderLastName: string | null;
  senderUsername: string | null;
  message: string;
  contactEmail: string;
  contactPhone: string | null;
  createdAt: string;
}

export default function ReceivedInquiriesPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { user, isAuthenticated } = useMockAuth();

  const [listing, setListing] = useState<MockListing | null>(null);
  const [inquiries, setInquiries] = useState<EnrichedInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    Promise.all([getListing(id), getListingInquiries(id)])
      .then(([listingData, inquiriesData]) => {
        setListing(listingData as MockListing);
        setInquiries(inquiriesData.inquiries as EnrichedInquiry[]);
      })
      .finally(() => setIsLoading(false));
  }, [id, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto mt-20 p-8 bg-card rounded-3xl border text-center">
          <p className="text-muted-foreground">Please sign in to view inquiries.</p>
        </div>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded-xl w-1/3" />
          <div className="h-40 bg-muted rounded-3xl" />
        </div>
      </AppLayout>
    );
  }

  if (!listing) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto mt-20 p-8 bg-card rounded-3xl border text-center">
          <p className="text-muted-foreground">Listing not found.</p>
        </div>
      </AppLayout>
    );
  }

  if (user?.id !== listing.sellerId) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto mt-20 p-8 bg-card rounded-3xl border text-center">
          <p className="text-muted-foreground">You don't have permission to view these inquiries.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/my-listings">
          <Button variant="ghost" className="gap-2 mb-6 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to My Listings
          </Button>
        </Link>

        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">Received Inquiries</h1>
            <p className="text-muted-foreground mt-2">
              {listing.year} {listing.make} {listing.model}
            </p>
          </div>
          <Badge variant="secondary" className="text-base px-4 py-2">
            {inquiries.length} {inquiries.length === 1 ? "inquiry" : "inquiries"}
          </Badge>
        </div>

        {inquiries.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No inquiries yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              When buyers send you a message about this listing, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {inquiry.senderFirstName && inquiry.senderLastName
                          ? `${inquiry.senderFirstName} ${inquiry.senderLastName}`
                          : inquiry.senderUsername ?? "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(inquiry.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-foreground leading-relaxed mb-4 bg-muted/40 rounded-xl p-4 text-sm">
                  {inquiry.message}
                </p>

                <div className="flex flex-wrap gap-4 text-sm">
                  {inquiry.contactEmail && (
                    <a
                      href={`mailto:${inquiry.contactEmail}`}
                      className="flex items-center gap-2 text-primary hover:underline font-medium"
                    >
                      <Mail className="w-4 h-4" />
                      {inquiry.contactEmail}
                    </a>
                  )}
                  {inquiry.contactPhone && (
                    <a
                      href={`tel:${inquiry.contactPhone}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium"
                    >
                      <Phone className="w-4 h-4" />
                      {inquiry.contactPhone}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
